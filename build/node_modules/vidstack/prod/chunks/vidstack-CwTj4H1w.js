import { render } from 'lit-html';

class LitElement extends HTMLElement {
  rootPart = null;
  connectedCallback() {
    this.rootPart = render(this.render(), this, {
      renderBefore: this.firstChild
    });
    this.rootPart.setConnected(true);
  }
  disconnectedCallback() {
    this.rootPart?.setConnected(false);
    this.rootPart = null;
    render(null, this);
  }
}

export { LitElement };
