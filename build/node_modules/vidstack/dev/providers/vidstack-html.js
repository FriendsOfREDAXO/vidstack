import { IS_SAFARI, IS_IOS, isHLSSrc, isMediaStream } from '../chunks/vidstack-uKxEd7nI.js';
import { signal, EventsController, effect, onDispose, peek, isNil, listenEvent, DOMEvent, createScope, setAttribute, isString } from '../chunks/vidstack-DVpy0IqK.js';
import { RAFLoop } from '../chunks/vidstack-HSkhaVtP.js';
import { getNumberOfDecimalPlaces } from '../chunks/vidstack-Dihypf8P.js';
import { ListSymbol } from '../chunks/vidstack-Dv_LIPFu.js';

let audioContext = null, gainNodes = [], elAudioSources = [];
function getOrCreateAudioCtx() {
  return audioContext ??= new AudioContext();
}
function createGainNode() {
  const audioCtx = getOrCreateAudioCtx(), gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNodes.push(gainNode);
  return gainNode;
}
function createElementSource(el, gainNode) {
  const audioCtx = getOrCreateAudioCtx(), src = audioCtx.createMediaElementSource(el);
  if (gainNode) {
    src.connect(gainNode);
  }
  elAudioSources.push(src);
  return src;
}
function destroyGainNode(node) {
  const idx = gainNodes.indexOf(node);
  if (idx !== -1) {
    gainNodes.splice(idx, 1);
    node.disconnect();
    freeAudioCtxWhenAllResourcesFreed();
  }
}
function destroyElementSource(src) {
  const idx = elAudioSources.indexOf(src);
  if (idx !== -1) {
    elAudioSources.splice(idx, 1);
    src.disconnect();
    freeAudioCtxWhenAllResourcesFreed();
  }
}
function freeAudioCtxWhenAllResourcesFreed() {
  if (audioContext && gainNodes.length === 0 && elAudioSources.length === 0) {
    audioContext.close().then(() => {
      audioContext = null;
    });
  }
}

