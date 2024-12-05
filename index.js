// Importa Express
const express = require("express");
const app = express();

// Define un puerto
const PORT = 3000;

// Ruta básica
app.get("/", (req, res) => {
  res.send("¡Hola, Express!");
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
