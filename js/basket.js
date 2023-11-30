"use strict";

import { ERROR_SERVER, NO_ITEMS_CART } from "../js/constants.js";
import {
  showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  // checkingRelevanceValueBasket,
} from "./utils.js";

const cart = document.querySelector(".cart-container");
const formWrapperBasket = document.querySelector(".form__container");
const productWrapperBasket = document.querySelector(
  ".product__container-basket"
);
let productsData = [];

getProducts();

if (cart) {
  cart.addEventListener("click", deleteProductBasket);
}

// Получение товаров
async function getProducts() {
  try {
    if (!productsData.length) {
      const res = await fetch("../data/products.json");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }

    loadProductBasket(productsData);
  } catch (err) {
    showErrorMessage(ERROR_SERVER);
    console.log(err.message);
  }
}

export function loadProductBasket(data) {
  console.log("2.1", data);
  if (!cart) {
    return;
  }
  cart.textContent = "";
  if (!data || !data.length) {
    showErrorMessage(ERROR_SERVER);
    return;
  }

  // checkingRelevanceValueBasket(data);
  const basket = getBasketLocalStorage();

  if (basket.length > 0) {
    formWrapperBasket.setAttribute("style", "display: block");
  } else {
    formWrapperBasket.setAttribute("style", "display: none");
  }
  console.log(basket);

  if (!basket || !basket.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }

  const findProducts = data.filter((item) => basket.includes(String(item.id)));
  if (!findProducts.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }

  renderProductsBasket(findProducts);
}

// Удаление товаров из корзины
function deleteProductBasket(event) {
  const targetButton = event.target.closest(".close");

  if (!targetButton) return;

  const card = targetButton.closest(".product__container-basket");
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  const newBasket = basket.filter((item) => item !== id);
  setBasketLocalStorage(newBasket);

  getProducts();
}

// Рендер товаров в корзине
function renderProductsBasket(arr) {
  arr.forEach((card) => {
    const { id, img, title, price, subDescr } = card;

    const cardItem = `
    <div class="product__container-basket" data-product-id="${id}" >
    <div class="product__img product__img-basket">
      <img src="./images/${img}" alt="${title}">
    </div>
    <div class="product__content product__content-basket">
      <div class="product__content-top top-basket">
        <div class="product__left product__left-basket">
          <h2 class="product__title product__title-basket">${title}</h3>
          <p class="product__descr product__descr-basket">${subDescr}</p>
        </div>
        <div class="product__right">
          <div class="product__inner-price">
            <div class="product__price product__price-basket">${price} MXN
            <div class="cart__block-btns">
                <div class="counter__minus btn-counter" data-action="minus">-</div>
                <div class="counter__value input-counter" data-counter >1</div>
                <div class="counter__plus btn-counter" data-action="plus">+</div>
            </div>
          </div>
        </div>
      </div>
    <div class="close">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
            <path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z"></path>
        </svg>
      </div>
      </div>
        `;

    cart.insertAdjacentHTML("beforeend", cardItem);
  });

  // Счетчик
  window.addEventListener("click", (e) => {
    if (e.target.dataset.action === "plus") {
      const counterWrapper = e.target.closest(".cart__block-btns");
      const counter = counterWrapper.querySelector("[data-counter]");
      counter.innerText = ++counter.innerText;

      // console.log(counter);
    }
    if (e.target.dataset.action === "minus") {
      const counterWrapper = e.target.closest(".cart__block-btns");
      const counter = counterWrapper.querySelector("[data-counter]");
      if (parseInt(counter.innerText) > 1)
        counter.innerText = --counter.innerText;

      // console.log(counter);
    }
  });
}
