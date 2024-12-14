// Este archivo manejará la lógica global, como la configuración del modo oscuro.

chrome.runtime.onInstalled.addListener(() => {
    // Establecer configuraciones predeterminadas al instalar la extensión
    chrome.storage.sync.set({ 
      darkModeEnabled: true, 
      darknessLevel: 0.7, 
      excludedSites: [] 
    });
  });
  