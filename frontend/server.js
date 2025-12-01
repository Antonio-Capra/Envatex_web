const express = require('express');
const path = require('path');
const app = express();

const buildPath = path.join(__dirname, 'build');

// Servir archivos estáticos del build
app.use(express.static(buildPath));

// Manejar cualquier ruta que no sea un archivo estático
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${buildPath}`);
});
