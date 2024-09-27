import '../define/vidstack-player.js';
import { isString, defineCustomElement, kebabToCamelCase } from '../chunks/vidstack-CRlI3Mh7.js';
import { isHTMLAudioElement, isHTMLVideoElement, isHTMLIFrameElement } from '../chunks/vidstack-Dvnit1xI.js';
import { isHTMLElement } from '../chunks/vidstack-Ds_q5BGO.js';
import '../chunks/vidstack-DF9tOn_S.js';
import '../chunks/vidstack-Cpte_fRf.js';
import '../chunks/vidstack-DwhHIY5e.js';
import '../chunks/vidstack-BmMUBVGQ.js';
import '../chunks/vidstack-oyBGi0R4.js';
import '../chunks/vidstack-A9j--j6J.js';
import '../chunks/vidstack-DE4XvkHU.js';
import '../chunks/vidstack-D5EzK014.js';
import '../chunks/vidstack-B01xzxC4.js';
import '../chunks/vidstack-C9vIqaYT.js';
import '@floating-ui/dom';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-DXXgp8ue.js';

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
        const { MediaPosterElement } = await import('../chunks/vidstack-QR8zGkwr.js');
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
