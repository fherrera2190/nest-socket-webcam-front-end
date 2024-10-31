import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { userId, videoRemote } from "./constants";
import { stream } from "./buttons";
import { envConfig } from "./config/app.config";

export const uuid = uuidv4();
userId.innerHTML = uuid;

export const peer = new Peer(uuid, {
  host: envConfig.VITE_PEER_SERVER,
  port: 443,
  path: "/peerjs",
  secure: true,
});

peer.on("open", (id: string) => {
  console.log("My peer ID is: " + id);
});

peer.on("call", (call) => {
  call.answer(stream);
  call.on("stream", (remoteStream: MediaStream) => {
    console.log("Receiving remote stream");
    videoRemote.srcObject = remoteStream; // Mostrar el video remoto
  });
});
