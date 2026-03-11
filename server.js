import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log("=== INICIANDO SERVIDOR ===");
console.log("Variables de entorno PORT:", process.env.PORT);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Railway inyecta el puerto a través de process.env.PORT.
const PORT = process.env.PORT || 3000;

// Verificar si la carpeta dist existe
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log(`Carpeta 'dist' encontrada en: ${distPath}`);
} else {
  console.error(`ERROR CRÍTICO: No se encontró la carpeta 'dist' en: ${distPath}`);
  console.error("Asegúrate de que el comando 'npm run build' se ejecutó correctamente.");
}

// Endpoint de salud para Railway
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Servir los archivos estáticos generados por Vite en la carpeta 'dist'
app.use(express.static(distPath));

// Redirigir cualquier otra ruta al index.html (necesario para React Router/SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html no encontrado. ¿Falló el build?');
  }
});

// Es CRÍTICO escuchar en '0.0.0.0' en entornos de contenedores como Railway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de producción corriendo exitosamente en http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error("Error fatal al intentar arrancar el servidor:", err);
});

