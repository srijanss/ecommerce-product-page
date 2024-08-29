import css from "./ImageGallery.css?inline";
import Store from "../../store.js";

export default class ImageGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.product = Store.product;
    this.productImagePosition = 1;
    this.transitionDuration = 300;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.productImageContainer = this.shadow.getElementById(
      "product-image-container"
    );
    this.renderProductImageListForInfinityScroll();
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
                <figure data-productid="${index}" class="product-image-btn">
                  <img src="${productImage.main}" alt="" />
                  <figcaption>${productImage.alt}</figcaption>
                </figure>
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

  renderProductImageListForInfinityScroll() {
    const productImageBtns = this.productImageContainer.children;
    this.productImageContainer.appendChild(productImageBtns[0].cloneNode(true));
    this.productImageContainer.prepend(
      productImageBtns[productImageBtns.length - 2].cloneNode(true)
    );
  }

  slideProductImage(slider, index, disableTransition) {
    if (disableTransition) {
      slider.setAttribute(
        "style",
        `--translate-x: ${index}; --transition: none`
      );
    } else {
      slider.setAttribute("style", `--translate-x: ${index}`);
    }
  }

  handlePreviousBtnClick() {
    this.productImagePosition -= 1;
    this.slideProductImage(
      this.productImageContainer,
      this.productImagePosition
    );
    if (this.productImagePosition === 0) {
      setTimeout(() => {
        this.productImagePosition =
          this.productImageContainer.children.length - 2;
        this.slideProductImage(
          this.productImageContainer,
          this.productImagePosition,
          true
        );
      }, this.transitionDuration);
    }
  }

  handleNextBtnClick() {
    this.productImagePosition += 1;
    this.slideProductImage(
      this.productImageContainer,
      this.productImagePosition
    );
    if (
      this.productImagePosition ===
      this.productImageContainer.children.length - 1
    ) {
      setTimeout(() => {
        this.productImagePosition = 1;
        this.slideProductImage(
          this.productImageContainer,
          this.productImagePosition,
          true
        );
      }, this.transitionDuration);
    }
  }

  handleEvents() {
    const previousBtn = this.shadow.getElementById("previous-btn");
    previousBtn.addEventListener("click", (e) => {
      this.handlePreviousBtnClick();
    });
    previousBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handlePreviousBtnClick();
      }
    });

    const nextBtn = this.shadow.getElementById("next-btn");
    nextBtn.addEventListener("click", (e) => {
      this.handleNextBtnClick();
    });
    nextBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleNextBtnClick();
      }
    });
  }
}
