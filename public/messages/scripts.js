var status;
var messages;
var content;
var message;

window.addEventListener("DOMContentLoaded", function() {
  status = document.getElementById("status");
  messages = document.getElementById("messages");
  message = document.getElementById("message");
  content = document.getElementById("content");

  message.addEventListener("focus", function(e) {
    content.scrollTo(0, content.scrollHeight);
  });

  document.getElementById("send").addEventListener("submit", function(e) {
    e.preventDefault();
    let data = {
      message: this.elements.message.value
    };
    messages.innerHTML += "<p>" + this.elements.message.value + "</p>";
    this.elements.message.value = "";
    fetch("/messages/send", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(res => {
      console.log(res.status + ": " + res.statusText);
      console.log(res.status);
      if (Math.floor(res.status / 100) <= 3) {
        // Response OK
        status.innerText = "Recieved!";
      } else {
        res.text().then(txt => {
          status.innerText = "Error: " + txt;
          window.setTimeout(() => {
            status.innerText = "You can send messages.";
            window.setTimeout(() => {
              status.innerText = "";
            }, 2500);
          }, 5000);
        });
      }
    });

    content.scrollTo(0, content.scrollHeight);
  });
});
