// Guardar configuración en el almacenamiento de Chrome
export function saveSettings(settings) {
    chrome.storage.sync.set(settings, () => {
      console.log("Configuración guardada:", settings);
    });
  }
  
  // Cargar configuración desde el almacenamiento
  export function loadSettings(callback) {
    chrome.storage.sync.get(["darkModeEnabled", "darknessLevel", "excludedSites"], (data) => {
      callback({
        darkModeEnabled: data.darkModeEnabled ?? true,
        darknessLevel: data.darknessLevel ?? 0.7,
        excludedSites: data.excludedSites ?? []
      });
    });
  }
  