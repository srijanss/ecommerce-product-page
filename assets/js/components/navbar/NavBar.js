import css from "./NavBar.css?inline";
import HamburgerIcon from "../../../images/icon-menu.svg";
import CloseIcon from "../../../images/icon-close.svg";

export default class NavBar extends HTMLElement {
  constructor() {
    super();
    this.menuItems = [
      {
        name: "Collections",
        href: "#",
      },
      {
        name: "Men",
        href: "#",
      },
      {
        name: "Women",
        href: "#",
      },
      {
        name: "About",
        href: "#",
      },
      {
        name: "Contact",
        href: "#",
      },
    ];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.handlePostRenderEvents();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        ${css}
      </style>
      <button id="hamburger-icon" aria-label="Open Menu" aria-expanded="false" aria-controls="menu">
        <img
          src="${HamburgerIcon}"
          alt="Menu"
          width="16"
          height="15"
        />
      </button>
      <nav id="menu" aria-label="Primary">
        <div class="overlay"></div>
        <div id="menu-content">
          <button id="close-icon" aria-label="Close Menu" aria-expanded="false" aria-controls="menu">
            <img
              src="${CloseIcon}"
              alt="Close Menu"
              width="14"
              height="15"
            />
          </button>
          <ul>
            ${this.menuItems
              .map(
                (item) => `
              <li>
                <a href="${item.href}"> ${item.name} </a>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      </nav>
      `;
  }

  handlePostRenderEvents() {
    this.hamburgerIcon = this.shadow.getElementById("hamburger-icon");
    this.closeIcon = this.shadow.getElementById("close-icon");
    this.menu = this.shadow.getElementById("menu");
    this.linkList = this.shadow.querySelectorAll("nav a");
    this.lastMenuItem = this.linkList[this.linkList.length - 1];
    this.setFocusableElements();
    this.handleEvents();
  }

  openMenu() {
    this.menu.classList.add("open");
    this.addFocusToMenuItems();
  }

  closeMenu() {
    this.menu.classList.remove("open");
    this.removeFocusFromMenuItems();
  }

  addFocusToMenuItems() {
    this.hamburgerIcon.setAttribute("aria-expanded", "true");
    this.closeIcon.setAttribute("aria-expanded", "true");
    this.closeIcon.setAttribute("aria-hidden", "false");
    this.closeIcon.setAttribute("tabindex", "0");
    setTimeout(() => {
      this.closeIcon.focus();
    }, 1);
    Array.from(this.linkList).forEach((link) => {
      link.setAttribute("tabindex", "0");
      link.setAttribute("aria-hidden", "false");
    });
  }

  removeFocusFromMenuItems() {
    this.hamburgerIcon.setAttribute("aria-expanded", "false");
    this.closeIcon.setAttribute("aria-expanded", "false");
    this.closeIcon.setAttribute("aria-hidden", "true");
    this.closeIcon.setAttribute("tabindex", "-1");
    this.hamburgerIcon.focus();
    Array.from(this.linkList).forEach((link) => {
      link.setAttribute("tabindex", "-1");
      link.setAttribute("aria-hidden", "true");
    });
  }

  isHamburgerIconVisible() {
    this.hamburgerIconVisible =
      getComputedStyle(this.hamburgerIcon).display !== "none";
    return this.hamburgerIconVisible;
  }

  setFocusableElements() {
    if (this.isHamburgerIconVisible()) {
      this.removeFocusFromMenuItems();
    } else {
      this.addFocusToMenuItems();
    }
  }

  handleEvents() {
    window.addEventListener("resize", () => {
      this.setFocusableElements();
    });
    this.hamburgerIcon.addEventListener("click", () => {
      this.openMenu();
    });

    this.closeIcon.addEventListener("click", () => {
      this.closeMenu();
    });

    Array.from(this.linkList).forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
      link.addEventListener("keydown", (event) => {
        if (link === this.lastMenuItem) {
          if (event.key === "Tab") {
            if (this.hamburgerIconVisible) {
              event.preventDefault();
              this.closeIcon.focus();
            }
          }
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setTimeout(() => {
            this.closeMenu();
          }, 1);
        }
      });
    });
  }
}
