/*==================================================
            DOM ELEMENTS
==================================================*/

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const taskDescription = document.getElementById("taskDescription");

const taskCategory = document.getElementById("taskCategory");

const taskPriority = document.getElementById("taskPriority");

const taskDate = document.getElementById("taskDate");

const taskTime = document.getElementById("taskTime");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const remainingCount = document.getElementById("remainingCount");

const nextDeadline = document.getElementById("nextDeadline");

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const progressPercent = document.getElementById("progressPercent");

const progressRing = document.getElementById("progressRing");

const searchTask = document.getElementById("searchTask");

const filterCategory = document.getElementById("filterCategory");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

const toastIcon = document.getElementById("toastIcon");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupText = document.getElementById("popupText");

const popupBtn = document.getElementById("popupBtn");

const congratsPopup = document.getElementById("congratsPopup");

const closeCongrats = document.getElementById("closeCongrats");

/*==================================================
            GLOBAL VARIABLES
==================================================*/

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskChart;

let categoryChart;

const circleLength = 408;

/*==================================================
            LOCAL STORAGE
==================================================*/

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/*==================================================
            TOAST NOTIFICATION
==================================================*/

function showToast(message, icon = "fa-circle-check"){

    toastMessage.textContent = message;

    toastIcon.className = `fa-solid ${icon}`;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

    toast.classList.remove("show");

},2500);
/*==================================================
            SUCCESS POPUP
==================================================*/

function showPopup(title, message){

    popupTitle.textContent = title;

    popupText.textContent = message;

    popup.classList.add("show");

}

popupBtn.onclick = () => {

    popup.classList.remove("show");

};

/*==================================================
        CONGRATULATIONS POPUP
==================================================*/

function showCongrats(){

    congratsPopup.classList.add("show");

}

closeCongrats.onclick = () => {

    congratsPopup.classList.remove("show");

};
/*==================================================
            MOTIVATIONAL QUOTES
==================================================*/

const quotes = [

"Success starts with self-discipline. 💜",

"Small progress is still progress.",

"Dream big. Work hard. Stay focused.",

"Every task completed is one step closer to your goal.",

"Don't watch the clock. Do what it does. Keep going.",

"Believe in yourself and all that you are.",

"Consistency beats motivation.",

"You are stronger than your excuses."

];

/*==================================================
            RANDOM QUOTE
==================================================*/

function showQuote(){

    const quote = document.getElementById("quote");

    const random = Math.floor(Math.random()*quotes.length);

    quote.textContent = quotes[random];

}

/*==================================================
            LIVE CLOCK
==================================================*/

function updateClock(){

    const now = new Date();

    const hour = String(now.getHours()).padStart(2,"0");

    const minute = String(now.getMinutes()).padStart(2,"0");

    const second = String(now.getSeconds()).padStart(2,"0");

    document.getElementById("clock").textContent =

    `${hour}:${minute}:${second}`;

}

/*==================================================
            DATE & DAY
==================================================*/

function updateDate(){

    const now = new Date();

    const options = {

        day:"numeric",

        month:"long",

        year:"numeric"

    };

    const dayOptions = {

        weekday:"long"

    };

    document.getElementById("todayDate").textContent =

    now.toLocaleDateString("en-IN",options);

    document.getElementById("todayDay").textContent =

    now.toLocaleDateString("en-IN",dayOptions);

}

/*==================================================
            GREETING
==================================================*/

function updateGreeting(){

    const hour = new Date().getHours();

    const greeting = document.getElementById("greeting");

    if(hour<12){

        greeting.textContent="Good Morning 🌞";

    }

    else if(hour<17){

        greeting.textContent="Good Afternoon ☀️";

    }

    else if(hour<20){

        greeting.textContent="Good Evening 🌇";

    }

    else{

        greeting.textContent="Good Night 🌙";

    }

}

/*==================================================
            DARK MODE
==================================================*/

const themeToggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

});

