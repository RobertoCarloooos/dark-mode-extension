// Recargar configuraciones almacenadas
chrome.storage.sync.get(["darkModeEnabled", "darknessLevel", "excludedSites"], (data) => {
  const darkModeEnabled = data.darkModeEnabled ?? true;
  const darknessLevel = data.darknessLevel ?? 0.7; // 0.0 es oscuro, 1.0 es claro
  const excludedSites = data.excludedSites ?? [];

  // Obtener el dominio de la página actual
  const currentSite = window.location.hostname;

  // Si el modo oscuro está habilitado y no estamos en un sitio excluido
  if (darkModeEnabled && !isSiteExcluded(currentSite, excludedSites)) {
    applyDarkMode(darknessLevel);
  }
});

// Función para aplicar el modo oscuro
function applyDarkMode(darknessLevel) {
  // Inyectar estilos generales de modo oscuro
  const darkModeStyle = document.createElement("style");
  darkModeStyle.id = "dark-mode-style";
  darkModeStyle.textContent = `
    body {
      background-color: rgb(${255 * (1 - darknessLevel)}, ${255 * (1 - darknessLevel)}, ${255 * (1 - darknessLevel)}) !important;
      color: rgb(${255 * darknessLevel}, ${255 * darknessLevel}, ${255 * darknessLevel}) !important;
    }
    * {
      background-color: inherit !important;
      color: inherit !important;
    }
    a {
      color: rgb(${200 * darknessLevel}, ${150 * darknessLevel}, 255) !important;
    }
    img, video {
      filter: brightness(${1 - darknessLevel * 0.5}) !important;
    }
  `;
  document.head.appendChild(darkModeStyle);
}

// Función para verificar si el sitio actual está excluido
function isSiteExcluded(currentSite, excludedSites) {
  return excludedSites.some((excludedSite) => currentSite.includes(excludedSite));
}
