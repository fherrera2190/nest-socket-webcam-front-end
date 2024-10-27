import { Manager, Socket } from "socket.io-client";
import { envConfig } from "./config/app.config";
import { addClient, removeClient } from "./clients-control";

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

  socket.on("broadcastVideo", (data: { stream: string; client: string }) => {
    //console.log(image);
    const imgClient = document.querySelector(
      `#${data.client}`
    ) as HTMLImageElement;
    imgClient.src = data.stream;
  });

  socket.on("clients-updated", (clientId: string) => {
    console.log(clientId);
    addClient(clientId);
  });

  socket.on("list-clients", (clients: string[]) => {
    clients.forEach((client) => {
      addClient(client);
    });
  });

  socket.on("client-offline", (clientId: string) => {
    removeClient(clientId);
  });
});

export const sendStreamData = (canvas: string) => {
  socket.emit("videoStreamClient", canvas);
};
