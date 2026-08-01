/*==================================================
        PREMIUM TO-DO LIST v2.0
        PART 1
==================================================*/

/*=========================================
            DOM ELEMENTS
=========================================*/

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

const themeToggle = document.getElementById("themeToggle");

/*=============================
        POMODORO
=============================*/

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startTimer");

const pauseBtn = document.getElementById("pauseTimer");

const resetBtn = document.getElementById("resetTimer");

/*=============================
            CHARTS
=============================*/

let taskChart = null;

let categoryChart = null;

/*=============================
        GLOBAL VARIABLES
=============================*/

let tasks = JSON.parse(

localStorage.getItem("tasks")

) || [];

const circleLength = 408;

let timer = null;

let totalSeconds = 25 * 60;

let isRunning = false;

/*=============================
        LOCAL STORAGE
=============================*/

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}

/*=============================
        LOAD STORAGE
=============================*/

function loadTasks(){

    const stored = localStorage.getItem("tasks");

    if(stored){

        tasks = JSON.parse(stored);

    }

}

/*=============================
        AUTO SAVE
=============================*/

window.addEventListener(

"beforeunload",

saveTasks

);
/*==================================================
        PART 2
        HEADER & UI
==================================================*/

/*=========================================
        MOTIVATIONAL QUOTES
=========================================*/

const quotes=[

"Success starts with self-discipline. 💜",

"Small progress is still progress.",

"Dream big. Work hard. Stay focused.",

"Believe in yourself.",

"Consistency beats motivation.",

"Progress is progress.",

"Stay focused and never give up.",

"Every task completed is a victory."

];

/*=========================================
        RANDOM QUOTE
=========================================*/

function showQuote(){

const random=

Math.floor(

Math.random()*quotes.length

);

document.getElementById("quote").textContent=

quotes[random];

}

/*=========================================
        LIVE CLOCK
=========================================*/

function updateClock(){

const now=new Date();

const h=

String(now.getHours())

.padStart(2,"0");

const m=

String(now.getMinutes())

.padStart(2,"0");

const s=

String(now.getSeconds())

.padStart(2,"0");

document.getElementById("clock").textContent=

`${h}:${m}:${s}`;

}

/*=========================================
        DATE
=========================================*/

function updateDate(){

const now=new Date();

document.getElementById("todayDate").textContent=

now.toLocaleDateString(

"en-IN",

{

day:"numeric",

month:"long",

year:"numeric"

}

);

document.getElementById("todayDay").textContent=

now.toLocaleDateString(

"en-IN",

{

weekday:"long"

}

);

}

/*=========================================
        GREETING
=========================================*/

function updateGreeting(){

const hour=new Date().getHours();

const greeting=

document.getElementById("greeting");

if(hour<12){

greeting.textContent=

"Good Morning 🌞";

}

else if(hour<17){

greeting.textContent=

"Good Afternoon ☀️";

}

else if(hour<20){

greeting.textContent=

"Good Evening 🌇";

}

else{

greeting.textContent=

"Good Night 🌙";

}

}

/*=========================================
        DARK MODE
=========================================*/

if(

localStorage.getItem("theme")==="dark"

){

document.body.classList.add("dark");

}

themeToggle.addEventListener(

"click",

()=>{

document.body.classList.toggle("dark");

if(

document.body.classList.contains("dark")

){

localStorage.setItem(

"theme",

"dark"

);

}

else{

localStorage.setItem(

"theme",

"light"

);

}

}

);

/*=========================================
        TOAST
=========================================*/

