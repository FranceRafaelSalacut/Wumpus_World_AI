window.onload = function(){
    dispGridSize()
    randomizeGrid()
}
var playerLocation
var gameGrid

function placeCharacter(Player, type){

    const container = document.getElementById(`tile${Player}`)
    const tile = document.createElement('img')
    if(type == 1){
        tile.setAttribute('src', `sprites/Goblin_slayer/down.png`)
    }else if(type == 2){
        tile.setAttribute('src', `sprites/Goblin.png`)
    }
        tile.setAttribute('id', `sprite`)
    container.appendChild(tile)
}

function randomizeGrid(){
    console.clear()
    const n = document.getElementById("slider").value

    gameGrid = new Object
    for (let i = 0; i < n * n; i++){
       gameGrid[`tile${i+1}`] = {Player: 0, Pit: 0, Goblin: 0, breeze:0, stench:0}
    }

    const Pos = [1, n*1, (n*n)-(n-1), n*n] //Possible locations of the player are on the edges [top-left, top-right, bot-left, bot-right]
    index = (Math.floor(Math.random() * Pos.length))
    const playerStart = Pos[index]
    gameGrid[`tile${playerStart}`].Player = 1
    
    //console.log(playerStart)

    const noSpawnZone = [playerStart]
    if(index == 0){
        //console.log("top-left")
        noSpawnZone.push(playerStart + 1)
        noSpawnZone.push(playerStart + n*1)
    }else if(index  == 1){
        //console.log("top-right")
        noSpawnZone.push(playerStart - 1)
        noSpawnZone.push(playerStart + n*1)
    }else if(index == 2){
        //console.log("bot-left")
        noSpawnZone.push(playerStart + 1)
        noSpawnZone.push(playerStart - n*1)
    }else if(index == 3){
        //console.log("bot-right")
        noSpawnZone.push(playerStart - 1)
        noSpawnZone.push(playerStart - n*1)
    }

    console.log(noSpawnZone)

    while(true){
        goblinPos = (Math.floor(Math.random() * (n*n)))+1
        if(noSpawnZone.indexOf(goblinPos) == -1){ //source = https://stackoverflow.com/questions/3425291/javascript-if-statement-looking-through-an-array
            noSpawnZone.push(goblinPos)
            gameGrid[`tile${goblinPos}`].Goblin = 1
            break
        }
        console.log(goblinPos)
        console.log("Im here goblin")
    }
    
    console.log(noSpawnZone)

    numPit = n - 3

    while(true){
        holePos = (Math.floor(Math.random() * (n*n)))+1
        if(noSpawnZone.indexOf(holePos) == -1){
            gameGrid[`tile${holePos}`].Pit = 1
            break
        }
        console.log(holePos)
        console.log("Im here pit")
    }

    renderGrid()

}

function renderGrid() {
    const container = document.getElementById("grid");
    const n = document.getElementById("slider").value

    container.innerHTML = ""

    const tileSize = 100/ n;

    for (let i = 1; i <= n * n; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile')
        tile.setAttribute('id', `tile${i}`)
        tile.style.width = `${tileSize}%`;
        tile.style.height = `${tileSize}%`;
        if(gameGrid[`tile${i}`].Pit == 1){
            tile.style.backgroundImage = 'url("sprites/cave_pit.png")'
        }else{
            tile.style.backgroundImage = 'url("sprites/cave_wall.png")'
        }
        container.appendChild(tile);

        if(gameGrid[`tile${i}`].Player == 1){
            placeCharacter(i,1)
        }

        if(gameGrid[`tile${i}`].Goblin == 1){
            placeCharacter(i,2)
        }

    }
}

function dispGridSize(){
    const slider = document.getElementById("slider")
    const output = document.getElementById("gridSize")

    output.textContent = slider.value

    slider.addEventListener('input', function() { 
        output.textContent = this.value; 
    }); 
}
