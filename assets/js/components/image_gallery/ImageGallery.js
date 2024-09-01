import css from "./ImageGallery.css?inline";
import Store from "../../store.js";

export default class ImageGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.product = Store.product;
    this.productImageCurrentIndex = 1;
    this.productImageOldIndex = 1;
    this.transitionDuration = 300;
    this.lightboxRendered = false;
    this.lightboxEnabledScreenSize = 938;
    this.productImageButtonAttributesSet = false;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.slider = this.shadow.getElementById("product-image-container");
    this.renderProductImageListForInfinityScroll();
    this.lightbox = new LightBox(this);
    if (!this.lightboxRendered) {
      this.lightbox.renderLightbox();
      this.lightboxRendered = true;
    }
    this.setProductImageButtonAttributes();
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
                <figure data-productid="${index}" class="product-image" aria-hidden="true">
                  <img src="${productImage.main}" alt="" />
                  <figcaption class="visually-hidden">${productImage.alt}</figcaption>
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
        <section id="product-thumbnail-list" class="product-thumbnail-list"  aria-label="Product thumbnails" role="radiogroup">
          ${this.product.product_images
            .map(
              (productImage, index) => `
              <button data-productid="${index}" class="product-thumbnail-btn ${
                index === 0 ? "active" : ""
              }" role="radio" aria-checked="${index === 0 ? "true" : "false"}">
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
      <article id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Product image lightbox" tabindex="-1">
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

  setProductImageCurrentIndex(index) {
    this.productImageCurrentIndex = index;
  }

  setProductImageOldIndex(index) {
    this.productImageOldIndex = index;
  }

  renderProductImageListForInfinityScroll() {
    const productImageBtns = this.slider.children;
    this.slider.appendChild(productImageBtns[0].cloneNode(true));
    this.slider.prepend(
      productImageBtns[productImageBtns.length - 2].cloneNode(true)
    );
  }

  setFocusToProductImageList() {
    const productImageList = this.shadow.getElementById("product-image-list");
    productImageList.setAttribute("aria-expanded", "false");
    productImageList.focus();
  }

  setProductImageButtonAttributes() {
    const productImageList = this.shadow.getElementById("product-image-list");
    if (
      window.innerWidth >= this.lightboxEnabledScreenSize &&
      !this.productImageButtonAttributesSet
    ) {
      productImageList.setAttribute("role", "button");
      productImageList.setAttribute("aria-haspopup", "dialog");
      productImageList.setAttribute("aria-expanded", "false");
      productImageList.setAttribute("aria-controls", "lightbox");
      productImageList.setAttribute("tabindex", "0");
      productImageList.setAttribute("style", "cursor: pointer");
      productImageList.addEventListener("click", () => {
        productImageList.setAttribute("aria-expanded", "true");
        this.productImageOldIndex = this.productImageCurrentIndex;
        this.lightbox.showLightbox();
      });
      productImageList.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          productImageList.setAttribute("aria-expanded", "true");
          this.productImageOldIndex = this.productImageCurrentIndex;
          this.lightbox.showLightbox();
        }
      });

      this.productImageButtonAttributesSet = true;
    }
  }

  removeProductImageButtonAttributes() {
    if (this.productImageButtonAttributesSet) {
      const productImageList = this.shadow.getElementById("product-image-list");
      productImageList.removeAttribute("role");
      productImageList.removeAttribute("aria-haspopup");
      productImageList.removeAttribute("aria-expanded");
      productImageList.removeAttribute("aria-controls");
      productImageList.removeAttribute("tabindex");
      productImageList.setAttribute("style", "cursor: default");
      this.productImageButtonAttributesSet = false;
    }
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

  handleThumbnailClick(thumbnailList, slider) {
    Array.from(thumbnailList).forEach((thumbnail) => {
      thumbnail.addEventListener("click", (e) => {
        this.showActiveProductImage(thumbnailList, thumbnail, slider);
      });
    });
  }

  showActiveProductImage(thumbnailList, thumbnail, slider) {
    this.removeActiveClassFromThumbnails(thumbnailList);
    thumbnail.setAttribute("aria-checked", "true");
    thumbnail.classList.add("active");
    this.productImageCurrentIndex = Number(thumbnail.dataset.productid) + 1;
    this.slideProductImage(
      slider,
      Number(thumbnail.dataset.productid) + 1,
      true
    );
  }

  removeActiveClassFromThumbnails(thumbnailList) {
    Array.from(thumbnailList).forEach((thumbnail) => {
      thumbnail.setAttribute("aria-checked", "false");
      thumbnail.classList.remove("active");
    });
  }

  handleEvents() {
    window.addEventListener("resize", (e) => {
      if (window.innerWidth < this.lightboxEnabledScreenSize) {
        this.removeProductImageButtonAttributes();
      } else {
        this.setProductImageButtonAttributes();
      }
    });
    const previousBtn = this.shadow.getElementById("previous-btn");
    previousBtn.addEventListener("click", (e) => {
      this.handlePreviousBtnClick(this.slider);
    });

    const nextBtn = this.shadow.getElementById("next-btn");
    nextBtn.addEventListener("click", (e) => {
      this.handleNextBtnClick(this.slider);
    });

    const thumbnailImageButtons = this.shadow.querySelectorAll(
      "#product-thumbnail-list button"
    );

    this.handleThumbnailClick(thumbnailImageButtons, this.slider);
  }
}

class LightBox {
  constructor(imageGalleryComponent) {
    this.imageGallery = imageGalleryComponent;
    this.shadow = this.imageGallery.shadow;
  }

  renderLightbox() {
    this.imageGallery.setProductImageOldIndex(
      this.imageGallery.productImageCurrentIndex
    );
    const lightBoxContainer = this.shadow.getElementById("lightbox-content");
    const imageGalleryEl = this.shadow.getElementById("image-gallery");
    const imageGalleryClone = imageGalleryEl.cloneNode(true);
    imageGalleryClone.id += "-lightbox";
    const elementsWithId = imageGalleryClone.querySelectorAll("[id]");
    Array.from(elementsWithId).forEach((element) => {
      element.id += "-lightbox";
    });
    lightBoxContainer.appendChild(imageGalleryClone);
    this.setLightboxComponents();
    this.setFocusableElements();
    this.handleLightboxEvents();
  }

  setLightboxComponents() {
    this.lightbox = this.shadow.getElementById("lightbox");
    this.slider = this.shadow.getElementById(
      "product-image-container-lightbox"
    );
    this.thumbnailImageButtons = this.shadow.querySelectorAll(
      "#product-thumbnail-list-lightbox button"
    );
  }

  setFocusableElements() {
    this.focusableElements = this.lightbox.querySelectorAll("button");
  }

  selectActiveLightboxThumbnail() {
    const activeThumbnail = Array.from(this.thumbnailImageButtons).find(
      (thumbnail) =>
        Number(thumbnail.dataset.productid) + 1 ===
        this.imageGallery.productImageCurrentIndex
    );

    this.imageGallery.showActiveProductImage(
      this.thumbnailImageButtons,
      activeThumbnail,
      this.slider
    );
  }

  showLightbox() {
    if (window.innerWidth >= this.imageGallery.lightboxEnabledScreenSize) {
      this.selectActiveLightboxThumbnail();
      this.lightbox.classList.add("open");
      this.lightbox.focus();
    }
  }

  hideLightbox() {
    this.imageGallery.setProductImageCurrentIndex(
      this.imageGallery.productImageOldIndex
    );
    this.lightbox.classList.remove("open");
    this.imageGallery.setFocusToProductImageList();
  }

  setFocusTrap() {
    Array.from(this.focusableElements).forEach((element) => {
      element.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (e.currentTarget === this.focusableElements[0]) {
              e.preventDefault();
              this.focusableElements[this.focusableElements.length - 1].focus();
            }
          } else {
            if (
              e.currentTarget ===
              this.focusableElements[this.focusableElements.length - 1]
            ) {
              e.preventDefault();
              this.focusableElements[0].focus();
            }
          }
        }
      });
    });
  }

  handleLightboxEvents() {
    this.lightbox.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideLightbox();
      }
    });
    this.setFocusTrap();
    const closeLightBoxBtn = this.shadow.getElementById("close-btn");
    closeLightBoxBtn.addEventListener("click", this.hideLightbox.bind(this));

    const previousBtn = this.shadow.getElementById("previous-btn-lightbox");
    previousBtn.addEventListener("click", (e) => {
      this.imageGallery.handlePreviousBtnClick(this.slider);
      this.imageGallery.removeActiveClassFromThumbnails(
        this.thumbnailImageButtons
      );
      setTimeout(() => {
        this.selectActiveLightboxThumbnail();
      }, this.imageGallery.transitionDuration);
    });

    const nextBtn = this.shadow.getElementById("next-btn-lightbox");
    nextBtn.addEventListener("click", (e) => {
      this.imageGallery.handleNextBtnClick(this.slider);
      this.imageGallery.removeActiveClassFromThumbnails(
        this.thumbnailImageButtons
      );
      setTimeout(() => {
        this.selectActiveLightboxThumbnail();
      }, this.imageGallery.transitionDuration);
    });

    this.imageGallery.handleThumbnailClick(
      this.thumbnailImageButtons,
      this.slider
    );
  }
}
