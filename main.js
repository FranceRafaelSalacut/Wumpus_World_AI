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
    tempGrid = []
    for (let i = 1; i <= n * n; i++){
       gameGrid[`tile${i}`] = {Player: 0, Pit: 0, Goblin: 0, Breeze:0, Stench:0}
       tempGrid.push(i)
    }

    const Pos = [1, n*1, (n*n)-(n-1), n*n] //Possible locations of the player are on the edges [top-left, top-right, bot-left, bot-right]
    index = (Math.floor(Math.random() * Pos.length))
    const playerStart = Pos[index]
    gameGrid[`tile${playerStart}`].Player = 1


    tempGrid.splice(tempGrid.indexOf(playerStart), 1)
    
    if(index == 0){
        tempGrid.splice(tempGrid.indexOf(playerStart + 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart + n*1), 1)
    }else if(index  == 1){
        tempGrid.splice(tempGrid.indexOf(playerStart - 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart + n*1), 1)
    }else if(index == 2){
        tempGrid.splice(tempGrid.indexOf(playerStart + 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart - n*1), 1)
    }else if(index == 3){
        tempGrid.splice(tempGrid.indexOf(playerStart - 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart - n*1), 1)
    }

    console.log(tempGrid)

    index = (Math.floor(Math.random() * tempGrid.length))
    goblinPos = tempGrid[index]

    gameGrid[`tile${goblinPos}`].Goblin = 1

    tempGrid.splice(tempGrid.indexOf(goblinPos), 1)

    stench = [goblinPos-n*1, goblinPos-1, goblinPos+1, goblinPos+n*1]
    for (let i = 0; i<stench.length; i++){
        if(stench[i] > 0 && stench[i] <= n*n){
            if(!(goblinPos%n==0 && goblinPos+1 == stench[i]) && !(goblinPos%n==1 && goblinPos-1 == stench[i])){
                gameGrid[`tile${stench[i]}`].Stench = 1
            }
           
        }
    }

    numPit = n-3

    for (let i = 0; i < numPit; i++){
        index = (Math.floor(Math.random() * tempGrid.length))
        holePos = tempGrid[index]
        gameGrid[`tile${holePos}`].Pit = 1
        tempGrid.splice(tempGrid.indexOf(holePos), 1)

        breeze= [holePos-n*1, holePos-1, holePos+1, holePos+n*1]
        for (let i = 0; i<breeze.length; i++){
            if(breeze[i] > 0 && breeze[i] <= n*n){
                gameGrid[`tile${breeze[i]}`].Breeze = 1
            }
    }

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
        }else if(gameGrid[`tile${i}`].Stench == 1 && gameGrid[`tile${i}`].Breeze == 1 && gameGrid[`tile${i}`].Goblin == 0 && gameGrid[`tile${i}`].Player == 0){
            tile.style.backgroundImage = 'url("sprites/cave_wall_stench_breeze.png")'
        }else if(gameGrid[`tile${i}`].Stench == 1 && gameGrid[`tile${i}`].Goblin == 0 && gameGrid[`tile${i}`].Player == 0){
            tile.style.backgroundImage = 'url("sprites/cave_wall_stench.png")'
        }else if(gameGrid[`tile${i}`].Breeze == 1 && gameGrid[`tile${i}`].Goblin == 0 && gameGrid[`tile${i}`].Player == 0){
            tile.style.backgroundImage = 'url("sprites/cave_wall_breeze.png")'
        }
        else{
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
