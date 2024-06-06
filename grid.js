
let playerLocation
let gameGrid
let covered = false
let uncover 
let GameOver = false
let GameWin = false

function revealGrid(){
    console.log("Reveal thy labyrinth")
    const n = document.getElementById("slider").value
    for(let i = 1; i <= n*n; i++){
        uncoverGrid(i)
    }
}

function uncoverGrid(i){
    const cont = document.getElementById(`tile${i}`)
    const gGrd = gameGrid[`tile${i}`]
    const bg = gGrd.backgroundImage

    if(gGrd.revealed){
        return 
    }

    gGrd.revealed = true

    if(gGrd.Player == 1){
        placeCharacter(i,1)
    }
        
    if(gGrd.Goblin == 1){
        placeCharacter(i,2)
    }

    if(gGrd.Arrow == 1){
        placeCharacter(i,3)
    }

    cont.style.backgroundColor = "None"
    cont.style.backgroundImage = bg

}

function placeCharacter(Player, type){

    const container = document.getElementById(`tile${Player}`)
    const tile = document.createElement('img')
    if(type == 1){
        tile.setAttribute('src', `sprites/Goblin_Slayer/down.png`)
        tile.setAttribute('id', `sprite`)
    }else if(type == 2){
        tile.setAttribute('src', `sprites/goblin.png`)
        tile.setAttribute('id', `sprite`)
    }else if(type == 3){
        tile.setAttribute('src', `sprites/arrow.png`)
        tile.setAttribute('id', `arrow`)
    }
        
    container.appendChild(tile)
}

function randomizeGrid(){
    //console.clear()
    const n = document.getElementById("slider").value

    gameGrid = new Object
    tempGrid = []
    for (let i = 1; i <= n * n; i++){
       gameGrid[`tile${i}`] = {Player: 0, Pit: 0, Goblin: 0, Breeze:0, Stench:0, Arrow:0, backgroundImage:"", revealed:false}
       tempGrid.push(i)
    }

    const Pos = [1, n*1, (n*n)-(n-1), n*n] //Possible locations of the player are on the edges [top-left, top-right, bot-left, bot-right]
    index = (Math.floor(Math.random() * Pos.length))
    const playerStart = Pos[index]
    gameGrid[`tile${playerStart}`].Player = 1


    tempGrid.splice(tempGrid.indexOf(playerStart), 1)

    uncover = [playerStart]
    if(index == 0){
        tempGrid.splice(tempGrid.indexOf(playerStart + 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart + n*1), 1)
        //uncover.push(playerStart + 1)
        //uncover.push(playerStart + n*1)
    }else if(index  == 1){
        tempGrid.splice(tempGrid.indexOf(playerStart - 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart + n*1), 1)
        //uncover.push(playerStart - 1)
        //uncover.push(playerStart + n*1)
    }else if(index == 2){
        tempGrid.splice(tempGrid.indexOf(playerStart + 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart - n*1), 1)
        //uncover.push(playerStart + 1)
        //uncover.push(playerStart - n*1)
    }else if(index == 3){
        tempGrid.splice(tempGrid.indexOf(playerStart - 1), 1)
        tempGrid.splice(tempGrid.indexOf(playerStart - n*1), 1)
        //uncover.push(playerStart - 1)
        //uncover.push(playerStart - n*1)
    }
    
    index = (Math.floor(Math.random() * tempGrid.length))
    goblinPos = tempGrid[index]

    gameGrid[`tile${goblinPos}`].Goblin = 1

    tempGrid.splice(tempGrid.indexOf(goblinPos), 1)

    stench = [goblinPos-n*1, goblinPos-1, goblinPos+1, goblinPos+n*1]
    for (let i = 0; i<stench.length; i++){
        if(stench[i] > 0 && stench[i] <= n*n){
            if(!(goblinPos%n==0 && goblinPos+1 == stench[i]) && !(goblinPos%n==1 && goblinPos-1 == stench[i])){
                tempGrid.splice(tempGrid.indexOf(stench[i]), 1)
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
                if(!(holePos%n==0 && holePos+1 == breeze[i]) && !(holePos%n==1 && holePos-1 == breeze[i])){
                    tempGrid.splice(tempGrid.indexOf(breeze[i]), 1)
                    gameGrid[`tile${breeze[i]}`].Breeze = 1
                }
               
            }
    }

    }

    index = (Math.floor(Math.random() * tempGrid.length))
    arrowPos = tempGrid[index]
    gameGrid[`tile${arrowPos}`].Arrow = 1
    tempGrid.splice(tempGrid.indexOf(arrowPos), 1)

    renderGrid()
    playerLocation = playerStart
}

function renderGrid() {
    const container = document.getElementById("grid");
    const n = document.getElementById("slider").value

    container.innerHTML = ""

    const tileSize = 100/ n;

    for (let i = 1; i <= n * n; i++) {
        gameGrid[`tile${i}`].revealed = 0

        const tile = document.createElement('div');
        tile.classList.add('tile')
        tile.setAttribute('id', `tile${i}`)
        tile.style.caretColor = 'transparent'
        //tile.setAttribute('onmouseover', `uncoverGrid(${i})`)
        tile.style.width = `${tileSize}%`;
        tile.style.height = `${tileSize}%`;
        const gGrid = gameGrid[`tile${i}`]
        if(gGrid.Pit == 1){
            gGrid.backgroundImage = 'url("sprites/cave_pit.png")'
            
        }else if(gGrid.Stench == 1 && gGrid.Breeze == 1 && gGrid.Goblin == 0 && gGrid.Player == 0){
            gGrid.backgroundImage = 'url("sprites/cave_wall_stench_breeze.png")'

        }else if(gGrid.Stench == 1 && gGrid.Goblin == 0 && gGrid.Player == 0){
            gGrid.backgroundImage = 'url("sprites/cave_wall_stench.png")'

        }else if(gGrid.Breeze == 1 && gGrid.Goblin == 0 && gGrid.Player == 0){
            gGrid.backgroundImage = 'url("sprites/cave_wall_breeze.png")'
        }
        else{
            gGrid.backgroundImage = 'url("sprites/cave_wall.png")'
        }

        tile.style.backgroundImage = "none"
        tile.style.backgroundColor = "grey"
        container.appendChild(tile);
    }

    for(const t of uncover){
        uncoverGrid(t)
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
