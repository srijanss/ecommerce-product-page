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
        <nav-bar></nav-bar>
        <img
          src="${Logo}"
          alt="Sneakers Logo"
          width="138"
          height="20"
        />
        <button id="cart-icon">
          <img
            src="${CartIcon}"
            alt="Cart"
            width="22"
            height="20"
          />
        </button>
        <figure>
          <img src="${Avatar}" alt="" />
          <figcaption>Avatar</figcaption>
        </figure>
        <hr />
      </header>
     `;
  }
}
