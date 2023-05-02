import { SeedsLogo } from "../../logo.js";
import styleText from "../styles/index.js";

const removeChilds = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

class Dialog {
  constructor({ classPrefix = "ual-hypha", disableImportant } = {}) {
    this.containerEl = null;
    this.requestEl = null;
    this.classPrefix = classPrefix;
    this.importantStyles = !disableImportant;
  }

  hide() {
    if (this.containerEl) {
      this.containerEl.classList.remove(`${this.classPrefix}-active`);
    }
  }

  show() {
    if (this.containerEl) {
      this.containerEl.classList.add(`${this.classPrefix}-active`);
    }
  }

  createEl(attrs = {}) {
    const el = document.createElement(attrs.tag || "div");
    for (const attr of Object.keys(attrs)) {
      const value = attrs[attr];
      switch (attr) {
        case "src":
          el.setAttribute(attr, value);
          break;
        case "tag":
          break;
        case "content":
          if (typeof value === "string") {
            el.appendChild(document.createTextNode(value));
          } else {
            el.appendChild(value);
          }
          break;
        case "text":
          el.appendChild(document.createTextNode(value));
          break;
        case "class":
          el.className = `${this.classPrefix}-${value}`;
          break;
        default:
          el.setAttribute(attr, value);
      }
    }
    return el;
  }

  setupElements() {
    if (!this.styleEl) {
      this.styleEl = document.createElement("style");
      this.styleEl.type = "text/css";
      let css = styleText.replace(/%prefix%/g, this.classPrefix);
      if (this.importantStyles) {
        css = css
          .split("\n")
          .map((line) => line.replace(/;$/i, " !important;"))
          .join("\n");
      }
      this.styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(this.styleEl);
    }
    if (!this.containerEl) {
      this.containerEl = this.createEl();
      this.containerEl.className = this.classPrefix;
      this.containerEl.onclick = (event) => {
        if (event.target === this.containerEl) {
          event.stopPropagation();
          this.hide();
        }
      };
      document.body.appendChild(this.containerEl);
    }

    if (!this.requestEl) {
      const wrapper = this.createEl({ class: "inner" });
      const closeButton = this.createEl({ class: "close" });
      closeButton.onclick = (event) => {
        event.stopPropagation();
        this.hide();
      };
      this.requestEl = this.createEl({ class: "request" });
      wrapper.appendChild(this.requestEl);
      wrapper.appendChild(closeButton);
      this.containerEl.appendChild(wrapper);
    }
  }

  showDialog({ title, subtitle, qrCode, action, footnote }) {
    this.setupElements();

    removeChilds(this.requestEl);

    const infoEl = this.createEl({ class: "info" });

    const infoLogo = this.createEl({
      class: "logo",
      tag: "img",
      src: SeedsLogo,
    });
    this.requestEl.appendChild(infoLogo);

    if (title) {
      const infoTitle = this.createEl({
        class: "title",
        tag: "h2",
        content: title,
      });
      this.requestEl.appendChild(infoTitle);
    }
    if (subtitle) {
      const infoSubtitle = this.createEl({
        class: "subtitle",
        tag: "p",
        content: subtitle,
      });
      this.requestEl.appendChild(infoSubtitle);
    }
    this.containerEl.appendChild(infoEl);

    if (qrCode) {
      const requestQRCode = this.createEl({
        class: "qrcode",
        tag: "img",
        src: qrCode,
      });
      this.requestEl.appendChild(requestQRCode);
    }

    if (action) {
      const buttonEl = this.createEl({
        tag: "a",
        class: "button",
        text: action.text,
      });
      buttonEl.addEventListener("click", (event) => {
        event.preventDefault();
        action && action.callback();
      });
      this.requestEl.appendChild(buttonEl);
    }

    if (footnote) {
      const footnoteEl = this.createEl({
        class: "footnote",
        content: args.footnote,
      });
      this.requestEl.appendChild(footnoteEl);
    }
    this.show();
  }
}

export default Dialog;
