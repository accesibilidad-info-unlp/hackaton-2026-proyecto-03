# Auditor inteligente de accesibilidad con IA

## Descripción

El **Auditor Inteligente de Accesibilidad** es una herramienta avanzada que permite evaluar y diagnosticar de forma sistemática el nivel de accesibilidad de cualquier sitio web, garantizando el cumplimiento de las pautas **WCAG 2.2**. 

A diferencia de los analizadores estáticos tradicionales, este proyecto implementa un **agente de IA autónomo (crawler-auditor loop)** que automatiza la navegación por enlaces internos del sitio, ejecuta pruebas en tiempo real inyectando motores de auditoría especializados y clasifica las infracciones detectadas según el tipo de discapacidad a la que afectan (ceguera/lectores de pantalla, baja visión/daltonismo, motriz/teclado, cognitiva/comprensión y auditiva).

El sistema cuenta con un panel visual interactivo y moderno (Dashboard) que calcula un puntaje dinámico de accesibilidad y permite a los desarrolladores previsualizar y personalizar en tiempo real la apariencia visual del sitio mediante un playground de temas CSS.

## Integrantes

- Pereyra Nehuen
- Pereyra Lautaro
- Marzialetti Fernando
- Martinez Nicolas

## Tecnologías utilizadas

### Frontend
- **React 19 & TypeScript**: Framework para la construcción de una interfaz de usuario interactiva y tipada.
- **Vite**: Herramienta de compilación rápida para desarrollo.
- **Tailwind CSS v4**: Framework de diseño y estilos CSS para crear una interfaz moderna, limpia y responsiva.
- **Lucide React**: Biblioteca de iconos vectoriales consistentes y modernos.
- **Radix UI & Shadcn**: Componentes visuales accesibles y personalizables.
- **Theme Playground**: Sistema de cambio de temas en tiempo real que soporta esquemas de variables CSS precargados (Solar Dusk, Violet, Quantum Rose, Emerald Forest).

### Backend / Agente de IA (Mastra)
- **Mastra AI Framework (`@mastra/core`)**: Orquestador principal que gestiona el ciclo de vida de los agentes de IA autónomos, herramientas (tools), persistencia y observabilidad.
- **DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`)**: Modelo de lenguaje que guía al agente en las decisiones de crawling, navegación del sitio y compilación del reporte final.
- **LibSQL & DuckDB**: Bases de datos embebidas para almacenar el estado de la auditoría y persistir la telemetría/observabilidad de los agentes de manera distribuida.
- **Mastra Observability & Pino Logger**: Registro y exportación detallada del comportamiento y trazas de los agentes de IA.

### Automatización y Auditoría
- **axe-core**: Motor estándar de la industria utilizado para ejecutar auditorías in-situ en el DOM de las páginas visitadas.
- **Stagehand / Playwright**: Administrador del navegador que permite simular la interacción humana, navegar por enlaces y esperar la hidratación del cliente de forma fluida.

## Instalación y ejecución

### Prerrequisitos
- **Node.js**: Versión `>= 20.0.0` (recomendado `>= 22.13.0` para Mastra)
- **pnpm**: Versión `>= 9.0.0` (administrador de paquetes recomendado)

### 1. Clonar el repositorio e instalar dependencias
Desde la raíz del proyecto, ejecuta el script de instalación para descargar las dependencias en todo el monorepo de manera concurrente:
```bash
pnpm install:all
```
*(Alternativamente, puedes ejecutar `pnpm install` directamente).*

### 2. Configurar variables de entorno
Crea un archivo `.env` en `apps/mastra` basándote en `.env.example` y agrega tus credenciales necesarias (como la API key para DeepSeek u OpenAI):
```env
DEEPSEEK_API_KEY=tu_clave_aqui
```

### 3. Ejecutar en modo desarrollo
Para iniciar tanto el servidor de Mastra como el frontend de React de forma simultánea, ejecuta:
```bash
pnpm dev
```
Esto levantará:
- **Frontend**: En [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Mastra Dev / API**: En [http://localhost:4111](http://localhost:4111), donde también puedes acceder a **Mastra Studio** para visualizar y probar el comportamiento de los agentes.

### 4. Compilar para producción
Para construir el bundle de producción de todas las aplicaciones:
```bash
pnpm build
```

## Estado actual

- **Agente WCAG Autónomo Completado**: Agente orquestado con Mastra capaz de realizar un bucle autónomo de crawling y auditoría utilizando herramientas especializadas (`analyzePage`, `discoverLinks`, `finishAudit`).
- **Inyección de axe-core Dinámica**: Auditoría automatizada que inyecta axe-core directamente en el contexto del navegador emulado por Playwright/Stagehand para recolectar fallos en el DOM real.
- **Mapeo de Discapacidades Operativo**: Lógica en el backend para traducir IDs de reglas de axe-core y asociar automáticamente los problemas detectados con las discapacidades afectadas.
- **Dashboard Interactivo Funcional**: Interfaz moderna en React con modo oscuro/claro que procesa el reporte JSON de auditoría de Mastra, calcula puntuaciones dinámicas, desglosa la severidad de los errores y agrupa las incidencias de forma navegable.
- **Editor y Playground de Temas en Caliente**: Herramienta en el frontend que permite cargar variables CSS, editar estilos y ver reflejados los cambios de diseño al instante, con opciones de descarga y copia al portapapeles.