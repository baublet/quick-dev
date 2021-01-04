import fetch from "node-fetch";

const PING_INTERVAL = 1000 * 10;

async function callWorkers() {
  try {
    await fetch(
      "http://localhost:8888/.netlify/functions/environment-background"
    );
    await fetch("http://localhost:8888/.netlify/functions/worker-background");
  } catch (e) {}
}

setInterval(() => {
  callWorkers();
}, PING_INTERVAL);

setInterval(() => {
  console.log("Worker caller is running 8)");
}, 30000);
