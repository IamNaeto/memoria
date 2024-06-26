﻿# Memoria

- A memories app built with nodejs that allows authenticated user create and view memories

## Requirements

- Create an app that users can sign in and post memories
- Use only NodeJs with no external packages
- Use basic authentication, the username should be ‘admin’ and password ‘password’
- Use a middleware to check the username and password, if the username is ‘admin’ and the password is ‘password’, proceed to sign in by passing control to the next middleware else, respond with status code 401 and message ‘Authentication required’.
- You are required to use only 2 files, index.js and `auth.js`  
  auth.js will contain the middleware that will check for username and password before signing users in.
- index.js will handle the rest of the logic with the middleware being on top to make sure users are authenticated before viewing or posting memories.
- An authenticated user can create and view memories.
- A memory should contain an `id` and the actual content as follows {id: string | number, content : string }
- Do not worry about persisting content, use a json file as your database.
- You can use either commonJs or modules
- The logic on how to create and view memories is up to you but make sure every memory created must be saved in the json file and can also retrieved from the json file.

## Setup

1. **Clone the repository or copy the code files**: Make sure you have the `index.js` and `auth.js` files in your project directory.

2. **Initialize the project**:

   - Open a terminal and navigate to the project directory.
   - Ensure Node.js is installed on your machine.

3. **Create `memories.json` file**: This file will be used to store the memories. The app will create this file if it doesn't exist.

## Files

### `index.js`

This file contains the server logic, including routes for viewing, creating, and deleting memories.

### `auth.js`

This file contains the authentication middleware to check the username and password.

## Running the App

1. **Start the server**:

   ```sh
   node index.js
   ```

   You should see the message:

   ```
   Server running on port 3000
   ```

## API Endpoints

### Authentication

- **Username**: `admin`
- **Password**: `password`

### View Memories

- **Endpoint**: `GET /memories`
- **Description**: Retrieves all memories.

#### Using Postman:

1. Open Postman.
2. Create a new `GET` request.
3. Enter the URL: `http://localhost:3000/memories`
4. Go to the `Authorization` tab.
5. Select `Basic Auth`.
6. Enter `admin` as the username and `password` as the password.
7. Click `Send`.

- **Response**:
  ```json
  [
    { "id": 1, "content": "My first memory" },
    { "id": 2, "content": "Another memory" }
  ]
  ```
- If there is no memeory yet you will see an empty array `[]`

### Create Memory

- **Endpoint**: `POST /memories`
- **Description**: Creates a new memory.

#### Using Postman:

1. Open Postman.
2. Create a new `POST` request.
3. Enter the URL: `http://localhost:3000/memories`
4. Go to the `Authorization` tab.
5. Select `Basic Auth`.
6. Enter `admin` as the username and `password` as the password.
7. Go to the `Headers` tab and add `Content-Type: application/json`.
8. Go to the `Body` tab.
9. Select `raw` and enter the following JSON:
   ```json
   {
     "content": "My new memory"
   }
   ```
10. Click `Send`.

- **Response**:
  ```json
  { "id": 3, "content": "My new memory" }
  ```

### Delete Memory

- **Endpoint**: `DELETE /memories/:id`
- **Description**: Deletes a memory by its ID.

#### Using Postman:

1. Open Postman.
2. Create a new `DELETE` request.
3. Enter the URL: `http://localhost:3000/memories/1` (replace `1` with the ID of the memory you want to delete).
4. Go to the `Authorization` tab.
5. Select `Basic Auth`.
6. Enter `admin` as the username and `password` as the password.
7. Click `Send`.

- **Response**:
  ```json
  { "msg": "Memory deleted successfully" }
  ```

## Example Usage

1. **Start the server**:

   ```sh
   node index.js
   ```

2. **View Memories**:

   - Use Postman to send a `GET` request to `http://localhost:3000/memories` with Basic Auth credentials.

3. **Create a Memory**:

   - Use Postman to send a `POST` request to `http://localhost:3000/memories` with Basic Auth credentials and JSON body.

4. **Delete a Memory**:
   - Use Postman to send a `DELETE` request to `http://localhost:3000/memories/:id` with Basic Auth credentials.

## Notes

- The app uses basic authentication. Use the username `admin` and password `password` for all requests.
- Memories are stored in `memories.json`.
- The server runs on port 3000 by default.
