window.onload = function(){
    load()
    dispGridSize()
    randomizeGrid()

    document.getElementById('setGrid').addEventListener('click', randomizeGrid)
    document.getElementById('add-state').addEventListener('click', addState)
    document.getElementById('remove-state').addEventListener('click', removeState)
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas)

    //document.getElementById('check').addEventListener('click',() => {
    //    console.log("==")
    //    console.log(states)
    //    console.log(transitions)
    //    console.log(gameGrid)
    //    console.log("==")
    //})

    document.getElementById('start-state').addEventListener('click', (e) =>{
        startState = true
        unchange = true
        canvas.style.cursor = 'crosshair'
    })

    document.getElementById('end-state').addEventListener('click', (e) =>{
        finalState = true
        unchange = true
        canvas.style.cursor = 'crosshair'
    })
    
    document.getElementById('add-transition').addEventListener('click', (e) => {
        //alert("Click on the first node")
        addingTransition = true
        unchange = true
        canvas.style.cursor = 'crosshair'
        fromState = null
    })

    canvas.addEventListener('click', (e) => {
        const { offsetX, offsetY } = e
        if (addingTransition) {
            if (!fromState) {
                fromState = states.find(state => state.contains(offsetX, offsetY))
                //alert("Click on the second node")
            } else {
                const toState = states.find(state => state.contains(offsetX, offsetY))
                if (fromState && toState) {
                    symbol = prompt('Enter transition symbol:')
                    if(acceptedActions.indexOf(symbol) == -1) symbol = ''
                    if (symbol) {
                        const transition = new Transition(fromState, toState, symbol)
                        transitions.push(transition)
                    }
                }
                fromState = null
                addingTransition = false
                unchange = false
                canvas.style.cursor = 'default'
                draw()
            }
        } else if (removingState) {
            console.log("click")
            const stateToRemove = states.find(state => state.contains(offsetX, offsetY))
            if (stateToRemove) {
                states = states.filter(state => state !== stateToRemove)
                transitions = transitions.filter(transition => transition.from !== stateToRemove && transition.to !== stateToRemove)
                draw()
            }
            removingState = false
            unchange = false
            canvas.style.cursor = 'default'
        } else if(startState) {
            const {offsetX, offsetY} = e
            const clickedState = states.find(state => state.contains(offsetX, offsetY))
            for(const st of states){
                st.isInitial = false
            }
            clickedState.isInitial = true
            draw()
            canvas.style.cursor = 'default'
            startState = false
            unchange = false
        } else if(finalState) {
            console.log("here")
            const {offsetX, offsetY} = e
            const clickedState = states.find(state => state.contains(offsetX, offsetY))
            clickedState.isAccept = !clickedState.isAccept
            draw()
            canvas.style.cursor = 'default'
            finalState = false
            unchange = false
        }
    })

    canvas.addEventListener('mousedown', (e) => {
        const { offsetX, offsetY } = e
        if(!unchange){
            dragging = states.find(state => state.contains(offsetX, offsetY))
        }
    })

    canvas.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY } = e
        if(!unchange){
            if(states.find(state => state.contains(offsetX, offsetY))){
                canvas.style.cursor = 'grab'
            }else{
                canvas.style.cursor = 'default'
            }
        }

        if (dragging) {
            canvas.style.cursor = 'grabbing'
            const { offsetX, offsetY } = e
            dragging.x = offsetX
            dragging.y = offsetY
            draw()
        }
    })

    canvas.addEventListener('mouseup', () => {
        dragging = null
        if(!unchange){
            canvas.style.cursor = 'default'
        }
    })

    document.getElementById('run').addEventListener('click', async () => {
        //const inputString = ['walk-up', 'walk-right','walk-down', 'walk-left']
        let pass = false
        let currentState = states.find(state => state.isInitial == true)
        if (!currentState) {
            alert('Please set an initial state.')
            return
        }

        let end = states.find(state => state.isAccept == true)
        if(!end){
            alert('Please set a final state.')
            return
        }

        if(currentState.isInitial == true && currentState.isAccept == true){
            pass = true
            currentState.isAccept = false
        }
    
        while(currentState.isAccept != true && GameOver == false && GameWin == false) {
            if(pass){
                currentState.isAccept = true
                pass = false
            }

            currentState.setColor('red')
            await new Promise(resolve => setTimeout(resolve, 500)) 
            currentState.resetColor()
            

            transition = transitions.filter(t => t.from === currentState)
            if(transition.indexOf(t => t.symbol === 'stench') != -1 && warnings == 'stench'){
                transitions = transitions.filter(t => t.symbol === 'stench')
            }else if(transition.indexOf(t => t.symbol === 'breeze') != -1 && warnings == 'breeze'){
                transitions = transitions.filter(t => t.symbol === 'breeze')
            }
            transition = transition[Math.floor(Math.random()*transition.length)]

            warnings = move(transition.symbol)
            currentState = transition.to
        }
    
        currentState.setColor('red')
        await new Promise(resolve => setTimeout(resolve, 500)) 
        currentState.resetColor()
    
        //document.getElementById('result').textContent = currentState.isAccept ? 'Accepted' : 'Rejected'
        //console.log(`outside ${currentState.isAccept ? 'Accepted' : 'Rejected'}`)
        currentState.resetColor()
        if(GameOver){
            alert('GAME OVER!')
        }else if(GameWin){
            alert('Game WIN!')
        }
    })


    document.getElementById('controls').addEventListener('click', () =>{
        $("#HowToPlay").dialog()
    })
}