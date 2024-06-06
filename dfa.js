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
let startState = false
let finalState = false
let acceptedActions = ['walk-up', 'walk-down', 'walk-left', 'walk-right']


class State {
    constructor(x, y) {
        this.id = stateId++;
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.isAccept = false; 
        this.isInitial = false; 
        this.color = 'black'; 
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        if (this.isAccept) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (this.isInitial) {
            ctx.beginPath();
            ctx.moveTo(this.x - this.radius, this.y);
            ctx.lineTo(this.x - this.radius-10, this.y - 10);
            ctx.lineTo(this.x - this.radius-10, this.y + 10);
            ctx.closePath();
            ctx.fill();
        }
        ctx.fillStyle = this.color;
        ctx.fillText(this.id, this.x - 5, this.y + 5);
    }

    // Method to check if a point (x, y) is inside this state
    contains(x, y) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) < this.radius;
    }

    // Method to set the color of the state
    setColor(color) {
        this.color = color;
        draw();
    }

    // Method to reset the color of the state to default
    resetColor() {
        this.color = 'black';
        draw();
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
            // Self-transition as a loop
            ctx.beginPath();
            const loopRadius = this.from.radius / 2;
            ctx.arc(this.from.x, this.from.y - this.from.radius, loopRadius, 0.25, 0.9 * Math.PI, true);
            ctx.stroke();

            ctx.fillText(this.symbol, this.from.x - loopRadius + 5, this.from.y - this.from.radius -20);
        } else {
            const dx = this.to.x - this.from.x;
            const dy = this.to.y - this.from.y;
            const angle = Math.atan2(dy, dx);
            const fromX = this.from.x + Math.cos(angle) * this.from.radius;
            const fromY = this.from.y + Math.sin(angle) * this.from.radius;
            const toX = this.to.x - Math.cos(angle) * this.to.radius;
            const toY = this.to.y - Math.sin(angle) * this.to.radius;

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            // Draw arrowhead
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

            // Draw transition symbol
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            ctx.fillText(this.symbol, midX, midY);
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
    const state = new State(150, 150)
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
    stateID = 0
    draw()
}

function removeState() {
    removingState = true
    unchange = true
    canvas.style.cursor = 'crosshair'
}



