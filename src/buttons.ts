import { Constraints } from "./interfaces/video-constraints.interfaces";
import { sendStreamData } from "./socket-client";

let startCamera: boolean = false;
let interval: number;

const canvas = document.querySelector(
  "canvas#canvas-local"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.style.display = "none";
const btnLocalPlay = document.querySelector(
  "#btn-play-local"
) as HTMLButtonElement;
const btnLocalPause = document.querySelector(
  "#btn-pause-local"
) as HTMLButtonElement;
const constraints: Constraints = {
  video: true,
  audio: false,
};
const video = document.querySelector("video#video-local") as HTMLVideoElement;
btnLocalPlay.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  video.play();
  
  if (!startCamera) startCamera = true;

  interval = setInterval(() => {
    ctx!.drawImage(video, 0, 0, 640, 480);
    sendStreamData(canvas.toDataURL());
  }, 250);

});

btnLocalPause.addEventListener("click", () => {
  video.pause();
  if (startCamera) startCamera = false;

  clearInterval(interval);
  sendStreamData("stop");
  const mediaStream = video.srcObject as MediaStream;
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
});
