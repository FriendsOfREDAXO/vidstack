import { createScope, signal, effect, peek, isString, deferredPromise, listenEvent, isArray } from '../chunks/vidstack-CRlI3Mh7.js';
import { QualitySymbol } from '../chunks/vidstack-B01xzxC4.js';
import { TimeRange } from '../chunks/vidstack-BmMUBVGQ.js';
import { TextTrack } from '../chunks/vidstack-oyBGi0R4.js';
import { ListSymbol } from '../chunks/vidstack-D5EzK014.js';
import { RAFLoop } from '../chunks/vidstack-DSYpsFWk.js';
import { preconnect } from '../chunks/vidstack-A9j--j6J.js';
import { EmbedProvider } from '../chunks/vidstack-BePVaxm4.js';
import { resolveVimeoVideoId, getVimeoVideoInfo } from '../chunks/vidstack-krOAtKMi.js';
import '../chunks/vidstack-DE4XvkHU.js';
import '../chunks/vidstack-DwhHIY5e.js';

const trackedVimeoEvents = [
  "bufferend",
  "bufferstart",
  // 'cuechange',
  "durationchange",
  "ended",
  "enterpictureinpicture",
  "error",
  "fullscreenchange",
  "leavepictureinpicture",
  "loaded",
  // 'loadeddata',
  // 'loadedmetadata',
  // 'loadstart',
  "playProgress",
  "loadProgress",
  "pause",
  "play",
  "playbackratechange",
  // 'progress',
  "qualitychange",
  "seeked",
  "seeking",
  // 'texttrackchange',
  "timeupdate",
  "volumechange",
  "waiting"
  // 'adstarted',
  // 'adcompleted',
  // 'aderror',
  // 'adskipped',
  // 'adallcompleted',
  // 'adclicked',
  // 'chapterchange',
  // 'chromecastconnected',
  // 'remoteplaybackavailabilitychange',
  // 'remoteplaybackconnecting',
  // 'remoteplaybackconnect',
  // 'remoteplaybackdisconnect',
  // 'liveeventended',
  // 'liveeventstarted',
  // 'livestreamoffline',
  // 'livestreamonline',
];

