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
          msg: "Welcome to my memories app homepage, as an authenticated user, you can now create and view memories",
          route: "localhost:3000/memories",
        })
      );
    });
  } else if (req.url.startsWith("/memories")) {
    if (req.method === "GET") {
      authenticate(req, res, () => {
        viewMemories(req, res);
      });
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

//function to view memories
function viewMemories(req, res) {
  fs.readFile(memoriesFilePath, (err, data) => {
    if (err) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Service Error");
      }
      return;
    }
    if (!res.headersSent) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    }
  });
}

const PORT = process.env.port || 3000;

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
