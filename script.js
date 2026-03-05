const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const themeChange = document.getElementById("setTheme");
const container = document.querySelector(".container");

inputBox.addEventListener("keypress",(e) =>{
    if(e.key=="Enter") addTask();
});

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something...");
    }else{
        const existing  = [...listContainer.querySelectorAll("li")];
        if(existing.some(li => li.firstChild.textContent.trim().toLowerCase() === inputBox.value.trim().toLowerCase())){
            alert("Task already exists!");
            inputBox.value = "";
            return;
        }

        let li = document.createElement("li");
        li.textContent = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
    updateCounter();
    updateEmptyMessage();
}

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){
    container.classList.add("dark-mode");
}

themeChange.addEventListener("click",() =>{
    container.classList.toggle("dark-mode");
    
    const isDark  = container.classList.contains("dark-mode");
    
    localStorage.setItem("theme",isDark ? "dark" : "light");
})

listContainer.addEventListener("click",function(e){
    if(e.target.tagName==="LI"){
        e.target.classList.toggle("checked");
        saveData();
        updateCounter();
        updateEmptyMessage();
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
        updateCounter();
        updateEmptyMessage();
    }
},false);

function saveData(){
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(li => {
        tasks.push({
            text : li.firstChild.textContent,
            checked : li.classList.contains("checked")
        });
    });
    localStorage.setItem("data",JSON.stringify(tasks));
}

function showTask(){
    const tasks = JSON.parse(localStorage.getItem("data")) || [];
    tasks.forEach(task =>{
        let li = document.createElement("li");
        li.textContent = task.text;
        if (task.checked) li.classList.add("checked");
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        listContainer.appendChild(li);
    });
}

function updateCounter(){
    const total = listContainer.querySelectorAll("li").length;
    const checked = listContainer.querySelectorAll("li.checked").length;
    const remaining = total - checked;
    const counter = document.getElementById("task-counter");
    counter.textContent = total === 0 ? "" : `${remaining} out of ${total} remaining`;
}

function updateEmptyMessage(){
    const emptyMsg = document.getElementById("empty-msg");
    if(listContainer.querySelectorAll("li").length === 0){
        emptyMsg.style.display = "block";
    }else{
        emptyMsg.style.display = "none";
    }
}

function clearAll(){
    if(listContainer.querySelectorAll("li").length === 0){
        alert("No tasks to clear..");
        return;
    }

    if(confirm("Are you sure you want to delete all tasks?")){
        listContainer.innerHTML ="";
        saveData();
        updateCounter();
        updateEmptyMessage();
    }
}

showTask();
updateCounter();
updateEmptyMessage();