/*==================================================
            START CLOCK
==================================================*/

updateClock();

updateDate();

updateGreeting();

showQuote();

setInterval(updateClock,1000);

setInterval(updateGreeting,60000);
/*==================================================
            ADD NEW TASK
==================================================*/

taskForm.addEventListener("submit", addTask);

function addTask(e){

    e.preventDefault();

    if(

        taskTitle.value.trim()==="" ||

        taskDate.value==="" ||

        taskTime.value===""

    ){

        showToast(

            "Please fill all required fields",

            "fa-circle-exclamation"

        );

        return;

    }

    const task={

        id:Date.now(),

        title:taskTitle.value.trim(),

        description:taskDescription.value.trim(),

        category:taskCategory.value,

        priority:taskPriority.value,

        date:taskDate.value,

        time:taskTime.value,

        completed:false,

        favorite:false,

        createdAt:new Date().toISOString()

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    showToast(

        "Task Added Successfully",

        "fa-circle-check"

    );

    showPopup(

        "Success",

        "Task Added Successfully 🎉"

    );

    taskForm.reset();

}

/*==================================================
            CLEAR FORM
==================================================*/

function clearForm(){

    taskTitle.value="";

    taskDescription.value="";

    taskCategory.selectedIndex=0;

    taskPriority.selectedIndex=0;

    taskDate.value="";

    taskTime.value="";

}

/*==================================================
            RESET AFTER ADD
==================================================*/

taskForm.addEventListener("submit",()=>{

    setTimeout(clearForm,100);

});
/*==================================================
            RENDER ALL TASKS
==================================================*/

function renderTasks(list = tasks){
    list.sort((a,b)=>{

    if(a.completed===b.completed){

        return new Date(a.date+"T"+a.time)-new Date(b.date+"T"+b.time);

    }

    return a.completed-b.completed;

});

    taskList.innerHTML = "";

    if(list.length === 0){

        taskList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-clipboard-list"></i>

            <h2>No Tasks Yet</h2>

            <p>Add your first task to get started 🚀</p>

        </div>

        `;

        taskCount.textContent = "0 Tasks";

        return;

    }

    taskCount.textContent =

    `${list.length} Task${list.length > 1 ? "s" : ""}`;
     const now=new Date();
    list.forEach(task=>{
        const overdue=

!task.completed &&

new Date(task.date+"T"+task.time)<now;

        taskList.innerHTML += `

<div class="task-card

${task.completed ? "completed" : ""}

${overdue ? "overdue" : ""}">

<div class="task-title">

<h3>${task.title}</h3>

<span class="priority-${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

<p class="task-description">

${task.description || "No description"}

</p>

<div class="task-details">

<span>

📂 ${task.category}

</span>

<span>

📅 ${task.date}

</span>

<span>

⏰ ${task.time}

</span>

<span class="remaining-time">

${getRemainingTime(task)}

</span>

</div>

<div class="task-actions">

<button

class="favorite-btn"

onclick="toggleFavorite(${task.id})"

title="Favourite">

${task.favorite ?

'<i class="fa-solid fa-heart"></i>' :

'<i class="fa-regular fa-heart"></i>'}

</button>

<button

class="complete-btn"

onclick="toggleComplete(${task.id})"

title="Complete">

<i class="fa-solid fa-check"></i>

</button>

<button

class="delete-btn"

onclick="deleteTask(${task.id})"

title="Delete">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

/*==================================================
        LIVE REMAINING TIME
==================================================*/

function getRemainingTime(task){

    if(task.completed){

        return "✅ Completed";

    }

    const now = new Date();

    const deadline = new Date(

        task.date + "T" + task.time

    );

    const diff = deadline - now;

    if(diff <= 0){

        return "❌ Overdue";

    }

    const days =

    Math.floor(diff / (1000*60*60*24));

    const hours =

    Math.floor(

    (diff % (1000*60*60*24))

    /(1000*60*60)

    );

    const minutes =

    Math.floor(

    (diff % (1000*60*60))

    /(1000*60)

    );

    if(days > 0){

        return `⏳ ${days}d ${hours}h Left`;

    }

    if(hours > 0){

        return `⏳ ${hours}h ${minutes}m Left`;

    }

    return `⏳ ${minutes}m Left`;

}

/*==================================================
        AUTO UPDATE COUNTDOWN
==================================================*/

setInterval(()=>{

    renderTasks();

},60000);
/*==================================================
            TOGGLE FAVORITE
==================================================*/

function toggleFavorite(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.favorite = !task.favorite;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    const task = tasks.find(t => t.id === id);

    showToast(

        task.favorite ?

        "Added to Favorites ❤️"

        :

        "Removed from Favorites 🤍",

        "fa-heart"

    );

}

/*==================================================
            COMPLETE TASK
==================================================*/

function toggleComplete(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    const completed = tasks.filter(task => task.completed).length;

    if(completed === tasks.length && tasks.length > 0){

        showCongrats();

    }

    showToast(

        "Task Completed Successfully 🎉",

        "fa-circle-check"

    );

}

/*==================================================
                DELETE TASK
==================================================*/

function deleteTask(id){

    if(!confirm("Delete this task?")){

        return;

    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    showToast(

        "Task Deleted Successfully 🗑️",

        "fa-trash"

    );

}

/*==================================================
        INITIAL RENDER
==================================================*/

renderTasks();

updateDashboard();

updateCharts();
/*==================================================
            UPDATE DASHBOARD
==================================================*/

function updateDashboard(){

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

    remainingCount.textContent = `${pending} Remaining`;

    updateProgress(total, completed);

    updateNextDeadline();

}

/*==================================================
            PROGRESS RING
==================================================*/

function updateProgress(total, completed){

    let percent = 0;

    if(total > 0){

        percent = Math.round((completed / total) * 100);

    }

    progressPercent.textContent = percent + "%";

    const offset = circleLength - (percent / 100) * circleLength;

    progressRing.style.strokeDasharray = circleLength;

    progressRing.style.transition="stroke-dashoffset 1s ease";

progressRing.style.strokeDashoffset=offset;

}

/*==================================================
            NEXT DEADLINE
==================================================*/

function updateNextDeadline(){

    const pendingTasksList = tasks
        .filter(task => !task.completed)
        .sort((a,b)=>{

            const first = new Date(a.date + "T" + a.time);

            const second = new Date(b.date + "T" + b.time);

            return first - second;

        });

    if(pendingTasksList.length === 0){

        nextDeadline.textContent = "No Pending Tasks 🎉";

        return;

    }

    const next = pendingTasksList[0];

    nextDeadline.textContent =
        `${next.title} • ${next.date} ${next.time}`;

}

/*==================================================
            REFRESH DASHBOARD
==================================================*/

function refreshDashboard(){

    updateDashboard();

    renderTasks();

}

/*==================================================
        INITIAL DASHBOARD LOAD
==================================================*/

refreshDashboard();
/*==================================================
                LIVE SEARCH
==================================================*/

searchTask.addEventListener("input", applyFilters);

filterCategory.addEventListener("change", applyFilters);


function applyFilters(){

    let filteredTasks = [...tasks];

    /* Search */

    const search = searchTask.value
        .toLowerCase()
        .trim();

    if(search){

        filteredTasks = filteredTasks.filter(task =>

            task.title.toLowerCase().includes(search) ||

            task.description.toLowerCase().includes(search)

        );

    }

    /* Category Filter */

    if(filterCategory.value !== "All"){

        filteredTasks = filteredTasks.filter(task =>

            task.category === filterCategory.value

        );

    }
renderTasks(filteredTasks);

}

/*==================================================
            TASK OVERVIEW CHART
==================================================*/

function updateCharts(){

    const completed = tasks.filter(task=>task.completed).length;

    const pending = tasks.length - completed;

    if(taskChart){

        taskChart.destroy();

    }

    taskChart = new Chart(

        document.getElementById("taskChart"),

        {

            type:"doughnut",

            data:{

                labels:["Completed","Pending"],
              datasets:[{
    data:[completed,pending],
    backgroundColor:[
        "#7c3aed",
        "#f59e0b"
    ],
    borderRadius:12
}]
              
            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

    updateCategoryChart();

}

/*==================================================
            CATEGORY CHART
==================================================*/

function updateCategoryChart(){

    const categoryCount = {};

    tasks.forEach(task=>{

        categoryCount[task.category] =

        (categoryCount[task.category] || 0) + 1;

    });

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart = new Chart(

        document.getElementById("categoryChart"),

        {

            type:"bar",

            data:{

                labels:Object.keys(categoryCount),
             datasets:[{
    label:"Tasks",
    data:Object.values(categoryCount),
    backgroundColor:[
        "#7c3aed",
        "#22c55e",
        "#f59e0b",
        "#3b82f6",
        "#ec4899",
        "#14b8a6"
    ],
    borderRadius:10
}]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/*==================================================
        INITIALIZE FILTERS & CHARTS
==================================================*/

applyFilters();

updateCharts();

/*==================================================
            POMODORO TIMER
==================================================*/

let timer;
let totalSeconds = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startTimer");
const pauseBtn = document.getElementById("pauseTimer");
const resetBtn = document.getElementById("resetTimer");
function updateTimerDisplay() {

    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");

    const seconds = (totalSeconds % 60)
        .toString()
        .padStart(2, "0");

    timerDisplay.textContent = `${minutes}:${seconds}`;

}

function startPomodoro() {

    if (isRunning) return;

    isRunning = true;
    startBtn.disabled=true;

pauseBtn.disabled=false;

    timer = setInterval(() => {

        
        if(totalSeconds > 0){
    totalSeconds--;
}
        updateTimerDisplay();

        if (totalSeconds <= 0) {

            clearInterval(timer);

            isRunning = false;

            showToast(
                "Pomodoro Completed 🍅",
                "fa-clock"
            );

            showPopup(
                "Time's Up!",
                "Great job! Take a 5-minute break."
            );

            const alarm = document.getElementById("alarmSound");

            if (alarm) {

                alarm.play();

            }

        }

    }, 1000);

}

function pausePomodoro() {

    clearInterval(timer);

    isRunning = false;
    startBtn.disabled=false;

    showToast(
        "Pomodoro Paused",
        "fa-pause"
    );

}

function resetPomodoro() {

    clearInterval(timer);

    isRunning = false;
    startBtn.disabled=false;
    totalSeconds = 25 * 60;

    updateTimerDisplay();

    showToast(
        "Pomodoro Reset",
        "fa-rotate-left"
    );

}

if (startBtn) {

    startBtn.addEventListener("click", startPomodoro);

}

if (pauseBtn) {

    pauseBtn.addEventListener("click", pausePomodoro);

}

if (resetBtn) {

    resetBtn.addEventListener("click", resetPomodoro);

}

/*==================================================
        AUTO UPDATE REMAINING TIME
==================================================*/

setInterval(() => {

    renderTasks();

    updateDashboard();

}, 60000);

/*==================================================
            INITIALIZE APP
==================================================*/
window.addEventListener("DOMContentLoaded", () => {

    // Hide all popups/toasts on page load
    toast.classList.remove("show");

    popup.classList.remove("show");

    congratsPopup.classList.remove("show");

    updateClock();

    updateDate();

    updateGreeting();

    showQuote();

    updateTimerDisplay();

    renderTasks();

    updateDashboard();

    updateCharts();

    applyFilters();

});

/*==================================================
            AUTO SAVE
==================================================*/

window.addEventListener("beforeunload", () => {

    saveTasks();

});