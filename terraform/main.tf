resource "docker_network" "appnetwork" {
 name = "appnetwork"
}

resource "docker_image" "nodeappimage" {
 name = "nodeappimage"
 build {
   context = ".."
   }
   }

resource "docker_container" "nodeappcontainer" {
 name  = "nodeappcontainer"
 image = docker_image.nodeappimage.image_id
 network_mode = var.dockernetwork
 ports {
    internal = 3000
    external = 3000
    }
}
resource "docker_container" "mongo" {
    name = "mongo"
    image = "mongo"
    network_mode = var.dockernetwork
    ports {
      internal = 27017
      external = 27017
      } 
}
data "aws_vpc" "default" {
  default = "true"
}
data "aws_instances" "tagged_instances2" {
  filter {
    name   = "tag:Name"
    values = ["deployment2"]  
  }
}
data "aws_instances" "tagged_instances" {
  filter {
    name   = "tag:Name"
    values = ["deployment"]  
  }
}

resource "aws_security_group" "alb-sg" {
  name        = "alb-sg"
  description = "Allow http"
  

  ingress {
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }
  
  


  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_htp"
  }
}
resource "aws_lb_target_group" "alb-tg" {
  name        = "alb-tg"
  target_type = "instance"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      =  data.aws_vpc.default.id


   health_check {
    path                = "/"  
    port                = "3000"                    
    protocol            = "HTTP"                
    timeout             = 5                     
    interval            = 30                    
    unhealthy_threshold = 2                     
    healthy_threshold   = 5     
    matcher             = "200-299"                
  }
}
  
resource "aws_lb_target_group_attachment" "example" {
  target_group_arn = aws_lb_target_group.alb-tg.arn
  target_id        = data.aws_instances.tagged_instances.ids[0]  
}

# Attach instances to the Target Group
resource "aws_lb_target_group_attachment" "example2" {
  target_group_arn = aws_lb_target_group.alb-tg.arn
  target_id        = data.aws_instances.tagged_instances2.ids[0]  
}

data "aws_subnets" "selected" {
  filter {
    name   = "tag:Name"
    values = ["deploy"] 
  }
}

resource "aws_lb" "my-alb" {
  name = "my-alb"
  load_balancer_type = "application"
  security_groups = [aws_security_group.alb-sg.id]
  subnets = data.aws_subnets.selected.ids


}
resource "aws_lb_listener" "redirect_http" {
  load_balancer_arn = aws_lb.my-alb.arn
  port = 3000
  protocol = "HTTP"
  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.alb-tg.arn
  }
  
}



