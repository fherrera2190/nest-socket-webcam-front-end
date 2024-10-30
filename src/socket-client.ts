import { Manager, Socket } from "socket.io-client";
import { envConfig } from "./config/app.config";

let manager: Manager;
let socket: Socket;

document.addEventListener("DOMContentLoaded", () => {
  manager = new Manager(envConfig.API_URL);
  socket = manager.socket("/webcam-ws");
  socket.on("connect", () => {
    document.querySelector("#server-status")!.innerHTML = "connected";
    console.log("connectado");
  });

  socket.on("disconnect", () => {
    console.log("desconectado");
    document.querySelector("#server-status")!.innerHTML = "disconnected";
  });
});
