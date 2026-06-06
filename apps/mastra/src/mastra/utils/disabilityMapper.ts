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
