
let nextYearDiv;
let secondsDiv;
let minutesDiv;
let hoursDiv;
let daysDiv;

function updateUI () {
    let nextYear = new Date ().getFullYear () + 1;
    let nextYearDate = new Date (nextYear, 0, 1, 0,0,0,0);
    
    let t = nextYearDate - new Date();
    let seconds = Math.floor( (t/1000) % 60 );
    let minutes = Math.floor( (t/1000/60) % 60 );
    let hours = Math.floor( (t/(1000*60*60)) % 24 );
    let days = Math.floor( t/(1000*60*60*24) );

    nextYearDiv.innerText = nextYear;
    secondsDiv.innerText = pad (seconds,2);
    minutesDiv.innerText = pad (minutes,2);
    hoursDiv.innerText = pad (hours,2);
    daysDiv.innerText = pad (days,3);
}

function pad (number,digits) {
    return String (number).padStart (digits,0);
}

window.onload = ()=> {
    nextYearDiv = document.getElementById ("nextYearDiv");
    secondsDiv = document.getElementById ("secondsDiv");
    minutesDiv = document.getElementById ("minutesDiv");
    hoursDiv = document.getElementById ("hoursDiv");
    daysDiv = document.getElementById ("daysDiv");
    setInterval (updateUI, 1000);
};

