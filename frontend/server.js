const express = require('express');
const path = require('path');
const app = express();

const buildPath = path.join(__dirname, 'build');

// Log de cada petición para debug
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Servir archivos estáticos del build
app.use(express.static(buildPath, { index: false }));

// Manejar TODAS las rutas - debe ir después de static
app.get('*', (req, res) => {
  console.log(`🔄 Serving index.html for: ${req.path}`);
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      console.error('❌ Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${buildPath}`);
});
