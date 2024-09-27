import { loadScript, preconnect } from '../chunks/vidstack-DCY5OwWc.js';
import { canPlayVideoType, canPlayAudioType, IS_CHROME, isDASHSupported } from '../chunks/vidstack-uKxEd7nI.js';
import { VideoProvider } from './vidstack-video.js';
import { listenEvent, effect, DOMEvent, isNumber, peek, isString, camelToKebabCase, isUndefined, isFunction } from '../chunks/vidstack-DVpy0IqK.js';
import { QualitySymbol } from '../chunks/vidstack-Bpr4fI4n.js';
import { TextTrackSymbol, TextTrack } from '../chunks/vidstack-Dn8_b_Q6.js';
import { ListSymbol } from '../chunks/vidstack-Dv_LIPFu.js';
import { RAFLoop } from '../chunks/vidstack-HSkhaVtP.js';
import { coerceToError } from '../chunks/vidstack-DbBJlz7I.js';
import './vidstack-html.js';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-clMv7kJL.js';
import '../chunks/vidstack-C1THCRTj.js';

function getLangName(langCode) {
  try {
    const displayNames = new Intl.DisplayNames(navigator.languages, { type: "language" });
    const languageName = displayNames.of(langCode);
    return languageName ?? null;
  } catch (err) {
    return null;
  }
}

