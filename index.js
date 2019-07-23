const express = require("express");
const app = express();
const port = 8080;

const fs = require("fs");
let lastMsgTime = new Date();
let spamCount = 0;
let blocked = false;

app.use(express.static(__dirname + "/public"));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get("/cake", (req, res) => res.send("Do you like cake?"));

app.post("/messages/send", (req, res) => {
  let msg = req.body.message;
  let msgTime = new Date();
  if (blocked) {
    if (msgTime - lastMsgTime > 5000) {
      blocked = false;
    } else {
      res
        .status(400)
        .send("Blocked! Wait 5 seconds before sending more messages.");
      return;
    }
  }
  if (msgTime - lastMsgTime < 500) {
    if (++spamCount == 10) {
      blocked = true;
    }
  } else {
    spamCount = 0;
  }
  lastMsgTime = msgTime;
  console.log(msg);
  res.end();
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