class VimeoProvider extends EmbedProvider {
  $$PROVIDER_TYPE = "VIMEO";
  scope = createScope();
  fullscreen;
  #ctx;
  #videoId = signal("");
  #pro = signal(false);
  #hash = null;
  #currentSrc = null;
  #fullscreenActive = false;
  #seekableRange = new TimeRange(0, 0);
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #currentCue = null;
  #chaptersTrack = null;
  #promises = /* @__PURE__ */ new Map();
  #videoInfoPromise = null;
  constructor(iframe, ctx) {
    super(iframe);
    this.#ctx = ctx;
    const self = this;
    this.fullscreen = {
      get active() {
        return self.#fullscreenActive;
      },
      supported: true,
      enter: () => this.#remote("requestFullscreen"),
      exit: () => this.#remote("exitFullscreen")
    };
  }
  /**
   * Whether tracking session data should be enabled on the embed, including cookies and analytics.
   * This is turned off by default to be GDPR-compliant.
   *
   * @defaultValue `false`
   */
  cookies = false;
  title = true;
  byline = true;
  portrait = true;
  color = "00ADEF";
  get type() {
    return "vimeo";
  }
  get currentSrc() {
    return this.#currentSrc;
  }
  get videoId() {
    return this.#videoId();
  }
  get hash() {
    return this.#hash;
  }
  get isPro() {
    return this.#pro();
  }
  preconnect() {
    preconnect(this.getOrigin());
  }
  setup() {
    super.setup();
    effect(this.#watchVideoId.bind(this));
    effect(this.#watchVideoInfo.bind(this));
    effect(this.#watchPro.bind(this));
    this.#ctx.notify("provider-setup", this);
  }
  destroy() {
    this.#reset();
    this.fullscreen = void 0;
    const message = "provider destroyed";
    for (const promises of this.#promises.values()) {
      for (const { reject } of promises) reject(message);
    }
    this.#promises.clear();
    this.#remote("destroy");
  }
  async play() {
    return this.#remote("play");
  }
  async pause() {
    return this.#remote("pause");
  }
  setMuted(muted) {
    this.#remote("setMuted", muted);
  }
  setCurrentTime(time) {
    this.#remote("seekTo", time);
    this.#ctx.notify("seeking", time);
  }
  setVolume(volume) {
    this.#remote("setVolume", volume);
    this.#remote("setMuted", peek(this.#ctx.$state.muted));
  }
  setPlaybackRate(rate) {
    this.#remote("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this.#currentSrc = null;
      this.#hash = null;
      this.#videoId.set("");
      return;
    }
    const { videoId, hash } = resolveVimeoVideoId(src.src);
    this.#videoId.set(videoId ?? "");
    this.#hash = hash ?? null;
    this.#currentSrc = src;
  }
  #watchVideoId() {
    this.#reset();
    const videoId = this.#videoId();
    if (!videoId) {
      this.src.set("");
      return;
    }
    this.src.set(`${this.getOrigin()}/video/${videoId}`);
    this.#ctx.notify("load-start");
  }
  #watchVideoInfo() {
    const videoId = this.#videoId();
    if (!videoId) return;
    const promise = deferredPromise(), abort = new AbortController();
    this.#videoInfoPromise = promise;
    getVimeoVideoInfo(videoId, abort, this.#hash).then((info) => {
      promise.resolve(info);
    }).catch((e) => {
      promise.reject();
    });
    return () => {
      promise.reject();
      abort.abort();
    };
  }
  #watchPro() {
    const isPro = this.#pro(), { $state, qualities } = this.#ctx;
    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol.setReadonly](!isPro);
    if (isPro) {
      return listenEvent(qualities, "change", () => {
        if (qualities.auto) return;
        const id = qualities.selected?.id;
        if (id) this.#remote("setQuality", id);
      });
    }
  }
  getOrigin() {
    return "https://player.vimeo.com";
  }
  buildParams() {
    const { keyDisabled } = this.#ctx.$props, { playsInline, nativeControls } = this.#ctx.$state, showControls = nativeControls();
    return {
      title: this.title,
      byline: this.byline,
      color: this.color,
      portrait: this.portrait,
      controls: showControls,
      h: this.hash,
      keyboard: showControls && !keyDisabled(),
      transparent: true,
      playsinline: playsInline(),
      dnt: !this.cookies
    };
  }
  #onAnimationFrame() {
    this.#remote("getCurrentTime");
  }
  // Embed will sometimes dispatch 0 at end of playback.
  #preventTimeUpdates = false;
  #onTimeUpdate(time, trigger) {
    if (this.#preventTimeUpdates && time === 0) return;
    const { realCurrentTime, paused, bufferedEnd, seekableEnd, live } = this.#ctx.$state;
    if (realCurrentTime() === time) return;
    const prevTime = realCurrentTime();
    this.#ctx.notify("time-change", time, trigger);
    if (Math.abs(prevTime - time) > 1.5) {
      this.#ctx.notify("seeking", time, trigger);
      if (!paused() && bufferedEnd() < time) {
        this.#ctx.notify("waiting", void 0, trigger);
      }
    }
    if (!live() && seekableEnd() - time < 0.01) {
      this.#ctx.notify("end", void 0, trigger);
      this.#preventTimeUpdates = true;
      setTimeout(() => {
        this.#preventTimeUpdates = false;
      }, 500);
    }
  }
  #onSeeked(time, trigger) {
    this.#ctx.notify("seeked", time, trigger);
  }
  #onLoaded(trigger) {
    const videoId = this.#videoId();
    this.#videoInfoPromise?.promise.then((info) => {
      if (!info) return;
      const { title, poster, duration, pro } = info;
      this.#pro.set(pro);
      this.#ctx.notify("title-change", title, trigger);
      this.#ctx.notify("poster-change", poster, trigger);
      this.#ctx.notify("duration-change", duration, trigger);
      this.#onReady(duration, trigger);
    }).catch(() => {
      if (videoId !== this.#videoId()) return;
      this.#remote("getVideoTitle");
      this.#remote("getDuration");
    });
  }
  #onReady(duration, trigger) {
    const { nativeControls } = this.#ctx.$state, showEmbedControls = nativeControls();
    this.#seekableRange = new TimeRange(0, duration);
    const detail = {
      buffered: new TimeRange(0, 0),
      seekable: this.#seekableRange,
      duration
    };
    this.#ctx.delegate.ready(detail, trigger);
    if (!showEmbedControls) {
      this.#remote("_hideOverlay");
    }
    this.#remote("getQualities");
    this.#remote("getChapters");
  }
  #onMethod(method, data, trigger) {
    switch (method) {
      case "getVideoTitle":
        const videoTitle = data;
        this.#ctx.notify("title-change", videoTitle, trigger);
        break;
      case "getDuration":
        const duration = data;
        if (!this.#ctx.$state.canPlay()) {
          this.#onReady(duration, trigger);
        } else {
          this.#ctx.notify("duration-change", duration, trigger);
        }
        break;
      case "getCurrentTime":
        this.#onTimeUpdate(data, trigger);
        break;
      case "getBuffered":
        if (isArray(data) && data.length) {
          this.#onLoadProgress(data[data.length - 1][1], trigger);
        }
        break;
      case "setMuted":
        this.#onVolumeChange(peek(this.#ctx.$state.volume), data, trigger);
        break;
      // case 'getTextTracks':
      //   this.#onTextTracksChange(data as VimeoTextTrack[], trigger);
      //   break;
      case "getChapters":
        this.#onChaptersChange(data);
        break;
      case "getQualities":
        this.#onQualitiesChange(data, trigger);
        break;
    }
    this.#getPromise(method)?.resolve();
  }
  #attachListeners() {
    for (const type of trackedVimeoEvents) {
      this.#remote("addEventListener", type);
    }
  }
  #onPause(trigger) {
    this.#timeRAF.stop();
    this.#ctx.notify("pause", void 0, trigger);
  }
  #onPlay(trigger) {
    this.#timeRAF.start();
    this.#ctx.notify("play", void 0, trigger);
  }
  #onPlayProgress(trigger) {
    const { paused } = this.#ctx.$state;
    if (!paused() && !this.#preventTimeUpdates) {
      this.#ctx.notify("playing", void 0, trigger);
    }
  }
  #onLoadProgress(buffered, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this.#seekableRange
    };
    this.#ctx.notify("progress", detail, trigger);
  }
  #onBufferStart(trigger) {
    this.#ctx.notify("waiting", void 0, trigger);
  }
  #onBufferEnd(trigger) {
    const { paused } = this.#ctx.$state;
    if (!paused()) this.#ctx.notify("playing", void 0, trigger);
  }
  #onWaiting(trigger) {
    const { paused } = this.#ctx.$state;
    if (paused()) {
      this.#ctx.notify("play", void 0, trigger);
    }
    this.#ctx.notify("waiting", void 0, trigger);
  }
  #onVolumeChange(volume, muted, trigger) {
    const detail = { volume, muted };
    this.#ctx.notify("volume-change", detail, trigger);
  }
  // #onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
  //   const textTrack = this.#ctx.textTracks.toArray().find((t) => t.language === track.language);
  //   if (textTrack) textTrack.mode = track.mode;
  // }
  // #onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
  //   for (const init of tracks) {
  //     const textTrack = new TextTrack({
  //       ...init,
  //       label: init.label.replace('auto-generated', 'auto'),
  //     });
  //     textTrack[TextTrackSymbol.readyState] = 2;
  //     this.#ctx.textTracks.add(textTrack, trigger);
  //     textTrack.setMode(init.mode, trigger);
  //   }
  // }
  // #onCueChange(cue: VimeoTextCue, trigger: Event) {
  //   const { textTracks, $state } = this.#ctx,
  //     { currentTime } = $state,
  //     track = textTracks.selected;
  //   if (this.#currentCue) track?.removeCue(this.#currentCue, trigger);
  //   this.#currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
  //   track?.addCue(this.#currentCue, trigger);
  // }
  #onChaptersChange(chapters) {
    this.#removeChapters();
    if (!chapters.length) return;
    const track = new TextTrack({
      kind: "chapters",
      default: true
    }), { seekableEnd } = this.#ctx.$state;
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i], nextChapter = chapters[i + 1];
      track.addCue(
        new window.VTTCue(
          chapter.startTime,
          nextChapter?.startTime ?? seekableEnd(),
          chapter.title
        )
      );
    }
    this.#chaptersTrack = track;
    this.#ctx.textTracks.add(track);
  }
  #removeChapters() {
    if (!this.#chaptersTrack) return;
    this.#ctx.textTracks.remove(this.#chaptersTrack);
    this.#chaptersTrack = null;
  }
  #onQualitiesChange(qualities, trigger) {
    this.#ctx.qualities[QualitySymbol.enableAuto] = qualities.some((q) => q.id === "auto") ? () => this.#remote("setQuality", "auto") : void 0;
    for (const quality of qualities) {
      if (quality.id === "auto") continue;
      const height = +quality.id.slice(0, -1);
      if (isNaN(height)) continue;
      this.#ctx.qualities[ListSymbol.add](
        {
          id: quality.id,
          width: height * (16 / 9),
          height,
          codec: "avc1,h.264",
          bitrate: -1
        },
        trigger
      );
    }
    this.#onQualityChange(
      qualities.find((q) => q.active),
      trigger
    );
  }
  #onQualityChange({ id } = {}, trigger) {
    if (!id) return;
    const isAuto = id === "auto", newQuality = this.#ctx.qualities.getById(id);
    if (isAuto) {
      this.#ctx.qualities[QualitySymbol.setAuto](isAuto, trigger);
      this.#ctx.qualities[ListSymbol.select](void 0, true, trigger);
    } else {
      this.#ctx.qualities[ListSymbol.select](newQuality ?? void 0, true, trigger);
    }
  }
  #onEvent(event, payload, trigger) {
    switch (event) {
      case "ready":
        this.#attachListeners();
        break;
      case "loaded":
        this.#onLoaded(trigger);
        break;
      case "play":
        this.#onPlay(trigger);
        break;
      case "playProgress":
        this.#onPlayProgress(trigger);
        break;
      case "pause":
        this.#onPause(trigger);
        break;
      case "loadProgress":
        this.#onLoadProgress(payload.seconds, trigger);
        break;
      case "waiting":
        this.#onWaiting(trigger);
        break;
      case "bufferstart":
        this.#onBufferStart(trigger);
        break;
      case "bufferend":
        this.#onBufferEnd(trigger);
        break;
      case "volumechange":
        this.#onVolumeChange(payload.volume, peek(this.#ctx.$state.muted), trigger);
        break;
      case "durationchange":
        this.#seekableRange = new TimeRange(0, payload.duration);
        this.#ctx.notify("duration-change", payload.duration, trigger);
        break;
      case "playbackratechange":
        this.#ctx.notify("rate-change", payload.playbackRate, trigger);
        break;
      case "qualitychange":
        this.#onQualityChange(payload, trigger);
        break;
      case "fullscreenchange":
        this.#fullscreenActive = payload.fullscreen;
        this.#ctx.notify("fullscreen-change", payload.fullscreen, trigger);
        break;
      case "enterpictureinpicture":
        this.#ctx.notify("picture-in-picture-change", true, trigger);
        break;
      case "leavepictureinpicture":
        this.#ctx.notify("picture-in-picture-change", false, trigger);
        break;
      case "ended":
        this.#ctx.notify("end", void 0, trigger);
        break;
      case "error":
        this.#onError(payload, trigger);
        break;
      case "seek":
      case "seeked":
        this.#onSeeked(payload.seconds, trigger);
        break;
    }
  }
  #onError(error, trigger) {
    const { message, method } = error;
    if (method === "setPlaybackRate") {
      this.#pro.set(false);
    }
    if (method) {
      this.#getPromise(method)?.reject(message);
    }
  }
  onMessage(message, event) {
    if (message.event) {
      this.#onEvent(message.event, message.data, event);
    } else if (message.method) {
      this.#onMethod(message.method, message.value, event);
    }
  }
  onLoad() {
  }
  async #remote(command, arg) {
    let promise = deferredPromise(), promises = this.#promises.get(command);
    if (!promises) this.#promises.set(command, promises = []);
    promises.push(promise);
    this.postMessage({
      method: command,
      value: arg
    });
    return promise.promise;
  }
  #reset() {
    this.#timeRAF.stop();
    this.#seekableRange = new TimeRange(0, 0);
    this.#videoInfoPromise = null;
    this.#currentCue = null;
    this.#pro.set(false);
    this.#removeChapters();
  }
  #getPromise(command) {
    return this.#promises.get(command)?.shift();
  }
}

export { VimeoProvider };
