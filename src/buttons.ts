import {
  btnConnectClient,
  btnLocalPlay,
  btnMic,
  copyBtn,
  userId,
  video,
  videoRemote,
} from "./constants";
import { peer, uuid } from "./peer-clients-control";

let statusCamera: boolean = false;
let statusAudio: boolean = false;
let call: any = null;
let videoTrack: any = null;
let audioTrack: any = null;

export let stream: MediaStream;

btnConnectClient.addEventListener("click", async () => {
  const id = document.querySelector("#client-to-connect") as HTMLInputElement;
  const peerId = id.value.trim();
  if (peerId === "") return;
  if (peerId === uuid) {
    alert("No puedes llamarte a ti mismo");
    return;
  }
  await realizarLlamada(peerId);
});

const realizarLlamada = async (clienteId: string) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    videoTrack = stream.getVideoTracks()[0];
    audioTrack = stream.getAudioTracks()[0];

    videoTrack.enabled = false;
    audioTrack.enabled = false;
  } catch (error) {
    console.log(error);
    alert("No puedes realizar una videollamada sin la camara o el microfono");
  }

  if (stream) {
    call = peer.call(clienteId, stream);

    call.on("stream", (remoteStream: MediaStream) => {
      console.log("recibiendo el video");
      videoRemote.srcObject = remoteStream;
      videoRemote.play();
    });
  }
};

btnLocalPlay.addEventListener("click", function () {
  statusCamera = !statusCamera;
  videoTrack.enabled = !videoTrack.enabled;
  if (statusCamera) {
    video.srcObject = stream;
    video.play();
    btnLocalPlay.innerHTML = `<i class="bi bi-camera-video"></i>`;
  } else {
    video.srcObject = null;
    video.pause();
    btnLocalPlay.innerHTML = `<i class="bi bi-camera-video-off"></i>`;
  }
});

btnMic.addEventListener("click", function () {
  statusAudio = !statusAudio;

  audioTrack.enabled = !audioTrack.enabled;
  if (statusAudio) {
    video.muted = true;
    btnMic.innerHTML = `<i class="bi bi-mic">`;
  } else {
    video.muted = false;
    btnMic.innerHTML = `<i class="bi bi-mic-mute">`;
  }
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
