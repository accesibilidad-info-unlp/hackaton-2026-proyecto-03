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
    'area-alt': {
      name: "Los elementos <area> activos deben tener texto alternativo",
      description: "Garantiza que los elementos <area> de los mapas de imágenes tienen texto alternativo"
    },
    'aria-allowed-attr': {
      name: "Atributo ARIA no permitido",
      description: "Se está utilizando un atributo ARIA que no es válido para el rol HTML del elemento, lo que puede provocar que los lectores de pantalla ignoren la especificación."
    },
    'aria-braille-equivalent': {
      name: "Equivalente no braille en atributos braille",
      description: "Garantiza que aria-braillelabel y aria-brailleroledescription tienen un equivalente que no sea braille para usuarios sin dispositivos braille."
    },
    'aria-command-name': {
      name: "Nombre accesible en comandos ARIA",
      description: "Garantiza que todos los botones, enlaces y elementos de menú ARIA tengan un nombre accesible discernible."
    },
    'aria-conditional-attr': {
      name: "Atributo ARIA condicional no válido",
      description: "Garantiza que los atributos ARIA se utilicen como se describe en la especificación para el rol del elemento."
    },
    'aria-deprecated-role': {
      name: "Rol ARIA obsoleto",
      description: "Garantiza que los elementos no utilicen roles ARIA obsoletos o en desuso."
    },
    'aria-hidden-body': {
      name: "aria-hidden aplicado en el elemento body",
      description: "El body tiene `aria-hidden=\"true\"`, lo que oculta toda la página a las tecnologías asistenciales."
    },
    'aria-hidden-focus': {
      name: "Los elementos 'ARIA hidden' no deben contener elementos que admitan el foco",
      description: "Garantiza que los elementos 'aria-hidden' no contienen elementos que admitan el foco"
    },
    'aria-input-field-name': {
      name: "Los 'ARIA input fields' tienen un nombre accesible",
      description: "Garantiza que cada 'ARIA input field' tiene un nombre accesible"
    },
    'aria-meter-name': {
      name: "Nombre accesible en elemento meter ARIA",
      description: "Garantiza que todos los elementos con rol meter de ARIA tengan un nombre accesible descriptivo."
    },
    'aria-progressbar-name': {
      name: "Nombre accesible en barra de progreso ARIA",
      description: "Garantiza que todos los elementos de barra de progreso ARIA tengan un nombre accesible descriptivo."
    },
    'aria-prohibited-attr': {
      name: "Atributo ARIA prohibido",
      description: "Garantiza que los atributos ARIA no estén prohibidos para el rol asignado al elemento HTML."
    },
    'aria-required-attr': {
      name: "Atributos ARIA requeridos faltantes",
      description: "Un elemento ARIA con rol específico carece de atributos requeridos para dicho rol (ej. `aria-checked` para un checkbox)."
    },
    'aria-required-children': {
      name: "Ciertos 'ARIA roles' deben contener determinados hijos",
      description: "Garantiza que los elementos con un 'ARIA role' que requieren 'child roles' los contienen"
    },
    'aria-required-parent': {
      name: "Ciertos 'ARIA roles' deben estar contenidos en determinados padres",
      description: "Garantiza que los elementos con un 'ARIA role' que requieren 'parent roles' están contenidos en ellos"
    },
    'aria-roles': {
      name: "Rol ARIA no válido",
      description: "Se usó un atributo `role` no soportado por la especificación de accesibilidad WAI-ARIA."
    },
    'aria-tab-name': {
      name: "Nombre accesible en pestaña ARIA",
      description: "Garantiza que todos los elementos de pestaña ARIA tengan un nombre accesible descriptivo."
    },
    'aria-toggle-field-name': {
      name: "Los 'ARIA toggle fields' tienen un nombre accesible",
      description: "Garantiza que cada 'ARIA toggle field' tiene un nombre accesible"
    },
    'aria-tooltip-name': {
      name: "Nombre accesible en tooltip ARIA",
      description: "Garantiza que todos los elementos de tooltip ARIA tengan un nombre accesible descriptivo."
    },
    'aria-valid-attr-value': {
      name: "Valor ARIA no válido",
      description: "El valor asignado a un atributo ARIA no sigue las especificaciones requeridas (ej. booleanos o valores fuera de rango)."
    },
    'aria-valid-attr': {
      name: "Atributo ARIA inexistente o mal escrito",
      description: "El nombre del atributo ARIA utilizado no existe en la especificación WAI-ARIA."
    },
    'blink': {
      name: "Efecto de parpadeo de contenido",
      description: "El parpadeo de contenido puede causar convulsiones fotosensibles en usuarios vulnerables y distrae gravemente la atención."
    },
    'button-name': {
      name: "Botones sin nombre accesible",
      description: "Los botones interactivos no tienen un texto perceptible o etiqueta (`aria-label`, `aria-labelledby`), lo que impide a los lectores de pantalla anunciar su función."
    },
    'bypass': {
      name: "Sin mecanismo para omitir bloques repetitivos",
      description: "Falta un enlace directo al contenido principal ('Saltar al contenido'), obligando al usuario de teclado a recorrer toda la navegación superior cada vez que cambia de página."
    },
    'color-contrast': {
      name: "Contraste de color insuficiente",
      description: "El contraste entre el color del texto y el fondo es menor al requerido (WCAG 2.2 AA exige al menos 4.5:1 para texto normal). Esto dificulta la lectura para personas con baja visión, daltonismo o fatiga visual."
    },
    'definition-list': {
      name: "Los elementos <dl> solo deben contener directamente grupos de <dt> y <dd> debidamente ordenados, o elementos <script> o <template>",
      description: "Garantiza que los elementos <dl> están estructurados correctamente"
    },
    'dlitem': {
      name: "Los elementos <dt> y <dd> deben estar contenidos en un <dl>",
      description: "Garantiza que los elementos <dt> y <dd> están contenidos en un <dl>"
    },
    'document-title': {
      name: "Documento sin título",
      description: "La página no tiene un título `<title>` que describa su contenido. Los títulos ayudan a identificar rápidamente la pestaña del navegador y el propósito de la pantalla."
    },
    'duplicate-id-aria': {
      name: "Los 'IDs' usados en ARIA y en 'labels' deben ser únicos",
      description: "Garantiza que cada valor del atributo id usado en ARIA y en 'labels' es único"
    },
    'form-field-multiple-labels': {
      name: "El campo de formulario no debe tener múltiples elementos label",
      description: "Garantiza que el campo de formulario no tiene múltiples elementos label"
    },
    'frame-focusable-content': {
      name: "Contenido enfocable dentro de marco no enfocado",
      description: "Garantiza que los elementos <frame> e <iframe> con contenido enfocable por teclado no tengan asignado tabindex=-1."
    },
    'frame-title-unique': {
      name: "Los marcos deben tener un único atributo title",
      description: "Garantiza que los elementos <iframe> y <frame> contienen un atributo título único"
    },
    'frame-title': {
      name: "Iframe sin título descriptivo",
      description: "Los elementos <iframe> deben tener un atributo title que describa su contenido para que las tecnologías asistenciales lo anuncien."
    },
    'html-has-lang': {
      name: "Idioma de la página no definido",
      description: "El elemento `<html>` carece del atributo `lang` (por ejemplo, `lang=\"es\"`). Sin esto, los lectores de pantalla no sabrán en qué idioma pronunciar el texto."
    },
    'html-lang-valid': {
      name: "El elemento <html> debe tener un valor válido para el atributo lang",
      description: "Garantiza que el atributo lang del elemento <html> tiene un valor válido"
    },
    'html-xml-lang-mismatch': {
      name: "Los elementos HTML con lang y xml:lang deben tener el mismo idioma base",
      description: "Garantizar que en los elementos HTML con atributos tanto lang como xml:lang válidos haya concordancia en el idioma base de la página"
    },
    'image-alt': {
      name: "Imágenes sin texto alternativo",
      description: "Las imágenes informativas deben poseer un atributo `alt` descriptivo. De lo contrario, los usuarios de lectores de pantalla no sabrán qué muestra la imagen."
    },
    'input-button-name': {
      name: "Los 'Input buttons' deben tener texto discernible",
      description: "Garantizar que los 'input buttons' tienen texto discernible"
    },
    'input-image-alt': {
      name: "Los 'image buttons' deben tener texto alternativo",
      description: "Garantiza que los elementos <input type=\"image\"> tienen texto alternativo"
    },
    'label': {
      name: "Campos de formulario sin etiquetas descriptivas",
      description: "Los elementos de entrada de datos no están correctamente asociados a una etiqueta `<label>`. Esto provoca que los usuarios que navegan con teclado o lector de pantalla no sepan qué ingresar."
    },
    'link-in-text-block': {
      name: "Los enlaces deben distinguirse del texto adyacente por un medio que no dependa del color",
      description: "Los enlaces pueden distinguirse sin depender del color"
    },
    'link-name': {
      name: "Enlaces sin nombre accesible",
      description: "Los enlaces carecen de un texto explicativo claro (por ejemplo, enlaces vacíos o íconos sin descripción), por lo que los usuarios no sabrán a dónde dirige el enlace."
    },
    'list': {
      name: "<ul> y <ol> solo deben contener directamente elementos <li>, <script> o <template>",
      description: "Garantiza que las listas están estructuradas correctamente"
    },
    'listitem': {
      name: "Los elementos <li> deben estar contenidos en un <ul> o un <ol>",
      description: "Garantiza que los elementos <li> se utilizan semánticamente"
    },
    'marquee': {
      name: "Elemento marquee obsoleto utilizado",
      description: "La etiqueta `<marquee>` crea movimiento automático del texto que no puede detenerse, afectando a personas con problemas de atención y lectura."
    },
    'meta-refresh': {
      name: "Actualización o redirección automática",
      description: "El sitio web refresca el contenido automáticamente. Esto desorienta a los usuarios con dificultades cognitivas o lectores de pantalla."
    },
    'meta-viewport': {
      name: "Zoom de la página bloqueado",
      description: "El escalado de pantalla está bloqueado o limitado (`user-scalable=no` o `maximum-scale` bajo). Impide que usuarios con baja visión amplíen el tamaño de letra del sitio."
    },
    'nested-interactive': {
      name: "Controles interactivos anidados",
      description: "Los elementos interactivos no deben anidarse dentro de otros elementos interactivos, ya que esto dificulta el foco del teclado y confunde las acciones de activación."
    },
    'no-autoplay-audio': {
      name: "Audio sin reproducción automática",
      description: "Garantiza que los elementos <video> o <audio> no reproduzcan sonido automáticamente por más de 3 segundos sin un control para detenerlo o silenciarlo."
    },
    'object-alt': {
      name: "Los elementos <object> deben tener texto alternativo",
      description: "Garantiza que los elementos <object> tienen texto alternativo"
    },
    'role-img-alt': {
      name: "Los elementos [role='img'] tienen un texto alternativo",
      description: "Garantiza que los elementos [role='img'] tienen texto alternativo"
    },
    'scrollable-region-focusable': {
      name: "Contenedores con scroll no enfocables",
      description: "Cajas con barras de desplazamiento vertical u horizontal que no reciben foco de teclado (`tabindex=\"0\"`), impidiendo que usuarios sin mouse puedan hacerles scroll."
    },
    'select-name': {
      name: "Nombre accesible en elemento select",
      description: "Garantiza que todos los menús desplegables (<select>) tengan un nombre accesible discernible."
    },
    'server-side-image-map': {
      name: "No deben usarse mapas de imágenes del lado del servidor",
      description: "Garantiza que no se usan mapas de imágenes del lado del servidor"
    },
    'summary-name': {
      name: "Nombre accesible en elemento summary",
      description: "Garantiza que todos los elementos <summary> tengan texto discernible que describa la sección colapsable."
    },
    'svg-img-alt': {
      name: "Texto alternativo en gráficos SVG con rol de imagen",
      description: "Garantiza que los elementos <svg> con rol de imagen, documento gráfico o símbolo gráfico posean texto accesible descriptivo."
    },
    'td-headers-attr': {
      name: "Todas las celdas de un elemento table que usen el atributo headers deben hacer referencia solo a otras celdas de esa misma tabla",
      description: "Garantizar que cada celda que use los encabezados en una tabla haga referencia a otra celda de esa tabla"
    },
    'th-has-data-cells': {
      name: "Todos los elementos th y elementos con role=columnheader/rowheader deben tener las celdas de datos que describen",
      description: "Garantizar que cada encabezado de tabla en una tabla de datos hace referencia a celdas de datos"
    },
    'valid-lang': {
      name: "El atributo lang debe tener un valor válido",
      description: "Garantiza que los atributos lang tienen valores válidos"
    },
    'video-caption': {
      name: "Los elementos <video> deben tener subtítulos",
      description: "Garantiza que los elementos <video> tienen subtítulos"
    },
    'autocomplete-valid': {
      name: "El atributo autocomplete debe usarse correctamente",
      description: "Garantizar que el atributo autocomplete es correcto y adecuado para el campo de formulario"
    },
    'avoid-inline-spacing': {
      name: "El espaciado de texto 'inline' debe poder ajustarse mediante hojas de estilo personalizadas",
      description: "Garantizar que el espaciado de texto establecido mediante atributos style se puede ajustar con hojas de estilo personalizadas"
    },
    'target-size': {
      name: "Tamaño mínimo del objetivo táctil",
      description: "Garantiza que los objetivos táctiles (botones, enlaces, etc.) tengan el tamaño y espacio libre suficientes para evitar pulsaciones accidentales."
    },
    'accesskeys': {
      name: "El valor del atributo accesskey debe ser único",
      description: "Garantiza que cada valor para el atributo accesskey es único"
    },
    'aria-allowed-role': {
      name: "ARIA role debe ser apropiado para el elemento",
      description: "Garantiza que el atributo role tiene un valor apropiado para el elemento"
    },
    'aria-dialog-name': {
      name: "Nombre accesible en diálogo ARIA",
      description: "Garantiza que todas las ventanas de diálogo y diálogos de alerta ARIA tengan un nombre accesible descriptivo."
    },
    'aria-text': {
      name: "Rol ARIA text en elementos interactivos",
      description: "Garantiza que role=\"text\" solo se utilice en elementos que no contengan descendientes enfocables por teclado."
    },
    'aria-treeitem-name': {
      name: "Nombre accesible en elemento de árbol ARIA",
      description: "Garantiza que todos los nodos de elemento de árbol ARIA tengan un nombre accesible descriptivo."
    },
    'empty-heading': {
      name: "Encabezados vacíos",
      description: "Se encontraron encabezados que no tienen texto. Esto confunde la navegación estructural al presentarse niveles vacíos a las tecnologías asistenciales."
    },
    'empty-table-header': {
      name: "Encabezado de tabla vacío",
      description: "Garantiza que todos los encabezados de tabla tengan texto discernible que describa la columna o fila."
    },
    'frame-tested': {
      name: "Los marcos deben probarse con axe-core",
      description: "Garantiza que los elementos <iframe> y <frame> contienen el script axe-core"
    },
    'heading-order': {
      name: "Orden jerárquico de encabezados incorrecto",
      description: "La jerarquía de encabezados (H1, H2, H3...) debe ser secuencial lógica para estructurar el contenido correctamente para usuarios con lectores de pantalla y cognitivos."
    },
    'image-redundant-alt': {
      name: "El texto alternativo de las imágenes no debe repetirse como texto",
      description: "Garantiza que la alternativa a la imagen no se repite como texto"
    },
    'label-title-only': {
      name: "Elemento de formulario con atributo title únicamente",
      description: "Los campos de formulario deben usar etiquetas descriptivas `<label>`, ya que el atributo `title` no es anunciado consistentemente por todos los lectores de pantalla."
    },
    'landmark-banner-is-top-level': {
      name: "El punto de referencia banner no debe estar contenido en otro punto de referencia",
      description: "Garantiza que el punto de referencia banner está en el nivel superior"
    },
    'landmark-contentinfo-is-top-level': {
      name: "El punto de referencia contentinfo no debe estar contenido en otro punto de referencia",
      description: "Garantiza que el punto de referencia contentinfo está en el nivel superior"
    },
    'landmark-main-is-top-level': {
      name: "El punto de referencia main no debe estar contenido en otro punto de referencia",
      description: "Garantiza que el punto de referencia main está en el nivel superior"
    },
    'landmark-no-duplicate-banner': {
      name: "El documento no debe tener más de un punto de referencia banner",
      description: "Garantiza que el documento tiene, como mucho, un punto de referencia banner"
    },
    'landmark-no-duplicate-contentinfo': {
      name: "El documento no debe tener más de un punto de referencia contentinfo",
      description: "Garantiza que el documento tiene, como mucho, un punto de referencia contentinfo"
    },
    'landmark-no-duplicate-main': {
      name: "Región principal main duplicada",
      description: "Garantiza que el documento tenga como máximo un único punto de referencia principal (<main> o role=\"main\")."
    },
    'landmark-one-main': {
      name: "Punto de referencia principal faltante",
      description: "El documento debe tener una región principal (<main> o role=\"main\") para que los usuarios puedan saltar directamente al contenido principal."
    },
    'landmark-unique': {
      name: "Garantiza que los puntos de referencia son únicos",
      description: "Los puntos de referencia deben tener una única combinación de role o role/label/title (es decir, un nombre accesible único)"
    },
    'meta-viewport-large': {
      name: "Zoom de página adaptable",
      description: "Garantiza que la etiqueta meta viewport permita ampliar y redimensionar el texto a una escala significativa (al menos 500%)."
    },
    'page-has-heading-one': {
      name: "Página sin título principal (H1)",
      description: "La página debe tener al menos un encabezado de nivel uno (<h1>) que identifique el contenido principal."
    },
    'presentation-role-conflict': {
      name: "Conflicto de rol presentacional",
      description: "Garantiza que los elementos marcados con rol presentacional o none no contengan atributos ARIA globales ni tabindex, permitiendo que los lectores de pantalla los ignoren por completo."
    },
    'region': {
      name: "Página sin regiones de referencia principales",
      description: "La página no define puntos de referencia semánticos (`<main>`, `<nav>`, `<header>`, etc.), lo cual dificulta la orientación estructural y saltos rápidos en lectores de pantalla."
    },
    'scope-attr-valid': {
      name: "El atributo scope debería usarse correctamente",
      description: "Garantiza que el atributo scope se usa correctamente en las tablas"
    },
    'skip-link': {
      name: "El destino del enlace de salto ('skip') debería existir y admitir el foco",
      description: "Garantizar que todos los enlaces de salto ('skip') tienen un destino que admite el foco"
    },
    'tabindex': {
      name: "Los elementos no deberían tener un tabindex mayor que 0",
      description: "Garantiza que los valores del atributo tabindex no son mayores que 0"
    },
    'table-duplicate-name': {
      name: "El elemento <caption> no debería contener el mismo texto que el atributo summary",
      description: "Garantizar que las tablas no tienen el mismo summary y caption"
    },
    'color-contrast-enhanced': {
      name: "Los elementos deben tener un contraste de colores suficiente",
      description: "Garantiza que el contraste entre colores de primer plano y fondo cumple los límites de la ratio para contraste WCAG 2 AAA"
    },
    'identical-links-same-purpose': {
      name: "Enlaces idénticos con mismo propósito",
      description: "Garantiza que los enlaces con el mismo nombre accesible dirijan al mismo destino o sirvan a un propósito similar."
    },
    'meta-refresh-no-exceptions': {
      name: "Actualización periódica por meta-refresh",
      description: "Garantiza que no se use la etiqueta meta-refresh para recargas o redirecciones temporales diferidas."
    },
    'css-orientation-lock': {
      name: "Las 'CSS Media queries' no se usan para bloquear la orientación de pantalla",
      description: "Garantiza que el contenido no está bloqueado en ninguna orientación de pantalla específica, y que el contenido es manejable en cualquier orientación de pantalla"
    },
    'focus-order-semantics': {
      name: "Los elementos en orden de foco necesitan un rol apropiado para contenido interactivo",
      description: "Garantiza que los elementos en orden de foco tienen un rol apropiado"
    },
    'hidden-content': {
      name: "El contenido oculto de la página no se puede analizar",
      description: "Informa a los usuarios sobre contenido oculto."
    },
    'label-content-name-mismatch': {
      name: "Los elementos deben tener su texto visible como parte de su nombre accesible",
      description: "Garantiza que, en los elementos etiquetados mediante su contenido, su texto visible debe formar parte de su nombre accesible"
    },
    'p-as-heading': {
      name: "No se usa texto en negrita, cursiva o tamaño de fuente para dar estilo de encabezados a elementos p",
      description: "Garantizar que los elementos p no se usan para diseñar encabezados"
    },
    'table-fake-caption': {
      name: "Las celdas de datos o de encabezados no deberían usarse para dar título a una tabla de datos.",
      description: "Garantizar que las tablas con título usan el elemento <caption>."
    },
    'td-has-header': {
      name: "Todos los elementos td no vacíos de una tabla mayor que 3 por 3 deben tener un encabezado de tabla asociado",
      description: "Garantizar que cada celda de datos no vacía de una tabla grande tiene uno o más encabezados de tabla"
    },
    'aria-roledescription': {
      name: "Descripción de rol ARIA inapropiada",
      description: "Garantiza que el atributo aria-roledescription solo se utilice en elementos que ya posean un rol implícito o explícito."
    },
    'audio-caption': {
      name: "Los elementos <audio> deben tener una pista de subtítulos",
      description: "Garantiza que los elementos <audio> tienen subtítulos"
    },
    'duplicate-id-active': {
      name: "IDs duplicados en elementos activos",
      description: "Existen elementos interactivos con el mismo atributo `id`. Esto confunde a las tecnologías asistenciales a la hora de enfocar y procesar eventos."
    },
    'duplicate-id': {
      name: "El valor del atributo id debe ser único",
      description: "Garantiza que cada valor para el atributo id es único"
    },
    'landmark-complementary-is-top-level': {
      name: "Aside no debe estar contenido en otro punto de referencia",
      description: "Garantiza que el punto de referencia complementary o aside está en el nivel superior"
    },
    'aria-hidden-focusable': {
      name: "Elemento enfocable dentro de área oculta",
      description: "No se deben incluir elementos interactivos (como enlaces o botones) dentro de contenedores que tengan aria-hidden=\"true\", ya que esto confunde a los usuarios con lectores de pantalla."
    }
  };

  const ruleIdLower = ruleId.toLowerCase();
  return dictionary[ruleIdLower] || {
    name: ruleId,
    description: originalDescription
  };
}
