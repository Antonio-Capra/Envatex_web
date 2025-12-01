const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos del build
app.use(express.static(path.join(__dirname, 'build')));

// Manejar cualquier ruta que no sea un archivo estático
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
