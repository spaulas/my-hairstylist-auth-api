const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
// Log parsed incoming requests to json
app.use(bodyParser.json({ type: "*/*" }));
// Log incoming requests
app.use(morgan("combined"));

router(app);

mongoose.connect("mongodb://localhost:27017");

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
