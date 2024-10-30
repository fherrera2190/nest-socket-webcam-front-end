import {
  btnConnectClient,
  btnLocalPause,
  btnLocalPlay,
  video,
  videoRemote,
} from "./constants";
import { Constraints } from "./interfaces/video-constraints.interfaces";
import { peer, uuid } from "./peer-clients-control";

let startCamera: boolean = false;

const constraints: Constraints = {
  video: true,
  audio: false,
};

export let stream: MediaStream;

btnLocalPlay.addEventListener("click", async () => {
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  video.play();
  if (!startCamera) startCamera = true;
});

btnLocalPause.addEventListener("click", () => {
  video.pause();
  if (startCamera) startCamera = false;

  const mediaStream = video.srcObject as MediaStream;
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
});

btnConnectClient.addEventListener("click", () => {
  const id = document.querySelector("#client-to-connect") as HTMLInputElement;
  const peerId = id.value.trim();
  if (peerId === "") return;
  if (peerId === uuid) {
    alert("No puedes llamarte a ti mismo");
    return;
  }
  //No envia la llamada si no hay stream
  const call = peer.call(peerId, stream);
  video.srcObject = stream;

  call.on("stream", (remoteStream: MediaStream) => {
    console.log("recibiendo el video");
    videoRemote.srcObject = remoteStream;
    videoRemote.play();
  });
});
