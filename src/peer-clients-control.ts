import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { userId, videoRemote } from "./constants";
import { stream } from "./buttons";
import { envConfig } from "./config/app.config";

export const uuid = uuidv4();
userId.innerHTML = uuid;

export let peer = new Peer(uuid, {
  host: envConfig.VITE_SERVER,
  port: envConfig.VITE_PORT,
  path: envConfig.VITE_PEER_PATH,
  secure: envConfig.VITE_PEER_SECURE,
});

document.addEventListener("DOMContentLoaded", () => {
  peer.on("open", (id: string) => {
    console.log("My peer ID is: " + id);
  });

  peer.on("call", (call) => {
    call.answer(stream);
    call.on("stream", (remoteStream: MediaStream) => {
      console.log(">>>>>>>>>>>>>", remoteStream);
      videoRemote.srcObject = remoteStream; // Mostrar el video remoto
    });
  });

  peer.on("close", () => {
    console.log("Deje de recibir video");
  });
});
