const clientsRemote = document.querySelector(
  "#container-remote"
) as HTMLDivElement;

export function addClient(id: string): void {
  console.log(">>>>>>>>>>>>>>>>>>>")
  if (!document.querySelector(`#${id}`)) {
    const img = document.createElement("img");
    img.id = id;
    //img.src = src;
    img.className = "border border-2";
    img.width = 320;
    img.height = 240;

    clientsRemote.appendChild(img);
  }
}

export function removeClient(id: string): void {
  const img = clientsRemote.querySelector(`#${id}`);
  if (img) {
    clientsRemote.removeChild(img);
  }
}

