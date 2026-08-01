/*=========================================
        DOM ELEMENTS
=========================================*/

const taskForm=document.getElementById("taskForm");

const taskTitle=document.getElementById("taskTitle");

const taskDescription=document.getElementById("taskDescription");

const taskCategory=document.getElementById("taskCategory");

const taskPriority=document.getElementById("taskPriority");

const taskDate=document.getElementById("taskDate");

const taskTime=document.getElementById("taskTime");

const taskList=document.getElementById("taskList");

const searchTask=document.getElementById("searchTask");

const filterCategory=document.getElementById("filterCategory");

const totalTasks=document.getElementById("totalTasks");

const completedTasks=document.getElementById("completedTasks");

const pendingTasks=document.getElementById("pendingTasks");

const taskCount=document.getElementById("taskCount");

const remainingCount=document.getElementById("remainingCount");

const nextDeadline=document.getElementById("nextDeadline");

const progressPercent=document.getElementById("progressPercent");

const progressRing=document.getElementById("progressRing");

const greeting=document.getElementById("greeting");

const quote=document.getElementById("quote");

const clock=document.getElementById("clock");

const todayDate=document.getElementById("todayDate");

const todayDay=document.getElementById("todayDay");

const themeToggle=document.getElementById("themeToggle");

const toast=document.getElementById("toast");

const toastMessage=document.getElementById("toastMessage");

const toastIcon=document.getElementById("toastIcon");

const popup=document.getElementById("popup");

const popupTitle=document.getElementById("popupTitle");

const popupText=document.getElementById("popupText");

const popupBtn=document.getElementById("popupBtn");

const congratsPopup=document.getElementById("congratsPopup");

const closeCongrats=document.getElementById("closeCongrats");

const alarmSound=document.getElementById("alarmSound");

const timerDisplay=document.getElementById("timer");

const startBtn=document.getElementById("startTimer");

const pauseBtn=document.getElementById("pauseTimer");

const resetBtn=document.getElementById("resetTimer");

/*=========================================
        VARIABLES
=========================================*/

let tasks=

JSON.parse(

localStorage.getItem("tasks")

)||[];

let taskChart=null;

let categoryChart=null;

let timer=null;

let totalSeconds=25*60;

let isRunning=false;

/*=========================================
        MOTIVATIONAL QUOTES
=========================================*/

const quotes=[

"Success starts with consistency.",

"Dream big. Start small.",

"Stay focused and never give up.",

"Discipline beats motivation.",

"Small progress is still progress.",

"Done is better than perfect.",

"Every task completed is a step forward.",

"Push yourself every single day."

];

/*=========================================
        DARK MODE
=========================================*/

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

}

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

showToast("Dark Mode Enabled 🌙");

}

else{

localStorage.setItem("theme","light");

themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

showToast("Light Mode Enabled ☀️");

}

});

/*=========================================
        CLOCK
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

const hour=now.getHours();

if(hour<12){

greeting.textContent="Good Morning ☀️";

}

else if(hour<17){

greeting.textContent="Good Afternoon 🌤️";

}

else if(hour<20){

greeting.textContent="Good Evening 🌆";

}

else{

greeting.textContent="Good Night 🌙";

}

}

setInterval(updateClock,1000);

updateClock();

/*=========================================
        RANDOM QUOTE
=========================================*/

function randomQuote(){

quote.textContent=

quotes[

Math.floor(

Math.random()*quotes.length

)

];

}

randomQuote();

setInterval(randomQuote,10000);

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
        POPUP
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

function showCongrats(){

congratsPopup.classList.add("show");

}

closeCongrats.onclick=()=>{

congratsPopup.classList.remove("show");

};

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

taskForm.addEventListener(

"submit",

addTask

);

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

showPopup(

"Success",

"Task Added Successfully 🎉"

);

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

showToast("Task Completed ✅");

if(

tasks.length>0 &&

tasks.every(task=>task.completed)

){

showCongrats();

}

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

showToast("Favorite Updated ❤️");

}

/*=========================================
        DELETE
=========================================*/

