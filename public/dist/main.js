const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const sizeLabel = document.querySelector("span");
const btnSize = document.querySelector("#size-pencil");
const btnUndo = document.querySelector("#undo");
const btnClean = document.querySelector("#clean");
const btnEraser = document.querySelector("#eraser");
const btnColors = document.querySelectorAll(".colors");
let draw = false;
let strokeColor = "black";
let strokeSize = 0;
let historic = [];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
function start(ev) {
    context.beginPath();
    context.moveTo(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
    draw = true;
}
function stop() {
    if (draw) {
        context.closePath();
        draw = false;
    }
    historic.push(context.getImageData(0, 0, canvas.width, canvas.height));
}
function drawing(ev) {
    if (draw) {
        context.lineTo(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeSize;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
}
function getX(ev) {
    if (ev.pageX == undefined) {
        return ev.targetTouches[0].pageX - canvas.offsetLeft;
    }
    else {
        return ev.pageX - canvas.offsetLeft;
    }
}
function getY(ev) {
    if (ev.pageY == undefined) {
        return ev.targetTouches[0].pageY - canvas.offsetTop;
    }
    else {
        return ev.pageY - canvas.offsetTop;
    }
}
function changeColor(ev) {
    const color = ev.target.dataset.color;
    strokeColor = color;
}
function changeSize(ev) {
    let size = Number(ev.target.value);
    strokeSize = size;
    sizeLabel.textContent = `${size}`;
}
function undo() {
    if ((historic.length - 1) > 0) {
        historic.pop();
        context.putImageData(historic[historic.length - 1], 0, 0);
    }
    else {
        clean();
    }
}
function clean() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    historic = [];
}
function eraser() {
    strokeColor = "white";
}
// pc
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mousemove", drawing);
// mobile
canvas.addEventListener("touchstart", start);
canvas.addEventListener("touchend", stop);
canvas.addEventListener("touchmove", drawing);
btnSize.addEventListener("input", changeSize);
btnUndo.addEventListener("click", undo);
btnClean.addEventListener("click", clean);
btnEraser.addEventListener("click", eraser);
btnColors.forEach(e => e.addEventListener("click", changeColor));
