import {
  btnConnectClient,
  btnLocalPlay,
  copyBtn,
  userId,
  video,
  videoRemote,
} from "./constants";
import { Constraints } from "./interfaces/video-constraints.interfaces";
import { peer, uuid } from "./peer-clients-control";

let statusCamera: boolean = false;
let statusAudio: boolean = false;
let call = null;
let mediaStream;
let videoTrack;
let audioTrack;
let conn;
export let stream: MediaStream

// let call: typeof Peer.Call() = null;
const constraints: Constraints = {
  video: true,
  audio: true,
};

btnLocalPlay.addEventListener("click", async function () {
  if (!statusCamera) {
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    statusCamera = true;
    video.srcObject = stream;
    video.play();
    btnLocalPlay.innerHTML = `<i class="bi bi-camera-video-off"></i>`;
  } else {
    video.pause();
    statusCamera = false;
    btnLocalPlay.innerHTML = `<i class="bi bi-camera-video"></i>`;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
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

  call = peer.call(peerId, stream);

  call.on("stream", (remoteStream: MediaStream) => {
    console.log("recibiendo el video");
    videoRemote.srcObject = remoteStream;
    videoRemote.play();
  });
});

//Copiar userId al portapapeles
copyBtn.addEventListener("click", () => {
  const text = userId.innerText;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      return;
    })
    .catch((err) => {
      console.error("Error al copiar el texto: ", err);
    });
});
