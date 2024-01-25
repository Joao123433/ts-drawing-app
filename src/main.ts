const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const sizeLabel: HTMLSpanElement = document.querySelector("span")
const btnSize: HTMLButtonElement = document.querySelector("#size-pencil")
const btnUndo: HTMLButtonElement = document.querySelector("#undo")
const btnClean: HTMLButtonElement = document.querySelector("#clean")
const btnEraser: HTMLButtonElement = document.querySelector("#eraser")
const btnColors: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".colors")

let draw = false
let strokeColor = "black"
let strokeSize = 0
let historic: ImageData[] =  []

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

function move(ev: { pageX: number; pageY: number }) {
  context.beginPath();
  context.moveTo(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop)
  draw = true
}

function stop() {
  if(draw) {
    context.closePath()
    draw = false
  }
  historic.push(context.getImageData(0, 0, canvas.width, canvas.height));
}

function drawing(ev: { pageX: number; pageY: number }) {
  if(draw) {
    context.lineTo(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop)
    context.strokeStyle = strokeColor
    context.lineWidth = strokeSize
    context.lineCap = "round"
    context.lineJoin = "round";
    context.stroke()
  }
}

function getX(ev: { pageX: number; targetTouches: { pageX: number }[] }) {
  if (ev.pageX == undefined) {
    return ev.targetTouches[0].pageX - canvas.offsetLeft
  } else {
    return ev.pageX - canvas.offsetLeft
  }
}


function getY(ev: { pageY: number; targetTouches: { pageY: number }[] }) {
  if (ev.pageY == undefined) {
    return ev.targetTouches[0].pageY - canvas.offsetTop
  } else {
    return ev.pageY - canvas.offsetTop
  }
}

function changeColor(ev) {
  const color = ev.target.dataset.color
  strokeColor = color
}

function changeSize(ev) {
  let size = Number(ev.target.value)
  strokeSize = size
  sizeLabel.textContent = `${size}`
}

function undo() {
  if((historic.length - 1) > 0) {
    historic.pop()
    context.putImageData(historic[historic.length - 1], 0, 0)
  } else {
    clean()
  }
}

function clean() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  historic = []
}

function eraser() {
  strokeColor = "white"
}

canvas.addEventListener("mousedown", move)
canvas.addEventListener("mouseup", stop)
canvas.addEventListener("mousemove", drawing)

btnSize.addEventListener("input", changeSize)
btnUndo.addEventListener("click", undo)
btnClean.addEventListener("click", clean)
btnEraser.addEventListener("click", eraser)
btnColors.forEach(e => e.addEventListener("click", changeColor))