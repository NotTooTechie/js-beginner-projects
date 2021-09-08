let newTodoInput;
let todos;

window.onload = () => {
    document.getElementById ("addTodoBtn").addEventListener ("click",()=> {
        if (newTodoInput.value) {
            addTodo ();
        }
        newTodoInput.focus ();
    });

    todos = document.getElementById ("todos");
    newTodoInput = document.getElementById ("newTodoInput");
}

function addTodo () {
    console.log (newTodoInput.value);
    let todoCard = addNewElement ("div","card mb-2 shadow-sm",todos);
    let todoBody = addNewElement ("div","card-body",todoCard);
    let cardTitle = addNewElement ("h4","card-title",todoBody,newTodoInput.value);
    let completeButton = addNewElement ("button", "btn btn-success", todoBody, "Complete");
    completeButton.addEventListener ("click", ()=> {
        cardTitle.style.color = "grey";
        cardTitle.innerText += " (Completed)";
        newTodoInput.focus ();
    })
    let deleteButton = addNewElement ("button","btn btn-danger",todoBody, "Delete");
    deleteButton.addEventListener ("click", ()=> {
        todos.removeChild (todoCard);
    })

    newTodoInput.value = "";
}


function addNewElement (type,className, parent, innerText) {
    element = document.createElement (type);
    element.className = className;
    if (innerText) {
        element.innerText = innerText;    
    }

    if (parent) {
        parent.appendChild (element);
    }
    
    return element;
}