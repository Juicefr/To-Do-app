const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const taskCount = document.getElementById("task-count");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
    completed: currentTask.completed ?? false
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  // Update task counter
  const count = taskData.length;

  taskCount.textContent = count === 1
    ? `YOUR TASK (${count})`
    : `YOUR TASKS (${count})`;

  taskCount.classList.toggle("hidden", count === 0);

  // Display tasks
  taskData.forEach(({ id, title, date, description, completed }) => {
    tasksContainer.innerHTML += `
      <div class="task ${completed ? "completed" : ""}" id="${id}">

        <div class="task-header">
          <h3>${title}</h3>
        </div>

        <p class="task-date">
          <strong>Date:</strong> ${date || "No date set"}
        </p>

        <p class="task-description">
          ${description || "No description provided."}
        </p>

        <label class="complete-label">
          <input
            type="checkbox"
            class="complete-checkbox"
            onchange="toggleTask(this)"
            ${completed ? "checked" : ""}
          >
          Mark as completed
        </label>

        <div class="task-actions">
          <button onclick="editTask(this)"
            type="button" class="btn edit-btn">
            Edit
          </button>

          <button onclick="deleteTask(this)"
            type="button" class="btn delete-btn">
            Delete
          </button>
        </div>

      </div>
    `;
  });
};
const toggleTask = (checkbox) => {
  const taskElement = checkbox.closest(".task");

  const task = taskData.find(
    (item) => item.id === taskElement.id
  );

  if (!task) return;

  task.completed = checkbox.checked;

  localStorage.setItem("data", JSON.stringify(taskData));

  updateTaskContainer();
};

const deleteTask = (buttonEl) => {
  const taskElement = buttonEl.closest(".task");

  const dataArrIndex = taskData.findIndex(
    (item) => item.id === taskElement.id
  );

  if (dataArrIndex === -1) return;

  taskData.splice(dataArrIndex, 1);

  localStorage.setItem("data", JSON.stringify(taskData));

  updateTaskContainer();
};

const editTask = (buttonEl) => {
  const taskElement = buttonEl.closest(".task");

  const dataArrIndex = taskData.findIndex(
    (item) => item.id === taskElement.id
  );

  if (dataArrIndex === -1) return;

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.remove("hidden");

  taskForm.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
};

const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";

  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";

  taskForm.classList.add("hidden");

  currentTask = {};
};

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () => {
  currentTask = {};
  addOrUpdateTaskBtn.innerText = "Add Task";
  taskForm.classList.remove("hidden");
});

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});