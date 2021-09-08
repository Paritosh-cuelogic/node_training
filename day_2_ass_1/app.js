const http = require("http");
require("dotenv").config();

const app = http.createServer((req, res) => {
  res.write("<h1>Server running on port " + process.env.PORT + "</h1>");
  res.end();
});

const port = process.env.PORT || 5000;
app.listen(port);
