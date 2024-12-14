import { saveSettings, loadSettings } from "../storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleDarkMode = document.getElementById("toggle-dark-mode");
  const darknessLevelInput = document.getElementById("darkness-level");
  const excludedSitesInput = document.getElementById("excluded-sites");
  const addSiteButton = document.getElementById("add-site");
  const excludedSitesList = document.getElementById("excluded-sites-list");

  let settings = {};

  loadSettings((data) => {
    settings = data;
    toggleDarkMode.checked = settings.darkModeEnabled;
    darknessLevelInput.value = settings.darknessLevel;
    renderExcludedSites();
  });

  // Actualizar configuraciones cuando el usuario cambie la opción
  toggleDarkMode.addEventListener("change", () => {
    settings.darkModeEnabled = toggleDarkMode.checked;
    saveSettings(settings);
  });

  darknessLevelInput.addEventListener("input", () => {
    settings.darknessLevel = parseFloat(darknessLevelInput.value);
    saveSettings(settings);
  });

  addSiteButton.addEventListener("click", () => {
    const site = excludedSitesInput.value.trim();
    if (site && !settings.excludedSites.includes(site)) {
      settings.excludedSites.push(site);
      saveSettings(settings);
      renderExcludedSites();
      excludedSitesInput.value = "";
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
      });
      li.appendChild(removeButton);
      excludedSitesList.appendChild(li);
    });
  }
});
