import css from "./ImageGallery.css?inline";
import PreviousIcon from "../../../images/icon-previous.svg";
import NextIcon from "../../../images/icon-next.svg";
import Store from "../../store.js";

export default class ImageGalleryComponent extends HTMLElement {
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
      <section>
        <button id="icon-previous">
          <img src="${PreviousIcon}" alt="Previous" />
        </button>
        ${this.product.product_images
          .map(
            (productImage) => `
            <figure>
              <img src="${productImage.main}" alt="" />
              <figcaption>${productImage.alt}</figcaption>
            </figure>
          `
          )
          .join("")}
        <button id="icon-next">
          <img src="${NextIcon}" alt="Next" />
        </button>
        ${this.product.product_images
          .map(
            (productImage, index) => `
            <button id="product-thumbnail-${index + 1}">
              <img
                src="${productImage.thumbnail}"
                alt="Product thumbnail ${index + 1}"
              />
            </button>
          `
          )
          .join("")}
      </section>
    `;
  }
}
