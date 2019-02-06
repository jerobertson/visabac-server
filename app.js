var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var index = require("./routes/index");
index(app);
var evaluate = require("./routes/evaluate");
evaluate(app);

app.listen(port);

console.log("Server running at http://localhost:3000/");