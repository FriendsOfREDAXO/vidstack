import { loadScript, preconnect } from '../chunks/vidstack-DCY5OwWc.js';
import { IS_CHROME, isHLSSupported } from '../chunks/vidstack-uKxEd7nI.js';
import { VideoProvider } from './vidstack-video.js';
import { peek, listenEvent, effect, DOMEvent, isString, camelToKebabCase, isUndefined, isFunction } from '../chunks/vidstack-DVpy0IqK.js';
import { QualitySymbol } from '../chunks/vidstack-Bpr4fI4n.js';
import { TextTrack, TextTrackSymbol } from '../chunks/vidstack-Dn8_b_Q6.js';
import { ListSymbol } from '../chunks/vidstack-Dv_LIPFu.js';
import { RAFLoop } from '../chunks/vidstack-HSkhaVtP.js';
import { coerceToError } from '../chunks/vidstack-DbBJlz7I.js';
import './vidstack-html.js';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-clMv7kJL.js';
import '../chunks/vidstack-C1THCRTj.js';

const toDOMEventType = (type) => camelToKebabCase(type);
class HLSController {
  #video;
  #ctx;
  #instance = null;
  #stopLiveSync = null;
  config = {};
  #callbacks = /* @__PURE__ */ new Set();
  get instance() {
    return this.#instance;
  }
  constructor(video, ctx) {
    this.#video = video;
    this.#ctx = ctx;
  }
  setup(ctor) {
    const { streamType } = this.#ctx.$state;
    const isLive = peek(streamType).includes("live"), isLiveLowLatency = peek(streamType).includes("ll-");
    this.#instance = new ctor({
      lowLatencyMode: isLiveLowLatency,
      backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : void 0,
      renderTextTracksNatively: false,
      ...this.config
    });
    const dispatcher = this.#dispatchHLSEvent.bind(this);
    for (const event of Object.values(ctor.Events)) this.#instance.on(event, dispatcher);
    this.#instance.on(ctor.Events.ERROR, this.#onError.bind(this));
    for (const callback of this.#callbacks) callback(this.#instance);
    this.#ctx.player.dispatch("hls-instance", {
      detail: this.#instance
    });
    this.#instance.attachMedia(this.#video);
    this.#instance.on(ctor.Events.AUDIO_TRACK_SWITCHED, this.#onAudioSwitch.bind(this));
    this.#instance.on(ctor.Events.LEVEL_SWITCHED, this.#onLevelSwitched.bind(this));
    this.#instance.on(ctor.Events.LEVEL_LOADED, this.#onLevelLoaded.bind(this));
    this.#instance.on(ctor.Events.LEVEL_UPDATED, this.#onLevelUpdated.bind(this));
    this.#instance.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, this.#onTracksFound.bind(this));
    this.#instance.on(ctor.Events.CUES_PARSED, this.#onCuesParsed.bind(this));
    this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);
    listenEvent(this.#ctx.qualities, "change", this.#onUserQualityChange.bind(this));
    listenEvent(this.#ctx.audioTracks, "change", this.#onUserAudioChange.bind(this));
    this.#stopLiveSync = effect(this.#liveSync.bind(this));
  }
  #createDOMEvent(type, data) {
    return new DOMEvent(toDOMEventType(type), { detail: data });
  }
  #liveSync() {
    if (!this.#ctx.$state.live()) return;
    const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
    raf.start();
    return raf.stop.bind(raf);
  }
  #liveSyncPosition() {
    this.#ctx.$state.liveSyncPosition.set(this.#instance?.liveSyncPosition ?? Infinity);
  }
  #dispatchHLSEvent(type, data) {
    this.#ctx.player?.dispatch(this.#createDOMEvent(type, data));
  }
  #onTracksFound(eventType, data) {
    const event = this.#createDOMEvent(eventType, data);
    let currentTrack = -1;
    for (let i = 0; i < data.tracks.length; i++) {
      const nonNativeTrack = data.tracks[i], init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions, track = new TextTrack({
        id: `hls-${nonNativeTrack.kind}-${i}`,
        src: init?.url,
        label: nonNativeTrack.label,
        language: init?.lang,
        kind: nonNativeTrack.kind,
        default: nonNativeTrack.default
      });
      track[TextTrackSymbol.readyState] = 2;
      track[TextTrackSymbol.onModeChange] = () => {
        if (track.mode === "showing") {
          this.#instance.subtitleTrack = i;
          currentTrack = i;
        } else if (currentTrack === i) {
          this.#instance.subtitleTrack = -1;
          currentTrack = -1;
        }
      };
      this.#ctx.textTracks.add(track, event);
    }
  }
  #onCuesParsed(eventType, data) {
    const index = this.#instance?.subtitleTrack, track = this.#ctx.textTracks.getById(`hls-${data.type}-${index}`);
    if (!track) return;
    const event = this.#createDOMEvent(eventType, data);
    for (const cue of data.cues) {
      cue.positionAlign = "auto";
      track.addCue(cue, event);
    }
  }
  #onAudioSwitch(eventType, data) {
    const track = this.#ctx.audioTracks[data.id];
    if (track) {
      const trigger = this.#createDOMEvent(eventType, data);
      this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
    }
  }
  #onLevelSwitched(eventType, data) {
    const quality = this.#ctx.qualities[data.level];
    if (quality) {
      const trigger = this.#createDOMEvent(eventType, data);
      this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
  }
  #onLevelUpdated(eventType, data) {
    if (data.details.totalduration > 0) {
      this.#ctx.$state.inferredLiveDVRWindow.set(data.details.totalduration);
    }
  }
  #onLevelLoaded(eventType, data) {
    if (this.#ctx.$state.canPlay()) return;
    const { type, live, totalduration: duration, targetduration } = data.details, trigger = this.#createDOMEvent(eventType, data);
    this.#ctx.notify(
      "stream-type-change",
      live ? type === "EVENT" && Number.isFinite(duration) && targetduration >= 10 ? "live:dvr" : "live" : "on-demand",
      trigger
    );
    this.#ctx.notify("duration-change", duration, trigger);
    const media = this.#instance.media;
    if (this.#instance.currentLevel === -1) {
      this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);
    }
    for (const remoteTrack of this.#instance.audioTracks) {
      const localTrack = {
        id: remoteTrack.id.toString(),
        label: remoteTrack.name,
        language: remoteTrack.lang || "",
        kind: "main"
      };
      this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
    }
    for (const level of this.#instance.levels) {
      const videoQuality = {
        id: level.id?.toString() ?? level.height + "p",
        width: level.width,
        height: level.height,
        codec: level.codecSet,
        bitrate: level.bitrate
      };
      this.#ctx.qualities[ListSymbol.add](videoQuality, trigger);
    }
    media.dispatchEvent(new DOMEvent("canplay", { trigger }));
  }
  #onError(eventType, data) {
    {
      this.#ctx.logger?.errorGroup(`[vidstack] HLS error \`${eventType}\``).labelledLog("Media Element", this.#instance?.media).labelledLog("HLS Instance", this.#instance).labelledLog("Event Type", eventType).labelledLog("Data", data).labelledLog("Src", peek(this.#ctx.$state.source)).labelledLog("Media Store", { ...this.#ctx.$state }).dispatch();
    }
    if (data.fatal) {
      switch (data.type) {
        case "mediaError":
          this.#instance?.recoverMediaError();
          break;
        default:
          this.#onFatalError(data.error);
          break;
      }
    }
  }
  #onFatalError(error) {
    this.#ctx.notify("error", {
      message: error.message,
      code: 1,
      error
    });
  }
  #enableAutoQuality() {
    if (this.#instance) this.#instance.currentLevel = -1;
  }
  #onUserQualityChange() {
    const { qualities } = this.#ctx;
    if (!this.#instance || qualities.auto) return;
    this.#instance[qualities.switch + "Level"] = qualities.selectedIndex;
    if (IS_CHROME) {
      this.#video.currentTime = this.#video.currentTime;
    }
  }
  #onUserAudioChange() {
    const { audioTracks } = this.#ctx;
    if (this.#instance && this.#instance.audioTrack !== audioTracks.selectedIndex) {
      this.#instance.audioTrack = audioTracks.selectedIndex;
    }
  }
  onInstance(callback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }
  loadSource(src) {
    if (!isString(src.src)) return;
    this.#instance?.loadSource(src.src);
  }
  destroy() {
    this.#instance?.destroy();
    this.#instance = null;
    this.#stopLiveSync?.();
    this.#stopLiveSync = null;
    this.#ctx?.logger?.info("\u{1F3D7}\uFE0F Destroyed HLS instance");
  }
}

