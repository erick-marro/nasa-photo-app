# NASA Image Gallery - Angular Technical Test

This project is a simple NASA image and video gallery, built as part of a front-end developer technical test for ORIGEN. The app allows users to browse images and videos from NASA's public API, showing trending and popular media as well as allowing users to search for specific content.
Project Overview

- Framework: Angular (v12)
- Docker: Set up to avoid downgrading Node.js from version 20 (using Node.js 12.14.1 in Docker container)
- NASA API: Integrated to fetch images and videos from the NASA public API.
- Features:
  - Display popular and trending images and videos
  - Search functionality to search for images or videos
        Responsive design

## Setup Instructions

To run this project locally, follow these steps:
Prerequisites

Ensure you have the following installed:

- Docker: Required to run the project due to the specified Node.js version.
- Git: To clone the repository.
- Any code editor: Recommended Visual Studio Code.

Steps to Run Locally

- Clone the repository:

````bash
git clone https://github.com/your-username/nasa-image-gallery.git
cd nasa-image-gallery
````

### Build and run the Docker container:

Since the project requires Node.js 12.14.1 and you may have a different version (e.g., Node.js 20), Docker is used to maintain the correct environment.

To set up and run the project, use the following commands:

````bash
    docker-compose up --build
````
This will:
    Build the Docker image with the correct Node.js version (12.14.1).
    Install all necessary dependencies inside the container.
    Launch the development server.

### Access the application:

After the container is up and running, you can access the application by visiting http://localhost:4200 in your web browser.

### Additional Commands

Stop the Docker container:

````bash
docker-compose down
````

### Rebuild the Docker image:

If you make changes to the Docker configuration or package dependencies, rebuild the container with:

````bash
docker-compose up --build
````

### Using the Application

The home page displays a toggle between popular and trending images/videos.
You can use the search bar to look for specific content from the NASA API.
The layout is responsive and optimized for modern browsers.

### Project Code
I created a module called ````photos```` there is all the application logic-

For more information, check out the NASA API documentation.

## Technologies Used

- Angular 12
- Node.js 12.14.1 (via Docker)
- Docker (to manage Node.js environment)
- SCSS for styling

## Why Docker?

Since my local Node.js version is 20.x, I used Docker to avoid downgrading my Node.js installation. The Docker environment provides Node.js 12.14.1, which is required by this project.

By running the application in a container, it ensures that the development environment is consistent and aligned with the project requirements, without needing to modify your local setup.