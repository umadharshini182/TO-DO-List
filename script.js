/*=========================================
        PREMIUM PRODUCTIVITY DASHBOARD
                VERSION 3.0
=========================================*/

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

const searchTask = document.getElementById("searchTask");

const filterCategory = document.getElementById("filterCategory");

const sortTasks = document.getElementById("sortTasks");

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const remainingCount = document.getElementById("remainingCount");

const nextDeadline = document.getElementById("nextDeadline");

const progressRing = document.getElementById("progressRing");

const progressPercent = document.getElementById("progressPercent");

/*=========================================
        HEADER
=========================================*/

const greeting = document.getElementById("greeting");

const quote = document.getElementById("quote");

const clock = document.getElementById("clock");

const todayDate = document.getElementById("todayDate");

const todayDay = document.getElementById("todayDay");

const themeToggle = document.getElementById("themeToggle");

/*=========================================
        POPUPS
=========================================*/

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

const toastIcon = document.getElementById("toastIcon");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupText = document.getElementById("popupText");

const popupBtn = document.getElementById("popupBtn");

const congratsPopup = document.getElementById("congratsPopup");

const closeCongrats = document.getElementById("closeCongrats");

/*=========================================
        POMODORO
=========================================*/

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startTimer");

const pauseBtn = document.getElementById("pauseTimer");

const resetBtn = document.getElementById("resetTimer");

const alarmSound = document.getElementById("alarmSound");

/*=========================================
        GLOBAL VARIABLES
=========================================*/

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskChart = null;

let ca
tegoryChart = null;

let timer = null;

let totalSeconds = 25 * 60;

let isRunning = false;

const circleLength = 515;

/*=========================================
        MOTIVATIONAL QUOTES
=========================================*/

const quotes = [

"Success starts with self discipline. 💜",

"Stay focused. Stay consistent.",

"Small progress is still progress.",

"Discipline beats motivation.",

"Make today productive.",

"Dream big. Work hard.",

"Believe in yourself.",

"Every task completed is a victory."

];
/*=========================================
        DARK MODE
=========================================*/

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const icon=themeToggle.querySelector("i");

    const text=themeToggle.querySelector("span");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        icon.className="fa-solid fa-sun";

        text.textContent="Light Mode";

    }

    else{

        localStorage.setItem("theme","light");

        icon.className="fa-solid fa-moon";

        text.textContent="Dark Mode";

    }

});

/*=========================================
        LIVE CLOCK
=========================================*/

function updateClock(){

    const now=new Date();

    clock.textContent=

    now.toLocaleTimeString(

    "en-IN",

    {

    hour12:false

    }

    );

}

/*=========================================
        DATE & DAY
=========================================*/

