import { envConfig } from "./config/app.config";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  btnConnectClient,
  btnLocalPlay,
  btnMic,
  copyBtn,
  listElement,
  video,
  userId,
  videoRemote,
  testCconnection,
  serverStatus,
} from "./constants";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();
userId.innerHTML = uuid;

let peer = new Peer(uuid, {
  host: envConfig.VITE_SERVER,
  port: envConfig.VITE_PORT,
  path: envConfig.VITE_PEER_PATH,
  secure: envConfig.VITE_PEER_SECURE,
});
let statusCamera: boolean = true;
let statusAudio: boolean = true;
let videoTrack: any = null;
let audioTrack: any = null;
let stream: MediaStream;

function retryConnection(peer: Peer) {
  const intervalId = setInterval(() => {
    if (peer.disconnected) {
      console.log("Intentando reconectar...");
      peer.reconnect();
    } else {
      console.log("Reconectado al servidor de PeerJS");
      clearInterval(intervalId);
    }
  }, 5000); // Intentar reconectar cada 5 segundos
}

peer.on("open", (id: string) => {
  console.log("My peer ID is: " + id);
  testCconnection.classList.remove("text-danger");
  testCconnection.classList.add("text-success");
  serverStatus.innerHTML = "connected";
});

peer.on("disconnected", () => {
  testCconnection.classList.remove("text-success");
  testCconnection.classList.add("text-danger");
  serverStatus.innerHTML = "disconnected";
  retryConnection(peer);
});

document.addEventListener("DOMContentLoaded", async () => {
  // retryConnection(peer);

  await getStream();

  peer.on("call", (call) => {
    call.answer(stream);
    call.on("stream", (remoteStream: MediaStream) => {
      videoRemote.srcObject = remoteStream; // Mostrar el video remoto
    });
  });

  peer.on("close", () => {
    console.log("Deje de recibir video");
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

function updateCameraList(cameras: MediaDeviceInfo[] = []) {
  listElement.innerHTML = "";

  cameras
    .map((camera: MediaDeviceInfo) => {
      const cameraOption = document.createElement("option");
      cameraOption.label = camera.label;
      cameraOption.value = camera.deviceId;
      return cameraOption;
    })
    .forEach((cameraOption: HTMLOptionElement) =>
      listElement.add(cameraOption)
    );
}

// Fetch an array of devices of a certain type
async function getConnectedDevices(type: string): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();

  const devicesQuery = devices.filter((device) => device.kind === type);
  return devicesQuery;
}
// Get the initial set of cameras connected

getConnectedDevices("videoinput")
  .then((cameras) => {
    updateCameraList(cameras);
  })
  .catch(console.error);

//Listen for changes to media devices and update the list accordingly
navigator.mediaDevices.addEventListener("devicechange", async () => {
  const newCameraList: MediaDeviceInfo[] = await getConnectedDevices("video");
  updateCameraList(newCameraList);
});

const getStream = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    videoTrack = stream.getVideoTracks()[0];
    audioTrack = stream.getAudioTracks()[0];
    video.srcObject = stream;
    video.play();
    video.muted = true;
    if (!videoTrack) btnLocalPlay.classList.add("disabled");
    if (!audioTrack) btnMic.classList.add("disabled");
  } catch (error: any) {
    if (error.name === "NotAllowedError")
      if (!videoTrack) btnLocalPlay.classList.add("disabled");
    if (!audioTrack) btnMic.classList.add("disabled");
    btnConnectClient.classList.add("disabled");
    console.log(
      "Debes habilitar los permisos de acceso a la camara y microfono"
    );
  }
};

btnConnectClient.addEventListener("click", async () => {
  const id = document.querySelector("#client-to-connect") as HTMLInputElement;
  const peerId = id.value.trim();
  if (peerId === "") return;
  if (peerId === uuid) {
    alert("No puedes llamarte a ti mismo");
    return;
  }

  if (stream) await realizarLlamada(peerId);
});

const realizarLlamada = async (clienteId: string) => {
  console.log("llamando", clienteId);
  const call = peer.call(clienteId, stream);

  call.on("stream", (remoteStream: MediaStream) => {
    console.log("recibiendo el video");
    videoRemote.srcObject = remoteStream;
    videoRemote.play();
  });
};

//VIDEO
btnLocalPlay.addEventListener("click", async function () {
  if (videoTrack) {
    if (statusCamera) {
      statusCamera = !statusCamera;
      videoTrack.enabled = statusCamera;
      btnLocalPlay.innerHTML = `<i class="bi bi-camera-video-off"></i>`;
    } else {
      statusCamera = !statusCamera;
      videoTrack.enabled = statusCamera;
      btnLocalPlay.innerHTML = `<i class="bi bi-camera-video"></i>`;
    }
  }
});

// AUDIO
btnMic.addEventListener("click", async function () {
  statusAudio = !statusAudio;

  audioTrack.enabled = !audioTrack.enabled;
  if (statusAudio) {
    btnMic.innerHTML = `<i class="bi bi-mic">`;
  } else {
    btnMic.innerHTML = `<i class="bi bi-mic-mute">`;
  }
});