const toDOMEventType = (type) => `dash-${camelToKebabCase(type)}`;
class DASHController {
  #video;
  #ctx;
  #instance = null;
  #callbacks = /* @__PURE__ */ new Set();
  #stopLiveSync = null;
  config = {};
  get instance() {
    return this.#instance;
  }
  constructor(video, ctx) {
    this.#video = video;
    this.#ctx = ctx;
  }
  setup(ctor) {
    this.#instance = ctor().create();
    const dispatcher = this.#dispatchDASHEvent.bind(this);
    for (const event of Object.values(ctor.events)) this.#instance.on(event, dispatcher);
    this.#instance.on(ctor.events.ERROR, this.#onError.bind(this));
    for (const callback of this.#callbacks) callback(this.#instance);
    this.#ctx.player.dispatch("dash-instance", {
      detail: this.#instance
    });
    this.#instance.initialize(this.#video, void 0, false);
    this.#instance.updateSettings({
      streaming: {
        text: {
          // Disabling text rendering by dash.
          defaultEnabled: false,
          dispatchForManualRendering: true
        },
        buffer: {
          /// Enables buffer replacement when switching bitrates for faster switching.
          fastSwitchEnabled: true
        }
      },
      ...this.config
    });
    this.#instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this.#onFragmentLoadStart.bind(this));
    this.#instance.on(
      ctor.events.FRAGMENT_LOADING_COMPLETED,
      this.#onFragmentLoadComplete.bind(this)
    );
    this.#instance.on(ctor.events.MANIFEST_LOADED, this.#onManifestLoaded.bind(this));
    this.#instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this.#onQualityChange.bind(this));
    this.#instance.on(ctor.events.TEXT_TRACKS_ADDED, this.#onTextTracksAdded.bind(this));
    this.#instance.on(ctor.events.TRACK_CHANGE_RENDERED, this.#onTrackChange.bind(this));
    this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);
    listenEvent(this.#ctx.qualities, "change", this.#onUserQualityChange.bind(this));
    listenEvent(this.#ctx.audioTracks, "change", this.#onUserAudioChange.bind(this));
    this.#stopLiveSync = effect(this.#liveSync.bind(this));
  }
  #createDOMEvent(event) {
    return new DOMEvent(toDOMEventType(event.type), { detail: event });
  }
  #liveSync() {
    if (!this.#ctx.$state.live()) return;
    const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
    raf.start();
    return raf.stop.bind(raf);
  }
  #liveSyncPosition() {
    if (!this.#instance) return;
    const position = this.#instance.duration() - this.#instance.time();
    this.#ctx.$state.liveSyncPosition.set(!isNaN(position) ? position : Infinity);
  }
  #dispatchDASHEvent(event) {
    this.#ctx.player?.dispatch(this.#createDOMEvent(event));
  }
  #currentTrack = null;
  #cueTracker = {};
  #onTextFragmentLoaded(event) {
    const native = this.#currentTrack?.[TextTrackSymbol.native], cues = (native?.track).cues;
    if (!native || !cues) return;
    const id = this.#currentTrack.id, startIndex = this.#cueTracker[id] ?? 0, trigger = this.#createDOMEvent(event);
    for (let i = startIndex; i < cues.length; i++) {
      const cue = cues[i];
      if (!cue.positionAlign) cue.positionAlign = "auto";
      this.#currentTrack.addCue(cue, trigger);
    }
    this.#cueTracker[id] = cues.length;
  }
  #onTextTracksAdded(event) {
    if (!this.#instance) return;
    const data = event.tracks, nativeTextTracks = [...this.#video.textTracks].filter((track) => "manualMode" in track), trigger = this.#createDOMEvent(event);
    for (let i = 0; i < nativeTextTracks.length; i++) {
      const textTrackInfo = data[i], nativeTextTrack = nativeTextTracks[i];
      const id = `dash-${textTrackInfo.kind}-${i}`, track = new TextTrack({
        id,
        label: textTrackInfo?.label ?? textTrackInfo.labels.find((t) => t.text)?.text ?? (textTrackInfo?.lang && getLangName(textTrackInfo.lang)) ?? textTrackInfo?.lang ?? void 0,
        language: textTrackInfo.lang ?? void 0,
        kind: textTrackInfo.kind,
        default: textTrackInfo.defaultTrack
      });
      track[TextTrackSymbol.native] = {
        managed: true,
        track: nativeTextTrack
      };
      track[TextTrackSymbol.readyState] = 2;
      track[TextTrackSymbol.onModeChange] = () => {
        if (!this.#instance) return;
        if (track.mode === "showing") {
          this.#instance.setTextTrack(i);
          this.#currentTrack = track;
        } else {
          this.#instance.setTextTrack(-1);
          this.#currentTrack = null;
        }
      };
      this.#ctx.textTracks.add(track, trigger);
    }
  }
  #onTrackChange(event) {
    const { mediaType, newMediaInfo } = event;
    if (mediaType === "audio") {
      const track = this.#ctx.audioTracks.getById(`dash-audio-${newMediaInfo.index}`);
      if (track) {
        const trigger = this.#createDOMEvent(event);
        this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
      }
    }
  }
  #onQualityChange(event) {
    if (event.mediaType !== "video") return;
    const quality = this.#ctx.qualities[event.newQuality];
    if (quality) {
      const trigger = this.#createDOMEvent(event);
      this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
  }
  #onManifestLoaded(event) {
    if (this.#ctx.$state.canPlay() || !this.#instance) return;
    const { type, mediaPresentationDuration } = event.data, trigger = this.#createDOMEvent(event);
    this.#ctx.notify("stream-type-change", type !== "static" ? "live" : "on-demand", trigger);
    this.#ctx.notify("duration-change", mediaPresentationDuration, trigger);
    this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);
    const media = this.#instance.getVideoElement();
    const videoQualities = this.#instance.getTracksForTypeFromManifest(
      "video",
      event.data
    );
    const supportedVideoMimeType = [...new Set(videoQualities.map((e) => e.mimeType))].find(
      (type2) => type2 && canPlayVideoType(media, type2)
    );
    const videoQuality = videoQualities.filter(
      (track) => supportedVideoMimeType === track.mimeType
    )[0];
    let audioTracks = this.#instance.getTracksForTypeFromManifest(
      "audio",
      event.data
    );
    const supportedAudioMimeType = [...new Set(audioTracks.map((e) => e.mimeType))].find(
      (type2) => type2 && canPlayAudioType(media, type2)
    );
    audioTracks = audioTracks.filter((track) => supportedAudioMimeType === track.mimeType);
    videoQuality.bitrateList.forEach((bitrate, index) => {
      const quality = {
        id: bitrate.id?.toString() ?? `dash-bitrate-${index}`,
        width: bitrate.width ?? 0,
        height: bitrate.height ?? 0,
        bitrate: bitrate.bandwidth ?? 0,
        codec: videoQuality.codec,
        index
      };
      this.#ctx.qualities[ListSymbol.add](quality, trigger);
    });
    if (isNumber(videoQuality.index)) {
      const quality = this.#ctx.qualities[videoQuality.index];
      if (quality) this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
    audioTracks.forEach((audioTrack, index) => {
      const matchingLabel = audioTrack.labels.find((label2) => {
        return navigator.languages.some((language) => {
          return label2.lang && language.toLowerCase().startsWith(label2.lang.toLowerCase());
        });
      });
      const label = matchingLabel || audioTrack.labels[0];
      const localTrack = {
        id: `dash-audio-${audioTrack?.index}`,
        label: label?.text ?? (audioTrack.lang && getLangName(audioTrack.lang)) ?? audioTrack.lang ?? "",
        language: audioTrack.lang ?? "",
        kind: "main",
        mimeType: audioTrack.mimeType,
        codec: audioTrack.codec,
        index
      };
      this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
    });
    media.dispatchEvent(new DOMEvent("canplay", { trigger }));
  }
  #onError(event) {
    const { type: eventType, error: data } = event;
    {
      this.#ctx.logger?.errorGroup(`[vidstack] DASH error \`${data.message}\``).labelledLog("Media Element", this.#video).labelledLog("DASH Instance", this.#instance).labelledLog("Event Type", eventType).labelledLog("Data", data).labelledLog("Src", peek(this.#ctx.$state.source)).labelledLog("Media Store", { ...this.#ctx.$state }).dispatch();
    }
    switch (data.code) {
      case 27:
        this.#onNetworkError(data);
        break;
      default:
        this.#onFatalError(data);
        break;
    }
  }
  #onFragmentLoadStart() {
    if (this.#retryLoadingTimer >= 0) this.#clearRetryTimer();
  }
  #onFragmentLoadComplete(event) {
    const mediaType = event.mediaType;
    if (mediaType === "text") {
      requestAnimationFrame(this.#onTextFragmentLoaded.bind(this, event));
    }
  }
  #retryLoadingTimer = -1;
  #onNetworkError(error) {
    this.#clearRetryTimer();
    this.#instance?.play();
    this.#retryLoadingTimer = window.setTimeout(() => {
      this.#retryLoadingTimer = -1;
      this.#onFatalError(error);
    }, 5e3);
  }
  #clearRetryTimer() {
    clearTimeout(this.#retryLoadingTimer);
    this.#retryLoadingTimer = -1;
  }
  #onFatalError(error) {
    this.#ctx.notify("error", {
      message: error.message ?? "",
      code: 1,
      error
    });
  }
  #enableAutoQuality() {
    this.#switchAutoBitrate("video", true);
    const { qualities } = this.#ctx;
    this.#instance?.setQualityFor("video", qualities.selectedIndex, true);
  }
  #switchAutoBitrate(type, auto) {
    this.#instance?.updateSettings({
      streaming: { abr: { autoSwitchBitrate: { [type]: auto } } }
    });
  }
  #onUserQualityChange() {
    const { qualities } = this.#ctx;
    if (!this.#instance || qualities.auto || !qualities.selected) return;
    this.#switchAutoBitrate("video", false);
    this.#instance.setQualityFor("video", qualities.selectedIndex, qualities.switch === "current");
    if (IS_CHROME) {
      this.#video.currentTime = this.#video.currentTime;
    }
  }
  #onUserAudioChange() {
    if (!this.#instance) return;
    const { audioTracks } = this.#ctx, selectedTrack = this.#instance.getTracksFor("audio").find(
      (track) => audioTracks.selected && audioTracks.selected.id === `dash-audio-${track.index}`
    );
    if (selectedTrack) this.#instance.setCurrentTrack(selectedTrack);
  }
  #reset() {
    this.#clearRetryTimer();
    this.#currentTrack = null;
    this.#cueTracker = {};
  }
  onInstance(callback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }
  loadSource(src) {
    this.#reset();
    if (!isString(src.src)) return;
    this.#instance?.attachSource(src.src);
  }
  destroy() {
    this.#reset();
    this.#instance?.destroy();
    this.#instance = null;
    this.#stopLiveSync?.();
    this.#stopLiveSync = null;
    this.#ctx?.logger?.info("\u{1F3D7}\uFE0F Destroyed DASH instance");
  }
}

