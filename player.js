function move(direction){
    const n = document.getElementById("slider").value

    switch(direction){
        case 'walk-up':
            if(playerLocation-n*1 > 0){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation - n*1 
                if(checkDanger(playerLocation)) GameOver = true
            }
            break
        case 'walk-down':
            if(playerLocation+n*1 <= n*n){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation + n*1 
                if(checkDanger(playerLocation)) GameOver = true
            }
            break
        case 'walk-left':
            if(playerLocation%n != 1){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation - 1 
                if(checkDanger(playerLocation)) GameOver = true
            }
            break
        case 'walk-right':
            if(playerLocation%n != 0){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation + 1 
                if(checkDanger(playerLocation)) GameOver = true
            }
            break
    }
    if(GameOver) {
        gameGrid[`tile${playerLocation}`].Player = 0
    }else{
        gameGrid[`tile${playerLocation}`].Player = 1
    }
    uncover.push(playerLocation)
    renderGrid()
}   

function checkDanger(pos){
    if(gameGrid[`tile${pos}`].Goblin == 1){
        uncover.push(pos)
        return true
    }

    if(gameGrid[`tile${pos}`].Pit == 1){
        uncover.push(pos)
        return true
    }

    return false
}