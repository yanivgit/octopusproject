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
  network_mode = "appnetwork"
  ports {
    internal = 3000
    external = 3000
  }
}
resource "docker_container" "mongo" {
    name = "mongo"
    image = "mongo"
    network_mode = "appnetwork"
    ports {
      internal = 27017
      external = 27017
       }
  
}






