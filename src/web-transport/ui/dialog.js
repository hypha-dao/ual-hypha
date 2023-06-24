import { Logo } from "../../logo.js";
import { CloseIcon } from "../../assets/CloseIcon.js";
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
        case "html":
          el.innerHTML = value;
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

  setupElements(wrapperBaseSize) {
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
      this.ualBox = document.getElementById("ual-box");
      // this.ualBox.remove();
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
      this.wrapper = this.createEl({ class: "wrapper" });

      const topBanner = this.createEl({ class: "top-banner" });
      const closeButton = this.createEl({ class: "close", html: CloseIcon });
      closeButton.onclick = (event) => {
        event.stopPropagation();
        this.hide();
      };
      this.requestEl = this.createEl({ class: "request" });
      topBanner.appendChild(closeButton);

      this.wrapper.appendChild(topBanner);
      this.wrapper.appendChild(this.requestEl);
      this.containerEl.appendChild(this.wrapper);
    }
    this.wrapper.style.setProperty('--wrapper-base-size', `${wrapperBaseSize}px`);

  }

  getImageSize(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            resolve({ width: this.width, height: this.height });
        };
        img.onerror = function() {
            reject(new Error('Could not load image'));
        };
        img.src = dataUrl;
    });
}

  async showDialog({ title, text, qrCode, esr, action, footnote }) {
    const imageSize = await this.getImageSize(qrCode)
    const qrAreaBaseSize = Math.max(imageSize.width, 380)
    const wrapperBaseSize = qrAreaBaseSize + 42

    this.setupElements(wrapperBaseSize);

    removeChilds(this.requestEl);

    const infoEl = this.createEl({ class: "info" });

    const infoLogo = this.createEl({
      class: "logo",
      tag: "svg",
      html: Logo,
    });
    this.requestEl.appendChild(infoLogo);

    const content = this.createEl({ class: "content" });

    if (title) {
      const infoTitle = this.createEl({
        class: "title",
        tag: "h2",
        content: title,
      });
      content.appendChild(infoTitle);
    }
    if (text) {
      const infoText = this.createEl({
        class: "text",
        tag: "p",
        content: text,
      });
      content.appendChild(infoText);
    }

    if (qrCode) {

      const qrArea = this.createEl({ class: "qr-area" });
      qrArea.style.setProperty('--qr-area-base-size', `${qrAreaBaseSize}px`);

      const requestQRCode = this.createEl({
        class: "qr-here",
        tag: "img",
        src: qrCode,
      });

      qrArea.appendChild(requestQRCode);
      content.appendChild(qrArea);
    }

    this.requestEl.appendChild(content);
    this.containerEl.appendChild(infoEl);

    if (action) {
      const buttonEl = this.createEl({
        tag: "button",
        text: action.text,
      });
      buttonEl.addEventListener("click", (event) => {
        event.preventDefault();
        action && action.callback();
      });
      content.appendChild(buttonEl);
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
