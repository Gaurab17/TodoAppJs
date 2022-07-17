const list = document.querySelector("ul");
const form = document.querySelector("form");
const btn = document.querySelector(".button");

// display the existing todos
db.collection("todo").onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(data=>{
        // console.log(data.type);
        console.log(data.doc.id);
        if(data.type === 'added'){
            // console.log(data.doc.data());
            displayTodos(data.doc.data(), data.doc.id);
        } else{
            console.log(data.doc.id);
            deleteTemplate(data.doc.id);
        }
    })
})

const displayTodos = (displayData, id) =>{
    const html = `
        <div todo-id="${id}">
            <li >${displayData.todo} - ${displayData.created_at}</li>
            <button class="button">Delete</button>
        </div>
        `;
        list.innerHTML += html;  
}

//deleting from template
const deleteTemplate = (id) =>{
    const li = document.querySelectorAll("div");
    li.forEach(data=>{
        if(data.getAttribute('todo-id') === id){
            data.remove();
        }
    }) 
}


//deleting from firestore
list.addEventListener("click", e=>{
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute("todo-id");
        console.log(id);
        db.collection("todo").doc(id).delete().then(data=>{
            console.log(`This id:${id} has been deleted`)
        }).catch(err=> console.log(err));
    }
})

//adding the todo to the database
const addTodo = (todos) =>{
    db.collection("todo").add(todos).then(data=>{
        console.log(data);
    }).catch(err=>console.log(err));
}

form.addEventListener("submit", e=>{
    e.preventDefault();
    const today = new Date();
    const time = today.getFullYear() + ":" + today.getMonth() + ":" + today.getDay();
    const data = {
        todo: form.todo.value,
        created_at: time,
    };
    addTodo(data);
    form.reset();
});