function updateDate(){

    const now=new Date();

    todayDate.textContent=

    now.toLocaleDateString(

    "en-IN",

    {

    day:"numeric",

    month:"long",

    year:"numeric"

    }

    );

    todayDay.textContent=

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

    const hour=

    new Date().getHours();

    if(hour<12){

        greeting.textContent=

        "Good Morning ☀️";

    }

    else if(hour<17){

        greeting.textContent=

        "Good Afternoon 🌤️";

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
        RANDOM QUOTE
=========================================*/

function showRandomQuote(){

    const random=

    Math.floor(

    Math.random()*quotes.length

    );

    quote.textContent=

    quotes[random];

}

/*=========================================
        TOAST
=========================================*/

function showToast(

message,

icon="fa-circle-check"

){

    toastMessage.textContent=

    message;

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

popupBtn.addEventListener("click",()=>{

    popup.classList.remove("show");

});

/*=========================================
        CONGRATULATIONS
=========================================*/

function showCongrats(){

    congratsPopup.classList.add("show");

}

closeCongrats.addEventListener("click",()=>{

    congratsPopup.classList.remove("show");

});

/*=========================================
        INITIAL HEADER
=========================================*/

updateClock();

updateDate();

updateGreeting();

showRandomQuote();

setInterval(updateClock,1000);

setInterval(updateGreeting,60000);

setInterval(updateDate,60000);
/*=========================================
        SAVE TASKS
=========================================*/

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}

/*=========================================
        ADD TASK
=========================================*/

taskForm.addEventListener("submit",addTask);

function addTask(e){

    e.preventDefault();

    const task={

        id:Date.now(),

        title:taskTitle.value.trim(),

        description:taskDescription.value.trim(),

        category:taskCategory.value,

        priority:taskPriority.value,

        date:taskDate.value,

        time:taskTime.value,

        completed:false,

        favorite:false

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    showToast("Task Added Successfully 🎉");

    showPopup("Success","Task Added Successfully 🎉");

    taskForm.reset();

}

/*=========================================
        COMPLETE TASK
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
        FAVORITE TASK
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

}

/*=========================================
        DELETE TASK
=========================================*/

function deleteTask(id){

    if(

        !confirm(

            "Delete this task?"

        )

    ){

        return;

    }

    tasks=

    tasks.filter(task=>task.id!==id);

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    showToast(

        "Task Deleted",

        "fa-trash"

    );

}

/*=========================================
        EDIT TASK
=========================================*/

function editTask(id){

    const task=

    tasks.find(

        t=>t.id===id

    );

    if(!task) return;

    taskTitle.value=task.title;

    taskDescription.value=task.description;

    taskCategory.value=task.category;

    taskPriority.value=task.priority;

    taskDate.value=task.date;

    taskTime.value=task.time;

    tasks=

    tasks.filter(

        t=>t.id!==id

    );

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
/*=========================================
        RENDER TASKS
=========================================*/

function renderTasks(list = tasks){

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

    const now=new Date();

    list.forEach(task=>{

        const deadline=

        new Date(task.date+"T"+task.time);

        const overdue=

        !task.completed && deadline<now;

        taskList.innerHTML+=`

<div class="task-card ${task.completed?"completed":""} ${overdue?"overdue":""}">

<div class="task-title">

<h3>

${task.favorite?

'<i class="fa-solid fa-heart favorite-icon"></i>':

''}

${task.title}

</h3>

<span class="priority-${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

<p class="task-description">

${task.description||"No description"}

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

<span>

${getRemainingTime(task)}

</span>

</div>

<div class="task-actions">

<button

class="favorite-btn"

onclick="toggleFavorite(${task.id})">

<i class="fa-solid fa-heart"></i>

</button>

<button

class="edit-btn"

onclick="editTask(${task.id})">

<i class="fa-solid fa-pen"></i>

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

/*=========================================
        REMAINING TIME
=========================================*/

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

    const days=Math.floor(diff/86400000);

    const hours=Math.floor((diff%86400000)/3600000);

    const mins=Math.floor((diff%3600000)/60000);

    if(days>0){

        return `⏳ ${days}d ${hours}h`;

    }

    if(hours>0){

        return `⏳ ${hours}h ${mins}m`;

    }

    return `⏳ ${mins}m`;

}

/*=========================================
        SEARCH FILTER
=========================================*/

searchTask.addEventListener(

"input",

applyFilters

);

filterCategory.addEventListener(

"change",

applyFilters

);

sortTasks.addEventListener(

"change",

applyFilters

);

function applyFilters(){

    let filtered=[...tasks];

    const keyword=

    searchTask.value.toLowerCase();

    if(keyword){

        filtered=filtered.filter(task=>

        task.title.toLowerCase().includes(keyword)||

        task.description.toLowerCase().includes(keyword)

        );

    }

    if(filterCategory.value!=="All"){

        filtered=filtered.filter(task=>

        task.category===filterCategory.value

        );

    }

    switch(sortTasks.value){

        case "latest":

            filtered.sort((a,b)=>b.id-a.id);

            break;

        case "oldest":

            filtered.sort((a,b)=>a.id-b.id);

            break;

        case "priority":

            filtered.sort((a,b)=>

            a.priority.localeCompare(b.priority));

            break;

        case "deadline":

            filtered.sort((a,b)=>

            new Date(a.date+"T"+a.time)-

            new Date(b.date+"T"+b.time));

            break;

        case "completed":

            filtered=filtered.filter(task=>task.completed);

            break;

        case "pending":

            filtered=filtered.filter(task=>!task.completed);

            break;

    }

    renderTasks(filtered);

}
/*=========================================
        DASHBOARD
=========================================*/

function updateDashboard(){

    const total = tasks.length;

    const completed = tasks.filter(task=>task.completed).length;

    const pending = total-completed;

    totalTasks.textContent=total;

    completedTasks.textContent=completed;

    pendingTasks.textContent=pending;

    taskCount.textContent=`${total} Task${total!==1?"s":""}`;

    remainingCount.textContent=`${pending} Task${pending!==1?"s":""} Left`;

    updateProgress(total,completed);

    updateNextDeadline();

}

/*=========================================
        PROGRESS RING
=========================================*/

function updateProgress(total,completed){

    let percent=0;

    if(total>0){

        percent=Math.round((completed/total)*100);

    }

    progressPercent.textContent=`${percent}%`;

    const radius=82;

    const circumference=2*Math.PI*radius;

    progressRing.style.strokeDasharray=circumference;

    const offset=circumference-(percent/100)*circumference;

    progressRing.style.strokeDashoffset=offset;

}

/*=========================================
        NEXT DEADLINE
=========================================*/

function updateNextDeadline(){

    const pendingTasksList=

    tasks

    .filter(task=>!task.completed)

    .sort(

        (a,b)=>

        new Date(a.date+"T"+a.time)-

        new Date(b.date+"T"+b.time)

    );

    if(pendingTasksList.length===0){

        nextDeadline.innerHTML=

        "🎉 Congratulations! No pending tasks.";

        return;

    }

    const task=pendingTasksList[0];

    nextDeadline.innerHTML=`

<strong>${task.title}</strong>

<br>

📅 ${task.date}

&nbsp;&nbsp;

⏰ ${task.time}

`;

}

/*=========================================
        TASK CHART
=========================================*/

function updateCharts(){

    const completed=

    tasks.filter(task=>task.completed).length;

    const pending=

    tasks.length-completed;

    if(taskChart){

        taskChart.destroy();

    }

    taskChart=new Chart(

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

                    borderWidth:0

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

/*=========================================
        CATEGORY CHART
=========================================*/

function updateCategoryChart(){

    if(categoryChart){

        categoryChart.destroy();

    }

    const categories={};

    tasks.forEach(task=>{

        categories[task.category]=(categories[task.category]||0)+1;

    });

    categoryChart=new Chart(

        document.getElementById("categoryChart"),

        {

            type:"bar",

            data:{

                labels:Object.keys(categories),

                datasets:[{

                    label:"Tasks",

                    data:Object.values(categories),

                    backgroundColor:[

                        "#7c3aed",

                        "#22c55e",

                        "#f59e0b",

                        "#3b82f6",

                        "#ec4899",

                        "#06b6d4"

                    ],

                    borderRadius:12

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
/*=========================================
        POMODORO TIMER
=========================================*/

function updateTimer(){

    const minutes=Math.floor(totalSeconds/60);

    const seconds=totalSeconds%60;

    timerDisplay.textContent=

    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

/*=========================================
        START TIMER
=========================================*/

function startPomodoro(){

    if(isRunning) return;

    isRunning=true;

    startBtn.disabled=true;

    pauseBtn.disabled=false;

    resetBtn.disabled=false;

    timer=setInterval(()=>{

        if(totalSeconds>0){

            totalSeconds--;

            updateTimer();

            localStorage.setItem(

                "pomodoroTime",

                totalSeconds

            );

        }

        else{

            clearInterval(timer);

            isRunning=false;

            startBtn.disabled=false;

            alarmSound.play();

            showToast(

            "Pomodoro Completed 🍅"

            );

            showPopup(

            "Great Job!",

            "25 Minutes Completed 🎉"

            );

            localStorage.removeItem(

            "pomodoroTime"

            );

        }

    },1000);

}

/*=========================================
        PAUSE TIMER
=========================================*/

function pausePomodoro(){

    clearInterval(timer);

    isRunning=false;

    startBtn.disabled=false;

}

/*=========================================
        RESET TIMER
=========================================*/

function resetPomodoro(){

    clearInterval(timer);

    isRunning=false;

    totalSeconds=25*60;

    updateTimer();

    startBtn.disabled=false;

    localStorage.removeItem(

    "pomodoroTime"

    );

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
        RESTORE TIMER
=========================================*/

const savedTime=

localStorage.getItem(

"pomodoroTime"

);

if(savedTime){

    totalSeconds=

    parseInt(savedTime);

}

updateTimer();
/*=========================================
        INITIALIZE APPLICATION
=========================================*/

function initializeApp(){

    renderTasks();

    updateDashboard();

    updateCharts();

    updateTimer();

    updateClock();

    updateDate();

    updateGreeting();

    showRandomQuote();

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
        SAVE BEFORE EXIT
=========================================*/

window.addEventListener(

"beforeunload",

()=>{

    saveTasks();

});

/*=========================================
        CLEAR SEARCH
=========================================*/

searchTask.value="";

/*=========================================
        DEFAULT FILTER
=========================================*/

filterCategory.value="All";

sortTasks.value="latest";

/*=========================================
        PROGRESS RING
=========================================*/

progressRing.style.transition=

"stroke-dashoffset 1s ease";

/*=========================================
        AUTO SAVE
=========================================*/

setInterval(()=>{

    saveTasks();

},10000);

/*=========================================
        CLOSE POPUPS
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
        ESC KEY CLOSE
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        popup.classList.remove("show");

        congratsPopup.classList.remove("show");

    }

});

/*=========================================
        AUTO FOCUS
=========================================*/

window.addEventListener("load",()=>{

    taskTitle.focus();

});

/*=========================================
        FIRST RUN
=========================================*/

initializeApp();

console.log(

"%cPremium Productivity Dashboard Loaded 🚀",

"color:#7c3aed;font-size:18px;font-weight:bold;"

);
/*=========================================
        FINAL POLISH
=========================================*/

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
        ANIMATE PROGRESS RING
=========================================*/

progressRing.style.strokeLinecap="round";

progressRing.style.transition=

"stroke-dashoffset 1s ease-in-out";

/*=========================================
        BUTTON RIPPLE EFFECT
=========================================*/

document.querySelectorAll("button").forEach(btn=>{

    btn.addEventListener("click",()=>{

        btn.style.transform="scale(.95)";

        setTimeout(()=>{

            btn.style.transform="scale(1)";

        },120);

    });

});

/*=========================================
        REFRESH DASHBOARD
=========================================*/

function refreshApp(){

    saveTasks();

    renderTasks();

    updateDashboard();

    updateCharts();

}

/*=========================================
        AUTO REFRESH
=========================================*/

setInterval(refreshApp,30000);

/*=========================================
        CHANGE QUOTE
=========================================*/

setInterval(showRandomQuote,300000);

/*=========================================
        DOUBLE CLICK TITLE
=========================================*/

document.querySelector(".app-title")

.addEventListener("dblclick",()=>{

showToast(

"Stay Productive 🚀"

);

});

/*=========================================
        KEYBOARD SHORTCUT
=========================================*/

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="n"){

e.preventDefault();

taskTitle.focus();

}

});

/*=========================================
        FINAL MESSAGE
=========================================*/

console.log(

"%cPremium Productivity Dashboard v3.0 Ready 🚀",

"color:#7c3aed;font-size:20px;font-weight:bold"

);