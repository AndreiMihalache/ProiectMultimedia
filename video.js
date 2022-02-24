"use strict";

let videos = [
  {
    name: "Fighter Jet",
    source: "./media/fighter.mp4",
  },
  {
    name: "Penguins",
    source: "./media/penguins.mp4",
  },
  {
    name: "Yosemite National Park",
    source: "./media/mountain.mp4",
  },
  {
    name: "Water",
    source: "./media/water.mp4",
  },
];

let sources = [
  "./media/fighter.mp4",
  "./media/penguins.mp4",
  "./media/mountain.mp4",
  "./media/water.mp4",
];

const video = document.getElementById("video");
const btnPlayPause = document.getElementById("btnPlayPause");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const btnDraw = document.getElementById("btnDraw");
const playlist = document.getElementById("playlist");
var volume = 100;
var currentSource = null;
let requestId;
video.volume = 1;
var scale = 1;
let previewx = null;

const preview = document.getElementById("preview");

startup();
loadPlaylist();

//preview.setAttribute("src", currentSource);

video.addEventListener("ended", () => {
  playNext();
});

video.addEventListener("play", () => {
  renderInterface(0);
});

video.addEventListener("pause", () => {
  cancelAnimationFrame(requestId);
  renderInterface(-100000);
});

video.addEventListener("loadedmetadata", () => {
  preview.setAttribute("src", currentSource);
  previewx = null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  scale = video.videoWidth / 960;
});

function render() {
  context.drawImage(video, 0, 0);
  requestId = requestAnimationFrame(() => render());
}

function renderInterface(frames) {
  context.drawImage(video, 0, 0);
  if (previewx != null) {
    var nextTime = ((previewx - 400 * scale) / (500 * scale)) * video.duration;
    preview.currentTime = nextTime;
    context.drawImage(
      preview,
      previewx - 72 * scale,
      canvas.height - 150 * scale,
      144 * scale,
      81 * scale
    );
  }

  if (frames < 150) Interface();
  requestId = requestAnimationFrame(() => renderInterface(frames + 1));
}

canvas.onmousemove = (e) => {
  if (currentSource != null) renderInterface(0);

  let x = (e.x - canvas.offsetLeft) * scale;
  let y = (e.y - canvas.offsetTop) * scale;

  if (
    x > 400 * scale &&
    x < 900 * scale &&
    y < canvas.height - 20 * scale &&
    y > canvas.height - 30 * scale &&
    currentSource != null
  ) {
    previewx = x;
  } else {
    previewx = null;
  }
};

canvas.onmouseenter = () => {
  previewx = null;
  if (!video.paused && currentSource != null) renderInterface(0);
};

canvas.onmouseleave = () => {
  previewx = null;
  if (video.currentTime != 0) {
    if (!video.paused) render();
    else renderInterface(-100000);
  }
};

canvas.onmousedown = (e) => {
  let x = (e.x - canvas.offsetLeft) * scale;
  let y = (e.y - canvas.offsetTop) * scale;

  //play pause
  if (
    (x > 17 * scale &&
      x < 45 * scale &&
      y > canvas.height - 45 * scale &&
      y < canvas.height - 10 * scale) ||
    (x > canvas.width / 2 - 50 * scale &&
      x < canvas.width / 2 + 50 * scale &&
      y > canvas.height / 2 - 50 * scale &&
      y < canvas.height / 2 + 50 * scale)
  ) {
    if (currentSource === null) {
      currentSource = sources[0];
      video.setAttribute("src", currentSource);
    }
    if (video.paused) {
      video.play();
    } else video.pause();
  }

  if (
    x > canvas.width / 6 - 50 * scale &&
    x < canvas.width / 6 &&
    y > canvas.height / 2 - 20 * scale &&
    y < canvas.height / 2 + 20 * scale
  ) {
    playPrev();
  }

  if (
    x > (canvas.width * 5) / 6 &&
    x < (canvas.width * 5) / 6 + 50 * scale &&
    y > canvas.height / 2 - 20 * scale &&
    y < canvas.height / 2 + 20 * scale
  ) {
    playNext();
  }

  if (
    x > 110 * scale &&
    x < 260 * scale &&
    y < canvas.height - 20 * scale &&
    y > canvas.height - 30 * scale
  ) {
    volume = (x - 110 * scale) / (1.5 * scale);
    video.volume = volume / 100;
  }

  if (
    x > 400 * scale &&
    x < 900 * scale &&
    y < canvas.height - 20 * scale &&
    y > canvas.height - 30 * scale
  ) {
    var nextTime = (x - 400 * scale) / (500 * scale);
    video.currentTime = nextTime * video.duration;
  }
};

function startup() {
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.beginPath();
  context.fillStyle = "black";
  context.rect(0, 0, canvas.width * scale, canvas.height * scale);
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
  Interface();
}

