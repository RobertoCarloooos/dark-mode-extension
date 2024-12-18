chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSettings") {
    const settings = message.settings;

    // Guardar configuración en chrome.storage.sync
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error("Error al guardar configuración en background:", chrome.runtime.lastError.message);
        sendResponse({ success: false });
      } else {
        console.log("Configuración guardada en el script de fondo:", settings);

        // Llamar a la función de aplicar modo oscuro
        applyDarkModeToTabs(settings.darkModeEnabled);
        sendResponse({ success: true });
      }
    });

    return true; // Retorno necesario para la comunicación asincrónica
  }
});

function applyDarkModeToTabs(enabled) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      // Excluir páginas como 'chrome://', 'about://'
      if (
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('about://')
      ) {
        // Aplicar o desactivar el modo oscuro
        if (enabled) {
          chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['public/dark-mode.css']
          }, () => {
            console.log(`Modo oscuro activado en la página: ${tab.url}`);
          });
        } else {
          chrome.scripting.removeCSS({
            target: { tabId: tab.id },
            files: ['public/dark-mode.css']
          }, () => {
            console.log(`Modo oscuro desactivado en la página: ${tab.url}`);
          });
        }
      } else {
        console.log(`Página excluida: ${tab.url}`);
      }
    });
  });
}
