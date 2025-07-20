        const classData = {
            // Primer período (5 semanas)
            'quimica': { total: 10, color: '#3f51b5', colorDark: '#303f9f' }, // Sáb-Dom = 2 días x 5 semanas
            'aritmetica': { total: 10, color: '#2196f3', colorDark: '#1976d2' }, // Sáb-Dom = 2 días x 5 semanas
            'espanol': { total: 25, color: '#f44336', colorDark: '#d32f2f' }, // Lun-Vie = 5 días x 5 semanas
            'fisica': { total: 25, color: '#3f51b5', colorDark: '#303f9f' }, // Lun-Vie = 5 días x 5 semanas
            'trigonometria': { total: 25, color: '#4caf50', colorDark: '#388e3c' }, // Lun-Vie = 5 días x 5 semanas
            
            // Segundo período (5 semanas)
            'espanol2': { total: 5, color: '#f44336', colorDark: '#d32f2f' }, // Solo sábados = 1 día x 5 semanas
            'fisica2': { total: 5, color: '#3f51b5', colorDark: '#303f9f' }, // Solo sábados = 1 día x 5 semanas
            'trigonometria2': { total: 5, color: '#4caf50', colorDark: '#388e3c' }, // Solo sábados = 1 día x 5 semanas
            'biologia': { total: 5, color: '#4caf50', colorDark: '#388e3c' }, // Solo sábados = 1 día x 5 semanas
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
        }

        // Actualizar barra de progreso
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