function showToast(

message,

icon="fa-circle-check"

){

toastMessage.textContent=message;

toastIcon.className=

`fa-solid ${icon}`;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*=========================================
        SUCCESS POPUP
=========================================*/

function showPopup(

title,

message

){

popupTitle.textContent=title;

popupText.textContent=message;

popup.classList.add("show");

}

popupBtn.onclick=()=>{

popup.classList.remove("show");

};

/*=========================================
        CONGRATS POPUP
=========================================*/

function showCongrats(){

congratsPopup.classList.add(

"show"

);

}

closeCongrats.onclick=()=>{

congratsPopup.classList.remove(

"show"

);

};

/*=========================================
        START HEADER
=========================================*/

updateClock();

updateDate();

updateGreeting();

showQuote();

setInterval(

updateClock,

1000

);

setInterval(

updateGreeting,

60000

);
/*==================================================
        PART 3
        TASK MANAGEMENT
==================================================*/

/*=========================================
        ADD TASK
=========================================*/

taskForm.addEventListener("submit",addTask);

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

        "Task Added Successfully 🎉"

    );

    showPopup(

        "Success",

        "Task Added Successfully 🎉"

    );

    taskForm.reset();

}

/*=========================================
        FAVORITE
=========================================*/

function toggleFavorite(id){

    tasks=tasks.map(task=>{

        if(task.id===id){

            task.favorite=!task.favorite;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

}

/*=========================================
        COMPLETE
=========================================*/

function toggleComplete(id){

    tasks=tasks.map(task=>{

        if(task.id===id){

            task.completed=!task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    if(

        tasks.length>0 &&

        tasks.every(task=>task.completed)

    ){

        showCongrats();

    }

}

/*=========================================
        DELETE
=========================================*/

function deleteTask(id){

    if(

        !confirm(

            "Delete this task?"

        )

    ){

        return;

    }

    tasks=tasks.filter(

        task=>task.id!==id

    );

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    showToast(

        "Task Deleted 🗑️",

        "fa-trash"

    );

}
/*==================================================
        PART 4
        RENDER TASKS
==================================================*/

function renderTasks(list = tasks){

    const now = new Date();

    list.sort((a,b)=>{

        if(a.completed===b.completed){

            return new Date(a.date+"T"+a.time)-
            new Date(b.date+"T"+b.time);

        }

        return a.completed-b.completed;

    });

    taskList.innerHTML="";

    if(list.length===0){

        taskList.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-clipboard-list"></i>

<h2>No Tasks Yet</h2>

<p>Add your first task 🚀</p>

</div>

`;

        taskCount.textContent="0 Tasks";

        return;

    }

    taskCount.textContent=

`${list.length} Task${list.length>1?"s":""}`;

    list.forEach(task=>{

        const overdue=

        !task.completed &&

        new Date(task.date+"T"+task.time)<now;

        taskList.innerHTML+=`

<div class="task-card

${task.completed?"completed":""}

${overdue?"overdue":""}">

<div class="task-title">

<h3>${task.title}</h3>

<span class="priority-${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

<p class="task-description">

${task.description||"No description"}

</p>

<div class="task-details">

<span>📂 ${task.category}</span>

<span>📅 ${task.date}</span>

<span>⏰ ${task.time}</span>

<span class="remaining-time">

${getRemainingTime(task)}

</span>

</div>

<div class="task-actions">

<button

class="favorite-btn"

onclick="toggleFavorite(${task.id})">

${task.favorite?

'<i class="fa-solid fa-heart"></i>':

'<i class="fa-regular fa-heart"></i>'}

</button>

<button

class="complete-btn"

onclick="toggleComplete(${task.id})">

<i class="fa-solid fa-check"></i>

</button>

<button

class="delete-btn"

onclick="deleteTask(${task.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

/*==================================================
        REMAINING TIME
==================================================*/

function getRemainingTime(task){

    if(task.completed){

        return "✅ Completed";

    }

    const now=new Date();

    const deadline=

    new Date(task.date+"T"+task.time);

    const diff=deadline-now;

    if(diff<=0){

        return "❌ Overdue";

    }

    const days=

    Math.floor(diff/86400000);

    const hours=

    Math.floor(

    (diff%86400000)/3600000

    );

    const minutes=

    Math.floor(

    (diff%3600000)/60000

    );

    if(days>0){

        return `⏳ ${days}d ${hours}h`;

    }

    if(hours>0){

        return `⏳ ${hours}h ${minutes}m`;

    }

    return `⏳ ${minutes}m`;

}

/*==================================================
        SEARCH + FILTER
==================================================*/

searchTask.addEventListener(

"input",

applyFilters

);

filterCategory.addEventListener(

"change",

applyFilters

);

function applyFilters(){

    let filtered=[...tasks];

    const search=

    searchTask.value

    .toLowerCase()

    .trim();

    if(search){

        filtered=

        filtered.filter(task=>

        task.title

        .toLowerCase()

        .includes(search)

        ||

        task.description

        .toLowerCase()

        .includes(search)

        );

    }

    if(

        filterCategory.value!=="All"

    ){

        filtered=

        filtered.filter(task=>

        task.category===

        filterCategory.value

        );

    }

    renderTasks(filtered);

}
/*==================================================
        PART 5
        DASHBOARD
==================================================*/

function updateDashboard(){

    const total=tasks.length;

    const completed=

    tasks.filter(

    task=>task.completed

    ).length;

    const pending=

    total-completed;

    totalTasks.textContent=total;

    completedTasks.textContent=completed;

    pendingTasks.textContent=pending;

    remainingCount.textContent=

`${pending} Task${pending!==1?"s":""} Left`;

    updateProgress(

    total,

    completed

    );

    updateNextDeadline();

}

/*==================================================
        PROGRESS RING
==================================================*/

function updateProgress(

total,

completed

){

    let percent=0;

    if(total>0){

        percent=

        Math.round(

        (completed/total)*100

        );

    }

    progressPercent.textContent=

`${percent}%`;

    const offset=

    circleLength-

    (circleLength*percent)/100;

    progressRing.style.transition=

    "stroke-dashoffset 1s ease";

    progressRing.style.strokeDashoffset=

    offset;

}

/*==================================================
        NEXT DEADLINE
==================================================*/

function updateNextDeadline(){

    const pending=

    tasks

    .filter(task=>!task.completed)

    .sort(

    (a,b)=>

    new Date(a.date+"T"+a.time)-

    new Date(b.date+"T"+b.time)

    );

    if(pending.length===0){

        nextDeadline.innerHTML=

        "🎉 All tasks completed!";

        return;

    }

    const next=pending[0];

    nextDeadline.innerHTML=

`🎯 <strong>${next.title}</strong>

<br>

📅 ${next.date}

⏰ ${next.time}`;

}

/*==================================================
        CHARTS
==================================================*/

function updateCharts(){

    const completed=

    tasks.filter(

    task=>task.completed

    ).length;

    const pending=

    tasks.length-completed;

    if(taskChart){

        taskChart.destroy();

    }

    taskChart=

    new Chart(

    document.getElementById("taskChart"),

    {

        type:"doughnut",

        data:{

            labels:[

            "Completed",

            "Pending"

            ],

            datasets:[{

                data:[

                completed,

                pending

                ],

                backgroundColor:[

                "#7c3aed",

                "#f59e0b"

                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    }

    );

    updateCategoryChart();

}

/*==================================================
        CATEGORY CHART
==================================================*/

function updateCategoryChart(){

    if(categoryChart){

        categoryChart.destroy();

    }

    const count={};

    tasks.forEach(task=>{

        count[task.category]=

        (count[task.category]||0)+1;

    });

    categoryChart=

    new Chart(

    document.getElementById("categoryChart"),

    {

        type:"bar",

        data:{

            labels:

            Object.keys(count),

            datasets:[{

                label:"Tasks",

                data:

                Object.values(count),

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

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    }

    );

}
/*==================================================
        PART 6
        POMODORO TIMER
==================================================*/

const alarmSound = document.getElementById("alarmSound");

/*=========================================
        UPDATE TIMER
=========================================*/

function updateTimerDisplay(){

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    timerDisplay.textContent =

    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

/*=========================================
        START TIMER
=========================================*/

function startPomodoro(){

    if(isRunning) return;

    isRunning = true;

    startBtn.disabled = true;

    pauseBtn.disabled = false;

    timer = setInterval(()=>{

        if(totalSeconds > 0){

            totalSeconds--;

            updateTimerDisplay();

        }

        else{

            clearInterval(timer);

            isRunning = false;

            startBtn.disabled = false;

            alarmSound.play();

            showToast(

                "Pomodoro Completed 🍅"

            );

            showPopup(

                "Congratulations 🎉",

                "Time is up! Take a short break."

            );

        }

    },1000);

}

/*=========================================
        PAUSE TIMER
=========================================*/

function pausePomodoro(){

    clearInterval(timer);

    isRunning = false;

    startBtn.disabled = false;

}

/*=========================================
        RESET TIMER
=========================================*/

function resetPomodoro(){

    clearInterval(timer);

    isRunning = false;

    totalSeconds = 25 * 60;

    updateTimerDisplay();

    startBtn.disabled = false;

}

/*=========================================
        BUTTON EVENTS
=========================================*/

startBtn.addEventListener(

    "click",

    startPomodoro

);

pauseBtn.addEventListener(

    "click",

    pausePomodoro

);

resetBtn.addEventListener(

    "click",

    resetPomodoro

);

/*=========================================
        INITIAL TIMER
=========================================*/

updateTimerDisplay();
/*==================================================
        PART 7
        APP INITIALIZATION
==================================================*/

/*=========================================
        LOAD APPLICATION
=========================================*/

function initializeApp(){

    loadTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    updateTimerDisplay();

    updateClock();

    updateDate();

    updateGreeting();

    showQuote();

}

/*=========================================
        AUTO REFRESH
=========================================*/

setInterval(()=>{

    renderTasks();

    updateDashboard();

},60000);

/*=========================================
        PAGE LOAD
=========================================*/

window.addEventListener(

"DOMContentLoaded",

()=>{

    initializeApp();

});

/*=========================================
        SAVE AUTOMATICALLY
=========================================*/

window.addEventListener(

"beforeunload",

()=>{

    saveTasks();

});

/*=========================================
        CLEAR SEARCH
=========================================*/

if(searchTask){

    searchTask.value="";

}

/*=========================================
        DEFAULT FILTER
=========================================*/

if(filterCategory){

    filterCategory.value="All";

}

/*=========================================
        FIRST RENDER
=========================================*/

renderTasks();

updateDashboard();

updateCharts();

/*=========================================
        PROGRESS RING DEFAULT
=========================================*/

progressRing.style.strokeDasharray=circleLength;

progressRing.style.strokeDashoffset=circleLength;
/*==================================================
        PART 8
        FINAL POLISH
==================================================*/

/*=========================================
        SAVE AFTER EVERY CHANGE
=========================================*/

function refreshApp(){

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

}

/*=========================================
        ENTER KEY
=========================================*/

taskTitle.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        taskForm.requestSubmit();

    }

});

/*=========================================
        AUTO FOCUS
=========================================*/

window.addEventListener("load",()=>{

    taskTitle.focus();

});

/*=========================================
        ESC CLOSE POPUP
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        popup.classList.remove("show");

        congratsPopup.classList.remove("show");

    }

});

/*=========================================
        CLICK OUTSIDE POPUP
=========================================*/

popup.addEventListener("click",(e)=>{

    if(e.target===popup){

        popup.classList.remove("show");

    }

});

congratsPopup.addEventListener("click",(e)=>{

    if(e.target===congratsPopup){

        congratsPopup.classList.remove("show");

    }

});

/*=========================================
        INITIAL LOAD
=========================================*/

initializeApp();

console.log(

"%cPremium To-Do List v2.0 Loaded Successfully 🚀",

"color:#7c3aed;font-size:18px;font-weight:bold;"

);