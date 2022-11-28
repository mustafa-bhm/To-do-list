const projectContainer = document.querySelector("[data-projects]");
const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectInput = document.querySelector("[data-new-project-input]");
const allProjects = document.querySelector(".all-projects");
const menu = document.querySelector(".fa-bars");
const deleteProjectButton = document.querySelector(
  "[data-delete-project-button]"
);
const listDisplayContainer = document.querySelector(
  "[data-project-display-container]"
);
const projectTitleElement = document.querySelector("[data-project-title]");
const projectTitleCount = document.querySelector("[data-tasks-count]");
const tasksContainer = document.querySelector("[data-tasks]");
// const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const deleteCompleteTasksButton = document.querySelector(
  "[data-delete-complete-tasks-button]"
);

/// save to local storage
const LOCAL_STORAGE_PROJECT_KEY = "projects";
/// for seleced lists
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "selectedProjectId";

let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

// select projects
let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
);

/// Event listenners ///

// to hidde side bar menu
menu.addEventListener("click", () => {
  allProjects.classList.toggle("hidden");
});
// to set value for the selectedProjectId
projectContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});

// to update remaining tasks
tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedProject = projects.find(
      (list) => list.id === selectedProjectId
    );
    const selectedtask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedtask.complete = e.target.checked;
    save();
    renderTaskCount(selectedProject);
  }
});

/// clear completed tasks
deleteCompleteTasksButton.addEventListener("click", (e) => {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => !task.complete
  );
  saveAndRender();
});

// event listener for delete btn
deleteProjectButton.addEventListener("click", (e) => {
  // to filter lists/project and only get the ones that are not selected
  projects = projects.filter((project) => project.id !== selectedProjectId);
  selectedProjectId = null;
  saveAndRender();
});

class CreateProject {
  constructor(name) {
    this.id = Date.now().toString();
    this.name = name;
    this.tasks = [];
  }
}
newProjectForm.addEventListener("click", (e) => {
  e.preventDefault();
  let input = newProjectInput.value;
  if (input == null || input === "") return;
  let project = new CreateProject(input);
  newProjectInput.value = "";
  projects.push(project);
  saveAndRender();
});

class Task {
  constructor(name) {
    this.id = Date.now().toString();
    this.name = name;
    this.complete = false;
  }
}
newTaskForm.addEventListener("click", (e) => {
  e.preventDefault();

  let taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = new Task(taskName);
  newTaskInput.value = "";
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  console.log(task, "====");
  selectedProject.tasks.push(task);
  saveAndRender();
});

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY,
    selectedProjectId
  );
}

function render() {
  clearElement(projectContainer);
  renderrList();
  // to render the project display container with tasks
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  if (selectedProjectId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    projectTitleElement.innerText = selectedProject.name;
    // to render remaining tasks
    renderTaskCount(selectedProject);
    clearElement(tasksContainer);
    renderTasks(selectedProject);
  }
}

// to create each task inside of the selected project
function renderTasks(selectedProject) {
  selectedProject.tasks.forEach((task) => {
    // to create the div container for each task
    let div = document.createElement("div");
    div.classList.add("task");
    div.innerHTML = `
 <input type="checkbox" id="${task.id}" />
    <label for="${task.id}">
      <span class="custom-checkbox"></span>
      ${task.name}
    </label>
 `;
    // set the value of the checkbox
    let checkBox = div.querySelector("input");
    checkBox.checked = task.complete;

    // append the task div to task container
    tasksContainer.appendChild(div);
  });
}

function renderTaskCount(selectedProject) {
  const incompleteTasksCount = selectedProject.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTasksCount === 1 ? "task" : "tasks";
  projectTitleCount.innerText = `${incompleteTasksCount} ${taskString} remaining`;
}

function renderrList() {
  projects.forEach((project) => {
    const projectElement = document.createElement("li");
    // create data attribute named project-id to hold the id number for this project

    projectElement.dataset.projectId = project.id;
    projectElement.classList.add("project-name");
    projectElement.innerHTML =
      `<i class="fa-solid fa-list"></i>` + project.name;

    // check if the stored selectedProjectId  === project.id
    if (project.id === selectedProjectId)
      projectElement.classList.add("active-project");

    projectContainer.appendChild(projectElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