function loadPlaylist() {
  for (let element of videos) {
    var li = document.createElement("li");
    li.setAttribute("id", "li" + element.source);

    let playBtn = document.createElement("button");
    playBtn.innerText = "Play";
    playBtn.setAttribute("class", "playBtn btn btn-success");

    let nameNode = document.createTextNode(element.name);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.setAttribute("class", "delBtn btn btn-outline-danger");

    let upBtn = document.createElement("button");
    upBtn.innerText = "Up";
    upBtn.setAttribute("class", "delBtn btn btn-primary");

    let downBtn = document.createElement("button");
    downBtn.innerText = "Down";
    downBtn.setAttribute("class", "delBtn btn btn-primary");

    li.appendChild(playBtn);
    li.appendChild(nameNode);
    li.appendChild(deleteBtn);
    li.appendChild(downBtn);
    li.appendChild(upBtn);

    deleteBtn.addEventListener("click", () => {
      let item = document.getElementById("li" + element.source);
      if (
        sources.length > 0 &&
        currentSource !== null &&
        element.source === currentSource
      )
        if (sources.length === 1) {
          video.pause();
          startup();
        } else playNext();
      sources = sources.filter((el) => el !== element.source);
      videos = videos.filter((el) => el !== element);
      playlist.removeChild(item);
    });
    playBtn.addEventListener("click", () => {
      video.setAttribute("src", element.source);
      video.play();
      currentSource = element.source;
    });
    upBtn.addEventListener("click", () => {
      let item = document.getElementById("li" + element.source);
      let prevIndex = sources.indexOf(element.source) - 1;
      if (prevIndex === -1) {
        prevIndex = sources.length - 1;
        var aux = sources[0];
        sources[0] = sources[prevIndex];
        sources[prevIndex] = aux;
        var aux2 = videos[0];
        videos[0] = videos[prevIndex];
        videos[prevIndex] = aux2;
      } else {
        var aux = sources[prevIndex + 1];
        sources[prevIndex + 1] = sources[prevIndex];
        sources[prevIndex] = aux;
        var aux2 = videos[prevIndex + 1];
        console.log(aux2);
        videos[prevIndex + 1] = videos[prevIndex];
        videos[prevIndex] = aux2;
      }
      let prevItem = item.previousElementSibling;
      if (prevItem) playlist.insertBefore(item, prevItem);
      else {
        playlist.removeChild(item);
        playlist.appendChild(item);
      }
    });
    downBtn.addEventListener("click", () => {
      let item = document.getElementById("li" + element.source);
      let nextIndex = sources.indexOf(element.source) + 1;
      if (nextIndex === sources.length) {
        nextIndex = 0;
        var aux = sources[sources.length - 1];
        sources[sources.length - 1] = sources[nextIndex];
        sources[nextIndex] = aux;
        var aux2 = videos[sources.length - 1];
        videos[sources.length - 1] = videos[nextIndex];
        videos[nextIndex] = aux2;
      } else {
        var aux = sources[nextIndex - 1];
        sources[nextIndex - 1] = sources[nextIndex];
        sources[nextIndex] = aux;
        var aux2 = videos[nextIndex - 1];
        videos[nextIndex - 1] = videos[nextIndex];
        videos[nextIndex] = aux2;
      }

      let nextItem = item.nextElementSibling;
      if (nextItem) {
        playlist.insertBefore(nextItem, item);
      } else {
        let firstItem = playlist.firstElementChild;
        playlist.insertBefore(item, firstItem);
      }
    });

    li.classList.add("list-group-item");
    playlist.appendChild(li);
  }
}

function Interface() {
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.beginPath();
  context.moveTo(0, canvas.height / scale - 50);
  context.lineTo(canvas.width / scale, canvas.height / scale - 50);
  context.moveTo(60, canvas.height / scale);
  context.lineTo(60, canvas.height / scale - 50);
  context.strokeStyle = "white";
  context.lineWidth = 1;
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.stroke();
  context.setTransform(1, 0, 0, 1, 0, 0);
  if (video.paused) drawPlay();
  else drawPause();
  drawPrevNext();
  drawVolume(volume);
  drawScrubber();
}

