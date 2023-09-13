# Shared Flavours

Welcome to the backend of our Shared Flavours Social Network web application! This README offers a glimpse into the essential elements, functionalities, and setup guidelines for our backend system. The backend is developed using Node.js and Express, incorporating MongoDB with Mongoose for data storage and administration. Docker is employed for containerization, and Yarn serves as the package manager.

## Installation

1. Ensure you have Docker and Docker Compose installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the backend directory.
4. Install the dependencies using the following command:
   ```shell
   yarn
   ```
5. Create a `.env` file in the backend directory and configure the environment variables contained in the `.env.example` file.
6. To start the backend server and MongoDB with Docker, use the following command:

   ```shell
   docker-compose up
   ```

   The server will be available at http://localhost:8080.

7. To run the backend server and to connect to the database use this command:

   ```shell
   yarn dev
   ```

## Authentication

The API uses JSON Web Tokens (JWT) for user authentication. Make sure to include the JWT token in the `Authorization` header of protected requests.

## Dependencies

- Node.js
- Express
- MongoDB with Mongoose
- Docker
- Yarn
