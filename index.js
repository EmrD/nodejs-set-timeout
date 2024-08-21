import express from 'express';

const app = express();

let false_req = 0;
let timeOutTimer = 20;
let timeoutActive = false;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

function handleDeny() {
  if (timeoutActive) {
    return true;  // Deny if timeout is active
  }
  return false;
}

function startTimeout() {
  timeoutActive = true;
  setTimeout(() => {
    false_req = 0;
    console.log("Timeout expired.")
    timeoutActive = false;  // Reset the state after the timeout
  }, timeOutTimer * 1000);  // Convert to milliseconds
}

// For example: user's username or password is wrong.
app.get("/false_req", (req, res) => {
  if (handleDeny()) {
    res.send("Your permission is denied. Please try again later due to timeout.");
    return;
  }

  false_req++;

  if (false_req > 3) {
    res.send("Your permission is denied. Please try again later.");
    startTimeout();
    return;
  }

  const remainingPermissions = 3 - false_req;
  res.send("Your False Request Count Changed: " + String(false_req) +
    "\nYour remaining permission is: " +
    (remainingPermissions === 0 ? "Your last permission" : String(remainingPermissions)));
});

// For example: user's username or password is correct.
app.get("/normal_req", (req, res) => {
  if (handleDeny()) {
    res.send("Your permission is denied. Please try again later due to timeout.");
    return;
  }

  false_req = 0;
  res.send("Your False Request Count Reset: " + String(false_req));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
