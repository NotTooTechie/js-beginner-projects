let lastInput;
let nonRepetableInputs = ["+","-","*","/","."];
let display; 

window.onload = () => {
    let buttons = document.getElementsByClassName ("btn");
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener ("click", (e) => {
            processInput (e);
        })
    }
    display = document.getElementById ("display");
}

function processInput (e) {
    let id = e.currentTarget.id;
    if (id === "c") {
        display.innerText = "";
        lastInput = undefined;
    } else if (id === "=") {
        if (display.innerText) {
            // eval not recomndded, acceptable for this simple excercise
            display.innerText = eval (display.innerText);
        }
    } else {
        if (canPrint (id)) {
            display.innerText += id;
        }
    }
    lastInput = id;
}


function canPrint (id) {
    // repeated operators and .
    if (contains (nonRepetableInputs,id) & contains (nonRepetableInputs,lastInput)) {
        return false;
    }
    // operator with no previous input
    if (!lastInput & contains(nonRepetableInputs,id)) {
        return false;
    }

    return true;
}


function contains (array, element) {
    if (array.indexOf (element) > -1) {
        return true;
    }
    return false;
}
