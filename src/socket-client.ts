import { Manager, Socket } from "socket.io-client";
import { envConfig } from "./config/app.config";

let manager: Manager;
let socket: Socket;
const imgElement = document.getElementById("video-remote") as HTMLImageElement;
document.addEventListener("DOMContentLoaded", () => {
  manager = new Manager(envConfig.API_URL);
  console.log(envConfig.API_URL);
  socket = manager.socket("/webcam-ws");
  socket.on("connect", () => {
    console.log("connectado");
    document.querySelector("#server-status")!.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    console.log("desconectado");
    document.querySelector("#server-status")!.innerHTML = "disconnected";
  });

  socket.on("broadcastVideo", (image: string) => {
    imgElement.src = image;
  });
});

export const sendStreamData = (canvas: string) => {
  socket.emit("videoStreamClient", canvas);
};
