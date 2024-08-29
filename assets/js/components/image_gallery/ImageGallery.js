import css from "./ImageGallery.css?inline";
import Store from "../../store.js";

export default class ImageGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.product = Store.product;
    this.productImageCurrentIndex = 1;
    this.productImageOldIndex = 1;
    this.transitionDuration = 300;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.productImageContainer = this.shadow.getElementById(
      "product-image-container"
    );
    this.renderProductImageListForInfinityScroll();
    this.setProductImageButtonAttributes();
    // this.renderLightbox();
    this.handleEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <article id="image-gallery" class="image-gallery" aria-label="Product image gallery">
        <section id="product-image-list" class="product-image-list" aria-label="Product images">
          <button id="previous-btn" class="previous-btn"  aria-label="Previous">
            <svg width="12" height="18" viewBox="0 0 12 18" xmlns="http://www.w3.org/2000/svg" aria-lablledby="previous-svg-icon" focusable="false" aria-hidden="true">
              <title id="previous-svg-icon" >Previous</title>
              <path d="M11 1 3 9l8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
          </button>
          <div id="product-image-container" class="product-image-container">
            ${this.product.product_images
              .map(
                (productImage, index) => `
                <figure data-productid="${index}" class="product-image-btn" aria-labelledby="product-image-label-${index}">
                  <img src="${productImage.main}" alt="" />
                  <figcaption id="product-image-label-${index}">${productImage.alt}</figcaption>
                </figure>
              `
              )
              .join("")}
          </div>
          <button id="next-btn" class="next-btn" aria-label="Next">
            <svg width="13" height="18" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg" aria-labelledby="next-svg-icon" aria-hidden="true" focusable="false">
              <title id="next-svg-icon">Next</title>
              <path d="m2 1 8 8-8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
          </button>
        </section>
        <section id="product-thumbnail-list" class="product-thumbnail-list"  aria-label="Product thumbnails">
          ${this.product.product_images
            .map(
              (productImage, index) => `
              <button data-productid="${index}" class="product-thumbnail-btn ${
                index === 0 ? "active" : ""
              }">
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
      <article id="lightbox" class="lightbox" aria-label="Product image lightbox">
        <div id="lightbox-content">
          <button id="close-btn" aria-label="Close">
            <svg width="14" height="15" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg" aria-labelledby="close-svg-icon" aria-hidden="true" focusable="false">
              <title id="close-svg-icon">Close</title>
              <path d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z" fill="#69707D" fill-rule="evenodd"/>
            </svg>
          </button>
        </div>
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

  setProductImageButtonAttributes() {
    const thumbnailContainer = this.shadow.getElementById(
      "product-thumbnail-list"
    );
    if (
      getComputedStyle(thumbnailContainer).getPropertyValue("display") !==
      "none"
    ) {
      this.enableProductImageButtonEvents();
    }
    const productImageButtons = this.shadow.querySelectorAll(
      "#product-image-container figure"
    );
    Array.from(productImageButtons).forEach((productImageButton) => {
      productImageButton.setAttribute("role", "button");
      productImageButton.setAttribute("tabindex", "-1");
      productImageButton.addEventListener("click", (e) => {
        console.log(e);
        this.renderLightbox();
      });
    });
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

  handlePreviousBtnClick(slider) {
    this.productImageCurrentIndex -= 1;
    this.slideProductImage(slider, this.productImageCurrentIndex);
    if (this.productImageCurrentIndex === 0) {
      setTimeout(() => {
        this.productImageCurrentIndex = slider.children.length - 2;
        this.slideProductImage(slider, this.productImageCurrentIndex, true);
      }, this.transitionDuration);
    }
  }

  handleNextBtnClick(slider) {
    this.productImageCurrentIndex += 1;
    this.slideProductImage(slider, this.productImageCurrentIndex);
    if (this.productImageCurrentIndex === slider.children.length - 1) {
      setTimeout(() => {
        this.productImageCurrentIndex = 1;
        this.slideProductImage(slider, this.productImageCurrentIndex, true);
      }, this.transitionDuration);
    }
  }

  handleEvents() {
    const previousBtn = this.shadow.getElementById("previous-btn");
    previousBtn.addEventListener("click", (e) => {
      this.handlePreviousBtnClick(this.productImageContainer);
    });

    const nextBtn = this.shadow.getElementById("next-btn");
    nextBtn.addEventListener("click", (e) => {
      this.handleNextBtnClick(this.productImageContainer);
    });

    const thumbnailImageButtons = this.shadow.querySelectorAll(
      "#product-thumbnail-list button"
    );

    this.handleThumbnailClick(
      thumbnailImageButtons,
      this.productImageContainer
    );
  }

  enableProductImageButtonEvents() {}

  handleThumbnailClick(thumbnailList, slider) {
    Array.from(thumbnailList).forEach((thumbnail) => {
      thumbnail.addEventListener("click", (e) => {
        this.removeActiveClassFromThumbnails(thumbnailList);
        e.currentTarget.classList.add("active");
        this.productImageCurrentIndex =
          Number(e.currentTarget.dataset.productid) + 1;
        this.slideProductImage(
          slider,
          Number(e.currentTarget.dataset.productid) + 1,
          true
        );
      });
    });
  }

  removeActiveClassFromThumbnails(thumbnailList) {
    Array.from(thumbnailList).forEach((thumbnail) => {
      thumbnail.classList.remove("active");
    });
  }

  renderLightbox() {
    const lightbox = this.shadow.getElementById("lightbox");
    lightbox.classList.add("open");
    this.productImageOldIndex = this.productImageCurrentIndex;
    const lightBoxContainer = this.shadow.getElementById("lightbox-content");
    const imageGallery = this.shadow.getElementById("image-gallery");
    const imageGalleryClone = imageGallery.cloneNode(true);
    imageGalleryClone.id += "-lightbox";
    const elementsWithId = imageGalleryClone.querySelectorAll("[id]");
    Array.from(elementsWithId).forEach((element) => {
      element.id += "-lightbox";
    });
    lightBoxContainer.appendChild(imageGalleryClone);
    this.handleLightboxEvents(lightbox);
  }

  hideLightbox(lightbox) {
    lightbox.classList.remove("open");
    const lightBoxContainer = this.shadow.getElementById("lightbox-content");
    const imageGalleryClone = this.shadow.getElementById(
      "image-gallery-lightbox"
    );
    lightBoxContainer.removeChild(imageGalleryClone);
  }

  handleLightboxEvents(lightbox) {
    this.productImageCurrentIndex = 1;
    const slider = this.shadow.getElementById(
      "product-image-container-lightbox"
    );
    const closeBtn = this.shadow.getElementById("close-btn");
    closeBtn.addEventListener("click", (e) => {
      this.productImageCurrentIndex = this.productImageOldIndex;
      this.hideLightbox(lightbox);
    });

    const previousBtn = this.shadow.getElementById("previous-btn-lightbox");
    previousBtn.addEventListener("click", (e) => {
      this.handlePreviousBtnClick(slider);
    });

    const nextBtn = this.shadow.getElementById("next-btn-lightbox");
    nextBtn.addEventListener("click", (e) => {
      this.handleNextBtnClick(slider);
    });

    const thumbnailImageButtons = this.shadow.querySelectorAll(
      "#product-thumbnail-list-lightbox button"
    );
    this.handleThumbnailClick(thumbnailImageButtons, slider);
  }
}
