// Guardar configuración en el almacenamiento de Chrome
export function saveSettings(settings) {
  try {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error("Error al guardar la configuración:", chrome.runtime.lastError.message);
      } else {
        console.log("Configuración guardada:", settings);
      }
    });
  } catch (error) {
    console.error("Excepción al guardar configuración:", error);
  }
}

// Cargar configuración desde el almacenamiento
export function loadSettings(callback) {
  try {
    chrome.storage.sync.get(["darkModeEnabled", "excludedSites"], (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error al cargar la configuración:", chrome.runtime.lastError.message);
        callback({
          darkModeEnabled: true, // Valor predeterminado
          excludedSites: []     // Valor predeterminado
        });
      } else {
        callback({
          darkModeEnabled: data.darkModeEnabled ?? true,
          excludedSites: data.excludedSites ?? []
        });
      }
    });
  } catch (error) {
    console.error("Excepción al cargar configuración:", error);
    callback({
      darkModeEnabled: true,
      excludedSites: []
    });
  }
}