class AudioGain {
  #media;
  #onChange;
  #gainNode = null;
  #srcAudioNode = null;
  get currentGain() {
    return this.#gainNode?.gain?.value ?? null;
  }
  get supported() {
    return true;
  }
  constructor(media, onChange) {
    this.#media = media;
    this.#onChange = onChange;
  }
  setGain(gain) {
    const currGain = this.currentGain;
    if (gain === this.currentGain) {
      return;
    }
    if (gain === 1 && currGain !== 1) {
      this.removeGain();
      return;
    }
    if (!this.#gainNode) {
      this.#gainNode = createGainNode();
      if (this.#srcAudioNode) {
        this.#srcAudioNode.connect(this.#gainNode);
      }
    }
    if (!this.#srcAudioNode) {
      this.#srcAudioNode = createElementSource(this.#media, this.#gainNode);
    }
    this.#gainNode.gain.value = gain;
    this.#onChange(gain);
  }
  removeGain() {
    if (!this.#gainNode) return;
    if (this.#srcAudioNode) {
      this.#srcAudioNode.connect(getOrCreateAudioCtx().destination);
    }
    this.#destroyGainNode();
    this.#onChange(null);
  }
  destroy() {
    this.#destroySrcNode();
    this.#destroyGainNode();
  }
  #destroySrcNode() {
    if (!this.#srcAudioNode) return;
    try {
      destroyElementSource(this.#srcAudioNode);
    } catch (e) {
    } finally {
      this.#srcAudioNode = null;
    }
  }
  #destroyGainNode() {
    if (!this.#gainNode) return;
    try {
      destroyGainNode(this.#gainNode);
    } catch (e) {
    } finally {
      this.#gainNode = null;
    }
  }
}

const PAGE_EVENTS = ["focus", "blur", "visibilitychange", "pageshow", "pagehide"];
class PageVisibility {
  #state = signal(determinePageState());
  #visibility = signal(document.visibilityState);
  #safariBeforeUnloadTimeout;
  connect() {
    const events = new EventsController(window), handlePageEvent = this.#handlePageEvent.bind(this);
    for (const eventType of PAGE_EVENTS) {
      events.add(eventType, handlePageEvent);
    }
    if (IS_SAFARI) {
      events.add("beforeunload", (event) => {
        this.#safariBeforeUnloadTimeout = setTimeout(() => {
          if (!(event.defaultPrevented || event.returnValue.length > 0)) {
            this.#state.set("hidden");
            this.#visibility.set("hidden");
          }
        }, 0);
      });
    }
  }
  /**
   * The current page state. Important to note we only account for a subset of page states, as
   * the rest aren't valuable to the player at the moment.
   *
   * - **active:** A page is in the active state if it is visible and has input focus.
   * - **passive:** A page is in the passive state if it is visible and does not have input focus.
   * - **hidden:** A page is in the hidden state if it is not visible.
   *
   * @see https://developers.google.com/web/updates/2018/07/page-lifecycle-api#states
   */
  get pageState() {
    return this.#state();
  }
  /**
   * The current document visibility state.
   *
   * - **visible:** The page content may be at least partially visible. In practice, this means that
   * the page is the foreground tab of a non-minimized window.
   * - **hidden:** The page content is not visible to the user. In practice this means that the
   * document is either a background tab or part of a minimized window, or the OS screen lock is
   * active.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
   */
  get visibility() {
    return this.#visibility();
  }
  #handlePageEvent(event) {
    if (IS_SAFARI) window.clearTimeout(this.#safariBeforeUnloadTimeout);
    if (event.type !== "blur" || this.#state() === "active") {
      this.#state.set(determinePageState(event));
      this.#visibility.set(document.visibilityState == "hidden" ? "hidden" : "visible");
    }
  }
}
function determinePageState(event) {
  if (event?.type === "blur" || document.visibilityState === "hidden") return "hidden";
  if (document.hasFocus()) return "active";
  return "passive";
}

class HTMLMediaEvents {
  #provider;
  #ctx;
  #waiting = false;
  #attachedLoadStart = false;
  #attachedCanPlay = false;
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #pageVisibility = new PageVisibility();
  #events;
  get #media() {
    return this.#provider.media;
  }
  constructor(provider, ctx) {
    this.#provider = provider;
    this.#ctx = ctx;
    this.#events = new EventsController(provider.media);
    this.#attachInitialListeners();
    this.#pageVisibility.connect();
    effect(this.#attachTimeUpdate.bind(this));
    onDispose(this.#onDispose.bind(this));
  }
  #onDispose() {
    this.#attachedLoadStart = false;
    this.#attachedCanPlay = false;
    this.#timeRAF.stop();
    this.#events.abort();
    this.#devHandlers?.clear();
  }
  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  #lastSeenTime = 0;
  #seekedTo = -1;
  #onAnimationFrame() {
    const newTime = this.#media.currentTime;
    const didStutter = IS_SAFARI && newTime - this.#seekedTo < 0.35;
    if (!didStutter && this.#lastSeenTime !== newTime) {
      this.#updateCurrentTime(newTime);
      this.#lastSeenTime = newTime;
    }
  }
  #attachInitialListeners() {
    {
      this.#ctx.logger?.info("attaching initial listeners");
    }
    this.#attachEventListener("loadstart", this.#onLoadStart);
    this.#attachEventListener("abort", this.#onAbort);
    this.#attachEventListener("emptied", this.#onEmptied);
    this.#attachEventListener("error", this.#onError);
    this.#attachEventListener("volumechange", this.#onVolumeChange);
    this.#ctx.logger?.debug("attached initial media event listeners");
  }
  #attachLoadStartListeners() {
    if (this.#attachedLoadStart) return;
    {
      this.#ctx.logger?.info("attaching load start listeners");
    }
    this.#attachEventListener("loadeddata", this.#onLoadedData);
    this.#attachEventListener("loadedmetadata", this.#onLoadedMetadata);
    this.#attachEventListener("canplay", this.#onCanPlay);
    this.#attachEventListener("canplaythrough", this.#onCanPlayThrough);
    this.#attachEventListener("durationchange", this.#onDurationChange);
    this.#attachEventListener("play", this.#onPlay);
    this.#attachEventListener("progress", this.#onProgress);
    this.#attachEventListener("stalled", this.#onStalled);
    this.#attachEventListener("suspend", this.#onSuspend);
    this.#attachEventListener("ratechange", this.#onRateChange);
    this.#attachedLoadStart = true;
  }
  #attachCanPlayListeners() {
    if (this.#attachedCanPlay) return;
    {
      this.#ctx.logger?.info("attaching can play listeners");
    }
    this.#attachEventListener("pause", this.#onPause);
    this.#attachEventListener("playing", this.#onPlaying);
    this.#attachEventListener("seeked", this.#onSeeked);
    this.#attachEventListener("seeking", this.#onSeeking);
    this.#attachEventListener("ended", this.#onEnded);
    this.#attachEventListener("waiting", this.#onWaiting);
    this.#attachedCanPlay = true;
  }
  #devHandlers = /* @__PURE__ */ new Map() ;
  #handleDevEvent = this.#onDevEvent.bind(this) ;
  #attachEventListener(eventType, handler) {
    this.#devHandlers.set(eventType, handler);
    this.#events.add(eventType, this.#handleDevEvent );
  }
  #onDevEvent(event2) {
    this.#ctx.logger?.debugGroup(`\u{1F4FA} provider fired \`${event2.type}\``).labelledLog("Provider", this.#provider).labelledLog("Event", event2).labelledLog("Media Store", { ...this.#ctx.$state }).dispatch();
    this.#devHandlers.get(event2.type)?.call(this, event2);
  }
  #updateCurrentTime(time, trigger) {
    const newTime = Math.min(time, this.#ctx.$state.seekableEnd());
    this.#ctx.notify("time-change", newTime, trigger);
  }
  #onLoadStart(event2) {
    if (this.#media.networkState === 3) {
      this.#onAbort(event2);
      return;
    }
    this.#attachLoadStartListeners();
    this.#ctx.notify("load-start", void 0, event2);
  }
  #onAbort(event2) {
    this.#ctx.notify("abort", void 0, event2);
  }
  #onEmptied() {
    this.#ctx.notify("emptied", void 0, event);
  }
  #onLoadedData(event2) {
    this.#ctx.notify("loaded-data", void 0, event2);
  }
  #onLoadedMetadata(event2) {
    this.#lastSeenTime = 0;
    this.#seekedTo = -1;
    this.#attachCanPlayListeners();
    this.#ctx.notify("loaded-metadata", void 0, event2);
    if (IS_IOS || IS_SAFARI && isHLSSrc(this.#ctx.$state.source())) {
      this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
    }
  }
  #getCanPlayDetail() {
    return {
      provider: peek(this.#ctx.$provider),
      duration: this.#media.duration,
      buffered: this.#media.buffered,
      seekable: this.#media.seekable
    };
  }
  #onPlay(event2) {
    if (!this.#ctx.$state.canPlay) return;
    this.#ctx.notify("play", void 0, event2);
  }
  #onPause(event2) {
    if (this.#media.readyState === 1 && !this.#waiting) return;
    this.#waiting = false;
    this.#timeRAF.stop();
    this.#ctx.notify("pause", void 0, event2);
  }
  #onCanPlay(event2) {
    this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
  }
  #onCanPlayThrough(event2) {
    if (this.#ctx.$state.started()) return;
    this.#ctx.notify("can-play-through", this.#getCanPlayDetail(), event2);
  }
  #onPlaying(event2) {
    if (this.#media.paused) return;
    this.#waiting = false;
    this.#ctx.notify("playing", void 0, event2);
    this.#timeRAF.start();
  }
  #onStalled(event2) {
    this.#ctx.notify("stalled", void 0, event2);
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify("waiting", void 0, event2);
    }
  }
  #onWaiting(event2) {
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify("waiting", void 0, event2);
    }
  }
  #onEnded(event2) {
    this.#timeRAF.stop();
    this.#updateCurrentTime(this.#media.duration, event2);
    this.#ctx.notify("end", void 0, event2);
    if (this.#ctx.$state.loop()) {
      const hasCustomControls = isNil(this.#media.controls);
      if (hasCustomControls) this.#media.controls = false;
    }
  }
  #attachTimeUpdate() {
    const isPaused = this.#ctx.$state.paused(), isPageHidden = this.#pageVisibility.visibility === "hidden", shouldListenToTimeUpdates = isPaused || isPageHidden;
    if (shouldListenToTimeUpdates) {
      listenEvent(this.#media, "timeupdate", this.#onTimeUpdate.bind(this));
    }
  }
  #onTimeUpdate(event2) {
    this.#updateCurrentTime(this.#media.currentTime, event2);
  }
  #onDurationChange(event2) {
    if (this.#ctx.$state.ended()) {
      this.#updateCurrentTime(this.#media.duration, event2);
    }
    this.#ctx.notify("duration-change", this.#media.duration, event2);
  }
  #onVolumeChange(event2) {
    const detail = {
      volume: this.#media.volume,
      muted: this.#media.muted
    };
    this.#ctx.notify("volume-change", detail, event2);
  }
  #onSeeked(event2) {
    this.#seekedTo = this.#media.currentTime;
    this.#updateCurrentTime(this.#media.currentTime, event2);
    this.#ctx.notify("seeked", this.#media.currentTime, event2);
    if (Math.trunc(this.#media.currentTime) === Math.trunc(this.#media.duration) && getNumberOfDecimalPlaces(this.#media.duration) > getNumberOfDecimalPlaces(this.#media.currentTime)) {
      this.#updateCurrentTime(this.#media.duration, event2);
      if (!this.#media.ended) {
        this.#ctx.player.dispatch(
          new DOMEvent("media-play-request", {
            trigger: event2
          })
        );
      }
    }
  }
  #onSeeking(event2) {
    this.#ctx.notify("seeking", this.#media.currentTime, event2);
  }
  #onProgress(event2) {
    const detail = {
      buffered: this.#media.buffered,
      seekable: this.#media.seekable
    };
    this.#ctx.notify("progress", detail, event2);
  }
  #onSuspend(event2) {
    this.#ctx.notify("suspend", void 0, event2);
  }
  #onRateChange(event2) {
    this.#ctx.notify("rate-change", this.#media.playbackRate, event2);
  }
  #onError(event2) {
    const error = this.#media.error;
    if (!error) return;
    const detail = {
      message: error.message,
      code: error.code,
      mediaError: error
    };
    this.#ctx.notify("error", detail, event2);
  }
}