function drawVolume() {
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.beginPath();
  context.moveTo(90, canvas.height / scale - 20);
  context.lineTo(80, canvas.height / scale - 20);
  context.lineTo(80, canvas.height / scale - 30);
  context.lineTo(90, canvas.height / scale - 30);
  context.lineTo(100, canvas.height / scale - 40);
  context.lineTo(100, canvas.height / scale - 10);
  context.lineTo(90, canvas.height / scale - 20);
  context.strokeRect(110, canvas.height / scale - 20, 150, -10);
  context.rect(110, canvas.height / scale - 20, volume * 1.5, -10);
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawScrubber() {
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.beginPath();
  context.font = "10pt Tahoma";
  var time;
  if (currentSource != null) {
    (time =
      secondsToString(video.currentTime) +
      "/" +
      secondsToString(video.duration)),
      300;
  } else time = "00:00/00:00";
  context.fillText(time, 300, canvas.height / scale - 20);
  context.strokeRect(400, canvas.height / scale - 20, 500, -10);
  context.rect(
    400,
    canvas.height / scale - 20,
    (video.currentTime / video.duration) * 500,
    -10
  );
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function secondsToString(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  min = min >= 10 ? min : "0" + min;
  sec = sec >= 10 ? sec : "0" + sec;

  const time = min + ":" + sec;

  return time;
}

function playNext() {
  previewx = null;
  let index = sources.indexOf(currentSource) + 1;
  if (index >= sources.length) index = 0;
  currentSource = sources[index];
  video.setAttribute("src", currentSource);
  video.play();
}

function playPrev() {
  previewx = null;
  let index = sources.indexOf(currentSource) - 1;
  if (index < 0) index = sources.length - 1;
  currentSource = sources[index];
  video.setAttribute("src", currentSource);
  video.play();
}

function drawPrevNext() {
  context.beginPath();
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.moveTo(canvas.width / scale / 6, canvas.height / scale / 2 - 20);
  context.lineTo(canvas.width / scale / 6, canvas.height / scale / 2 + 20);
  context.lineTo(canvas.width / scale / 6 - 25, canvas.height / scale / 2);
  context.lineTo(canvas.width / scale / 6, canvas.height / scale / 2 - 20);
  context.moveTo(canvas.width / scale / 6 - 25, canvas.height / scale / 2 - 20);
  context.lineTo(canvas.width / scale / 6 - 25, canvas.height / scale / 2 + 20);
  context.lineTo(canvas.width / scale / 6 - 50, canvas.height / scale / 2);
  context.lineTo(canvas.width / scale / 6 - 25, canvas.height / scale / 2 - 20);
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();

  context.beginPath();
  context.moveTo(
    ((canvas.width / scale) * 5) / 6,
    canvas.height / scale / 2 - 20
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6,
    canvas.height / scale / 2 + 20
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6 + 25,
    canvas.height / scale / 2
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6,
    canvas.height / scale / 2 - 20
  );
  context.moveTo(
    ((canvas.width / scale) * 5) / 6 + 25,
    canvas.height / scale / 2 - 20
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6 + 25,
    canvas.height / scale / 2 + 20
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6 + 50,
    canvas.height / scale / 2
  );
  context.lineTo(
    ((canvas.width / scale) * 5) / 6 + 25,
    canvas.height / scale / 2 - 20
  );
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawPlay() {
  context.beginPath();
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.moveTo(20, canvas.height / scale - 10);
  context.lineTo(20, canvas.height / scale - 40);
  context.lineTo(40, canvas.height / scale - 25);
  context.lineTo(20, canvas.height / scale - 10);
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();

  context.beginPath();
  context.moveTo(canvas.width / scale / 2 - 50, canvas.height / scale / 2 - 50);
  context.lineTo(canvas.width / scale / 2 - 50, canvas.height / scale / 2 + 50);
  context.lineTo(canvas.width / scale / 2 + 50, canvas.height / scale / 2);
  context.lineTo(canvas.width / scale / 2 - 50, canvas.height / scale / 2 - 50);
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawPause() {
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.fillStyle = "rgba(255, 255, 255, 0.50)";
  context.beginPath();
  context.moveTo(20, canvas.height / scale - 15);
  context.lineTo(20, canvas.height / scale - 35);
  context.lineTo(25, canvas.height / scale - 35);
  context.lineTo(25, canvas.height / scale - 15);
  context.lineTo(20, canvas.height / scale - 15);

  context.moveTo(30, canvas.height / scale - 15);
  context.lineTo(30, canvas.height / scale - 35);
  context.lineTo(35, canvas.height / scale - 35);
  context.lineTo(35, canvas.height / scale - 15);
  context.lineTo(30, canvas.height / scale - 15);
  context.fill();

  context.beginPath();
  context.moveTo(canvas.width / scale / 2 - 15, canvas.height / scale / 2 - 30);
  context.lineTo(canvas.width / scale / 2 - 15, canvas.height / scale / 2 + 30);
  context.lineTo(canvas.width / scale / 2 - 5, canvas.height / scale / 2 + 30);
  context.lineTo(canvas.width / scale / 2 - 5, canvas.height / scale / 2 - 30);
  context.lineTo(canvas.width / scale / 2 - 15, canvas.height / scale / 2 - 30);
  context.fill();

  context.beginPath();
  context.moveTo(canvas.width / scale / 2 + 5, canvas.height / scale / 2 - 30);
  context.lineTo(canvas.width / scale / 2 + 5, canvas.height / scale / 2 + 30);
  context.lineTo(canvas.width / scale / 2 + 15, canvas.height / scale / 2 + 30);
  context.lineTo(canvas.width / scale / 2 + 15, canvas.height / scale / 2 - 30);
  context.lineTo(canvas.width / scale / 2 + 5, canvas.height / scale / 2 - 30);
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);
}