function deleteTask(id){

if(!confirm("Delete this task?")) return;

tasks=

tasks.filter(

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

/*=========================================
        EDIT
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

showToast("Edit Task ✏️");

window.scrollTo({

top:0,

behavior:"smooth"

});

}
/*=========================================
        RENDER TASKS
=========================================*/

function renderTasks(){

let filtered=tasks.filter(task=>{

const matchesSearch=

task.title.toLowerCase()

.includes(

searchTask.value.toLowerCase()

);

const matchesCategory=

filterCategory.value==="All"||

task.category===filterCategory.value;

return matchesSearch&&matchesCategory;

});

taskList.innerHTML="";

taskCount.textContent=

`${filtered.length} Tasks`;

if(filtered.length===0){

taskList.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-clipboard-list"></i>

<h2>No Tasks Yet</h2>

<p>Add your first task 🚀</p>

</div>

`;

return;

}

filtered.forEach(task=>{

taskList.innerHTML+=`

<div class="task-card ${task.completed?"completed":""}">

<div class="task-top">

<div>

<h3>

${task.favorite?

'<i class="fa-solid fa-heart" style="color:#ec4899;"></i> '

:''}

${task.title}

</h3>

<p>

${task.description||"No Description"}

</p>

</div>

<span class="priority ${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

<div class="task-info">

<span>📂 ${task.category}</span>

<span>📅 ${task.date}</span>

<span>⏰ ${task.time}</span>

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
        SEARCH
=========================================*/

searchTask.addEventListener(

"input",

renderTasks

);

/*=========================================
        FILTER
=========================================*/

filterCategory.addEventListener(

"change",

renderTasks

);
/*=========================================
        DASHBOARD
=========================================*/

function updateDashboard(){

const total=tasks.length;

const completed=

tasks.filter(task=>task.completed).length;

const pending=

total-completed;

totalTasks.textContent=total;

completedTasks.textContent=completed;

pendingTasks.textContent=pending;

remainingCount.textContent=

`${pending} Tasks Left`;

updateProgress(total,completed);

updateNextDeadline();

}

/*=========================================
        PROGRESS RING
=========================================*/

function updateProgress(total,completed){

let percent=0;

if(total>0){

percent=Math.round(

(completed/total)*100

);

}

progressPercent.textContent=

`${percent}%`;

const radius=85;

const circumference=

2*Math.PI*radius;

progressRing.style.strokeDasharray=

circumference;

const offset=

circumference-

(percent/100)*circumference;

progressRing.style.strokeDashoffset=

offset;

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

"🎉 No Pending Tasks";

return;

}

const task=pendingTasksList[0];

nextDeadline.innerHTML=

`<strong>${task.title}</strong><br>

📅 ${task.date}

&nbsp;&nbsp;

⏰ ${task.time}`;

}

/*=========================================
        CHARTS
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

data:[completed,pending],

backgroundColor:[

"#22c55e",

"#7c3aed"

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

categories[task.category]=

(categories[task.category]||0)+1;

});

categoryChart=new Chart(

document.getElementById("categoryChart"),

{

type:"bar",

data:{

labels:Object.keys(categories),

datasets:[{

data:Object.values(categories),

backgroundColor:[

"#7c3aed",

"#ec4899",

"#22c55e",

"#3b82f6",

"#f59e0b",

"#06b6d4"

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
/*=========================================
        POMODORO TIMER
=========================================*/

function updateTimerDisplay(){

const minutes=

String(

Math.floor(totalSeconds/60)

).padStart(2,"0");

const seconds=

String(

totalSeconds%60

).padStart(2,"0");

timerDisplay.textContent=

`${minutes}:${seconds}`;

}

function startPomodoro(){

if(isRunning) return;

isRunning=true;

showToast("Pomodoro Started 🍅","fa-play");

timer=setInterval(()=>{

totalSeconds--;

updateTimerDisplay();

if(totalSeconds<=0){

clearInterval(timer);

isRunning=false;

alarmSound.play();

showPopup(

"Pomodoro Complete 🎉",

"Great Job! Time for a short break."

);

showToast(

"Session Completed 🎉",

"fa-clock"

);

totalSeconds=25*60;

updateTimerDisplay();

}

},1000);

}

function pausePomodoro(){

if(!isRunning) return;

clearInterval(timer);

isRunning=false;

showToast(

"Pomodoro Paused ⏸️",

"fa-pause"

);

}

function resetPomodoro(){

clearInterval(timer);

isRunning=false;

totalSeconds=25*60;

updateTimerDisplay();

showToast(

"Pomodoro Reset 🔄",

"fa-rotate-right"

);

}

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

updateTimerDisplay();

/*=========================================
        INITIAL LOAD
=========================================*/

renderTasks();

updateDashboard();

updateCharts();

/*=========================================
        AUTO SAVE
=========================================*/

window.addEventListener(

"beforeunload",

()=>{

saveTasks();

}

/*=========================================
        KEYBOARD SHORTCUT
=========================================*/

);

document.addEventListener(

"keydown",

(e)=>{

if(

e.ctrlKey &&

e.key==="Enter"

){

e.preventDefault();

taskForm.requestSubmit();

}

});

/*=========================================
        ENTER ANIMATION
=========================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

document.body.style.opacity="0";

setTimeout(()=>{

document.body.style.transition="opacity .6s";

document.body.style.opacity="1";

},100);

});

/*=========================================
        SCROLL TO TOP
=========================================*/

function scrollTopSmooth(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/*=========================================
        CLOSE POPUPS BY CLICKING OUTSIDE
=========================================*/

popup.addEventListener(

"click",

(e)=>{

if(e.target===popup){

popup.classList.remove("show");

}

});

congratsPopup.addEventListener(

"click",

(e)=>{

if(e.target===congratsPopup){

congratsPopup.classList.remove("show");

}

});

/*=========================================
        SAFETY CHECKS
=========================================*/

if(progressRing){

updateProgress(

tasks.length,

tasks.filter(task=>task.completed).length

);

}

if(taskChart){

updateCharts();

}

/*=========================================
        WINDOW LOAD
=========================================*/

window.onload=()=>{

renderTasks();

updateDashboard();

updateCharts();

updateTimerDisplay();

};

/*=========================================
        END
=========================================*/

console.log(

"✅ To-Do List Loaded Successfully"

);