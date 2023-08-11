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
        document.getElementsByClassName("heads_up_class").textContent = data.welcome;
      })
      .catch(error => {
        console.error(`Error fetching translation: ${error}`);
      });
  });