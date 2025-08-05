        const classData = {
            // Primer período (5 semanas)
            'quimica': { total: 10, color: '#3f51b5', colorDark: '#303f9f' }, // Sáb-Dom = 2 días x 5 semanas
            'aritmetica': { total: 10, color: '#2196f3', colorDark: '#1976d2' }, // Sáb-Dom = 2 días x 5 semanas
            'espanol': { total: 25, color: '#f44336', colorDark: '#d32f2f' }, // Lun-Vie = 5 días x 5 semanas
            'fisica': { total: 25, color: '#3f51b5', colorDark: '#303f9f' }, // Lun-Vie = 5 días x 5 semanas
            'trigonometria': { total: 25, color: '#4caf50', colorDark: '#388e3c' }, // Lun-Vie = 5 días x 5 semanas
            
            // Segundo período (5 semanas)
            'espanol2': { total: 10, color: '#f44336', colorDark: '#d32f2f' }, // Solo sábados = 1 día x 5 semanas
            'fisica2': { total: 10, color: '#3f51b5', colorDark: '#303f9f' }, // Solo sábados = 1 día x 5 semanas
            'trigonometria2': { total: 10, color: '#4caf50', colorDark: '#388e3c' }, // Solo sábados = 1 día x 5 semanas
            'biologia': { total: 10, color: '#4caf50', colorDark: '#388e3c' }, // Solo sábados = 1 día x 5 semanas
            'historia': { total: 25, color: '#ff9800', colorDark: '#f57c00' }, // Lun-Vie = 5 días x 5 semanas
            'quimica2': { total: 25, color: '#3f51b5', colorDark: '#303f9f' }, // Lun-Vie = 5 días x 5 semanas
            'probabilidad': { total: 25, color: '#2196f3', colorDark: '#1976d2' }, // Lun-Vie = 5 días x 5 semanas
            'calculo': { total: 25, color: '#9c27b0', colorDark: '#7b1fa2' } // Lun-Vie = 5 días x 5 semanas
        };

        // Cargar progreso guardado
        function loadProgress() {
            const saved = localStorage.getItem('classProgress');
            return saved ? JSON.parse(saved) : {};
        }

        // Guardar progreso
        function saveProgress(progress) {
            localStorage.setItem('classProgress', JSON.stringify(progress));
        }

        // Actualizar todas las barras de progreso
        function updateAllProgressBars() {
            const progress = loadProgress();
            
            Object.keys(classData).forEach(classKey => {
                const completed = progress[classKey] ? progress[classKey].length : 0;
                const total = classData[classKey].total;
                const percentage = (completed / total) * 100;
                
                const progressBar = document.getElementById(`progress-${classKey}`);
                const progressText = document.getElementById(`progress-text-${classKey}`);
                const progressPercentage = document.getElementById(`progress-percentage-${classKey}`);
                
                if (progressBar) {
                    progressBar.style.width = percentage + '%';
                }
                if (progressText) {
                    progressText.textContent = `${completed} de ${total} clases`;
                }
                if (progressPercentage) {
                    progressPercentage.textContent = Math.round(percentage) + '%';
                }
            });
        }

        // Abrir modal
        function openModal(title, classKey) {
            const modal = document.getElementById('classModal');
            const modalTitle = document.getElementById('modalTitle');
            const classList = document.getElementById('classList');
            
            modalTitle.textContent = title;
            
            // Establecer colores del modal
            const header = document.querySelector('.modal-header');
            const root = document.documentElement;
            root.style.setProperty('--modal-color', classData[classKey].color);
            root.style.setProperty('--modal-color-dark', classData[classKey].colorDark);
            
            // Generar lista de clases
            classList.innerHTML = '';
            const progress = loadProgress();
            const classProgress = progress[classKey] || [];
            
            for (let i = 1; i <= classData[classKey].total; i++) {
                const listItem = document.createElement('li');
                listItem.className = 'class-list-item';
                
                const isCompleted = classProgress.includes(i);
                if (isCompleted) {
                    listItem.classList.add('completed');
                }
                
                listItem.innerHTML = `
                    <span class="class-title">Clase ${i}</span>
                    <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''} 
                           onchange="toggleClass('${classKey}', ${i}, this)">
                `;
                
                classList.appendChild(listItem);
            }
            
            updateProgress(classKey);
            modal.style.display = 'block';
        }

        // Cerrar modal
        function closeModal() {
            document.getElementById('classModal').style.display = 'none';
        }

        // Alternar clase completada
        function toggleClass(classKey, classNumber, checkbox) {
            const progress = loadProgress();
            if (!progress[classKey]) {
                progress[classKey] = [];
            }
            
            if (checkbox.checked) {
                if (!progress[classKey].includes(classNumber)) {
                    progress[classKey].push(classNumber);
                }
                checkbox.parentElement.classList.add('completed');
            } else {
                progress[classKey] = progress[classKey].filter(n => n !== classNumber);
                checkbox.parentElement.classList.remove('completed');
            }
            
            saveProgress(progress);
            updateProgress(classKey);
            updateAllProgressBars(); // Actualizar todas las barras de progreso
        }

        // Actualizar barra de progreso del modal
        function updateProgress(classKey) {
            const progress = loadProgress();
            const completed = progress[classKey] ? progress[classKey].length : 0;
            const total = classData[classKey].total;
            const percentage = (completed / total) * 100;
            
            document.getElementById('progressFill').style.width = percentage + '%';
            document.getElementById('progressText').textContent = `${completed} de ${total} clases completadas (${Math.round(percentage)}%)`;
        }

        // Cerrar modal al hacer clic fuera
        window.onclick = function(event) {
            const modal = document.getElementById('classModal');
            if (event.target == modal) {
                closeModal();
            }
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        // Inicializar las barras de progreso al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            updateAllProgressBars();
        });
