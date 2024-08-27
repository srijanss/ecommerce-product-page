import css from "./NavBar.css?inline";
import HamburgerIcon from "../../../images/icon-menu.svg";
import CloseIcon from "../../../images/icon-close.svg";

export default class NavBar extends HTMLElement {
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
      <button id="hamburger-icon">
        <img
          src="${HamburgerIcon}"
          alt="Menu"
          width="16"
          height="15"
        />
      </button>
      <nav>
        <button id="close-icon">
          <img
            src="${CloseIcon}"
            alt="Close menu"
            width="14"
            height="15"
          />
        </button>
        <ul>
          <li>
            <a href="#"> Collections </a>
          </li>
          <li>
            <a href="#"> Men </a>
          </li>
          <li>
            <a href="#"> Women </a>
          </li>
          <li>
            <a href="#"> About </a>
          </li>
          <li>
            <a href="#"> Contact </a>
          </li>
        </ul>
      </nav>
      `;
  }
}
