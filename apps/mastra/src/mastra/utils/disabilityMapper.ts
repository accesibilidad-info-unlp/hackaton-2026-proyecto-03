/**
 * Determina qué discapacidades o capacidades se ven afectadas por una regla y etiquetas de axe-core.
 * Retorna las categorías correspondientes en español.
 */
export function getAffectedDisabilities(ruleId: string, tags: string[] = []): string[] {
  const disabilities = new Set<string>();

  // Analizar etiquetas de categoría de axe-core
  for (const tag of tags) {
    if (tag === 'cat.color') {
      disabilities.add('Visual (Baja visión / Contraste)');
    } else if (tag === 'cat.aria' || tag === 'cat.tables' || tag === 'cat.parsing') {
      disabilities.add('Visual (Lector de pantalla)');
    } else if (tag === 'cat.text-alternatives') {
      disabilities.add('Visual (Lector de pantalla)');
    } else if (tag === 'cat.keyboard') {
      disabilities.add('Motriz (Uso de teclado)');
    } else if (tag === 'cat.navigation') {
      disabilities.add('Motriz (Uso de teclado)');
      disabilities.add('Cognitiva (Estructura)');
    } else if (tag === 'cat.structure') {
      disabilities.add('Cognitiva (Estructura)');
      disabilities.add('Visual (Lector de pantalla)');
    } else if (tag === 'cat.forms') {
      disabilities.add('Visual (Lector de pantalla)');
      disabilities.add('Cognitiva (Comprensión)');
    } else if (tag === 'cat.sensory-and-visual-cues') {
      disabilities.add('Visual (Baja visión / Contraste)');
      disabilities.add('Cognitiva (Comprensión)');
    } else if (tag === 'cat.time-and-media') {
      disabilities.add('Auditiva (Subtítulos / Audio)');
      disabilities.add('Visual (Lector de pantalla)');
    } else if (tag === 'cat.language') {
      disabilities.add('Cognitiva (Comprensión)');
      disabilities.add('Visual (Lector de pantalla)');
    }
  }

  // Búsqueda de coincidencia específica por ID de regla como fallback o complemento
  const ruleIdLower = ruleId.toLowerCase();

  if (ruleIdLower.includes('color') || ruleIdLower.includes('contrast')) {
    disabilities.add('Visual (Baja visión / Contraste)');
  }
  if (ruleIdLower.includes('alt') || ruleIdLower.includes('image') || ruleIdLower.includes('aria') || ruleIdLower.includes('label')) {
    disabilities.add('Visual (Lector de pantalla)');
  }
  if (
    ruleIdLower.includes('keyboard') ||
    ruleIdLower.includes('focus') ||
    ruleIdLower.includes('tabindex') ||
    ruleIdLower.includes('bypass') ||
    ruleIdLower.includes('accesskey')
  ) {
    disabilities.add('Motriz (Uso de teclado)');
  }
  if (
    ruleIdLower.includes('heading') ||
    ruleIdLower.includes('title') ||
    ruleIdLower.includes('lang') ||
    ruleIdLower.includes('structure') ||
    ruleIdLower.includes('navigation')
  ) {
    disabilities.add('Cognitiva (Estructura)');
  }
  if (
    ruleIdLower.includes('media') ||
    ruleIdLower.includes('video') ||
    ruleIdLower.includes('audio') ||
    ruleIdLower.includes('track') ||
    ruleIdLower.includes('caption')
  ) {
    disabilities.add('Auditiva (Subtítulos / Audio)');
  }

  // Si no se clasificó bajo ninguna categoría, agregamos cognitivo como genérico
  if (disabilities.size === 0) {
    disabilities.add('Cognitiva (Comprensión)');
  }

  return Array.from(disabilities);
}

export interface RuleTranslation {
  name: string;
  description: string;
}

