export const video = document.querySelector(
  "video#video-local"
) as HTMLVideoElement;
export const videoRemote = document.querySelector(
  "video#video-remote"
) as HTMLVideoElement;

export const btnLocalPlay = document.querySelector(
  "#btn-play-local"
) as HTMLButtonElement;
export const btnMic = document.querySelector("#btn-mic") as HTMLButtonElement;

export const btnConnectClient = document.querySelector(
  "#btn-connect-client"
) as HTMLButtonElement;

export const listElement = document.querySelector(
  "select#select-devices"
) as HTMLSelectElement;

export const userId = document.querySelector("#user-id") as HTMLSpanElement;

export const copyBtn = document.querySelector(
  "#copyButton"
) as HTMLButtonElement;

export const testCconnection = document.querySelector(
  "#test-connection"
) as HTMLDivElement;

export const serverStatus = document.querySelector(
  "#server-status"
) as HTMLSpanElement;