class HLSLibLoader {
  #lib;
  #ctx;
  #callback;
  constructor(lib, ctx, callback) {
    this.#lib = lib;
    this.#ctx = ctx;
    this.#callback = callback;
    this.#startLoading();
  }
  async #startLoading() {
    this.#ctx.logger?.info("\u{1F3D7}\uFE0F Loading HLS Library");
    const callbacks = {
      onLoadStart: this.#onLoadStart.bind(this),
      onLoaded: this.#onLoaded.bind(this),
      onLoadError: this.#onLoadError.bind(this)
    };
    let ctor = await loadHLSScript(this.#lib, callbacks);
    if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importHLS(this.#lib, callbacks);
    if (!ctor) return null;
    if (!ctor.isSupported()) {
      const message = "[vidstack] `hls.js` is not supported in this environment";
      this.#ctx.logger?.error(message);
      this.#ctx.player.dispatch(new DOMEvent("hls-unsupported"));
      this.#ctx.notify("error", { message, code: 4 });
      return null;
    }
    return ctor;
  }
  #onLoadStart() {
    {
      this.#ctx.logger?.infoGroup("Starting to load `hls.js`").labelledLog("URL", this.#lib).dispatch();
    }
    this.#ctx.player.dispatch(new DOMEvent("hls-lib-load-start"));
  }
  #onLoaded(ctor) {
    {
      this.#ctx.logger?.infoGroup("Loaded `hls.js`").labelledLog("Library", this.#lib).labelledLog("Constructor", ctor).dispatch();
    }
    this.#ctx.player.dispatch(
      new DOMEvent("hls-lib-loaded", {
        detail: ctor
      })
    );
    this.#callback(ctor);
  }
  #onLoadError(e) {
    const error = coerceToError(e);
    {
      this.#ctx.logger?.errorGroup("[vidstack] Failed to load `hls.js`").labelledLog("Library", this.#lib).labelledLog("Error", e).dispatch();
    }
    this.#ctx.player.dispatch(
      new DOMEvent("hls-lib-load-error", {
        detail: error
      })
    );
    this.#ctx.notify("error", {
      message: error.message,
      code: 4,
      error
    });
  }
}
async function importHLS(loader, callbacks = {}) {
  if (isUndefined(loader)) return void 0;
  callbacks.onLoadStart?.();
  if (loader.prototype && loader.prototype !== Function) {
    callbacks.onLoaded?.(loader);
    return loader;
  }
  try {
    const ctor = (await loader())?.default;
    if (ctor && !!ctor.isSupported) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
        true ? "[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor." : ""
      );
    }
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
async function loadHLSScript(src, callbacks = {}) {
  if (!isString(src)) return void 0;
  callbacks.onLoadStart?.();
  try {
    await loadScript(src);
    if (!isFunction(window.Hls)) {
      throw Error(
        true ? "[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window" : ""
      );
    }
    const ctor = window.Hls;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}

const JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
class HLSProvider extends VideoProvider {
  $$PROVIDER_TYPE = "HLS";
  #ctor = null;
  #controller = new HLSController(this.video, this.ctx);
  /**
   * The `hls.js` constructor.
   */
  get ctor() {
    return this.#ctor;
  }
  /**
   * The current `hls.js` instance.
   */
  get instance() {
    return this.#controller.instance;
  }
  /**
   * Whether `hls.js` is supported in this environment.
   */
  static supported = isHLSSupported();
  get type() {
    return "hls";
  }
  get canLiveSync() {
    return true;
  }
  #library = `${JS_DELIVR_CDN}/npm/hls.js@^1.5.0/dist/hls${".js" }`;
  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  get config() {
    return this.#controller.config;
  }
  set config(config) {
    this.#controller.config = config;
  }
  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
   */
  get library() {
    return this.#library;
  }
  set library(library) {
    this.#library = library;
  }
  preconnect() {
    if (!isString(this.#library)) return;
    preconnect(this.#library);
  }
  setup() {
    super.setup();
    new HLSLibLoader(this.#library, this.ctx, (ctor) => {
      this.#ctor = ctor;
      this.#controller.setup(ctor);
      this.ctx.notify("provider-setup", this);
      const src = peek(this.ctx.$state.source);
      if (src) this.loadSource(src);
    });
  }
  async loadSource(src, preload) {
    if (!isString(src.src)) {
      this.removeSource();
      return;
    }
    this.media.preload = preload || "";
    this.appendSource(src, "application/x-mpegurl");
    this.#controller.loadSource(src);
    this.currentSrc = src;
  }
  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback) {
    const instance = this.#controller.instance;
    if (instance) callback(instance);
    return this.#controller.onInstance(callback);
  }
  destroy() {
    this.#controller.destroy();
  }
}

export { HLSProvider };
