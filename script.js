document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const emptyState = document.getElementById("emptyState");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const liveClock = document.getElementById("liveClock");
    const toastContainer = document.getElementById("toastContainer");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    // Initialize application
    function init() {
        startLiveClock();
        renderTasks();
        // Update countdown text every second live
        setInterval(updateCountdownsLive, 1000);
    }

    // Live Clock Ticker
    function startLiveClock() {
        function updateClock() {
            const now = new Date();
            liveClock.textContent = now.toLocaleTimeString();
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Save tasks to LocalStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Show professional custom Toast Notification popup
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        const iconClass = type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-trophy";
        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Add a new task
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) {
            showToast("Please enter a valid task description.", "success");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            priority: priorityInput.value,
            dueDate: dueDateInput.value || null,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        showToast("Task successfully added!");

        // Reset inputs
        taskInput.value = "";
        dueDateInput.value = "";
        priorityInput.value = "Medium";
        taskInput.focus();
    }

    // Toggle task completion and trigger celebratory alerts if everything is completed
    function toggleTask(id) {
        let targetTask = tasks.find(t => t.id === id);
        const willBeCompleted = !targetTask.completed;

        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: willBeCompleted } : task
        );
        saveTasks();
        renderTasks();

        if (willBeCompleted) {
            showToast("Task completed! Great job.");

            // Check if ALL tasks are now completed
            if (tasks.length > 0 && tasks.every(t => t.completed)) {
                setTimeout(() => {
                    showToast("🎉 Incredible! You've completed everything on your list!", "complete-all");
                }, 400);
            }
        }
    }

    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        showToast("Task removed.");
    }

    // Calculate dynamic time remaining string for due dates
    function getTimeRemaining(dueDateTimeStr) {
        if (!dueDateTimeStr) return "";
        const now = new Date().getTime();
        const dueTime = new Date(dueDateTimeStr).getTime();
        const diff = dueTime - now;

        if (diff <= 0) {
            return { text: "Time expired!", isExpired: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
            return { text: `${days}d ${hours}h left`, isExpired: false };
        } else {
            return { text: `${hours}h ${minutes}m ${seconds}s left`, isExpired: false };
        }
    }

    // Filter tasks based on status
    function getFilteredTasks() {
        if (currentFilter === "active") {
            return tasks.filter(task => !task.completed);
        } else if (currentFilter === "completed") {
            return tasks.filter(task => task.completed);
        }
        return tasks;
    }

    // Live update countdown fields without completely re-rendering DOM layout
    function updateCountdownsLive() {
        const countdownElements = document.querySelectorAll(".due-countdown");
        countdownElements.forEach(el => {
            const dueVal = el.getAttribute("data-due");
            if (dueVal) {
                const res = getTimeRemaining(dueVal);
                el.innerHTML = `<i class="fa-regular fa-clock"></i> ${res.text}`;
                if (res.isExpired) {
                    el.classList.add("expired");
                } else {
                    el.classList.remove("expired");
                }
            }
        });
    }

    // Render tasks to the DOM
    function renderTasks() {
        taskList.innerHTML = "";
        const filteredTasks = getFilteredTasks();

        if (filteredTasks.length === 0) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;

            let countdownHTML = "";
            if (task.dueDate) {
                const res = getTimeRemaining(task.dueDate);
                countdownHTML = `<span class="due-countdown ${res.isExpired ? 'expired' : ''}" data-due="${task.dueDate}">
                    <i class="fa-regular fa-clock"></i> ${res.text}
                </span>`;
            }

            li.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <div class="task-meta">
                    <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                    ${countdownHTML}
                    <button class="delete-btn" aria-label="Delete Task"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;

            // Event bindings
            const checkbox = li.querySelector(".task-checkbox");
            checkbox.addEventListener("change", () => toggleTask(task.id));

            const deleteBtn = li.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            taskList.appendChild(li);
        });

        updateStats();
    }

    // Update remaining task counter
    function updateStats() {
        const activeCount = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeCount} task${activeCount === 1 ? "" : "s"} remaining`;
    }

    // XSS Prevention helper
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Event Listeners
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentFilter = e.target.getAttribute("data-filter");
            renderTasks();
        });
    });

    init();
});