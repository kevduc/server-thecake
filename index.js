const express = require("express");
const app = express();
const port = 8080;

app.use(express.static(__dirname + "/public"));

app.get("/cake", (req, res) => res.send("Do you like cake?"));

app.listen(port, () => console.log(`App listening on port ${port}!`));
