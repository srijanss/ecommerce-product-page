import css from "./Cart.css?inline";
import DeleteIcon from "../../../images/icon-delete.svg";

export default class CartComponent extends HTMLElement {
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
      <article>
        <h2>Cart</h2>
        <hr />
        <p>Your cart is empty.</p>
        <div>
          <figure>
            <img src="" alt="" />
            <figcaption>Product added to cart</figcaption>
          </figure>
          <h3>Fall limited Edition Sneakers</h3>
          <span>$125.00</span> x <span>3</span> <span>$375.00</span>
        </div>
        <button id="delete-icon">
          <img src="${DeleteIcon}" alt="Delete cart item" />
        </button>
        <button id="checkout">Checkout</button>
      </article>
    `;
  }
}
