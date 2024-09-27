import { computed, peek, effect, onDispose, isDOMNode, animationFrameThrottle, isString } from './vidstack-DVpy0IqK.js';
import { nothing, render, html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { directive, AsyncDirective, PartType } from 'lit-html/async-directive.js';
import { useMediaContext } from './vidstack-CUYciP40.js';

class SignalDirective extends AsyncDirective {
  #signal = null;
  #isAttr = false;
  #stop = null;
  constructor(part) {
    super(part);
    this.#isAttr = part.type === PartType.ATTRIBUTE || part.type === PartType.BOOLEAN_ATTRIBUTE;
  }
  render(signal) {
    if (signal !== this.#signal) {
      this.disconnected();
      this.#signal = signal;
      if (this.isConnected) this.#watch();
    }
    return this.#signal ? this.#resolveValue(peek(this.#signal)) : nothing;
  }
  reconnected() {
    this.#watch();
  }
  disconnected() {
    this.#stop?.();
    this.#stop = null;
  }
  #watch() {
    if (!this.#signal) return;
    this.#stop = effect(this.#onValueChange.bind(this));
  }
  #resolveValue(value) {
    return this.#isAttr ? ifDefined(value) : value;
  }
  #setValue(value) {
    this.setValue(this.#resolveValue(value));
  }
  #onValueChange() {
    {
      try {
        this.#setValue(this.#signal?.());
      } catch (error) {
        if (error instanceof Error && error.message.includes("This `ChildPart` has no `parentNode`")) {
          const svelteDynamicImportExample = [
            "{#await import('./Player.svelte') then {default: Player}}",
            "  <svelte:component this={Player} />",
            "{/await}"
          ].join("\n");
          console.warn(
            `[vidstack] Failed to render most likely due to a hydration issue with your framework. Dynamically importing the player should resolve the issue.

Svelte Example:

${svelteDynamicImportExample}`
          );
        } else {
          console.error(error);
        }
      }
    }
  }
}
function $signal(compute) {
  return directive(SignalDirective)(computed(compute));
}

class SlotObserver {
  #roots;
  #callback;
  elements = /* @__PURE__ */ new Set();
  constructor(roots, callback) {
    this.#roots = roots;
    this.#callback = callback;
  }
  connect() {
    this.#update();
    const observer = new MutationObserver(this.#onMutation);
    for (const root of this.#roots) observer.observe(root, { childList: true, subtree: true });
    onDispose(() => observer.disconnect());
    onDispose(this.disconnect.bind(this));
  }
  disconnect() {
    this.elements.clear();
  }
  assign(template, slot) {
    if (isDOMNode(template)) {
      slot.textContent = "";
      slot.append(template);
    } else {
      render(null, slot);
      render(template, slot);
    }
    if (!slot.style.display) {
      slot.style.display = "contents";
    }
    const el = slot.firstElementChild;
    if (!el) return;
    const classList = slot.getAttribute("data-class");
    if (classList) el.classList.add(...classList.split(" "));
  }
  #onMutation = animationFrameThrottle(this.#update.bind(this));
  #update(entries) {
    if (entries && !entries.some((e) => e.addedNodes.length)) return;
    let changed = false, slots = this.#roots.flatMap((root) => [...root.querySelectorAll("slot")]);
    for (const slot of slots) {
      if (!slot.hasAttribute("name") || this.elements.has(slot)) continue;
      this.elements.add(slot);
      changed = true;
    }
    if (changed) this.#callback(this.elements);
  }
}

let id = 0, slotIdAttr = "data-slot-id";
class SlotManager {
  #roots;
  slots;
  constructor(roots) {
    this.#roots = roots;
    this.slots = new SlotObserver(roots, this.#update.bind(this));
  }
  connect() {
    this.slots.connect();
    this.#update();
    const mutations = new MutationObserver(this.#onMutation);
    for (const root of this.#roots) mutations.observe(root, { childList: true });
    onDispose(() => mutations.disconnect());
  }
  #onMutation = animationFrameThrottle(this.#update.bind(this));
  #update() {
    for (const root of this.#roots) {
      for (const node of root.children) {
        if (node.nodeType !== 1) continue;
        const name = node.getAttribute("slot");
        if (!name) continue;
        node.style.display = "none";
        let slotId = node.getAttribute(slotIdAttr);
        if (!slotId) {
          node.setAttribute(slotIdAttr, slotId = ++id + "");
        }
        for (const slot of this.slots.elements) {
          if (slot.getAttribute("name") !== name || slot.getAttribute(slotIdAttr) === slotId) {
            continue;
          }
          const clone = document.importNode(node, true);
          if (name.includes("-icon")) clone.classList.add("vds-icon");
          clone.style.display = "";
          clone.removeAttribute("slot");
          this.slots.assign(clone, slot);
          slot.setAttribute(slotIdAttr, slotId);
        }
      }
    }
  }
}

function Icon({ name, class: _class, state, paths, viewBox = "0 0 32 32" }) {
  return html`<svg
    class="${"vds-icon" + (_class ? ` ${_class}` : "")}"
    viewBox="${viewBox}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${ifDefined(name ?? state)}
  >
    ${!isString(paths) ? $signal(paths) : unsafeSVG(paths)}
  </svg>`;
}

class IconsLoader {
  #icons = {};
  #loaded = false;
  slots;
  constructor(roots) {
    this.slots = new SlotObserver(roots, this.#insertIcons.bind(this));
  }
  connect() {
    this.slots.connect();
  }
  load() {
    this.loadIcons().then((icons) => {
      this.#icons = icons;
      this.#loaded = true;
      this.#insertIcons();
    });
  }
  *#iterate() {
    for (const iconName of Object.keys(this.#icons)) {
      const slotName = `${iconName}-icon`;
      for (const slot of this.slots.elements) {
        if (slot.name !== slotName) continue;
        yield { icon: this.#icons[iconName], slot };
      }
    }
  }
  #insertIcons() {
    if (!this.#loaded) return;
    for (const { icon, slot } of this.#iterate()) {
      this.slots.assign(icon, slot);
    }
  }
}

class LayoutIconsLoader extends IconsLoader {
  connect() {
    super.connect();
    const { player } = useMediaContext();
    if (!player.el) return;
    let dispose, observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      dispose?.();
      dispose = void 0;
      this.load();
    });
    observer.observe(player.el);
    dispose = onDispose(() => observer.disconnect());
  }
}

export { $signal, Icon, LayoutIconsLoader, SlotManager };
