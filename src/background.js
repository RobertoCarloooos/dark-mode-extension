console.log('background.js cargado');

// Configuración inicial al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensión instalada.');
  chrome.storage.sync.set({ 
    darkModeEnabled: true, 
    darknessLevel: 0.7, 
    excludedSites: [] 
  }, () => {
    console.log("Configuraciones predeterminadas establecidas.");
  });
});

// Escuchar mensajes desde el popup para activar o desactivar el modo oscuro
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleDarkMode') {
    console.log(`Modo oscuro ${message.enabled ? 'activado' : 'desactivado'}`);
    applyDarkModeToTabs(message.enabled, message.excludedSites);
  }

  if (message.action === 'updateSettings') {
    console.log('Configuraciones actualizadas:', message.settings);
    applyDarkModeToTabs(message.settings.darkModeEnabled, message.settings.excludedSites);
  }
});

// Función para aplicar o remover el modo oscuro en todas las pestañas
function applyDarkModeToTabs(enabled, excludedSites) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const hostname = new URL(tab.url).hostname;

      // Verifica si la URL no es de una página interna de Chrome (chrome:// o about://)
      if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('about://')) {
        if (!excludedSites.includes(hostname)) {
          if (enabled) {
            // Inyectar CSS de modo oscuro
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              files: ['public/dark-mode.css']
            }, () => {
              console.log(`Modo oscuro activado en la página: ${tab.url}`);
            });
          } else {
            // Eliminar CSS de modo oscuro
            chrome.scripting.removeCSS({
              target: { tabId: tab.id },
              files: ['public/dark-mode.css']
            }, () => {
              console.log(`Modo oscuro desactivado en la página: ${tab.url}`);
            });
          }
        } else {
          console.log(`Página excluida: ${hostname}`);
        }
      } else {
        console.log(`No se puede aplicar el modo oscuro en la página: ${tab.url}`);
      }
    });
  });
}
