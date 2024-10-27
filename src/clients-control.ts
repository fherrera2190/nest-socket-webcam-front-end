const clientsRemote = document.querySelector(
  "#container-remote"
) as HTMLDivElement;

export function addClient(id: string): void {
  console.log(">>>>>>>>>>>>>>>>>>>")
  if (!document.querySelector(`#${id}`)) {
    const img = document.createElement("img");
    img.id = id;
    img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNYRu8LA0MWpRLTDJCQEq3talVZsczYlQjCQ&s";
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

