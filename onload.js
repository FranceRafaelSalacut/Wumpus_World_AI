window.onload = function(){
    load()
    dispGridSize()
    randomizeGrid()

    document.getElementById('setGrid').addEventListener('click', randomizeGrid)
    document.getElementById('add-state').addEventListener('click', addState)
    document.getElementById('remove-state').addEventListener('click', removeState)
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas)

    document.getElementById('check').addEventListener('click',() => {
        console.log("==")
        console.log(states)
        console.log(transitions)
        console.log("==")
    })
    
    document.getElementById('add-transition').addEventListener('click', () => {
        alert("Click on the first node")
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
                alert("Click on the second node")
            } else {
                const toState = states.find(state => state.contains(offsetX, offsetY))
                if (fromState && toState) {
                    const symbol = prompt('Enter transition symbol:')
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

    canvas.addEventListener('dblclick', (e) => {
        const { offsetX, offsetY } = e
        const clickedState = states.find(state => state.contains(offsetX, offsetY))
        for(const st of states){
            st.isInitial = false
        }
        clickedState.isInitial = true
        draw()
    })

    document.getElementById('run').addEventListener('click', async () => {
        const inputString = "ababba"
        console.log(transitions)
        let currentState = states.find(state => state.isInitial == true)
        console.log(currentState)
        if (!currentState) {
            alert('Please set an initial state.')
            return
        }
    
        for (const symbol of inputString) {
            currentState.setColor('red')
            await new Promise(resolve => setTimeout(resolve, 500)) 
            currentState.resetColor()
            
            const transition = transitions.find(t => t.from === currentState && t.symbol === symbol)
            if (!transition) {
                //document.getElementById('result').textContent = 'Rejected'
                console.log("loop rejected")
                return
            }
            currentState = transition.to
        }
    
        currentState.setColor('red')
        await new Promise(resolve => setTimeout(resolve, 500)) 
        currentState.resetColor()
    
        //document.getElementById('result').textContent = currentState.isAccept ? 'Accepted' : 'Rejected'
        console.log(`outside ${currentState.isAccept ? 'Accepted' : 'Rejected'}`)
    })

    
}