class NativeAudioTracks {
  #provider;
  #ctx;
  get #nativeTracks() {
    return this.#provider.media.audioTracks;
  }
  constructor(provider, ctx) {
    this.#provider = provider;
    this.#ctx = ctx;
    this.#nativeTracks.onaddtrack = this.#onAddNativeTrack.bind(this);
    this.#nativeTracks.onremovetrack = this.#onRemoveNativeTrack.bind(this);
    this.#nativeTracks.onchange = this.#onChangeNativeTrack.bind(this);
    listenEvent(this.#ctx.audioTracks, "change", this.#onChangeTrack.bind(this));
  }
  #onAddNativeTrack(event) {
    const nativeTrack = event.track;
    if (nativeTrack.label === "") return;
    const id = nativeTrack.id.toString() || `native-audio-${this.#ctx.audioTracks.length}`, audioTrack = {
      id,
      label: nativeTrack.label,
      language: nativeTrack.language,
      kind: nativeTrack.kind,
      selected: false
    };
    this.#ctx.audioTracks[ListSymbol.add](audioTrack, event);
    if (nativeTrack.enabled) audioTrack.selected = true;
  }
  #onRemoveNativeTrack(event) {
    const track = this.#ctx.audioTracks.getById(event.track.id);
    if (track) this.#ctx.audioTracks[ListSymbol.remove](track, event);
  }
  #onChangeNativeTrack(event) {
    let enabledTrack = this.#getEnabledNativeTrack();
    if (!enabledTrack) return;
    const track = this.#ctx.audioTracks.getById(enabledTrack.id);
    if (track) this.#ctx.audioTracks[ListSymbol.select](track, true, event);
  }
  #getEnabledNativeTrack() {
    return Array.from(this.#nativeTracks).find((track) => track.enabled);
  }
  #onChangeTrack(event) {
    const { current } = event.detail;
    if (!current) return;
    const track = this.#nativeTracks.getTrackById(current.id);
    if (track) {
      const prev = this.#getEnabledNativeTrack();
      if (prev) prev.enabled = false;
      track.enabled = true;
    }
  }
}