export function translateRule(ruleId: string, originalDescription: string): RuleTranslation {
  const dictionary: Record<string, RuleTranslation> = {
    'color-contrast': {
      name: "Contraste de color insuficiente",
      description: "El contraste entre el color del texto y el fondo es menor al requerido (WCAG 2.2 AA exige al menos 4.5:1 para texto normal). Esto dificulta la lectura para personas con baja visión, daltonismo o fatiga visual."
    },
    'image-alt': {
      name: "Imágenes sin texto alternativo",
      description: "Las imágenes informativas deben poseer un atributo `alt` descriptivo. De lo contrario, los usuarios de lectores de pantalla no sabrán qué muestra la imagen."
    },
    'button-name': {
      name: "Botones sin nombre accesible",
      description: "Los botones interactivos no tienen un texto perceptible o etiqueta (`aria-label`, `aria-labelledby`), lo que impide a los lectores de pantalla anunciar su función."
    },
    'link-name': {
      name: "Enlaces sin nombre accesible",
      description: "Los enlaces carecen de un texto explicativo claro (por ejemplo, enlaces vacíos o íconos sin descripción), por lo que los usuarios no sabrán a dónde dirige el enlace."
    },
    'document-title': {
      name: "Documento sin título",
      description: "La página no tiene un título `<title>` que describa su contenido. Los títulos ayudan a identificar rápidamente la pestaña del navegador y el propósito de la pantalla."
    },
    'html-has-lang': {
      name: "Idioma de la página no definido",
      description: "El elemento `<html>` carece del atributo `lang` (por ejemplo, `lang=\"es\"`). Sin esto, los lectores de pantalla no sabrán en qué idioma pronunciar el texto."
    },
    'label': {
      name: "Campos de formulario sin etiquetas descriptivas",
      description: "Los elementos de entrada de datos no están correctamente asociados a una etiqueta `<label>`. Esto provoca que los usuarios que navegan con teclado o lector de pantalla no sepan qué ingresar."
    },
    'heading-order': {
      name: "Orden jerárquico de encabezados incorrecto",
      description: "La jerarquía de encabezados (H1, H2, H3...) debe ser secuencial lógica para estructurar el contenido correctamente para usuarios con lectores de pantalla y cognitivos."
    },
    'empty-heading': {
      name: "Encabezados vacíos",
      description: "Se encontraron encabezados que no tienen texto. Esto confunde la navegación estructural al presentarse niveles vacíos a las tecnologías asistenciales."
    },
    'meta-viewport': {
      name: "Zoom de la página bloqueado",
      description: "El escalado de pantalla está bloqueado o limitado (`user-scalable=no` o `maximum-scale` bajo). Impide que usuarios con baja visión amplíen el tamaño de letra del sitio."
    },
    'scrollable-region-focusable': {
      name: "Contenedores con scroll no enfocables",
      description: "Cajas con barras de desplazamiento vertical u horizontal que no reciben foco de teclado (`tabindex=\"0\"`), impidiendo que usuarios sin mouse puedan hacerles scroll."
    },
    'bypass': {
      name: "Sin mecanismo para omitir bloques repetitivos",
      description: "Falta un enlace directo al contenido principal ('Saltar al contenido'), obligando al usuario de teclado a recorrer toda la navegación superior cada vez que cambia de página."
    },
    'region': {
      name: "Página sin regiones de referencia principales",
      description: "La página no define puntos de referencia semánticos (`<main>`, `<nav>`, `<header>`, etc.), lo cual dificulta la orientación estructural y saltos rápidos en lectores de pantalla."
    },
    'duplicate-id-active': {
      name: "IDs duplicados en elementos activos",
      description: "Existen elementos interactivos con el mismo atributo `id`. Esto confunde a las tecnologías asistenciales a la hora de enfocar y procesar eventos."
    },
    'label-title-only': {
      name: "Elemento de formulario con atributo title únicamente",
      description: "Los campos de formulario deben usar etiquetas descriptivas `<label>`, ya que el atributo `title` no es anunciado consistentemente por todos los lectores de pantalla."
    },
    'aria-allowed-attr': {
      name: "Atributo ARIA no permitido",
      description: "Se está utilizando un atributo ARIA que no es válido para el rol HTML del elemento, lo que puede provocar que los lectores de pantalla ignoren la especificación."
    },
    'aria-hidden-body': {
      name: "aria-hidden aplicado en el elemento body",
      description: "El body tiene `aria-hidden=\"true\"`, lo que oculta toda la página a las tecnologías asistenciales."
    },
    'aria-required-attr': {
      name: "Atributos ARIA requeridos faltantes",
      description: "Un elemento ARIA con rol específico carece de atributos requeridos para dicho rol (ej. `aria-checked` para un checkbox)."
    },
    'aria-roles': {
      name: "Rol ARIA no válido",
      description: "Se usó un atributo `role` no soportado por la especificación de accesibilidad WAI-ARIA."
    },
    'aria-valid-attr-value': {
      name: "Valor ARIA no válido",
      description: "El valor asignado a un atributo ARIA no sigue las especificaciones requeridas (ej. booleanos o valores fuera de rango)."
    },
    'aria-valid-attr': {
      name: "Atributo ARIA inexistente o mal escrito",
      description: "El nombre del atributo ARIA utilizado no existe en la especificación WAI-ARIA."
    },
    'meta-refresh': {
      name: "Actualización o redirección automática",
      description: "El sitio web refresca el contenido automáticamente. Esto desorienta a los usuarios con dificultades cognitivas o lectores de pantalla."
    },
    'blink': {
      name: "Efecto de parpadeo de contenido",
      description: "El parpadeo de contenido puede causar convulsiones fotosensibles en usuarios vulnerables y distrae gravemente la atención."
    },
    'marquee': {
      name: "Elemento marquee obsoleto utilizado",
      description: "La etiqueta `<marquee>` crea movimiento automático del texto que no puede detenerse, afectando a personas con problemas de atención y lectura."
    }
  };

  const ruleIdLower = ruleId.toLowerCase();
  return dictionary[ruleIdLower] || {
    name: ruleId,
    description: originalDescription
  };
}
