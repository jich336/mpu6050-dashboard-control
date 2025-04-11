const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 1000;

// Habilitar CORS y JSON
app.use(cors());
app.use(express.json());

// Variables en memoria
let registros = [];      // Array donde guardamos todos los datos enviados
let filtroActual = 1;     // Filtro por defecto: 1 (Crudo)

// Ruta para recibir datos del ESP32
app.post('/api/guardar_datos', (req, res) => {
  const { accX, accY, accZ, roll, pitch, yaw } = req.body;
  const timestamp = new Date();
  const nuevoRegistro = {
    accX: accX !== undefined ? accX : null,
    accY: accY !== undefined ? accY : null,
    accZ: accZ !== undefined ? accZ : null,
    roll: roll !== undefined ? roll : null,
    pitch: pitch !== undefined ? pitch : null,
    yaw: yaw !== undefined ? yaw : null,
    timestamp
  };
  registros.push(nuevoRegistro);

  console.log('Dato recibido:', nuevoRegistro);
  res.status(200).send('Datos guardados exitosamente');
});

// Ruta para obtener los datos (para el dashboard)
app.get('/api/datos', (req, res) => {
  res.json(registros);
});

// Ruta para consultar el filtro actual (el ESP32 pregunta aquí)
app.get('/api/filtro', (req, res) => {
  res.json({ modo: filtroActual });
});

// Ruta para cambiar el filtro (cuando haces clic en la web)
app.post('/api/filtro', (req, res) => {
  const { modo } = req.body;
  if ([1, 2, 3].includes(modo)) {
    filtroActual = modo;
    console.log('Filtro actualizado a modo:', filtroActual);
    res.send('Filtro actualizado exitosamente');
  } else {
    res.status(400).send('Modo no válido');
  }
});

// Servir la carpeta pública con el dashboard y control web
app.use('/', express.static('public'));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

