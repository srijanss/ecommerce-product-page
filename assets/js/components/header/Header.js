import css from "./Header.css?inline";
import Logo from "../../../images/logo.svg";
import Avatar from "../../../images/image-avatar.png";
import Store from "../../store";

export default class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.cart = Store.cart;
    this.cartQuantity = Store.getCartQuantity();
    Store.subscribe(this);
    this.cartComponentVisible = false;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleEvents();
  }

  renderCartIcon() {
    return `
        <button id="cart-icon" class="${
          this.cartQuantity > 0 ? "active" : ""
        }" data-quantity="${
      this.cartQuantity
    }" aria-label="Cart" aria-describedby="cart-quantity-message" aria-expanded="false" aria-controls="cart-popup" aria-haspopup="dialog">
          <span id="cart-quantity-message" class="visually-hidden">Cart quantity ${
            this.cartQuantity
          }</span>
          <svg width="22" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="image" aria-labelledby="cart-icon-title" focusable="false">
            <title id="cart-icon-title">Cart</title>
            <path d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z" fill="#69707D" fill-rule="nonzero"/>
          </svg>
        </button>
    `;
  }

  reRenderCartIcon() {
    this.cartIcon.outerHTML = this.renderCartIcon();
    this.handleEvents();
  }

  update(cart) {
    this.cart = cart;
    this.cartQuantity = Store.getCartQuantity();
    if (this.shadow) {
      this.reRenderCartIcon();
    }
    this.cartComponentVisible = false;
    setTimeout(() => {
      if (this.cartQuantity === 0) {
        this.cartComponent.showModal();
        this.cartComponentVisible = true;
      }
    }, 1);
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <header>
        <img
          id="logo"
          src="${Logo}"
          alt="Sneakers Logo"
          width="138"
          height="20"
        />
        <nav-bar></nav-bar>
        <div id="empty-space"></div>
        <div id="cart-wrapper">
          ${this.renderCartIcon()}
          <cart-component></cart-component>
        </div>
        <figure id="avatar">
          <img src="${Avatar}" alt="" />
          <figcaption class="visually-hidden">Avatar</figcaption>
        </figure>
      </header>
     `;
  }

  renderCartComponent() {
    this.cartComponent.showModal();
  }

  hideCartComponent() {
    this.cartComponent.hideModal();
  }

  updateCartStatus(status) {
    if (status === Store.CART_STATUS.CLOSED) {
      this.cartComponentVisible = false;
      this.cartIcon.setAttribute("aria-expanded", "false");
      this.cartIcon.focus();
    } else {
      this.cartComponentVisible = true;
      this.cartIcon.setAttribute("aria-expanded", "true");
    }
  }

  handleEvents() {
    this.cartComponent = this.shadow.querySelector("cart-component");
    this.cartIcon = this.shadow.querySelector("#cart-icon");
    this.cartIcon.addEventListener("click", (e) => {
      if (!this.cartComponentVisible) {
        this.renderCartComponent();
      } else {
        this.hideCartComponent();
      }
    });
    this.cartIcon.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!this.cartComponentVisible) {
          this.renderCartComponent();
        } else {
          this.hideCartComponent();
        }
      }
    });
  }
}
