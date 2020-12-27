// import fetch from "node-fetch";

const PING_INTERVAL = 1000 * 5;

// function callWorkers() {
//   console.log("Pinging provisioning worker");
//   fetch(
//     "http://localhost:8888/.netlify/functions/environment-background"
//   ).catch((e) => {
//     console.error(e.message);
//   });
// }

setInterval(() => {
  //callWorkers();
}, PING_INTERVAL);
