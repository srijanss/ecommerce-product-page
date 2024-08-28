import css from "./Cart.css?inline";
import DeleteIcon from "../../../images/icon-delete.svg";
import Store from "../../store";

export default class CartComponent extends HTMLElement {
  constructor() {
    super();
    this.cart = Store.cart;
    Store.subscribe(this);
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    // this.render();
  }

  update(cart) {
    this.cart = cart;
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <article id="cart-popup" role="dialog" aria-modal="true" aria-labelledby="cart-heading" tabindex="-1">
        <h2 id="cart-heading">Cart</h2>
        <hr aria-hidden="true"/>
        ${
          this.cart.length === 0
            ? this.renderEmptyCart()
            : this.renderCartItems()
        }
      </article>
    `;
    setTimeout(() => {
      this.dialog = this.shadow.querySelector("#cart-popup");
      this.dialog.focus();
      this.focusableElements = this.dialog.querySelectorAll("a, button");
      Array.from(this.focusableElements).forEach((element) => {
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-hidden", "false");
      });
      this.handleEvents();
    }, 1);
  }

  showModal(hideCallback) {
    this.hideCallback = hideCallback;
    this.render();
  }

  hideModal() {
    this.shadow.innerHTML = "";
  }

  renderEmptyCart() {
    return `
      <section id="cart-empty" aria-labelledby="cart-empty-message" tabindex="0">
        <p id="cart-empty-message" >Your cart is empty.</p>
      </section>
    `;
  }

  renderCartItems() {
    return `
      <section id="cart-with-items" aria-labelledby="product-name" aria-describedby="product-price quantity subtotal">
        ${this.cart.map((product) => this.renderEachCartItem(product)).join("")}
      </section>
      <a href="#" id="checkout-btn" >Checkout</a>
    `;
  }

  renderEachCartItem(product) {
    return `
      <figure>
        <img src="${product.product_images[0].thumbnail}" alt="" />
        <figcaption class="visually-hidden">${
          product.product_images[0].alt
        }</figcaption>
      </figure>
      <h3 id="product-name">${product.name}</h3>
      <p>
        <span id="product-price" aria-label="Product Price $${product.current_price.toFixed(
          2
        )}">$${product.current_price.toFixed(
      2
    )}</span><span id="quantity" aria-label="Quantity ${product.quantity}"> x ${
      product.quantity
    }</span> &nbsp;<span id="subtotal" aria-label="Subtotal $${product.subtotal.toFixed(
      2
    )}">$${product.subtotal.toFixed(2)}</span>
      </p>
      <button id="delete-icon" data-productid="${
        product.id
      }" aria-label="Delete Item">
        <img src="${DeleteIcon}" alt="Delete cart item" width="14" height="16"/>
      </button>
    `;
  }

  handleEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideCallback();
      }
    });

    Array.from(this.focusableElements).forEach((element) => {
      element.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.currentTarget === this.focusableElements[1]) {
            e.preventDefault();
            this.focusableElements[0].focus();
          }
        }
      });
    });

    const cartEmptyRegion = this.shadow.querySelector("#cart-empty");
    if (cartEmptyRegion) {
      cartEmptyRegion.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          this.hideCallback();
        }
      });
    }

    const deleteButtons = this.shadow.querySelectorAll("#delete-icon");
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.currentTarget.getAttribute("data-productid");
        Store.removeFromCart(Number(productId));
      });
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const productId = e.currentTarget.getAttribute("data-productid");
          Store.removeFromCart(Number(productId));
        }
      });
    });
  }
}
