import ProductImage1 from "../images/image-product-1.jpg";
import ProductImage2 from "../images/image-product-2.jpg";
import ProductImage3 from "../images/image-product-3.jpg";
import ProductImage4 from "../images/image-product-4.jpg";
import ProductThumbnail1 from "../images/image-product-1-thumbnail.jpg";
import ProductThumbnail2 from "../images/image-product-2-thumbnail.jpg";
import ProductThumbnail3 from "../images/image-product-3-thumbnail.jpg";
import ProductThumbnail4 from "../images/image-product-4-thumbnail.jpg";

class Store {
  constructor() {
    this._product = {
      brand: "Sneaker Company",
      name: "Fall Limited Edition Sneakers",
      description:
        "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they’ll withstand everything the weather can offer.",
      current_price: 125.0,
      previous_price: 250.0,
      discount: 50,
      product_images: [
        {
          main: ProductImage1,
          thumbnail: ProductThumbnail1,
          alt: "Product 1",
        },
        {
          main: ProductImage2,
          thumbnail: ProductThumbnail2,
          alt: "Product 2",
        },
        {
          main: ProductImage3,
          thumbnail: ProductThumbnail3,
          alt: "Product 3",
        },
        {
          main: ProductImage4,
          thumbnail: ProductThumbnail4,
          alt: "Product 4",
        },
      ],
    };
  }

  get product() {
    return this._product;
  }
}

const storeInstance = new Store();
export default storeInstance;