class DASHLibLoader {
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
    this.#ctx.logger?.info("\u{1F3D7}\uFE0F Loading DASH Library");
    const callbacks = {
      onLoadStart: this.#onLoadStart.bind(this),
      onLoaded: this.#onLoaded.bind(this),
      onLoadError: this.#onLoadError.bind(this)
    };
    let ctor = await loadDASHScript(this.#lib, callbacks);
    if (isUndefined(ctor) && !isString(this.#lib)) ctor = await importDASH(this.#lib, callbacks);
    if (!ctor) return null;
    if (!window.dashjs.supportsMediaSource()) {
      const message = "[vidstack] `dash.js` is not supported in this environment";
      this.#ctx.logger?.error(message);
      this.#ctx.player.dispatch(new DOMEvent("dash-unsupported"));
      this.#ctx.notify("error", { message, code: 4 });
      return null;
    }
    return ctor;
  }
  #onLoadStart() {
    {
      this.#ctx.logger?.infoGroup("Starting to load `dash.js`").labelledLog("URL", this.#lib).dispatch();
    }
    this.#ctx.player.dispatch(new DOMEvent("dash-lib-load-start"));
  }
  #onLoaded(ctor) {
    {
      this.#ctx.logger?.infoGroup("Loaded `dash.js`").labelledLog("Library", this.#lib).labelledLog("Constructor", ctor).dispatch();
    }
    this.#ctx.player.dispatch(
      new DOMEvent("dash-lib-loaded", {
        detail: ctor
      })
    );
    this.#callback(ctor);
  }
  #onLoadError(e) {
    const error = coerceToError(e);
    {
      this.#ctx.logger?.errorGroup("[vidstack] Failed to load `dash.js`").labelledLog("Library", this.#lib).labelledLog("Error", e).dispatch();
    }
    this.#ctx.player.dispatch(
      new DOMEvent("dash-lib-load-error", {
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
async function importDASH(loader, callbacks = {}) {
  if (isUndefined(loader)) return void 0;
  callbacks.onLoadStart?.();
  if (isDASHConstructor(loader)) {
    callbacks.onLoaded?.(loader);
    return loader;
  }
  if (isDASHNamespace(loader)) {
    const ctor = loader.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  }
  try {
    const ctor = (await loader())?.default;
    if (isDASHNamespace(ctor)) {
      callbacks.onLoaded?.(ctor.MediaPlayer);
      return ctor.MediaPlayer;
    }
    if (ctor) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
        true ? "[vidstack] failed importing `dash.js`. Dynamic import returned invalid object." : ""
      );
    }
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
async function loadDASHScript(src, callbacks = {}) {
  if (!isString(src)) return void 0;
  callbacks.onLoadStart?.();
  try {
    await loadScript(src);
    if (!isFunction(window.dashjs.MediaPlayer)) {
      throw Error(
        true ? "[vidstack] failed loading `dash.js`. Could not find a valid `Dash` constructor on window" : ""
      );
    }
    const ctor = window.dashjs.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
function isDASHConstructor(value) {
  return value && value.prototype && value.prototype !== Function;
}
function isDASHNamespace(value) {
  return value && "MediaPlayer" in value;
}

const JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
class DASHProvider extends VideoProvider {
  $$PROVIDER_TYPE = "DASH";
  #ctor = null;
  #controller = new DASHController(this.video, this.ctx);
  /**
   * The `dash.js` constructor.
   */
  get ctor() {
    return this.#ctor;
  }
  /**
   * The current `dash.js` instance.
   */
  get instance() {
    return this.#controller.instance;
  }
  /**
   * Whether `dash.js` is supported in this environment.
   */
  static supported = isDASHSupported();
  get type() {
    return "dash";
  }
  get canLiveSync() {
    return true;
  }
  #library = `${JS_DELIVR_CDN}/npm/dashjs@4.7.4/dist/dash${".all.debug.js" }`;
  /**
   * The `dash.js` configuration object.
   *
   * @see {@link https://cdn.dashjs.org/latest/jsdoc/module-Settings.html}
   */
  get config() {
    return this.#controller.config;
  }
  set config(config) {
    this.#controller.config = config;
  }
  /**
   * The `dash.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js`
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
    new DASHLibLoader(this.#library, this.ctx, (ctor) => {
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
   * The given callback is invoked when a new `dash.js` instance is created and right before it's
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

export { DASHProvider };
