function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.end("Authentication Required");
    return;
  }

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (username === "admin" && password === "password") {
    next();
  } else {
    res.writeHead(401, { "Content-Type": "text/plain" });
    res.end("Authentication Required");
  }
}

module.exports = authenticate;
