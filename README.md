# 🎡 Ruleta en Tiempo Real

Una aplicación web interactiva de ruleta con sincronización en tiempo real usando Socket.io. Múltiples usuarios pueden conectarse y ver la ruleta girar simultáneamente.

## ✨ Características

- 🎯 **Sincronización en tiempo real**: Todos los usuarios ven la ruleta girar al mismo tiempo
- 👥 **Multi-usuario**: Varios amigos pueden conectarse simultáneamente
- ⭐ **Sistema de Admin**: El primer usuario conectado puede controlar la ruleta
- 📋 **Historial**: Guarda los últimos 10 resultados
- 🎨 **Interfaz moderna**: Diseño responsivo y atractivo
- 🔄 **Animación suave**: Giro realista con Canvas HTML5

## 🚀 Instalación Local

### Requisitos previos

- Node.js (v14 o superior)
- npm o yarn

### Pasos

1. **Clona o descarga el proyecto**

2. **Instala las dependencias**
```bash
npm install
```

3. **Inicia el servidor**
```bash
npm start
```

4. **Abre tu navegador**
```
http://localhost:3000
```

## 👥 Compartir con Amigos

### Opción 1: Red Local (LAN)

1. Encuentra tu IP local:
   - **Windows**: Abre CMD y escribe `ipconfig`, busca "IPv4 Address"
   - **Mac/Linux**: Abre Terminal y escribe `ifconfig` o `ip addr`

2. Comparte la URL con tus amigos:
   ```
   http://TU_IP_LOCAL:3000
   ```
   Ejemplo: `http://192.168.1.100:3000`

3. Asegúrate de que estén en la misma red WiFi

### Opción 2: Internet (Deploy en Render)

#### Desplegar en Render (GRATIS)

1. **Crea una cuenta en [Render](https://render.com)**

2. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin TU_REPO_URL
   git push -u origin main
   ```

3. **En Render Dashboard:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: roulette-chat (o el que prefieras)
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Espera a que se despliegue** (2-3 minutos)

5. **Comparte la URL con tus amigos**
   ```
   https://tu-app.onrender.com
   ```

**⚠️ Nota**: El plan gratuito de Render puede tardar ~30 segundos en despertar si no se usa por un tiempo.

## 🎮 Cómo Usar

### Para el Admin (Primer usuario conectado)

1. Verás una insignia "⭐ ADMIN" en la parte superior
2. En el **Panel de Control**:
   - Agrega nombres escribiendo en el campo y presionando "Agregar"
   - Elimina nombres haciendo click en "Eliminar"
3. Presiona **"GIRAR RULETA"** para comenzar
4. Todos los usuarios conectados verán la animación simultáneamente

### Para otros usuarios

1. Conecta usando la URL compartida
2. Verás la ruleta y el historial en tiempo real
3. Observa cómo el admin gira la ruleta
4. Verás los resultados aparecer instantáneamente

## 📱 Dispositivos Compatibles

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Android)
- ✅ Tablets

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Tiempo Real**: Socket.io
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Gráficos**: Canvas API

## 📂 Estructura del Proyecto

```
RouletteChat/
├── server.js           # Servidor backend con Socket.io
├── package.json        # Dependencias
├── .gitignore         # Archivos ignorados por Git
├── README.md          # Este archivo
└── public/            # Archivos estáticos
    ├── index.html     # Interfaz principal
    ├── style.css      # Estilos
    └── app.js         # Lógica del cliente
```

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`

### Los amigos no pueden conectarse (red local)
- Verifica que todos estén en la misma red WiFi
- Desactiva temporalmente el firewall
- Comprueba que el puerto 3000 no esté bloqueado

### La ruleta no gira
- Solo el admin puede girar la ruleta
- Necesitas al menos una opción en la ruleta
- Espera a que termine el giro anterior

## 📝 Licencia

MIT - Libre para usar y modificar

## 🎉 ¡Diviértete!

¿Tienes ideas para mejorar? ¡Siéntete libre de modificar el código!

