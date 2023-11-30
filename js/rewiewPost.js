document.addEventListener("DOMContentLoaded", () => {
  // Отправка в Google таблицу

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzqbpQ09grzCFmAX5wCqrf-g2HHJLo8XsyNk4QwZXkyiNRhGCZMZYO8D6G5nLGKCdXwiQ/exec";
  const form = document.forms["submit-to-google-sheet"];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  });
});
