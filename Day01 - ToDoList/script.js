document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filters = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const tasksLeft = document.getElementById('tasksLeft');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        let filteredTasks = tasks;
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found. Add a new task!</p>';
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;

                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <button class="task-delete"><i class="fas fa-trash"></i></button>
                `;

                taskList.appendChild(taskItem);
            });
        }

        updateTasksLeft();
    }

    // Add new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text,
                completed: false
            };

            tasks.unshift(newTask);
            saveTasks();
            renderTasks(getCurrentFilter());
            taskInput.value = '';
        }
    }

    // Toggle task completion
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task =>
            task.id === parseInt(taskId) ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Delete task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== parseInt(taskId));
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Update tasks left counter
    function updateTasksLeft() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksLeft.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Get current active filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    taskList.addEventListener('click', function (e) {
        if (e.target.classList.contains('task-checkbox')) {
            const taskItem = e.target.closest('.task-item');
            toggleTaskCompletion(taskItem.dataset.id);
        } else if (e.target.closest('.task-delete')) {
            const taskItem = e.target.closest('.task-item');
            deleteTask(taskItem.dataset.id);
        }
    });

    filters.forEach(btn => {
        btn.addEventListener('click', function () {
            filters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Initial render
    renderTasks();
});