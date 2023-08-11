document.addEventListener("DOMContentLoaded", function() {
    const language = navigator.language.split("-")[0]; // Get the language code
    
    fetch(`translations/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Translation file not found for language: ${language}`);
        }
        return response.json();
      })
      .then(data => {
        document.getElementById("welcome-text").textContent = data.welcome;
        document.getElementById("about-link").textContent = data.about;
        document.getElementById("team-link").textContent = data.team;
        document.getElementById("contact-link").textContent = data.contact;
      })
      .catch(error => {
        console.error(`Error fetching translation: ${error}`);
      });
  });