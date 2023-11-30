"use strict";

import {
  ERROR_SERVER,
  PRODUCT_INFORMATION_NOT_FOUND,
} from "../js/constants.js";
import {
  showErrorMessage,
  checkingRelevanceValueBasket,
  getBasketLocalStorage,
  setBasketLocalStorage,
} from "./utils.js";

const wrapper = document.querySelector(".wrapper");

let productsData = [];

getProducts();

async function getProducts() {
  try {
    if (!productsData.length) {
      const res = await fetch("../data/products.json");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }

    loadProductDetails(productsData);
  } catch (err) {
    showErrorMessage(ERROR_SERVER);
    console.log(err.message);
  }
}

function getParameterFromURL(parameter) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

function loadProductDetails(data) {
  if (!data || !data.length) {
    showErrorMessage(ERROR_SERVER);
    return;
  }

  checkingRelevanceValueBasket(data);

  const productId = Number(getParameterFromURL("id"));

  if (!productId) {
    showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND);
    return;
  }

  const findProduct = data.find((card) => card.id === productId);

  if (!findProduct) {
    showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND);
    return;
  }

  renderInfoProduct(findProduct);

  document.querySelector(".card__add").onclick = function () {
    const isInBasket = !!getBasketLocalStorage().find((i) => i == productId);

    if (!isInBasket) {
      console.log(isInBasket, productId);
      const currentBasket = getBasketLocalStorage();
      currentBasket.push(String(productId));
      setBasketLocalStorage(currentBasket);
    }
  };
}

function renderInfoProduct(product) {
  const {
    id,
    img,
    title,
    oldPrice,
    price,
    subDescr,
    descr,
    name,
    age,
    review,
  } = product;

  const isInBasket = !!getBasketLocalStorage().find((i) => i == id);

  const buttonText = isInBasket ? "В корзине" : "AGREGAR";

  const productItem = `

        <div class="product" data-product-id="${id}" >
          <div class="product__img">
            <img src="./images/${img}" alt="${title}">
          </div>
          <div class="product__content">
            <div class="product__content-top">
              <div class="product__left">
                <h2 class="product__title">${title}</h3>
                <p class="product__descr">${subDescr}</p>
              </div>
              <div class="product__right">
                <div class="product__inner-price">
                  <div class="card__price--old">${oldPrice}MXN</div>
                  <div class="product__price">${price}MXN
                </div>
              </div>
            </div>
            </div>
            <div class="product__content-bottom">
              <span class="product__descr-title">descripción</span>
              <p class="product__descr">${descr}</p>
              <span class="product__descr-title">opiniones</span>
              <button class="option__btn btn-reset" data-target="#modal">escribir una opinión</button>
              <ul class="list-reset reviews__list">
                <li class="reviews__item">
                  <div class="reviews__title">
                    <span class="rewievs__name">${name},</span>
                    <span class="rewievs__age">${age} años</span>
                  </div>
                  <div class="reviews__content">
                    <p class="reiews__text">${review}</p>
                   </div>
                </li>
              </ul>
              <a href="basket.html" class="card__add btn-reset card__btn">${buttonText}</a>
            </div>
      
        `;
  wrapper.insertAdjacentHTML("beforeend", productItem);

  const btnModal = document.querySelector(".option__btn");
  const modal = document.querySelector(btnModal.dataset.target);

  btnModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  modal.querySelector(".modal-dialog").addEventListener("click", (event) => {
    event._isClickWithinModal = true;
    console.log("djn");
  });

  modal.addEventListener("click", (event) => {
    if (event._isClickWithinModal) return;
    modal.style.display = "none";
    console.log("11");
  });
}
