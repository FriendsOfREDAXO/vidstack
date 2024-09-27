import '../define/vidstack-player.js';
import { isString, defineCustomElement, kebabToCamelCase } from '../chunks/vidstack-DVpy0IqK.js';
import { isHTMLAudioElement, isHTMLVideoElement, isHTMLIFrameElement } from '../chunks/vidstack-Gf_DI1v6.js';
import { isHTMLElement } from '../chunks/vidstack-CGUlKgT8.js';
import '../chunks/vidstack-s5-dXkiU.js';
import '../chunks/vidstack-CUYciP40.js';
import '../chunks/vidstack-uKxEd7nI.js';
import '../chunks/vidstack-B5ElR9su.js';
import '../chunks/vidstack-Dn8_b_Q6.js';
import '../chunks/vidstack-DCY5OwWc.js';
import '../chunks/vidstack-C1THCRTj.js';
import '../chunks/vidstack-Dv_LIPFu.js';
import '../chunks/vidstack-Bpr4fI4n.js';
import '../chunks/vidstack-DbBJlz7I.js';
import '@floating-ui/dom';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-9MhB-Ya7.js';

class VidstackPlayerLayout {
  constructor(props) {
    this.props = props;
  }
  name = "vidstack";
  async load() {
    await import('../define/vidstack-player-default-layout.js');
    await import('../define/vidstack-player-ui.js');
  }
  create() {
    const layouts = [
      document.createElement("media-audio-layout"),
      document.createElement("media-video-layout")
    ];
    if (this.props) {
      for (const [prop, value] of Object.entries(this.props)) {
        for (const el of layouts) el[prop] = value;
      }
    }
    return layouts;
  }
}

class PlyrLayout {
  constructor(props) {
    this.props = props;
  }
  name = "plyr";
  async load() {
    await import('../define/plyr-layout.js');
  }
  create() {
    const layout = document.createElement("media-plyr-layout");
    if (this.props) {
      for (const [prop, value] of Object.entries(this.props)) {
        layout[prop] = value;
      }
    }
    return [layout];
  }
}

const LAYOUT_LOADED = Symbol();
class VidstackPlayer {
  static async create({ target, layout, tracks, ...props }) {
    if (isString(target)) {
      target = document.querySelector(target);
    }
    if (!isHTMLElement(target)) {
      throw Error(`[vidstack] target must be of type \`HTMLElement\`, found \`${typeof target}\``);
    }
    let player = document.createElement("media-player"), provider = document.createElement("media-provider"), layouts, isTargetContainer = !isHTMLAudioElement(target) && !isHTMLVideoElement(target) && !isHTMLIFrameElement(target);
    player.setAttribute("keep-alive", "");
    if (props.poster && layout?.name !== "plyr") {
      if (!customElements.get("media-poster")) {
        const { MediaPosterElement } = await import('../chunks/vidstack-D2Gpq24o.js');
        defineCustomElement(MediaPosterElement);
      }
      const poster = document.createElement("media-poster");
      if (layout?.name === "vidstack") poster.classList.add("vds-poster");
      provider.append(poster);
    }
    if (layout) {
      target.removeAttribute("controls");
      if (!layout[LAYOUT_LOADED]) {
        await layout.load();
        layout[LAYOUT_LOADED] = true;
      }
      layouts = await layout.create();
    }
    const title = target.getAttribute("title");
    if (title) player.setAttribute("title", title);
    const width = target.getAttribute("width"), height = target.getAttribute("height");
    if (width || height) {
      if (width) player.style.width = width;
      if (height) player.style.height = height;
      player.style.aspectRatio = "unset";
    }
    for (const attr of target.attributes) {
      const name = attr.name.replace("data-", ""), propName = kebabToCamelCase(name);
      if (propName in player) {
        player.setAttribute(name, attr.value);
      } else if (layouts?.length) {
        for (const layout2 of layouts) {
          if (propName in layout2) {
            layout2.setAttribute(name, attr.value);
          }
        }
      }
    }
    for (const [prop, value] of Object.entries(props)) {
      player[prop] = value;
    }
    if (tracks) {
      for (const track of tracks) player.textTracks.add(track);
    }
    player.append(provider);
    if (layouts) {
      for (const layout2 of layouts) player.append(layout2);
    }
    if (isTargetContainer) {
      target.append(player);
    } else {
      for (const child of [...target.children]) provider.append(child);
      target.replaceWith(player);
    }
    return player;
  }
}

export { PlyrLayout, VidstackPlayer, VidstackPlayerLayout };
