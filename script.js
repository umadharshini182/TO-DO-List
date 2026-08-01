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

const searchTask = document.getElementById("searchTask");

const filterCategory = document.getElementById("filterCategory");

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const taskCount = document.getElementById("taskCount");

const remainingCount = document.getElementById("remainingCount");

const nextDeadline = document.getElementById("nextDeadline");

const progressPercent = document.getElementById("progressPercent");

const progressRing = document.getElementById("progressRing");

const greeting = document.getElementById("greeting");

const quote = document.getElementById("quote");

const clock = document.getElementById("clock");

const todayDate = document.getElementById("todayDate");

const todayDay = document.getElementById("todayDay");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

const toastIcon = document.getElementById("toastIcon");

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupText = document.getElementById("popupText");

const popupBtn = document.getElementById("popupBtn");

const congratsPopup = document.getElementById("congratsPopup");

const closeCongrats = document.getElementById("closeCongrats");

const alarmSound = document.getElementById("alarmSound");

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startTimer");

const pauseBtn = document.getElementById("pauseTimer");

const resetBtn = document.getElementById("resetTimer");

/*=========================================
        VARIABLES
=========================================*/

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskChart = null;

let categoryChart = null;

let timer = null;

let totalSeconds = 25 * 60;

let isRunning = false;

/*=========================================
        MOTIVATIONAL QUOTES
=========================================*/

const quotes = [

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

showToast("🌙 Dark Mode Enabled");

}

else{

localStorage.setItem("theme","light");

themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

showToast("☀️ Light Mode Enabled");

}

});

/*=========================================
        LIVE CLOCK
=========================================*/

