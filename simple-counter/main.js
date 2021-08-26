let counter = 0;

window.onload = ()=> {
    document.getElementById ("plusBtn").addEventListener ("click", ()=>{
        counter ++;
        updateUI ();
    });
    
    document.getElementById ("minusBtn").addEventListener ("click", ()=> {
        counter --;
        updateUI ();
    });

    document.getElementById ("resetBtn").addEventListener ("click", () => {
        counter = 0;
        updateUI ();
    });
}

function updateUI () {
    document.getElementById ("counter").innerText = counter;
}


