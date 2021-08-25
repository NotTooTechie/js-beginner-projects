const colors = ["bg-primary","bg-secondary","bg-success","bg-danger","bg-warning","bg-info"];
let currentColorIndex = 1;

window.onload = ()=> {
    console.log ("Window onload");
    document.getElementById ("chgColorBtn").addEventListener ("click", ()=> {
        changeBackgroundColor ();
    })
}

function changeBackgroundColor () {
    let mainDivClassList = document.getElementById ("mainDiv").classList;
    let newColorIndex = getNewColorIndex ();
    mainDivClassList.remove (colors [currentColorIndex]);
    mainDivClassList.add (colors [newColorIndex]);
    console.log (colors [newColorIndex]);
    currentColorIndex = newColorIndex;    
}

function getNewColorIndex () {
    let colorIndex = currentColorIndex;
    while (colorIndex == currentColorIndex) {
        colorIndex = Math.floor (Math.random () * colors.length);
    }
    return colorIndex;
}