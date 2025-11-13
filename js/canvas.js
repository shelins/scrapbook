// Canvas setup
const canvas = document.getElementById("scrapCanvas");
const ctx = canvas.getContext("2d");

let imagesOnCanvas = [];
let textItems = [];
let draggingItem = null;
let dragType = null;
let offsetX = 0, offsetY = 0;
let resizingImage = null;
const HANDLE_SIZE = 10;

// 🖱️ Mouse events
canvas.addEventListener("mousedown", (e) => {
  const x = e.offsetX, y = e.offsetY;

  for (let img of [...imagesOnCanvas].reverse()) {
    if (
      x > img.x + img.width - HANDLE_SIZE &&
      x < img.x + img.width &&
      y > img.y + img.height - HANDLE_SIZE &&
      y < img.y + img.height
    ) {
      resizingImage = img;
      return;
    }
    if (x > img.x && x < img.x + img.width && y > img.y && y < img.y + img.height) {
      draggingItem = img;
      dragType = "image";
      offsetX = x - img.x;
      offsetY = y - img.y;
      return;
    }
  }

  for (let text of [...textItems].reverse()) {
    ctx.font = `${text.fontSize}px sans-serif`;
    const width = ctx.measureText(text.content).width;
    const height = text.fontSize;
    if (x > text.x && x < text.x + width && y > text.y - height && y < text.y) {
      draggingItem = text;
      dragType = "text";
      offsetX = x - text.x;
      offsetY = y - text.y;
      return;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (resizingImage) {
    resizingImage.width = Math.max(20, e.offsetX - resizingImage.x);
    resizingImage.height = Math.max(20, e.offsetY - resizingImage.y);
    redrawCanvas();
  } else if (draggingItem) {
    draggingItem.x = e.offsetX - offsetX;
    draggingItem.y = e.offsetY - offsetY;
    redrawCanvas();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingItem = null;
  dragType = null;
  resizingImage = null;
});

canvas.addEventListener("dblclick", (e) => {
  const x = e.offsetX, y = e.offsetY;
  for (let text of textItems) {
    ctx.font = `${text.fontSize}px sans-serif`;
    const width = ctx.measureText(text.content).width;
    const height = text.fontSize;
    if (x > text.x && x < text.x + width && y > text.y - height && y < text.y) {
      const newText = prompt("Edit text:", text.content);
      if (newText !== null) {
        text.content = newText;
        redrawCanvas();
      }
      return;
    }
  }
});

// 🖼️ Image upload
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const base64 = event.target.result;
    const img = new Image();
    img.onload = function() {
      imagesOnCanvas.push({
        img,
        src: base64,
        x: 100,
        y: 100,
        width: img.width,
        height: img.height
      });
      redrawCanvas();
    };
    img.src = base64;
  };
  reader.readAsDataURL(file);
}

// 📝 Add text
function addText() {
  const content = document.getElementById("textInput").value.trim();
  const color = document.getElementById("textColor").value;
  let fontSize = parseInt(document.getElementById("fontSize").value);
  if (!content) return;
  if (isNaN(fontSize)) fontSize = 20;
  textItems.push({ content, x: 150, y: 200, fontSize, color });
  redrawCanvas();
}

// 🎨 Redraw canvas
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let img of imagesOnCanvas) {
    ctx.drawImage(img.img, img.x, img.y, img.width, img.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(img.x + img.width - HANDLE_SIZE, img.y + img.height - HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
  }

  for (let text of textItems) {
    ctx.font = `${text.fontSize}px sans-serif`;
    ctx.fillStyle = text.color;
    ctx.fillText(text.content, text.x, text.y);
  }

  updateImagePreview();
}

// 🖼️ Thumbnail preview
function updateImagePreview() {
  const previewList = document.getElementById("imagePreviewList");
  previewList.innerHTML = "";

  imagesOnCanvas.forEach((imgObj, index) => {
    const thumb = document.createElement("img");
    thumb.src = imgObj.src;
    thumb.width = 80;
    thumb.height = 60;
    thumb.alt = `Image ${index + 1}`;
    thumb.style.border = "1px solid #ccc";
    thumb.style.cursor = "pointer";
    thumb.title = "Click to delete this image";

    thumb.addEventListener("click", () => {
      if (confirm("Delete this image?")) {
        imagesOnCanvas.splice(index, 1);
        redrawCanvas();
      }
    });

    previewList.appendChild(thumb);
  });

  document.querySelector("#imagePreviewContainer h3").textContent =
    `🖼️ Images on Page: ${imagesOnCanvas.length}`;
}
