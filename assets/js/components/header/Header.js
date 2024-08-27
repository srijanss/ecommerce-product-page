import css from "./Header.css?inline";
import Logo from "../../../images/logo.svg";
import CartIcon from "../../../images/icon-cart.svg";
import Avatar from "../../../images/image-avatar.png";

export default class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
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
        <button id="cart-icon" aria-label="Cart">
          <img
            src="${CartIcon}"
            alt="Cart"
            width="22"
            height="20"
          />
        </button>
        <figure id="avatar">
          <img src="${Avatar}" alt="" />
          <figcaption class="visually-hidden">Avatar</figcaption>
        </figure>
      </header>
     `;
  }
}
