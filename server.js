const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Estado del juego
let gameState = {
  options: ['Ana', 'Carlos', 'María', 'Juan', 'Laura', 'Pedro', 'Sofía', 'Diego'],
  history: [],
  adminId: null,
  connectedUsers: 0,
  isSpinning: false
};

io.on('connection', (socket) => {
  gameState.connectedUsers++;
  console.log(`Usuario conectado: ${socket.id}. Total: ${gameState.connectedUsers}`);

  // Asignar admin al primer usuario conectado
  if (!gameState.adminId) {
    gameState.adminId = socket.id;
    socket.emit('admin-assigned', true);
    console.log(`Admin asignado: ${socket.id}`);
  } else {
    socket.emit('admin-assigned', false);
  }

  // Enviar estado inicial al usuario
  socket.emit('initial-state', {
    options: gameState.options,
    history: gameState.history,
    connectedUsers: gameState.connectedUsers,
    isAdmin: socket.id === gameState.adminId
  });

  // Broadcast cantidad de usuarios conectados
  io.emit('users-update', gameState.connectedUsers);

  // Actualizar opciones de la ruleta (solo admin)
  socket.on('update-options', (newOptions) => {
    if (socket.id === gameState.adminId) {
      gameState.options = newOptions;
      io.emit('options-updated', gameState.options);
      console.log('Opciones actualizadas:', newOptions);
    }
  });

  // Girar la ruleta (solo admin)
  socket.on('spin-roulette', () => {
    if (socket.id === gameState.adminId && !gameState.isSpinning && gameState.options.length > 0) {
      gameState.isSpinning = true;
      
      // Calcular resultado aleatorio
      const winnerIndex = Math.floor(Math.random() * gameState.options.length);
      const winner = gameState.options[winnerIndex];
      
      // Calcular rotación (múltiples vueltas + posición final)
      const spins = 5 + Math.random() * 3; // 5-8 vueltas completas
      const degreesPerOption = 360 / gameState.options.length;
      const finalRotation = (spins * 360) + (winnerIndex * degreesPerOption);
      
      // Enviar evento de giro a todos los clientes
      io.emit('roulette-spinning', {
        rotation: finalRotation,
        duration: 5000 // 5 segundos de animación
      });

      // Después de la animación, enviar el resultado
      setTimeout(() => {
        const result = {
          winner: winner,
          timestamp: new Date().toLocaleTimeString('es-ES'),
          date: new Date().toISOString()
        };
        
        gameState.history.unshift(result);
        if (gameState.history.length > 10) {
          gameState.history = gameState.history.slice(0, 10);
        }
        
        io.emit('roulette-result', result);
        gameState.isSpinning = false;
        console.log('Resultado:', result);
      }, 5000);
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    gameState.connectedUsers--;
    console.log(`Usuario desconectado: ${socket.id}. Total: ${gameState.connectedUsers}`);
    
    // Si el admin se desconecta, asignar nuevo admin
    if (socket.id === gameState.adminId) {
      gameState.adminId = null;
      // El próximo usuario que se conecte será admin
      console.log('Admin desconectado');
    }
    
    io.emit('users-update', gameState.connectedUsers);
  });
});

server.listen(PORT, () => {
  console.log(`🎡 Servidor de Ruleta ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Comparte esta URL con tus amigos para que se conecten`);
});

