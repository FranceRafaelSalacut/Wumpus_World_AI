var canvas
var ctx
let states = []
let transitions = []
let dragging = null
let stateId = 0
let addingTransition = false
let fromState = null
let removingState = false
let unchange = false


class State {
    constructor(x, y) {
        this.id = stateId++
        this.x = x
        this.y = y
        this.radius = 30
        this.isAccept = false
        this.isInitial = false
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        if (this.isAccept) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius - 5, 0, 2 * Math.PI)
            ctx.stroke()
        }
        if (this.isInitial) {
            ctx.beginPath()
            ctx.moveTo(this.x - this.radius - 10, this.y)
            ctx.lineTo(this.x - this.radius, this.y - 10)
            ctx.lineTo(this.x - this.radius, this.y + 10)
            ctx.closePath()
            ctx.fill()
        }
        ctx.fillText(this.id, this.x - 5, this.y + 5)
    }

    contains(x, y) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) < this.radius
    }
}

class Transition {
    constructor(from, to, symbol) {
        this.from = from;
        this.to = to;
        this.symbol = symbol;
    }

    draw() {
        if (this.from === this.to) {
            ctx.beginPath();
            ctx.arc(this.from.x, this.from.y - this.from.radius, this.from.radius / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillText(this.symbol, this.from.x - 10, this.from.y - this.from.radius - 10);
        } else {

            const dx = this.to.x - this.from.x;
            const dy = this.to.y - this.from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const offset = 15;
            const controlX = (this.from.x + this.to.x) / 2 + offset * Math.sin(angle);
            const controlY = (this.from.y + this.to.y) / 2 - offset * Math.cos(angle);

            const fromX = this.from.x + Math.cos(angle) * this.from.radius;
            const fromY = this.from.y + Math.sin(angle) * this.from.radius;
            const toX = this.to.x - Math.cos(angle) * this.to.radius;
            const toY = this.to.y - Math.sin(angle) * this.to.radius;

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.quadraticCurveTo(controlX, controlY, toX, toY);
            ctx.stroke();

            ctx.save();
            ctx.translate(toX, toY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            ctx.fillText(this.symbol, midX + offset * Math.sin(angle) / 2, midY - offset * Math.cos(angle) / 2);
        }
    }
}

function load(){
    canvas = document.getElementById('canvas')
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    ctx = canvas.getContext('2d')
}

function addState() {
    const state = new State(50, 50)
    states.push(state)
    draw()
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    transitions.forEach(transition => transition.draw())
    states.forEach(state => state.draw())
}

function clearCanvas() {
    states = []
    transitions = []
    draw()
}

function removeState() {
    removingState = true
    unchange = true
    canvas.style.cursor = 'crosshair'
}