// Inicializar las barras de progreso al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateAllProgressBars();
    loadTodos();
    updateTodoStats();
});

// TO-DO LIST FUNCTIONALITY

let todos = [];
let currentFilter = 'all';
let todoIdCounter = 1;

// Cargar todos desde localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        // Actualizar contador para nuevos todos
        todoIdCounter = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    }
    renderTodos();
}

// Guardar todos en localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Agregar nuevo todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('todoPriority');
    const text = input.value.trim();

    if (text === '') {
        input.focus();
        return;
    }

    const newTodo = {
        id: todoIdCounter++,
        text: text,
        completed: false,
        priority: priority.value,
        createdAt: new Date().toISOString()
    };

    todos.unshift(newTodo); // Agregar al inicio
    input.value = '';
    priority.value = 'medium';
    
    saveTodos();
    renderTodos();
    updateTodoStats();
}

// Alternar estado completado
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateTodoStats();
    }
}

// Eliminar todo
function deleteTodo(id) {
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
    if (todoElement) {
        todoElement.classList.add('hiding');
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
            updateTodoStats();
        }, 300);
    }
}

// Filtrar todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Actualizar botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Renderizar todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredTodos = todos;
    
    // Aplicar filtros
    switch (currentFilter) {
        case 'pending':
            filteredTodos = todos.filter(t => !t.completed);
            break;
        case 'completed':
            filteredTodos = todos.filter(t => t.completed);
            break;
        case 'high':
            filteredTodos = todos.filter(t => t.priority === 'high' && !t.completed);
            break;
    }

    if (filteredTodos.length === 0) {
        todoList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    todoList.style.display = 'block';
    emptyState.style.display = 'none';

    todoList.innerHTML = filteredTodos.map(todo => {
        const date = new Date(todo.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });

        const priorityText = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };

        return `
            <li class="todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <div class="todo-content">
                    <div class="todo-text">${escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        <span class="priority-badge priority-${todo.priority}">
                            ${priorityText[todo.priority]}
                        </span>
                        <span class="todo-date">${date}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="todo-action-btn delete-btn" onclick="deleteTodo(${todo.id})" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </li>
        `;
    }).join('');
}

// Actualizar estadísticas
function updateTodoStats() {
    const pending = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    document.getElementById('todoStats').textContent = `${pending} pendientes, ${completed} completadas`;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Permitir agregar con Enter
document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }
});