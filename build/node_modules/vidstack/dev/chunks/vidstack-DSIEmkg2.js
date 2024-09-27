import { Component, State, effect, isNull, setAttribute, EventsController } from './vidstack-DVpy0IqK.js';
import { useMediaContext } from './vidstack-CUYciP40.js';
import { preconnect } from './vidstack-DCY5OwWc.js';

class Poster extends Component {
  static props = {
    src: null,
    alt: null,
    crossOrigin: null
  };
  static state = new State({
    img: null,
    src: null,
    alt: null,
    crossOrigin: null,
    loading: true,
    error: null,
    hidden: false
  });
  #media;
  onSetup() {
    this.#media = useMediaContext();
    this.#watchSrc();
    this.#watchAlt();
    this.#watchCrossOrigin();
    this.#watchHidden();
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
    effect(this.#watchImg.bind(this));
    effect(this.#watchSrc.bind(this));
    effect(this.#watchAlt.bind(this));
    effect(this.#watchCrossOrigin.bind(this));
    effect(this.#watchHidden.bind(this));
    const { started } = this.#media.$state;
    this.setAttributes({
      "data-visible": () => !started() && !this.$state.hidden(),
      "data-loading": this.#isLoading.bind(this),
      "data-error": this.#hasError.bind(this),
      "data-hidden": this.$state.hidden
    });
  }
  onConnect(el) {
    effect(this.#onPreconnect.bind(this));
    effect(this.#onLoadStart.bind(this));
  }
  #hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }
  #onPreconnect() {
    const { canLoadPoster, poster } = this.#media.$state;
    if (!canLoadPoster() && poster()) preconnect(poster(), "preconnect");
  }
  #watchHidden() {
    const { src } = this.$props, { poster, nativeControls } = this.#media.$state;
    this.el && setAttribute(this.el, "display", nativeControls() ? "none" : null);
    this.$state.hidden.set(this.#hasError() || !(src() || poster()) || nativeControls());
  }
  #isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  #watchImg() {
    const img = this.$state.img();
    if (!img) return;
    new EventsController(img).add("load", this.#onLoad.bind(this)).add("error", this.#onError.bind(this));
    if (img.complete) this.#onLoad();
  }
  #prevSrc = "";
  #watchSrc() {
    const { poster: defaultPoster } = this.#media.$props, { canLoadPoster, providedPoster, inferredPoster } = this.#media.$state;
    const src = this.$props.src() || "", poster = src || defaultPoster() || inferredPoster();
    if (this.#prevSrc === providedPoster()) {
      providedPoster.set(src);
    }
    this.$state.src.set(canLoadPoster() && poster.length ? poster : null);
    this.#prevSrc = src;
  }
  #watchAlt() {
    const { src } = this.$props, { alt } = this.$state, { poster } = this.#media.$state;
    alt.set(src() || poster() ? this.$props.alt() : null);
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin, poster: src } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(
      /ytimg\.com|vimeo/.test(src() || "") ? null : crossOrigin === true ? "anonymous" : crossOrigin
    );
  }
  #onLoadStart() {
    const { loading, error } = this.$state, { canLoadPoster, poster } = this.#media.$state;
    loading.set(canLoadPoster() && !!poster());
    error.set(null);
  }
  #onLoad() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
  }
  #onError(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
}

export { Poster };
