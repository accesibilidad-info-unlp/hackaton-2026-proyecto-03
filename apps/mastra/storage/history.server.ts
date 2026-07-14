import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "audit-history.json");

// Obtener historial
app.get("/history", async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({
      error: "No se pudo leer el historial."
    });
  }
});

app.post("/history", async (req, res) => {
  try {
    const nuevaAuditoria = req.body;

    const data = await fs.readFile(FILE_PATH, "utf8");
    const historial = JSON.parse(data);

    historial.push(nuevaAuditoria);

    await fs.writeFile(
      FILE_PATH,
      JSON.stringify(historial, null, 2),
      "utf8"
    );

    res.status(201).json({
      mensaje: "Auditoría guardada correctamente."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo guardar la auditoría."
    });
  }
});


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor History ejecutándose en http://localhost:${PORT}`);
});