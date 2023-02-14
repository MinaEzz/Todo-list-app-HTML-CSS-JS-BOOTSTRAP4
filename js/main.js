const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
//JSON.parse() to convert string to object
let todos = JSON.parse(localStorage.getItem("todo-item")); //getting local storage todo-list
const taskBox = document.querySelector(".task-box");
const clearAllBtn = document.querySelector(".clear-btn");
//editing variables
let editId;
let isEdited = false;

// FIRST FUNCTION:
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim(); //trim() is method removes whitespace from both sides of a string
  if (e.key == "Enter" && userTask) {
    if (!isEdited) {
      if (!todos) {
        todos = []; // if there is no todos, pass an empty todos array
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); //adding the new task to todos
    } else {
      isEdited = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-item", JSON.stringify(todos)); //JSON.stringify() to convert object to string
    addTask("all");
  }
});

// SECOND FUNCTION:
function addTask(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `
        <li class="task">
        <div class="task-desc">
            <input onClick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
            <label for="${id}" class="${isCompleted}">${todo.name}</label>
        </div>
        <div class="setting">
            <i onClick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
            <ul class="task-menu">
                <li onClick="editTask(${id}, '${todo.name}')"> <i class="fa-solid fa-pen"></i> Edit</li>
                <li onClick="deleteTask(${id})"> <i class="fa-solid fa-trash-can"></i> Delete</li>
            </ul> <!-- ./task-menu -->
        </div> <!-- ./setting -->
        </li> <!-- ./task -->
        `;
      }
    });
  }
  taskBox.innerHTML =
    li || `<li class="task"> You Don't Have Any Task Here </li>`;
}
addTask("all");

//THIRD FUNCTION:
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-item", JSON.stringify(todos));
}

//FOURTH FUNCTION:
function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

//FIFTH FUNCTION:
function deleteTask(deleteId) {
  todos.splice(deleteId, 1); //splice() is a function to delete an element from an array
  localStorage.setItem("todo-item", JSON.stringify(todos));
  addTask("all");
}

//SIXTH FUNCTION:
function editTask(taskId, taskName) {
  editId = taskId;
  isEdited = true;
  taskInput.value = taskName;
}

// FILTERS:
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    addTask(btn.id);
  });
});

//CLEAR ALL:
clearAllBtn.addEventListener("click", () => {
  todos.splice(0, todos.length); //splice() is a function to delete an element from an array
  localStorage.setItem("todo-item", JSON.stringify(todos));
  addTask("all");
});
