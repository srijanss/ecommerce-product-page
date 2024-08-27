import HeaderComponent from "./components/header/Header.js";
import NavBar from "./components/navbar/NavBar.js";
import CartComponent from "./components/cart/Cart.js";
import ImageGalleryComponent from "./components/image_gallery/ImageGallery.js";
import ProductDetailsComponent from "./components/product_details/ProductDetails.js";

customElements.define("header-component", HeaderComponent);
customElements.define("nav-bar", NavBar);
customElements.define("cart-component", CartComponent);
customElements.define("image-gallery-component", ImageGalleryComponent);
customElements.define("product-details-component", ProductDetailsComponent);
