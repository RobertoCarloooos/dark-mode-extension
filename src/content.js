// Recargar configuraciones almacenadas
chrome.storage.sync.get(["darkModeEnabled", "darknessLevel", "excludedSites"], (data) => {
    const darkModeEnabled = data.darkModeEnabled ?? true;
    const darknessLevel = data.darknessLevel ?? 0.7; // 0.0 es oscuro, 1.0 es normal
    const excludedSites = data.excludedSites ?? [];
  
    // Obtener la URL de la página actual
    const currentSite = window.location.hostname;
  
    // Si el modo oscuro está habilitado y no estamos en un sitio excluido
    if (darkModeEnabled && !excludedSites.includes(currentSite)) {
      applyDarkMode(darknessLevel);
    }
  });
  
  // Función para aplicar el modo oscuro
  function applyDarkMode(darknessLevel) {
    const body = document.body;
    body.style.backgroundColor = `rgb(${255 * (1 - darknessLevel)}, ${255 * (1 - darknessLevel)}, ${255 * (1 - darknessLevel)})`;
    body.style.color = `rgb(${255 * darknessLevel}, ${255 * darknessLevel}, ${255 * darknessLevel})`;
  
    // Ajustar otros elementos de la página para mejorar el contraste
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const backgroundColor = window.getComputedStyle(element).backgroundColor;
      const textColor = window.getComputedStyle(element).color;
      
      // Solo aplicar ajustes si el fondo no es transparente
      if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
        element.style.backgroundColor = adjustColor(backgroundColor, darknessLevel);
        element.style.color = adjustColor(textColor, 1 - darknessLevel);
      }
    });
  }
  
  // Función para ajustar el color (tanto de fondo como texto)
  function adjustColor(color, darknessLevel) {
    const rgb = color.match(/\d+/g);
    if (!rgb) return color;
  
    const r = Math.min(255, Math.max(0, parseInt(rgb[0]) * darknessLevel));
    const g = Math.min(255, Math.max(0, parseInt(rgb[1]) * darknessLevel));
    const b = Math.min(255, Math.max(0, parseInt(rgb[2]) * darknessLevel));
  
    return `rgb(${r}, ${g}, ${b})`;
  }
  