data "aws_instances" "example" {
  instance_state_names = ["running"]  
  filter {
    name   = "vpc-id"
    values = ["vpc-06d33e3dc78efbd2c"]
  }
}

output "instance_ids" {
  value = data.aws_instances.example.ids
}
