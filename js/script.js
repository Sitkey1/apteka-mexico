"use strict";

import {
  showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  // checkingRelevanceValueBasket,
} from "./utils.js";

import {
  COUNT_SHOW_CARDS_CLICK,
  ERROR_SERVER,
  NO_PRODUCTS_IN_THIS_CATEGORY,
  PAGE,
} from "../js/constants.js";

const cards = document.querySelector(".cards");
const btnShowCards = document.querySelector(".show-cards");
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];

// Текущая длина массива корзины (счетчик)
document.querySelector(".basket__count").textContent =
  getBasketLocalStorage().length;

// Загрузка товаров
if (cards) {
  getProducts();
}

//Загрузка товаров по кнопке "Показать еще"
if (btnShowCards) {
  btnShowCards.addEventListener("click", sliceArrCards);
}

// Обработка клика по кнопке "В корзину"
if (cards) cards.addEventListener("click", handleCardClick);

const filterCards = (type) => {
  return productsData.filter((item) => item.type === type);
};

// Получение товаров
async function getProducts() {
  try {
    if (!productsData.length) {
      const res = await fetch("../data/products.json");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();

      switch (window.location.pathname) {
        case PAGE.HIPERTENSION:
          productsData = filterCards("hipertension");
          break;
        case PAGE.SALUD:
          productsData = filterCards("salud");
          break;
        case PAGE.ADELGAZAR:
          productsData = filterCards("adelgazar");
          break;
        default:
          break;
      }

      // const filterList = productsData.filter((el) => {
      //   if (el.type === "hipertension") {
      //     return el;
      //   }
      // });

      // console.log(filterList);
      console.log(productsData);

      // productsData = [...filterList];
    }

    if (
      productsData.length > COUNT_SHOW_CARDS_CLICK &&
      btnShowCards.classList.contains("none")
    ) {
      btnShowCards.classList.remove("none");
    }

    renderStratPage(productsData);
  } catch (error) {
    showErrorMessage(ERROR_SERVER);
    console.log(error.message);
  }
}

function renderStratPage(data) {
  if (!data.length) {
    showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
    return;
  }
  const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
  createCards(arrCards);

  // checkingRelevanceValueBasket(data);

  const basket = getBasketLocalStorage();
  checkingActiveButtons(basket);
}

function sliceArrCards() {
  if (shownCards >= productsData.length) return;

  countClickBtnShowCards++;
  const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;

  const arrCards = productsData.slice(shownCards, countShowCards);
  createCards(arrCards);
  checkingActiveButtons(getBasketLocalStorage());
  shownCards = cards.children.length;
  if (shownCards >= productsData.length) {
    btnShowCards.classList.add("none");
  }
}

function handleCardClick(event) {
  const targetButton = event.target.closest(".card__add");

  if (!targetButton) return;

  const card = targetButton.closest(".card");
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  if (basket.includes(id)) return;

  basket.push(id);
  setBasketLocalStorage(basket);
  checkingActiveButtons(basket);
}

function checkingActiveButtons(basket) {
  const buttons = document.querySelectorAll(".card__add");

  buttons.forEach((btn) => {
    const card = btn.closest(".card");
    const id = card.dataset.productId;
    const isInBasket = basket.includes(id);

    btn.disabled = isInBasket;
    btn.classList.toggle("active", isInBasket);
    // console.log("id", card, id);
    btn.textContent = isInBasket ? "В корзине" : "AGREGAR";
  });
}

// Рендер карточки
function createCards(data) {
  data.forEach((card) => {
    const { id, img, title, subDescr, oldPrice, price } = card;

    const cardItem = `
              <div class="card" data-product-id="${id}">
                  <div class="card__top">
                      <a href="/card.html?id=${id}" class="card__image">
                          <img
                              src="./images/${img}"
                              alt="${title}"
                          />
                      </a>
                     
                  </div>
                  <div class="card__bottom">
                      
                      <a href="/card.html?id=${id}" class="card__title">${title}</a>
                      <p class="card__subdescr">${subDescr}</p>
                      <div class="card__prices">
                          <div class="card__price--old">${oldPrice}</div>
                          <div class="card__price card__price--common">${price}</div>
                      </div>
                      <button class="card__add btn-reset">AGREGAR</button>
                  </div>
              </div>
          `;
    cards.insertAdjacentHTML("beforeend", cardItem);
  });
}

// slider
const heroSwiper = document.querySelector(".hero__swiper");
const ofertasSwiper = document.querySelector(".ofertas__swiper");
const specialSwiper = document.querySelector(".special__swiper");

if (heroSwiper) {
  const heroSlider = new Swiper(heroSwiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 3000,
    },

    navigation: {
      nextEl: ".hero__next",
      prevEl: ".hero__prev",
    },
  });
}

if (ofertasSwiper) {
  const ofertasSlider = new Swiper(ofertasSwiper, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 2000,
    },

    // navigation: {
    //   nextEl: ".hero__next",
    //   prevEl: ".hero__prev",
    // },
  });
}

if (specialSwiper) {
  const speciaSlider = new Swiper(specialSwiper, {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 3000,
    },

    navigation: {
      nextEl: ".special__next",
      prevEl: ".special__prev",
    },
  });
}
