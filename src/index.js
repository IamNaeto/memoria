const http = require("http");
const fs = require("fs");
const authenticate = require("./auth");

const memoriesFilePath = "./memories.json";

// Initialize memories file if it does not exist
if (!fs.existsSync(memoriesFilePath)) {
  fs.writeFileSync(memoriesFilePath, JSON.stringify([]));
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    authenticate(req, res, () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          authenticated: true,
          msg: "Welcome to my memories app homepage, as an authenticated user, you can now create and view memories. Additionally you can also delete memories",
          route: "localhost:3000/memories",
          methods: {
            GET: "view memories",
            POST: "create memories",
            DELETE: "delete memories by id",
          },
        })
      );
    });
  } else if (req.url.startsWith("/memories")) {
    if (req.method === "GET") {
      authenticate(req, res, () => {
        viewMemories(req, res);
      });
    } else if (req.method === "POST") {
      authenticate(req, res, () => {
        createMemory(req, res);
      });
    } else if (req.method === "DELETE") {
      authenticate(req, res, () => {
        deleteMemory(req, res);
      });
    } else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method not allowed");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

//Function to view memories
function viewMemories(req, res) {
  fs.readFile(memoriesFilePath, (err, data) => {
    if (err) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
      return;
    }
    if (!res.headersSent) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    }
  });
}

//Function to create a new memory
function createMemory(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const newMemory = JSON.parse(body);

    fs.readFile(memoriesFilePath, (err, data) => {
      if (err) {
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
        return;
      }

      const memories = JSON.parse(data);
      newMemory.id = memories.length ? memories[memories.length - 1].id + 1 : 1;
      memories.push(newMemory);

      fs.writeFile(memoriesFilePath, JSON.stringify(memories), (err) => {
        if (err) {
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
          return;
        }
        if (!res.headersSent) {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newMemory));
        }
      });
    });
  });

  req.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
    }
  });
}

// Function to delete a memory
function deleteMemory(req, res) {
  const memoryId = req.url.split("/memories/")[1]; // Extract memory ID from URL

  if (!memoryId) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing memory ID");
    return;
  }

  fs.readFile(memoriesFilePath, (err, data) => {
    if (err) {
      console.error("Error reading memories file:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error: Could not read memories data.");
      return;
    }

    try {
      const memories = JSON.parse(data);
      const filteredMemories = memories.filter(
        (memory) => memory.id !== parseInt(memoryId)
      );

      fs.writeFile(
        memoriesFilePath,
        JSON.stringify(filteredMemories),
        (err) => {
          if (err) {
            console.error("Error writing memories file:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error: Could not save updated memories.");
            return;
          }

          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(`Memory with ID ${memoryId} deleted successfully.`);
        }
      );
    } catch (error) {
      console.error("Error deleting memory:", error);
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request: Error processing memory data.");
    }
  });
}

const PORT = process.env.port || 3000;

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
