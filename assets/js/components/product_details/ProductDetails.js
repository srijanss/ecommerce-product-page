import css from "./ProductDetails.css?inline";
import Store from "../../store.js";

export default class ProductDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this.product = Store.product;
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
        <span>${this.product.brand}</span>
        <h1>${this.product.name}</h1>
        <p>${this.product.description}</p>
        <ins>$${this.product.current_price}</ins>
        <span>${this.product.discount}%</span>
        <del>$${this.product.previous_price}</del>
        <form action="post" id="add-to-cart" novalidate>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="10"
            value="0"
            aria-label="Quantity"
            required
          />
          <button type="submit">Add to cart</button>
        </form>
      </article>
    `;
  }
}
