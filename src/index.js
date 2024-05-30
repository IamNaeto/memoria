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

//Function to create a memory
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

const PORT = process.env.port || 3000;

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
