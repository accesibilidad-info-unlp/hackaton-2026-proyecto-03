---
# Tema principal de la presentación
theme: seriph
# Imagen de fondo con gradiente (estética moderna)
background: https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80
# Clases adicionales aplicadas a toda la diapositiva
class: text-center
# Configuración del resaltador de código
highlighter: shiki
lineNumbers: false
# Información general
info: |
  ## Auditor Inteligente de Accesibilidad con IA
  Presentación del proyecto - Hackathon 2026
drawings:
  persist: false
transition: slide-left
title: Auditor de Accesibilidad IA
---

<div class="absolute inset-0 bg-black bg-opacity-60 -z-1"></div>

<div class="relative z-10 text-white">

# Auditor Inteligente de Accesibilidad con IA

Evaluación y diagnóstico sistemático para el cumplimiento de **WCAG 2.2**

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-4 py-2 rounded-lg cursor-pointer bg-blue-600 bg-opacity-40 hover:bg-opacity-60 transition-all font-semibold text-white">
    Comenzar presentación <carbon:arrow-right class="inline"/>
  </span>
</div>

</div>

---
transition: fade-out
layout: image-right
# Gradiente dinámico para acompañar el contenido
image: https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80
---

# ¿Qué es?

El **Auditor Inteligente de Accesibilidad** es una herramienta avanzada que permite evaluar y diagnosticar sistemáticamente el nivel de accesibilidad de cualquier sitio web.

<br>

<v-click>

- 🎯 **Objetivo Principal:** Garantizar el cumplimiento de las pautas **WCAG 2.2**.
- 🤖 **Innovación:** Utiliza un **agente de IA autónomo** que simula navegación humana.
- 📊 **Clasificación Inteligente:** Clasifica las infracciones detectadas según el tipo de discapacidad a la que afectan (visual, motriz, cognitiva, etc.).

</v-click>

---
layout: center
transition: slide-up
---

# El Problema
<br>
<div class="text-center text-4xl mb-4 font-bold text-gray-400">Analizadores estáticos tradicionales</div>
<div class="text-center text-2xl my-6">vs</div>
<div class="text-center text-5xl mb-4 font-bold text-blue-500">Nuestro Agente de IA</div>

---
layout: two-cols
---

# <carbon:warning-alt class="inline text-red-500"/> Tradicionales

<br>

- ❌ Estáticos: analizan código fuente sin contexto.
- ❌ Requieren configuración manual página por página.
- ❌ No interpretan flujos interactivos (SPA, modales, hidratación).
- ❌ Generan reportes crudos, orientados a código y difíciles de empatizar.

::right::

# <carbon:machine-learning class="inline text-blue-500"/> Nuestro Enfoque

<br>

- ✅ **Autónomo:** Bucle *crawler-auditor* que descubre enlaces y navega automáticamente.
- ✅ **Dinámico:** Inyecta motores de auditoría en el DOM real durante la ejecución.
- ✅ **Humano:** Comprende el contexto interactivo y clasifica los fallos por **discapacidad específica**.

---
layout: default
---

# Características Principales

<div class="grid grid-cols-2 gap-6 mt-8">
  <div v-click class="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 class="flex items-center gap-2 text-xl font-bold mb-2"><carbon:bot class="text-blue-500"/> Agente Autónomo</h3>
    <p class="text-sm opacity-80">Navegación inteligente simulada y ejecución de pruebas en tiempo real, inyectando herramientas en el DOM para análisis profundo.</p>
  </div>
  
  <div v-click class="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 class="flex items-center gap-2 text-xl font-bold mb-2"><carbon:dashboard class="text-green-500"/> Dashboard Interactivo</h3>
    <p class="text-sm opacity-80">Procesa el reporte JSON, calcula un puntaje dinámico de accesibilidad y desglosa la severidad de los errores de forma visual.</p>
  </div>

  <div v-click class="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 class="flex items-center gap-2 text-xl font-bold mb-2"><carbon:color-palette class="text-purple-500"/> Theme Playground</h3>
    <p class="text-sm opacity-80">Permite previsualizar y personalizar en tiempo real la apariencia visual del sitio para validar contrastes y estilos sobre la marcha.</p>
  </div>
  
  <div v-click class="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 class="flex items-center gap-2 text-xl font-bold mb-2"><carbon:accessibility-alt class="text-orange-500"/> Mapeo de Discapacidades</h3>
    <p class="text-sm opacity-80">Agrupa inteligentemente problemas de teclado, visuales (ceguera/daltonismo), cognitivos y auditivos para priorizar correcciones.</p>
  </div>
