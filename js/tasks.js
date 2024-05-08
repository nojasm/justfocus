let newTaskBtn = document.getElementById("new-task");
let taskListEl = document.getElementById("tasks");

function getTasksFromLocalStorage() {
    let localTasks = [];
    if (localStorage.getItem("tasks") != null && localStorage.getItem("tasks") != "")
        localTasks = JSON.parse(localStorage.getItem("tasks"));
    return localTasks;
}

function setTasksInLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text, localStorageID) {
    let el = document.createElement("div");
    el.classList.add("task");

    el.setAttribute("lsid", localStorageID);

    let elBtn = document.createElement("div");
    elBtn.classList.add("task-button");

    let elText = document.createElement("input");
    elText.classList.add("task-text");
    elText.value = text;
    elText.addEventListener("change", (event) => {
        // Find in local storage
        let lst = getTasksFromLocalStorage();
        lst.forEach((e) => {
            if (e.id == event.target.parentElement.getAttribute("lsid")) {
                e.text = elText.value;
                return;
            }
        });
        setTasksInLocalStorage(lst);
    });

    elText.onfocus = () => {isAnyFocussed = true};
    elText.onblur = () => {isAnyFocussed = false};

    elBtn.addEventListener("click", (event) => {
        if (el.style.opacity == 0.5) {
            el.style.opacity = 1.0;
            elText.style.textDecoration = "";
        } else {
            el.style.opacity = 0.5;
            elText.style.textDecoration = "line-through";
        }

        // Find in local storage
        let lst = getTasksFromLocalStorage();
        lst.forEach((e) => {
            if (e.id == localStorageID) {
                e.done = el.style.opacity == 0.5;
                return;
            }
        });
        setTasksInLocalStorage(lst);
    });

    el.appendChild(elBtn);
    el.appendChild(elText);

    taskListEl.appendChild(el);

    let localTasks = getTasksFromLocalStorage();
    localTasks.push({text: text, done: false, id: localStorageID});
    setTasksInLocalStorage(localTasks);
}

document.getElementById("new-task").addEventListener("click", (event) => {
    addTask("empty task", crypto.randomUUID());
});

document.getElementById("clear-tasks").addEventListener("click", (event) => {
    setTasksInLocalStorage([]);
    [...document.getElementsByClassName("task")].forEach((e) => {
        e.remove();
    })
});

let localTasks = structuredClone(getTasksFromLocalStorage());
setTasksInLocalStorage([]);
localTasks.forEach((t) => {
    if (!t.done) addTask(t.text, t.id);
});