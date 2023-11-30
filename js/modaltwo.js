const button = document.querySelector("[data-modal-button]");
const modalTwo = document.querySelector("[data-modal]");
const buttonClose = document.querySelector("[data-modal-close]");

button.addEventListener("click", function () {
  modalTwo.classList.remove("hidden");
});

buttonClose.addEventListener("click", function () {
  modalTwo.classList.add("hidden");
});

modalTwo.addEventListener("click", function () {
  modalTwo.classList.add("hidden");
});

modalTwo
  .querySelector(".modal-window")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });
