import { saveSettings, loadSettings } from "../storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleDarkMode = document.getElementById("toggle-dark-mode");
  let settings = {};

  // Cargar configuraciones iniciales
  loadSettings((data) => {
    settings = data;
    toggleDarkMode.checked = settings.darkModeEnabled;
  });

  // Actualizar configuración y notificar al background
  const updateSettingsAndNotify = () => {
    saveSettings(settings);
    notifyBackgroundScript();
  };

  // Activar/desactivar modo oscuro
  toggleDarkMode.addEventListener("change", () => {
    settings.darkModeEnabled = toggleDarkMode.checked;
    updateSettingsAndNotify();
  });

  // Notificar al script de fondo sobre cambios
  function notifyBackgroundScript() {
    chrome.runtime.sendMessage(
      { action: "updateSettings", settings: settings },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error al enviar mensaje al script de fondo:", chrome.runtime.lastError.message);
        } else if (response && response.success) {
          console.log("Configuración enviada correctamente.");
        } else {
          console.warn("Respuesta inesperada del script de fondo.");
        }
      }
    );
  }
});
