import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Railway inyecta el puerto a través de process.env.PORT.
// Si configuraste el 3000 manualmente, usará ese.
const PORT = process.env.PORT || 3000;

// Servir los archivos estáticos generados por Vite en la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir cualquier otra ruta al index.html (necesario para React Router/SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Es CRÍTICO escuchar en '0.0.0.0' en entornos de contenedores como Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de producción corriendo en http://0.0.0.0:${PORT}`);
});
