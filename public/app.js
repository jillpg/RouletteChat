// Conectar al servidor Socket.io
const socket = io();

// Variables globales
let isAdmin = false;
let currentOptions = [];
let isSpinning = false;
let currentRotation = 0;

// Elementos del DOM
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('resultDisplay');
const userCountElement = document.getElementById('user-count');
const adminBadge = document.getElementById('admin-badge');
const controlPanel = document.getElementById('controlPanel');
const optionsList = document.getElementById('optionsList');
const newOptionInput = document.getElementById('newOptionInput');
const addOptionBtn = document.getElementById('addOptionBtn');
const historyList = document.getElementById('historyList');

// Colores para la ruleta
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
];

// Eventos Socket.io
socket.on('admin-assigned', (admin) => {
    isAdmin = admin;
    if (isAdmin) {
        adminBadge.classList.remove('hidden');
        controlPanel.classList.remove('hidden');
        spinButton.classList.remove('hidden');
        resultDisplay.innerHTML = '<p class="result-text">👉 Presiona "Girar" para comenzar</p>';
    } else {
        resultDisplay.innerHTML = `
            <div class="spectator-message">
                <p>👥 Modo Espectador</p>
                <p>Observa cómo el admin ⭐ controla la ruleta</p>
            </div>
        `;
    }
});

socket.on('initial-state', (state) => {
    currentOptions = state.options;
    updateUserCount(state.connectedUsers);
    updateOptionsList();
    updateHistoryList(state.history);
    drawRoulette();
    
    if (state.isAdmin) {
        spinButton.disabled = false;
        resultDisplay.innerHTML = '<p class="result-text">👉 Presiona "Girar" para comenzar</p>';
    } else {
        resultDisplay.innerHTML = `
            <div class="spectator-message">
                <p>👥 Modo Espectador</p>
                <p>Observa cómo el admin ⭐ controla la ruleta</p>
            </div>
        `;
    }
});

socket.on('users-update', (count) => {
    updateUserCount(count);
});

socket.on('options-updated', (options) => {
    currentOptions = options;
    updateOptionsList();
    drawRoulette();
});

socket.on('roulette-spinning', (data) => {
    isSpinning = true;
    if (isAdmin) {
        spinButton.disabled = true;
    }
    
    resultDisplay.innerHTML = '<p class="result-text">🎡 Girando...</p>';
    spinRoulette(data.rotation, data.duration);
});

socket.on('roulette-result', (result) => {
    isSpinning = false;
    if (isAdmin) {
        spinButton.disabled = false;
    }
    
    // Mostrar resultado con animación
    setTimeout(() => {
        resultDisplay.innerHTML = `
            <div class="result-winner">
                🎉 ${result.winner} 🎉
            </div>
        `;
    }, 500);
    
    // Actualizar historial
    addHistoryItem(result);
});

// Funciones de dibujo
function drawRoulette() {
    if (currentOptions.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Agrega opciones', 200, 200);
        return;
    }
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 190;
    const sliceAngle = (2 * Math.PI) / currentOptions.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar cada segmento
    currentOptions.forEach((option, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        
        // Dibujar segmento
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Dibujar borde
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Dibujar texto
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(option, radius * 0.65, 5);
        ctx.restore();
    });
    
    // Círculo central
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function spinRoulette(finalRotation, duration) {
    const startRotation = currentRotation;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing cubic
        const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        currentRotation = startRotation + (finalRotation - startRotation) * easeProgress;
        
        // Rotar canvas
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(200, 200);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.translate(-200, -200);
        drawRouletteWithoutClear();
        ctx.restore();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function drawRouletteWithoutClear() {
    const centerX = 200;
    const centerY = 200;
    const radius = 190;
    const sliceAngle = (2 * Math.PI) / currentOptions.length;
    
    currentOptions.forEach((option, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(option, radius * 0.65, 5);
        ctx.restore();
    });
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Funciones de UI
function updateUserCount(count) {
    userCountElement.textContent = `👥 Conectados: ${count}`;
}

function updateOptionsList() {
    if (!isAdmin) return;
    
    optionsList.innerHTML = '';
    currentOptions.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option-item';
        li.innerHTML = `
            <span class="option-name">${option}</span>
            <button class="remove-btn" data-index="${index}">Eliminar</button>
        `;
        optionsList.appendChild(li);
    });
    
    // Event listeners para botones de eliminar
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeOption(index);
        });
    });
}

function addHistoryItem(result) {
    // Remover mensaje de historial vacío
    const emptyMessage = historyList.querySelector('.empty-history');
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-winner">🎯 ${result.winner}</div>
        <div class="history-time">⏰ ${result.timestamp}</div>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limitar a 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function updateHistoryList(history) {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">Aún no hay resultados</p>';
        return;
    }
    
    history.forEach(result => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-winner">🎯 ${result.winner}</div>
            <div class="history-time">⏰ ${result.timestamp}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

function addOption() {
    const newOption = newOptionInput.value.trim();
    if (newOption && !currentOptions.includes(newOption)) {
        currentOptions.push(newOption);
        socket.emit('update-options', currentOptions);
        newOptionInput.value = '';
    }
}

function removeOption(index) {
    currentOptions.splice(index, 1);
    socket.emit('update-options', currentOptions);
}

// Event Listeners
spinButton.addEventListener('click', () => {
    if (!isSpinning && isAdmin && currentOptions.length > 0) {
        socket.emit('spin-roulette');
    }
});

addOptionBtn.addEventListener('click', addOption);

newOptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addOption();
    }
});

// Dibujar ruleta inicial
drawRoulette();

