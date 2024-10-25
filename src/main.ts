import { Constraints } from "./interfaces/video-constraints.interfaces";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const controls = document.querySelector(".controls") as HTMLElement;
const cameraOptions = document.querySelector(
  ".video-options>select"
) as HTMLSelectElement;
const video = document.querySelector("video") as HTMLVideoElement;
let streamStarted = false;
const buttons = [...controls.querySelectorAll("button")] as HTMLButtonElement[];
const [
  play,
  pause, //screenshot
] = buttons;

let stream: MediaStream;
const constraints: Constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
};

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const options = videoDevices.map((videoDevice) => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join("");
};

const startStream = async (constraints: Constraints) => {
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

play.onclick = () => {
  console.log(streamStarted);

  if (streamStarted) {
    video.play();
    return;
  }

  if ("mediaDevices" in navigator) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value,
      },
    };
    startStream(updatedConstraints);
  }
};

const handleStream = (stream: MediaStream) => {
  video.srcObject = stream;
  streamStarted = true;
};

cameraOptions.onchange = () => {
  const updatedConstraints: Constraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value,
    },
  };
  startStream(updatedConstraints);
};

// PLAY/Pause

const pauseStream = () => {
  video.pause();
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    streamStarted = false;
  }
};
pause.onclick = pauseStream;

getCameraSelection();

// const connectToServer = () => {
//   const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");

//   const socket = manager.socket("/webcam-ws");
// };
// connectToServer();
