// TO-DO APP — script.js
// Built in class 6/22 from one AI prompt, then split into this external file.

// --- STATE ---
let todos = [];
let currentFilter = "all";
let nextId = 1;

// --- DOM REFERENCES ---
const taskInput   = document.getElementById("task-input");
const addBtn      = document.getElementById("add-btn");
const todoList    = document.getElementById("todo-list");
const emptyState  = document.getElementById("empty-state");
const errorMsg    = document.getElementById("error-msg");
const summary     = document.getElementById("summary");
const filterBtns  = document.querySelectorAll(".filter-btn");

// --- ADD TASK ---
function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    errorMsg.textContent = "Type something first.";
    taskInput.focus();
    return;
  }

  errorMsg.textContent = "";

  const newTask = {
    id: nextId++,
    text: text,
    completed: false
  };

  todos.push(newTask);
  taskInput.value = "";
  taskInput.focus();
  render();
}

// --- TOGGLE COMPLETE ---
function toggleComplete(id) {
  const todo = todos.find(function(t) { return t.id === id; });
  if (todo) {
    todo.completed = !todo.completed;
  }
  render();
}

// --- DELETE TASK ---
function deleteTask(id) {
  todos = todos.filter(function(t) { return t.id !== id; });
  render();
}

// --- FILTER ---
function getFiltered() {
  if (currentFilter === "active") {
    return todos.filter(function(t) { return !t.completed; });
  }
  if (currentFilter === "completed") {
    return todos.filter(function(t) { return t.completed; });
  }
  return todos;
}

// --- RENDER ---
function render() {
  const filtered = getFiltered();

  // Clear the list
  todoList.innerHTML = "";

  // Summary count
  const activeCount = todos.filter(function(t) { return !t.completed; }).length;
  summary.textContent = todos.length === 0
    ? ""
    : activeCount + " of " + todos.length + " tasks remaining";

  // Empty state
  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");

    filtered.forEach(function(todo) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", function() {
        toggleComplete(todo.id);
      });

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-ghost delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function() {
        deleteTask(todo.id);
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  // Update filter buttons
  filterBtns.forEach(function(btn) {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// --- EVENT LISTENERS ---
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") addTask();
});

taskInput.addEventListener("input", function() {
  errorMsg.textContent = "";
});

filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// --- INIT ---
render();