class HTMLMediaProvider {
  constructor(media, ctx) {
    this.media = media;
    this.ctx = ctx;
    this.audioGain = new AudioGain(media, (gain) => {
      this.ctx.notify("audio-gain-change", gain);
    });
  }
  scope = createScope();
  currentSrc = null;
  audioGain;
  setup() {
    new HTMLMediaEvents(this, this.ctx);
    if ("audioTracks" in this.media) new NativeAudioTracks(this, this.ctx);
    onDispose(() => {
      this.audioGain.destroy();
      this.media.srcObject = null;
      this.media.removeAttribute("src");
      for (const source of this.media.querySelectorAll("source")) source.remove();
      this.media.load();
    });
  }
  get type() {
    return "";
  }
  setPlaybackRate(rate) {
    this.media.playbackRate = rate;
  }
  async play() {
    return this.media.play();
  }
  async pause() {
    return this.media.pause();
  }
  setMuted(muted) {
    this.media.muted = muted;
  }
  setVolume(volume) {
    this.media.volume = volume;
  }
  setCurrentTime(time) {
    this.media.currentTime = time;
  }
  setPlaysInline(inline) {
    setAttribute(this.media, "playsinline", inline);
  }
  async loadSource({ src, type }, preload) {
    this.media.preload = preload || "";
    if (isMediaStream(src)) {
      this.removeSource();
      this.media.srcObject = src;
    } else {
      this.media.srcObject = null;
      if (isString(src)) {
        if (type !== "?") {
          this.appendSource({ src, type });
        } else {
          this.removeSource();
          this.media.src = this.#appendMediaFragment(src);
        }
      } else {
        this.removeSource();
        this.media.src = window.URL.createObjectURL(src);
      }
    }
    this.media.load();
    this.currentSrc = { src, type };
  }
  /**
   * Append source so it works when requesting AirPlay since hls.js will remove it.
   */
  appendSource(src, defaultType) {
    const prevSource = this.media.querySelector("source[data-vds]"), source = prevSource ?? document.createElement("source");
    setAttribute(source, "src", this.#appendMediaFragment(src.src));
    setAttribute(source, "type", src.type !== "?" ? src.type : defaultType);
    setAttribute(source, "data-vds", "");
    if (!prevSource) this.media.append(source);
  }
  removeSource() {
    this.media.querySelector("source[data-vds]")?.remove();
  }
  #appendMediaFragment(src) {
    const { clipStartTime, clipEndTime } = this.ctx.$state, startTime = clipStartTime(), endTime = clipEndTime();
    if (startTime > 0 && endTime > 0) {
      return `${src}#t=${startTime},${endTime}`;
    } else if (startTime > 0) {
      return `${src}#t=${startTime}`;
    } else if (endTime > 0) {
      return `${src}#t=0,${endTime}`;
    }
    return src;
  }
}

export { HTMLMediaProvider };