</div>

---
layout: section
---

# Arquitectura y Stack Tecnológico

---
layout: two-cols
---

# Frontend 🎨

Interfaz interactiva, moderna y accesible.

<br>

- **React 19 & TypeScript**
- **Vite** (Build tool rápida)
- **Tailwind CSS v4** (Diseño y estilos)
- **Radix UI & Shadcn** (Componentes accesibles)
- **Lucide React** (Iconografía)
- **Theme Playground** (Gestión de variables CSS)

::right::

# Backend & IA 🧠

Orquestación, automatización y análisis.

<br>

- **Mastra AI Framework** (`@mastra/core`)
- Modelo Base: **DeepSeek V4 Pro**
- Bases de Datos: **LibSQL & DuckDB**
- Observabilidad: **Mastra & Pino Logger**
- Automatización: 
  - **axe-core** (Auditoría DOM)
  - **Stagehand / Playwright** (Navegador emulado)

---
layout: statement
---

# Estado Actual del Proyecto

El proyecto está funcional e integra las siguientes capacidades clave:

<div class="text-left mt-8 max-w-2xl mx-auto text-lg space-y-4">
  <div v-click class="flex items-center gap-3"><carbon:checkmark-outline class="text-green-500 text-2xl flex-shrink-0"/> <span>Agente WCAG Autónomo Completado (discoverLinks, analyzePage)</span></div>
  <div v-click class="flex items-center gap-3"><carbon:checkmark-outline class="text-green-500 text-2xl flex-shrink-0"/> <span>Inyección Dinámica de axe-core en Playwright/Stagehand</span></div>
  <div v-click class="flex items-center gap-3"><carbon:checkmark-outline class="text-green-500 text-2xl flex-shrink-0"/> <span>Traducción y Mapeo Automático de Discapacidades</span></div>
  <div v-click class="flex items-center gap-3"><carbon:checkmark-outline class="text-green-500 text-2xl flex-shrink-0"/> <span>Dashboard Interactivo para visualización de métricas</span></div>
  <div v-click class="flex items-center gap-3"><carbon:checkmark-outline class="text-green-500 text-2xl flex-shrink-0"/> <span>Editor y Playground de Temas en Caliente operativo</span></div>
</div>

---
layout: center
class: text-center
---

# El Equipo

Hackathon 2026 - Proyecto 03

<br>

<div class="grid grid-cols-4 gap-8 mt-8">
  <div class="flex flex-col items-center">
    <div class="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-4xl mb-4 shadow-lg border-2 border-blue-500">👨‍💻</div>
    <strong class="text-lg">Pereyra Nehuen</strong>
  </div>
  <div class="flex flex-col items-center">
    <div class="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-4xl mb-4 shadow-lg border-2 border-green-500">👨‍💻</div>
    <strong class="text-lg">Pereyra Lautaro</strong>
  </div>
  <div class="flex flex-col items-center">
    <div class="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-4xl mb-4 shadow-lg border-2 border-purple-500">👨‍💻</div>
    <strong class="text-lg">Marzialetti Fernando</strong>
  </div>
  <div class="flex flex-col items-center">
    <div class="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-4xl mb-4 shadow-lg border-2 border-orange-500">👨‍💻</div>
    <strong class="text-lg">Martinez Nicolas</strong>
  </div>
</div>

---
layout: end
---

# ¡Gracias!

¿Preguntas o comentarios?
