window.onload = function(){
    load()
    dispGridSize()
    randomizeGrid()

    document.getElementById('setGrid').addEventListener('click', randomizeGrid)
    document.getElementById('add-state').addEventListener('click', addState)
    document.getElementById('remove-state').addEventListener('click', removeState)
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas)
    
    document.getElementById('add-transition').addEventListener('click', () => {
        alert("Click on the first node")
        addingTransition = true
        unchange = true
        canvas.style.cursor = 'crosshair'
        fromState = null
    })

    canvas.addEventListener('click', (e) => {
        const { offsetX, offsetY } = e
        console.log("clickereds")
        if (addingTransition) {
            if (!fromState) {
                console.log("huan")
                fromState = states.find(state => state.contains(offsetX, offsetY));
                alert("Click on the second node")
            } else {
                console.log("twooo")
                const toState = states.find(state => state.contains(offsetX, offsetY));
                if (fromState && toState && fromState !== toState) {
                    const symbol = prompt('Enter transition symbol:');
                    if (symbol) {
                        const transition = new Transition(fromState, toState, symbol);
                        transitions.push(transition);
                    }
                }
                fromState = null;
                addingTransition = false;
                unchange = false
                canvas.style.cursor = 'default';
                draw();
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
}