let preferredTheme = localStorage.getItem("wattexs-theme");

// Check if theme is already set in local storage
if (preferredTheme) {
  $("html").attr("data-theme", preferredTheme);
  $("#theme-toggle").html(
    `<i class="bx bx-${preferredTheme === "dark" ? "sun" : "moon"} text-accent text-xl"></i>`,
  );
}

// Call toggleTheme function on button click (replace #theme-toggle with your button selector)
$("#theme-toggle").on("click", function () {
  var currentTheme = $("html").attr("data-theme");
  if (currentTheme === "light") {
    currentTheme = "dark";
  } else {
    currentTheme = "light";
  }
  $("html").attr("data-theme", currentTheme);
  localStorage.setItem("wattexs-theme", currentTheme);
  $(this).html(
    `<i class="bx bx-${currentTheme === "dark" ? "sun" : "moon"} text-accent text-xl"></i>`,
  );
});

// DOM Elements
const canvas = document.getElementById("textCanvas");
const ctx = canvas.getContext("2d");
const textInput = document.getElementById("textInput");
const updateBtn = document.getElementById("updateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const fontFamilySelect = document.getElementById("fontFamily");
const fontFamily = document.getElementById("fontFamily");
const fontSize = $("#fontSize");
const textColor = $("#textColor");
const bgOptions = $("#bgOptions");
const textOverlay = document.getElementById("textOverlay");

// State variables
let currentAlignment = "left";
let selectedBgImage = null;
let selectedBgOption = null;

let fontFamilyOptions = [
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",

  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "Montserrat",
  "Playfair Display",
  "Bebas Neue",
  "Oswald",
  "Pacifico",
  "Lobster",
  "Dancing Script",
  "Abril Fatface",
  "Raleway",
  "Space Mono",
];

// Background image options
const backgroundOptions = bgOptions.data("backgrounds");

// Initialize canvas
canvas.width = 1000;
canvas.height = 640;

function addOptionsToSelect(selectId, options) {
  console.log(selectId);
  var $select = $("#" + selectId);
  console.log($select);
  $.each(options, function (index, option) {
    console.log(option);
    $select.append($("<option></option>").attr("value", option).text(option));
  });
}

// Create background options grid

function createBackgroundOptions() {
  $.each(backgroundOptions, function (index, imgUrl) {
    const imgElement = $("<img>", {
      src: imgUrl,
      class: "bg-option",
      "data-index": index,
    });

    imgElement.on("click", function () {
      if (selectedBgOption) {
        selectedBgOption.removeClass("selected");
        // selectedBgOption.classList.remove("selected");
      }
      $(this).addClass("selected");
      selectedBgOption = $(this);
      selectedBgImage = imgUrl;
      renderCanvas();
    });

    bgOptions.append(imgElement);
  });
}

/*function createBackgroundOptions() {
  backgroundOptions.forEach((imgUrl, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = imgUrl;
    imgElement.classList.add("bg-option");
    imgElement.dataset.index = index;

    imgElement.addEventListener("click", function () {
      // Remove selected class from previously selected option
      if (selectedBgOption) {
        selectedBgOption.classList.remove("selected");
      }

      // Set new selection
      this.classList.add("selected");
      selectedBgOption = this;
      selectedBgImage = imgUrl;
      renderCanvas();
    });

    bgOptions.append(imgElement);
  });
}*/

// Set up alignment buttons
function setupAlignmentButtons() {
  $("[data-align]").on("click", function () {
    let alignBtns = $("[data-align]");
    $.each(alignBtns, function (index, btn) {
      if (btn.classList.contains("btn-accent")) {
        btn.classList.remove("btn-accent");
      }
    });

    $(this).addClass("btn-accent");
    currentAlignment = $(this).data("align");
    renderCanvas();
  });
}

// Text wrapping function
function wrapText(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Text justification function
function justifyText(text, maxWidth) {
  const words = text.split(" ");
  if (words.length === 1) return text;

  const totalWidth = ctx.measureText(text).width;
  const spaceWidth = (maxWidth - totalWidth) / (words.length - 1);

  let justifiedText = words[0];
  for (let i = 1; i < words.length; i++) {
    justifiedText +=
      " ".repeat(Math.floor(spaceWidth / ctx.measureText(" ").width)) +
      words[i];
  }
  return justifiedText;
}

// Main rendering function
function renderCanvas() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Draw text
  drawText();
}

function drawBackground() {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Handle CORS if needed
  img.onload = function () {
    // Draw image covering entire canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Add semi-transparent overlay if enabled
    if (textOverlay.checked) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Redraw text after image loads
    drawText();
  };
  img.src = selectedBgImage;
}

function drawText() {
  const text = textInput.value;
  if (!text) return;

  // Set text style
  ctx.font = `${fontSize.val()}px "${fontFamily.value}"`;
  ctx.fillStyle = textColor.val();
  ctx.textBaseline = "middle";
  ctx.textAlign = currentAlignment === "justify" ? "left" : currentAlignment;

  // Calculate available width with padding
  const padding = 20;
  const maxWidth = canvas.width - padding * 2;

  // Split text into paragraphs and wrap lines
  const paragraphs = text.split("\n");
  const lineHeight = parseInt(fontSize.val()) * 1.4;
  let totalHeight = 0;
  const allLines = [];

  paragraphs.forEach((para) => {
    const lines = wrapText(para, maxWidth);
    totalHeight += lines.length * lineHeight;
    allLines.push(...lines);
  });

  // Calculate starting Y position for vertical centering
  const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

  // Render each line
  let currentY = startY;
  allLines.forEach((line) => {
    let x;
    switch (currentAlignment) {
      case "left":
        x = padding;
        break;
      case "right":
        x = canvas.width - padding;
        break;
      case "center":
        x = canvas.width / 2;
        break;
      default:
        x = padding;
    }

    const textToRender =
      currentAlignment === "justify" ? justifyText(line, maxWidth) : line;
    ctx.fillText(textToRender, x, currentY);
    currentY += lineHeight;
  });
}

// Download function
function downloadCanvas() {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  $.get("/api/record/download");
}

// Event Listeners
function setupEventListeners() {
  updateBtn.addEventListener("click", renderCanvas);
  downloadBtn.addEventListener("click", downloadCanvas);

  $("[data-auto-update]").on("change", renderCanvas);

  // Text input with Enter key
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      renderCanvas();
    }
  });
}

// Initialize
createBackgroundOptions();
addOptionsToSelect("fontFamily", fontFamilyOptions);
setupAlignmentButtons();
setupEventListeners();
renderCanvas();
//
// $("[data-bg-img]").on("click", function () {
//   $("#textCanvas").css("background-image", `url("${$(this).data("bg-img")}")`);
// });