function updateClock(){

const now=new Date();

clock.textContent=now.toLocaleTimeString("en-IN",{

hour12:true

});

todayDate.textContent=now.toLocaleDateString("en-IN",{

day:"numeric",

month:"long",

year:"numeric"

});

todayDay.textContent=now.toLocaleDateString("en-IN",{

weekday:"long"

});

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
        RANDOM QUOTES
=========================================*/

function randomQuote(){

quote.textContent=

quotes[Math.floor(Math.random()*quotes.length)];

}

randomQuote();

setInterval(randomQuote,15000);

/*=========================================
        TOAST MESSAGE
=========================================*/

function showToast(message,icon="fa-circle-check"){

toastMessage.textContent=message;

toastIcon.className=`fa-solid ${icon}`;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*=========================================
        POPUP
=========================================*/

function showPopup(title,message){

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

updateRemainingTime();

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
        COMPLETE TASK
=========================================*/

function toggleComplete(id){

const task=tasks.find(t=>t.id===id);

if(!task) return;

if(!task.completed){

if(!confirm("Mark this task as completed?")){

return;

}

}

task.completed=!task.completed;

saveTasks();

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

if(task.completed){

showToast(

"Task Completed Successfully ✅"

);

showPopup(

"Success",

"Task Completed Successfully 🎉"

);

}

else{

showToast(

"Task Marked as Pending"

);

}

if(

tasks.length>0 &&

tasks.every(t=>t.completed)

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

updateRemainingTime();

showToast(

"Added To Favorites ❤️"

);

}

/*=========================================
        DELETE
=========================================*/

function deleteTask(id){

if(!confirm("Delete this task?")) return;

tasks=tasks.filter(

task=>task.id!==id

);

saveTasks();

renderTasks();

updateRemainingTime();

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

const task=tasks.find(

t=>t.id===id

);

if(!task) return;

taskTitle.value=task.title;

taskDescription.value=task.description;

taskCategory.value=task.category;

taskPriority.value=task.priority;

taskDate.value=task.date;

taskTime.value=task.time;

tasks=tasks.filter(

t=>t.id!==id

);

saveTasks();

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

showToast(

"Task Ready For Editing ✏️"

);

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

task.title.toLowerCase().includes(

searchTask.value.toLowerCase()

);

const matchesCategory=

filterCategory.value==="All"||

task.category===filterCategory.value;

return matchesSearch&&matchesCategory;

});

taskList.innerHTML="";

taskCount.textContent=`${filtered.length} Tasks`;

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

<span

class="remaining-time"

id="remaining-${task.id}">

⏳ Calculating...

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

updateRemainingTime();

}

/*=========================================
        REMAINING TIME
=========================================*/

function updateRemainingTime(){

tasks.forEach(task=>{

const element=document.getElementById(

`remaining-${task.id}`

);

if(!element) return;

const deadline=new Date(

`${task.date}T${task.time}:00`

);

if(isNaN(deadline.getTime())){

element.innerHTML="⚠️ Invalid Date";

return;

}

const now=new Date();

const diff=deadline-now;

if(task.completed){

element.innerHTML="✅ Completed";

element.style.color="#22c55e";

return;

}

if(diff<=0){

element.innerHTML="🚨 Overdue";

element.style.color="#ef4444";

return;

}

const days=Math.floor(diff/86400000);

const hours=Math.floor(

(diff%86400000)/3600000

);

const minutes=Math.floor(

(diff%3600000)/60000

);

element.innerHTML=

`⏳ ${days}d ${hours}h ${minutes}m Left`;

element.style.color="#fbbf24";

});

/*=========================================
        SEARCH
=========================================*/

searchTask.addEventListener(

"input",

()=>{

renderTasks();

updateRemainingTime();

}

);

/*=========================================
        FILTER
=========================================*/

filterCategory.addEventListener(

"change",

()=>{

renderTasks();

updateRemainingTime();

}

);

}
/*=========================================
        DASHBOARD
=========================================*/

function updateDashboard(){

const total=tasks.length;

const completed=

tasks.filter(task=>task.completed).length;

const pending=total-completed;

totalTasks.textContent=total;

completedTasks.textContent=completed;

pendingTasks.textContent=pending;

remainingCount.textContent=`${pending} Tasks Left`;

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

const radius=90;

const circumference=2*Math.PI*radius;

progressRing.style.strokeDasharray=circumference;

progressRing.style.strokeDashoffset=

circumference-(percent/100)*circumference;

}

/*=========================================
        NEXT DEADLINE
=========================================*/

function updateNextDeadline(){

const pendingTasksList=tasks

.filter(task=>!task.completed)

.sort((a,b)=>

new Date(`${a.date}T${a.time}`)-

new Date(`${b.date}T${b.time}`)

);

if(pendingTasksList.length===0){

nextDeadline.innerHTML=

"🎉 No Pending Tasks";

return;

}

const task=pendingTasksList[0];

const deadline=new Date(`${task.date}T${task.time}`);

const now=new Date();

const diff=deadline-now;

let remain="";

if(diff>0){

const d=Math.floor(diff/86400000);

const h=Math.floor((diff%86400000)/3600000);

const m=Math.floor((diff%3600000)/60000);

remain=`⏳ ${d}d ${h}h ${m}m Left`;

}

else{

remain="🚨 Overdue";

}

nextDeadline.innerHTML=

`<strong>${task.title}</strong><br>

📅 ${task.date}

&nbsp;&nbsp;

⏰ ${task.time}

<br>

${remain}`;

}

/*=========================================
        TASK CHART
=========================================*/

function updateCharts(){

const completed=

tasks.filter(task=>task.completed).length;

const pending=tasks.length-completed;

if(taskChart){

taskChart.destroy();

}

taskChart=new Chart(

document.getElementById("taskChart"),

{

type:"doughnut",

data:{

labels:["Completed","Pending"],

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

"#ec4899",

"#22c55e",

"#3b82f6",

"#f59e0b",

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
        INITIAL LOAD
=========================================*/

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

/*=========================================
        LIVE REMAINING TIME
=========================================*/

setInterval(()=>{

updateRemainingTime();

updateNextDeadline();

},60000);
/*=========================================
        POMODORO TIMER
=========================================*/

function updateTimerDisplay(){

const minutes=String(

Math.floor(totalSeconds/60)

).padStart(2,"0");

const seconds=String(

totalSeconds%60

).padStart(2,"0");

timerDisplay.textContent=`${minutes}:${seconds}`;

}

function startPomodoro(){

if(isRunning) return;

isRunning=true;

showToast(

"Pomodoro Started 🍅",

"fa-play"

);

timer=setInterval(()=>{

totalSeconds--;

updateTimerDisplay();

if(totalSeconds<=0){

clearInterval(timer);

isRunning=false;

alarmSound.play();

showPopup(

"Pomodoro Complete 🎉",

"Time for a short break!"

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
        AUTO SAVE
=========================================*/

window.addEventListener(

"beforeunload",

()=>{

saveTasks();

}

);

/*=========================================
        KEYBOARD SHORTCUT
=========================================*/

document.addEventListener(

"keydown",

e=>{

if(e.ctrlKey&&e.key==="Enter"){

e.preventDefault();

taskForm.requestSubmit();

}

}

/*=========================================
        WINDOW LOAD
=========================================*/

);

window.onload=()=>{

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

updateTimerDisplay();

};

/*=========================================
        END
=========================================*/

console.log(

"✅ Premium To-Do List Loaded Successfully"

);
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
        PAGE LOAD
=========================================*/

window.addEventListener("load",()=>{

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

updateTimerDisplay();

});

/*=========================================
        LIVE UPDATES
=========================================*/

setInterval(()=>{

updateClock();

updateRemainingTime();

updateNextDeadline();

},1000);

/*=========================================
        AUTO SAVE
=========================================*/

window.addEventListener("beforeunload",()=>{

saveTasks();

});

/*=========================================
        KEYBOARD SHORTCUTS
=========================================*/

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey&&e.key==="Enter"){

e.preventDefault();

taskForm.requestSubmit();

}

if(e.key==="Escape"){

popup.classList.remove("show");

congratsPopup.classList.remove("show");

}

});

/*=========================================
        FINAL INITIALIZATION
=========================================*/

updateClock();

randomQuote();

updateTimerDisplay();

renderTasks();

updateRemainingTime();

updateDashboard();

updateCharts();

console.log("✅ Premium To-Do List Loaded Successfully");