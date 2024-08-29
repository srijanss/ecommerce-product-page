import css from "./ImageGallery.css?inline";
import Store from "../../store.js";

export default class ImageGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.product = Store.product;
    this.productImagePosition = 0;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handleEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <article id="image-gallery" aria-label="Product image gallery">
        <section id="product-image-list" aria-label="Product images">
          <button id="previous-btn" aria-label="Previous">
            <svg width="12" height="18" viewBox="0 0 12 18" xmlns="http://www.w3.org/2000/svg" aria-lablledby="previous-svg-icon" focusable="false" aria-hidden="true">
              <title id="previous-svg-icon">Previous</title>
              <path d="M11 1 3 9l8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
          </button>
          <div id="product-image-container">
            ${this.product.product_images
              .map(
                (productImage, index) => `
                <button data-productid="${index}" class="product-image-btn">
                  <img src="${productImage.main}" alt="${productImage.alt}" />
                </button>
              `
              )
              .join("")}
          </div>
          <button id="next-btn" aria-label="Next">
            <svg width="13" height="18" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg" aria-labelledby="next-svg-icon" aria-hidden="true" focusable="false">
              <title id="next-svg-icon">Next</title>
              <path d="m2 1 8 8-8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
          </button>
        </section>
        <section id="product-thumbnail-list" aria-label="Product thumbnails">
          ${this.product.product_images
            .map(
              (productImage, index) => `
              <button data-productid="${index}" class="product-thumbnail-btn">
                <img
                  src="${productImage.thumbnail}"
                  alt="${productImage.alt}"
                />
              </button>
            `
            )
            .join("")}
        </section>
      </article>
    `;
  }

  handleEvents() {
    const productImageContainer = this.shadow.getElementById(
      "product-image-container"
    );
    const previousBtn = this.shadow.getElementById("previous-btn");
    previousBtn.addEventListener("click", (e) => {
      if (this.productImagePosition === 0) {
        this.productImagePosition = 0;
      } else {
        this.productImagePosition -= 1;
      }
      console.log(this.productImagePosition);
      productImageContainer.setAttribute(
        "style",
        `--translate-x: ${this.productImagePosition}`
      );
    });

    const nextBtn = this.shadow.getElementById("next-btn");
    nextBtn.addEventListener("click", (e) => {
      if (this.productImagePosition === 3) {
        this.productImagePosition = 3;
      } else {
        this.productImagePosition += 1;
      }
      console.log(this.productImagePosition);
      productImageContainer.setAttribute(
        "style",
        `--translate-x: ${this.productImagePosition}`
      );
    });
  }
}
