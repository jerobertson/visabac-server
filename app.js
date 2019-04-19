var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var helloworld = require("./routes/helloworld");
helloworld(app);
var evaluate = require("./routes/evaluate");
evaluate(app);
var compare = require("./routes/compare");
compare(app);

app.listen(port);

console.log("Server running at http://localhost:3000/");