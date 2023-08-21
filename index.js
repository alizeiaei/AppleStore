const cartButton = document.querySelector(".fa-cart-plus");
const cartItem = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const clearCart = document.querySelector(".clear-cart");
const confirm = document.querySelector(".confirm");
const container = document.querySelector(".container");
const totalCart = document.querySelector(".total-cart");
const cartItems = document.querySelector(".number-products");
const cartContent = document.querySelector(".cartContent");

import { productsData } from "./products.js";

//------------classes-----------

let cart = [];
let buttonsDom = [];

class products {
  getProducts() {
    return productsData;
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
      <div class="product">
          <img src="${item.imageUrl}" alt="..." />
          <div class="price">
            <h3>${item.price}.00$</h3>
            <h3>${item.title}</h3>
          </div>
          <button class="add-to-cart" data-id = "${item.id}">add to cart</button>
        </div>`;
      container.innerHTML = result;
    });
  }
  getAddToCart() {
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = addToCartBtn;
    addToCartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        const addProducts = { ...storage.getproductid(id), quantity: 1 };
        cart = [...cart, addProducts];
        storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartProduct(addProducts);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    totalCart.innerText = `total price : ${totalPrice.toFixed(2)}$`;
    cartItems.innerText = tempCartItem;
  }
  addCartProduct(cartItem) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
    <img src="${cartItem.imageUrl}" alt="" />
          <div class="price">
            <h5>${cartItem.title}</h5>
            <h5>${cartItem.price}.00$</h5>
          </div>
          <div class="amount-order-cart">
            <i class="fa-solid fa-chevron-up" data-id = ${cartItem.id}></i>
            <span  class="cart-items">${cartItem.quantity}</span>
            <i class="fa-solid fa-chevron-down" data-id = ${cartItem.id}></i>
          </div>
          <div class="trash">
            <i class="fa-solid fa-trash-can" data-id = ${cartItem.id}></i>
          </div>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    cart = storage.getCart();

    cart.forEach((cartItem) => this.addCartProduct(cartItem));
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;
        const addItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addItem.quantity++;
        this.setCartValue(cart);
        storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addItem.quantity;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        substractedItem.quantity--;
        if (substractedItem.quantity === 0) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        this.setCartValue(cart);
        storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-can")) {
        const _removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == _removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        storage.saveCart(cart);
        cartContent.removeChild(_removeItem.parentElement.parentElement);
      }
    });
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setCartValue(cart);
    storage.saveCart(cart);
    this.getSingleBtn(id);
  }
  getSingleBtn(id) {
    const button = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to Cart";
    button.disabled = false;
  }
}

class storage {
  static saveProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products));
  }
  static getproductid(id) {
    const _products = JSON.parse(localStorage.getItem("Products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
//------addEventListeners-----

document.addEventListener("DOMContentLoaded", () => {
  const product = new products();
  const productData = product.getProducts();
  const ui = new UI();
  ui.setUpApp();
  ui.displayProducts(productData);
  ui.getAddToCart();
  ui.cartLogic();
  storage.saveProducts(productData);
});

cartButton.addEventListener("click", carShow);
confirm.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);

//---------functions-----------

function carShow() {
  cartItem.style.top = "10rem";
  backDrop.style.display = "block";
}

function closeModalFunction() {
  cartItem.style.top = "-1000rem";
  backDrop.style.display = "none";
}
