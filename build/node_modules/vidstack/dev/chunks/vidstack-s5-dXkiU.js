import { Host, effect, computed, setAttribute } from './vidstack-DVpy0IqK.js';
import { MediaProvider, MediaPlayer } from './vidstack-Gf_DI1v6.js';
import { useMediaContext } from './vidstack-CUYciP40.js';

class MediaProviderElement extends Host(HTMLElement, MediaProvider) {
  static tagName = "media-provider";
  #media;
  #target = null;
  #blocker = null;
  onSetup() {
    this.#media = useMediaContext();
    this.setAttribute("keep-alive", "");
  }
  onDestroy() {
    this.#blocker?.remove();
    this.#blocker = null;
    this.#target?.remove();
    this.#target = null;
  }
  onConnect() {
    effect(() => {
      const loader = this.$state.loader(), isYouTubeEmbed = loader?.name === "youtube", isVimeoEmbed = loader?.name === "vimeo", isEmbed = isYouTubeEmbed || isVimeoEmbed, isGoogleCast = loader?.name === "google-cast";
      const target = loader ? isGoogleCast ? this.#createGoogleCastContainer() : isEmbed ? this.#createIFrame() : loader.mediaType() === "audio" ? this.#createAudio() : this.#createVideo() : null;
      if (this.#target !== target) {
        const parent = this.#target?.parentElement ?? this;
        this.#target?.remove();
        this.#target = target;
        if (target) parent.prepend(target);
        if (isEmbed && target) {
          effect(() => {
            const { nativeControls, viewType } = this.#media.$state, showNativeControls = nativeControls(), isAudioView = viewType() === "audio", showBlocker = !showNativeControls && !isAudioView;
            if (showBlocker) {
              this.#blocker = this.querySelector(".vds-blocker");
              if (!this.#blocker) {
                this.#blocker = document.createElement("div");
                this.#blocker.classList.add("vds-blocker");
                target.after(this.#blocker);
              }
            } else {
              this.#blocker?.remove();
              this.#blocker = null;
            }
            setAttribute(target, "data-no-controls", !showNativeControls);
          });
        }
      }
      if (isYouTubeEmbed) target?.classList.add("vds-youtube");
      else if (isVimeoEmbed) target?.classList.add("vds-vimeo");
      if (!isEmbed) {
        this.#blocker?.remove();
        this.#blocker = null;
      }
      this.load(target);
    });
  }
  #createAudio() {
    const audio = this.#target instanceof HTMLAudioElement ? this.#target : document.createElement("audio");
    const { controls, crossOrigin } = this.#media.$state;
    effect(() => {
      setAttribute(audio, "controls", controls());
      setAttribute(audio, "crossorigin", crossOrigin());
    });
    return audio;
  }
  #createVideo() {
    const video = this.#target instanceof HTMLVideoElement ? this.#target : document.createElement("video");
    const { crossOrigin, poster, nativeControls } = this.#media.$state, $controls = computed(() => nativeControls() ? "true" : null), $poster = computed(() => poster() && nativeControls() ? poster() : null);
    effect(() => {
      setAttribute(video, "controls", $controls());
      setAttribute(video, "crossorigin", crossOrigin());
      setAttribute(video, "poster", $poster());
    });
    return video;
  }
  #createIFrame() {
    const iframe = this.#target instanceof HTMLIFrameElement ? this.#target : document.createElement("iframe"), { nativeControls } = this.#media.$state;
    effect(() => setAttribute(iframe, "tabindex", !nativeControls() ? -1 : null));
    return iframe;
  }
  #createGoogleCastContainer() {
    if (this.#target?.classList.contains("vds-google-cast")) {
      return this.#target;
    }
    const container = document.createElement("div");
    container.classList.add("vds-google-cast");
    import('./vidstack-Ds5tKO58.js').then(({ insertContent }) => {
      insertContent(container, this.#media.$state);
    });
    return container;
  }
}

class MediaPlayerElement extends Host(HTMLElement, MediaPlayer) {
  static tagName = "media-player";
  static attrs = {
    autoPlay: "autoplay",
    crossOrigin: "crossorigin",
    playsInline: "playsinline",
    preferNativeHLS: "prefer-native-hls",
    minLiveDVRWindow: "min-live-dvr-window"
  };
}

export { MediaPlayerElement, MediaProviderElement };
