import type { HistoryItem } from "./types";

const API_URL = "http://localhost:3001";

export async function saveHistory(item: HistoryItem) {
  const response = await fetch(`${API_URL}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    console.error("Status:", response.status);

    const texto = await response.text();
    console.error(texto);

    throw new Error("No se pudo guardar la auditoría.");
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_URL}/history`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el historial.");
  }

  return response.json();
}