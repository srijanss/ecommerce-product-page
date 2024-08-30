import css from "./ProductDetails.css?inline";
import Store from "../../store.js";

export default class ProductDetailsComponent extends HTMLElement {
  constructor() {
    super();
    Store.subscribe(this);
    this.product = Store.product;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.setReusableComponent();
    this.handleEvents();
  }

  setReusableComponent() {
    this.errorMessageEL = this.shadow.getElementById("error-message");
    this.quantityInput = this.shadow.getElementById("quantity");
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <article id="product-details" aria-labelledby="product-name" aria-describedby="product-description">
        <p id="product-brand">${this.product.brand}</p>
        <h1 id="product-name">${this.product.name}</h1>
        <p id="product-description">${this.product.description}</p>
        <div id="product-price">
          <ins id="current-price">$${this.product.current_price.toFixed(
            2
          )}</ins>
          <div id="discount-percent">${this.product.discount}%</div>
          <del id="old-price">$${this.product.previous_price.toFixed(2)}</del>
        </div>
        <form action="post" id="add-to-cart" novalidate>
          <div class="form-input-group">
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="10"
              value="0"
              aria-label="Quantity"
              aria-invalid="false"
              aria-describedby="error-message"
              required
            />
            <button id="decrement-quantity" type="button" aria-label="Decrement quantity">
              <svg width="12" height="4" viewBox="0 0 12 4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-labelledby="minus-svg-icon" role="image" aria-hidden="true" focusable="false">
                <title id="minus-svg-icon">Minus</title>
                <defs>
                  <path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" id="a"/>
                </defs>
                <use fill="#FF7E1B" fill-rule="nonzero" xlink:href="#a"/>
              </svg>
            </button>  
            <button id="increment-quantity" type="button" aria-label="Increment quantity">
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-labelledby="plus-svg-icon" role="image" aria-hidden="true" focusable="false">
                <title id="plus-svg-icon">Plus</title>
                <defs>
                  <path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" id="b"/>
                </defs>
                <use fill="#FF7E1B" fill-rule="nonzero" xlink:href="#b"/>
              </svg>
            </button>
          </div>
          <button id="add-to-cart-btn" type="submit">
            <svg width="22" height="20" viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="image" aria-labelledby="cart-icon-title" focusable="false">
              <title id="cart-icon-title">Cart</title>
              <path d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z" fill="#69707D" fill-rule="nonzero"/>
            </svg>
            Add to cart
          </button>
        </form>
        <p id="error-message" role="alert" aria-live="true" aria-atomic="true"></p>
      </article>
    `;
  }

  update() {
    if (Store.getCartQuantity() < 1) {
      this.hideError(this.quantityInput, this.errorMessageEL);
    }
  }
  hideError() {
    if (this.quantityInput.classList.contains("error")) {
      this.quantityInput.classList.remove("error");
      this.quantityInput.setAttribute("aria-invalid", "false");
      this.errorMessageEL.textContent = "";
    }
  }

  showError(message) {
    this.quantityInput.classList.add("error");
    this.quantityInput.setAttribute("aria-invalid", "true");
    this.errorMessageEL.textContent = message;
  }

  isValidForm(data) {
    if (data.quantity == "") {
      return {
        valid: false,
        message: "Please enter a valid quantity",
      };
    }
    const inputQuantity = parseInt(data.quantity);
    if (inputQuantity < 1 || inputQuantity > 10) {
      return {
        valid: false,
        message: "Please enter a quantity between 1 and 10",
      };
    }
    const newQuantity = parseInt(data.quantity) + Store.getCartQuantity();
    if (newQuantity > 10) {
      return {
        valid: false,
        message: "You can only add up to 10 items in the cart",
      };
    }
    return {
      valid: true,
      message: "Valid form",
    };
  }

  handleEvents() {
    const form = this.shadow.getElementById("add-to-cart");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const validationCheck = this.isValidForm(data);
      if (validationCheck.valid) {
        const quantity = parseInt(data.quantity);
        Store.addToCart(this.product, quantity);
      } else {
        this.showError(validationCheck.message);
      }
    });

    this.quantityInput.addEventListener("input", () => {
      this.hideError();
    });

    const decrementBtn = this.shadow.getElementById("decrement-quantity");
    decrementBtn.addEventListener("focus", () => {
      this.hideError();
    });
    decrementBtn.addEventListener("click", () => {
      if (Number(this.quantityInput.value) === Number(this.quantityInput.min)) {
        return;
      }
      this.quantityInput.stepDown();
    });
    const incrementBtn = this.shadow.getElementById("increment-quantity");
    incrementBtn.addEventListener("focus", () => {
      this.hideError();
    });
    incrementBtn.addEventListener("click", () => {
      if (Number(this.quantityInput.value) === Number(this.quantityInput.max)) {
        return;
      }
      this.quantityInput.stepUp();
    });
  }
}
