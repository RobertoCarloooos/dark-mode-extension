import { saveSettings, loadSettings } from "../storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleDarkMode = document.getElementById("toggle-dark-mode");
  const darknessLevelInput = document.getElementById("darkness-level");
  const excludedSitesInput = document.getElementById("excluded-sites");
  const addSiteButton = document.getElementById("add-site");
  const excludedSitesList = document.getElementById("excluded-sites-list");

  let settings = {};

  // Cargar configuraciones iniciales
  loadSettings((data) => {
    settings = data;
    toggleDarkMode.checked = settings.darkModeEnabled;
    darknessLevelInput.value = settings.darknessLevel;
    renderExcludedSites();
  });

  // Activar/desactivar modo oscuro
  toggleDarkMode.addEventListener("change", () => {
    settings.darkModeEnabled = toggleDarkMode.checked;
    saveSettings(settings);
    notifyBackgroundScript();
  });

  // Ajustar nivel de oscuridad
  darknessLevelInput.addEventListener("input", () => {
    settings.darknessLevel = parseFloat(darknessLevelInput.value);
    saveSettings(settings);
    notifyBackgroundScript();
  });

  // Agregar un sitio a la lista de excluidos
  addSiteButton.addEventListener("click", () => {
    const site = excludedSitesInput.value.trim();
    if (site && !settings.excludedSites.includes(site)) {
      settings.excludedSites.push(site);
      saveSettings(settings);
      renderExcludedSites();
      excludedSitesInput.value = "";
      notifyBackgroundScript();
    }
  });

  // Mostrar la lista de sitios excluidos
  function renderExcludedSites() {
    excludedSitesList.innerHTML = "";
    settings.excludedSites.forEach((site, index) => {
      const li = document.createElement("li");
      li.textContent = site;

      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.addEventListener("click", () => {
        settings.excludedSites.splice(index, 1);
        saveSettings(settings);
        renderExcludedSites();
        notifyBackgroundScript();
      });

      li.appendChild(removeButton);
      excludedSitesList.appendChild(li);
    });
  }

  // Notificar al script de fondo sobre cambios
  function notifyBackgroundScript() {
    chrome.runtime.sendMessage({
      action: "updateSettings",
      settings: settings,
    });
  }
});
