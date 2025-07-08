require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`).then(() => {
  console.log("Tabla usuarios lista");
}).catch(err => {
  console.error("Error creando tabla:", err);
});

// Rutas

app.get("/", (req, res) => {
  res.send("¡Hola, mundo desde Railway con PostgreSQL!");
});

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
});

app.post("/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const resultado = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *",
      [nombre, email]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear usuario");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
