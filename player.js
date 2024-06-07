function move(direction){
    const n = document.getElementById("slider").value

    switch(direction){
        case 'walk-up':
            if(playerLocation-n*1 > 0){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation - n*1 
            }
            break
        case 'walk-down':
            if(playerLocation+n*1 <= n*n){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation + n*1 
            }
            break
        case 'walk-left':
            if(playerLocation%n != 1){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation - 1 
            }
            break
        case 'walk-right':
            if(playerLocation%n != 0){
                gameGrid[`tile${playerLocation}`].Player = 0
                playerLocation = playerLocation + 1 
                
            }
            break
    }
    if(checkDanger(playerLocation)) GameOver = true

    if(GameOver) {
        gameGrid[`tile${playerLocation}`].Player = 0
        warning = 'None'
    }else{
        gameGrid[`tile${playerLocation}`].Player = 1
        warning = checkSigns(playerLocation)
        if(!sword){
            sword = checkSword(playerLocation)
        }
    }
    uncover.push(playerLocation)
    renderGrid()
    return warning
}   

function checkDanger(pos){
    if(gameGrid[`tile${pos}`].Goblin == 1){
        if(sword){
            gameGrid[`tile${pos}`].Goblin = 0
            GameWin = true
            return false
        }
        uncover.push(pos)
        return true
    }

    if(gameGrid[`tile${pos}`].Pit == 1){
        uncover.push(pos)
        return true
    }

    return false
}

function checkSigns(pos){
    if(gameGrid[`tile${pos}`].Stench == 1){
        return 'stench'
    }

    if(gameGrid[`tile${pos}`].Breeze == 1){
        return 'breeze'
    }

    return 'None'
}

function checkSword(pos){
    if(gameGrid[`tile${pos}`].Arrow == 1){
        gameGrid[`tile${pos}`].Arrow = 0
        alert("Sword Acquired")
        return true
    }
    return false
}