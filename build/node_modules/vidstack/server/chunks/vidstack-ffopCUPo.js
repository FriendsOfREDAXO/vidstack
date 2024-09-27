import { waitTimeout, isArray, isUndefined, isString, isBoolean, deferredPromise, isNull, listenEvent, scoped, getScope, EventsTarget, DOMEvent, isNumber, State, tick } from './vidstack-1-opvwuv.js';

const IS_IPHONE = false;
const IS_CHROME = false;
function canOrientScreen() {
  return canRotateScreen();
}
function canRotateScreen() {
  return false;
}
function canPlayVideoType(video, type) {
  return false;
}
function canPlayHLSNatively(video) {
  return false;
}
function canUsePictureInPicture(video) {
  return false;
}
function canUseVideoPresentation(video) {
  return false;
}
async function canChangeVolume() {
  const video = document.createElement("video");
  video.volume = 0.5;
  await waitTimeout(0);
  return video.volume === 0.5;
}
function isHLSSupported() {
  return false;
}
function isDASHSupported() {
  return isHLSSupported();
}

class TimeRange {
  #ranges;
  get length() {
    return this.#ranges.length;
  }
  constructor(start, end) {
    if (isArray(start)) {
      this.#ranges = start;
    } else if (!isUndefined(start) && !isUndefined(end)) {
      this.#ranges = [[start, end]];
    } else {
      this.#ranges = [];
    }
  }
  start(index) {
    return this.#ranges[index][0] ?? Infinity;
  }
  end(index) {
    return this.#ranges[index][1] ?? Infinity;
  }
}
function getTimeRangesStart(range) {
  if (!range.length) return null;
  let min = range.start(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.start(i);
    if (value < min) min = value;
  }
  return min;
}
function getTimeRangesEnd(range) {
  if (!range.length) return null;
  let max = range.end(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.end(i);
    if (value > max) max = value;
  }
  return max;
}
function normalizeTimeIntervals(intervals) {
  if (intervals.length <= 1) {
    return intervals;
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let normalized = [], current = intervals[0];
  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (current[1] >= next[0] - 1) {
      current = [current[0], Math.max(current[1], next[1])];
    } else {
      normalized.push(current);
      current = next;
    }
  }
  normalized.push(current);
  return normalized;
}
function updateTimeIntervals(intervals, interval, value) {
  let start = interval[0], end = interval[1];
  if (value < start) {
    return [value, -1];
  } else if (value === start) {
    return interval;
  } else if (start === -1) {
    interval[0] = value;
    return interval;
  } else if (value > start) {
    interval[1] = value;
    if (end === -1) intervals.push(interval);
  }
  normalizeTimeIntervals(intervals);
  return interval;
}

const AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|flac)($|\?)/i;
const AUDIO_TYPES = /* @__PURE__ */ new Set([
  "audio/mpeg",
  "audio/ogg",
  "audio/3gp",
  "audio/mp3",
  "audio/webm",
  "audio/flac",
  "audio/m4a",
  "audio/m4b",
  "audio/mp4a",
  "audio/mp4"
]);
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
const VIDEO_TYPES = /* @__PURE__ */ new Set([
  "video/mp4",
  "video/webm",
  "video/3gp",
  "video/ogg",
  "video/avi",
  "video/mpeg"
]);
const HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_VIDEO_EXTENSIONS = /\.(mpd)($|\?)/i;
const HLS_VIDEO_TYPES = /* @__PURE__ */ new Set([
  // Apple sanctioned
  "application/vnd.apple.mpegurl",
  // Apple sanctioned for backwards compatibility
  "audio/mpegurl",
  // Very common
  "audio/x-mpegurl",
  // Very common
  "application/x-mpegurl",
  // Included for completeness
  "video/x-mpegurl",
  "video/mpegurl",
  "application/mpegurl"
]);
const DASH_VIDEO_TYPES = /* @__PURE__ */ new Set(["application/dash+xml"]);
function isAudioSrc({ src, type }) {
  return isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
}
function isVideoSrc(src) {
  return isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && true : src.type === "video/object";
}
function isHLSSrc({ src, type }) {
  return isString(src) && HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
}
function isDASHSrc({ src, type }) {
  return isString(src) && DASH_VIDEO_EXTENSIONS.test(src) || DASH_VIDEO_TYPES.has(type);
}
function canGoogleCastSrc(src) {
  return isString(src.src) && (isAudioSrc(src) || isVideoSrc(src) || isHLSSrc(src));
}
function isMediaStream(src) {
  return false;
}

function preconnect(url, rel = "preconnect") {
  return false;
}
const pendingRequests = {};
function loadScript(src) {
  if (pendingRequests[src]) return pendingRequests[src].promise;
  const promise = deferredPromise(), exists = document.querySelector(`script[src="${src}"]`);
  if (!isNull(exists)) {
    promise.resolve();
    return promise.promise;
  }
  pendingRequests[src] = promise;
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };
  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };
  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}
function getRequestCredentials(crossOrigin) {
  return crossOrigin === "use-credentials" ? "include" : isString(crossOrigin) ? "same-origin" : void 0;
}
function getDownloadFile({
  title,
  src,
  download
}) {
  const url = isBoolean(download) || download === "" ? src.src : isString(download) ? download : download?.url;
  if (!isValidFileDownload({ url, src, download })) return null;
  return {
    url,
    name: !isBoolean(download) && !isString(download) && download?.filename || title.toLowerCase() || "media"
  };
}
function isValidFileDownload({
  url,
  src,
  download
}) {
  return isString(url) && (download && download !== true || isAudioSrc(src) || isVideoSrc(src));
}

const CROSS_ORIGIN = Symbol(0), READY_STATE = Symbol(0), UPDATE_ACTIVE_CUES = Symbol(0), CAN_LOAD = Symbol(0), ON_MODE_CHANGE = Symbol(0), NATIVE = Symbol(0), NATIVE_HLS = Symbol(0);
const TextTrackSymbol = {
  crossOrigin: CROSS_ORIGIN,
  readyState: READY_STATE,
  updateActiveCues: UPDATE_ACTIVE_CUES,
  canLoad: CAN_LOAD,
  onModeChange: ON_MODE_CHANGE,
  native: NATIVE,
  nativeHLS: NATIVE_HLS
};

function findActiveCue(cues, time) {
  for (let i = 0, len = cues.length; i < len; i++) {
    if (isCueActive(cues[i], time)) return cues[i];
  }
  return null;
}
function isCueActive(cue, time) {
  return time >= cue.startTime && time < cue.endTime;
}
function watchActiveTextTrack(tracks, kind, onChange) {
  let currentTrack = null, scope = getScope();
  function onModeChange() {
    const kinds = isString(kind) ? [kind] : kind, track = tracks.toArray().find((track2) => kinds.includes(track2.kind) && track2.mode === "showing");
    if (track === currentTrack) return;
    if (!track) {
      onChange(null);
      currentTrack = null;
      return;
    }
    if (track.readyState == 2) {
      onChange(track);
    } else {
      onChange(null);
      scoped(() => {
      }, scope);
    }
    currentTrack = track;
  }
  onModeChange();
  return listenEvent();
}
function watchCueTextChange(tracks, kind, callback) {
  watchActiveTextTrack(tracks, kind, (track) => {
    if (!track) {
      callback("");
      return;
    }
    const onCueChange = () => {
      const activeCue = track?.activeCues[0];
      callback(activeCue?.text || "");
    };
    onCueChange();
  });
}

class TextTrack extends EventsTarget {
  static createId(track) {
    return `vds-${track.type}-${track.kind}-${track.src ?? track.label ?? "?"}`;
  }
  src;
  content;
  type;
  encoding;
  id = "";
  label = "";
  language = "";
  kind;
  default = false;
  #canLoad = false;
  #currentTime = 0;
  #mode = "disabled";
  #metadata = {};
  #regions = [];
  #cues = [];
  #activeCues = [];
  /** @internal */
  [TextTrackSymbol.readyState] = 0;
  /** @internal */
  [TextTrackSymbol.crossOrigin];
  /** @internal */
  [TextTrackSymbol.onModeChange] = null;
  /** @internal */
  [TextTrackSymbol.native] = null;
  get metadata() {
    return this.#metadata;
  }
  get regions() {
    return this.#regions;
  }
  get cues() {
    return this.#cues;
  }
  get activeCues() {
    return this.#activeCues;
  }
  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState() {
    return this[TextTrackSymbol.readyState];
  }
  get mode() {
    return this.#mode;
  }
  set mode(mode) {
    this.setMode(mode);
  }
  constructor(init) {
    super();
    for (const prop of Object.keys(init)) this[prop] = init[prop];
    if (!this.type) this.type = "vtt";
    if (!init.src) {
      this[TextTrackSymbol.readyState] = 2;
    }
  }
  addCue(cue, trigger) {
    let i = 0, length = this.#cues.length;
    for (i = 0; i < length; i++) if (cue.endTime <= this.#cues[i].startTime) break;
    if (i === length) this.#cues.push(cue);
    else this.#cues.splice(i, 0, cue);
    if (!(cue instanceof TextTrackCue)) {
      this[TextTrackSymbol.native]?.track.addCue(cue);
    }
    this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
    if (isCueActive(cue, this.#currentTime)) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    }
  }
  removeCue(cue, trigger) {
    const index = this.#cues.indexOf(cue);
    if (index >= 0) {
      const isActive = this.#activeCues.includes(cue);
      this.#cues.splice(index, 1);
      this[TextTrackSymbol.native]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    if (this.#mode === mode) return;
    this.#mode = mode;
    if (mode === "disabled") {
      this.#activeCues = [];
      this.#activeCuesChanged();
    } else if (this.readyState === 2) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    } else {
      this.#load();
    }
    this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
    this[TextTrackSymbol.onModeChange]?.();
  }
  /** @internal */
  [TextTrackSymbol.updateActiveCues](currentTime, trigger) {
    this.#currentTime = currentTime;
    if (this.mode === "disabled" || !this.#cues.length) return;
    const activeCues = [];
    for (let i = 0, length = this.#cues.length; i < length; i++) {
      const cue = this.#cues[i];
      if (isCueActive(cue, currentTime)) activeCues.push(cue);
    }
    let changed = activeCues.length !== this.#activeCues.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.#activeCues.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }
    this.#activeCues = activeCues;
    if (changed) this.#activeCuesChanged(trigger);
  }
  /** @internal */
  [TextTrackSymbol.canLoad]() {
    this.#canLoad = true;
    if (this.#mode !== "disabled") this.#load();
  }
  #parseContent(init) {
    import('media-captions').then(({ parseText, VTTCue, VTTRegion }) => {
      if (!isString(init.content) || init.type === "json") {
        this.#parseJSON(init.content, VTTCue, VTTRegion);
        if (this.readyState !== 3) this.#ready();
      } else {
        parseText(init.content, { type: init.type }).then(({ cues, regions }) => {
          this.#cues = cues;
          this.#regions = regions;
          this.#ready();
        });
      }
    });
  }
  async #load() {
    if (!this.#canLoad || this[TextTrackSymbol.readyState] > 0) return;
    this[TextTrackSymbol.readyState] = 1;
    this.dispatchEvent(new DOMEvent("load-start"));
    if (!this.src) {
      this.#ready();
      return;
    }
    try {
      const { parseResponse, VTTCue, VTTRegion } = await import('media-captions'), crossOrigin = this[TextTrackSymbol.crossOrigin]?.();
      const response = fetch(this.src, {
        headers: this.type === "json" ? { "Content-Type": "application/json" } : void 0,
        credentials: getRequestCredentials(crossOrigin)
      });
      if (this.type === "json") {
        this.#parseJSON(await (await response).text(), VTTCue, VTTRegion);
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding
        });
        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this.#metadata = metadata;
          this.#regions = regions;
          this.#cues = cues;
        }
      }
      this.#ready();
    } catch (error) {
      this.#error(error);
    }
  }
  #ready() {
    this[TextTrackSymbol.readyState] = 2;
    if (!this.src || this.type !== "vtt") {
      const native = this[TextTrackSymbol.native];
      if (native && !native.managed) {
        for (const cue of this.#cues) native.track.addCue(cue);
      }
    }
    const loadEvent = new DOMEvent("load");
    this[TextTrackSymbol.updateActiveCues](this.#currentTime, loadEvent);
    this.dispatchEvent(loadEvent);
  }
  #error(error) {
    this[TextTrackSymbol.readyState] = 3;
    this.dispatchEvent(new DOMEvent("error", { detail: error }));
  }
  #parseJSON(json, VTTCue, VTTRegion) {
    try {
      const { regions, cues } = parseJSONCaptionsFile(json, VTTCue, VTTRegion);
      this.#regions = regions;
      this.#cues = cues;
    } catch (error) {
      this.#error(error);
    }
  }
  #activeCuesChanged(trigger) {
    this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
  }
}
const captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}
function parseJSONCaptionsFile(json, Cue, Region) {
  const content = isString(json) ? JSON.parse(json) : json;
  let regions = [], cues = [];
  if (content.regions && Region) {
    regions = content.regions.map((region) => Object.assign(new Region(), region));
  }
  if (content.cues || isArray(content)) {
    cues = (isArray(content) ? content : content.cues).filter((content2) => isNumber(content2.startTime) && isNumber(content2.endTime)).map((cue) => Object.assign(new Cue(0, 0, ""), cue));
  }
  return { regions, cues };
}

const mediaState = new State({
  artist: "",
  artwork: null,
  audioTrack: null,
  audioTracks: [],
  autoPlay: false,
  autoPlayError: null,
  audioGain: null,
  buffered: new TimeRange(),
  canLoad: false,
  canLoadPoster: false,
  canFullscreen: false,
  canOrientScreen: canOrientScreen(),
  canPictureInPicture: false,
  canPlay: false,
  clipStartTime: 0,
  clipEndTime: 0,
  controls: false,
  get iOSControls() {
    return IS_IPHONE;
  },
  get nativeControls() {
    return this.controls || this.iOSControls;
  },
  controlsVisible: false,
  get controlsHidden() {
    return !this.controlsVisible;
  },
  crossOrigin: null,
  ended: false,
  error: null,
  fullscreen: false,
  get loop() {
    return this.providedLoop || this.userPrefersLoop;
  },
  logLevel: "silent",
  mediaType: "unknown",
  muted: false,
  paused: true,
  played: new TimeRange(),
  playing: false,
  playsInline: false,
  pictureInPicture: false,
  preload: "metadata",
  playbackRate: 1,
  qualities: [],
  quality: null,
  autoQuality: false,
  canSetQuality: true,
  canSetPlaybackRate: true,
  canSetVolume: false,
  canSetAudioGain: false,
  seekable: new TimeRange(),
  seeking: false,
  source: { src: "", type: "" },
  sources: [],
  started: false,
  textTracks: [],
  textTrack: null,
  get hasCaptions() {
    return this.textTracks.filter(isTrackCaptionKind).length > 0;
  },
  volume: 1,
  waiting: false,
  realCurrentTime: 0,
  get currentTime() {
    return this.ended ? this.duration : this.clipStartTime > 0 ? Math.max(0, Math.min(this.realCurrentTime - this.clipStartTime, this.duration)) : this.realCurrentTime;
  },
  providedDuration: -1,
  intrinsicDuration: 0,
  get duration() {
    return this.seekableWindow;
  },
  get title() {
    return this.providedTitle || this.inferredTitle;
  },
  get poster() {
    return this.providedPoster || this.inferredPoster;
  },
  get viewType() {
    return this.providedViewType !== "unknown" ? this.providedViewType : this.inferredViewType;
  },
  get streamType() {
    return this.providedStreamType !== "unknown" ? this.providedStreamType : this.inferredStreamType;
  },
  get currentSrc() {
    return this.source;
  },
  get bufferedStart() {
    const start = getTimeRangesStart(this.buffered) ?? 0;
    return Math.max(start, this.clipStartTime);
  },
  get bufferedEnd() {
    const end = getTimeRangesEnd(this.buffered) ?? 0;
    return Math.min(this.seekableEnd, Math.max(0, end - this.clipStartTime));
  },
  get bufferedWindow() {
    return Math.max(0, this.bufferedEnd - this.bufferedStart);
  },
  get seekableStart() {
    if (this.isLiveDVR && this.liveDVRWindow > 0) {
      return Math.max(0, this.seekableEnd - this.liveDVRWindow);
    }
    const start = getTimeRangesStart(this.seekable) ?? 0;
    return Math.max(start, this.clipStartTime);
  },
  get seekableEnd() {
    if (this.providedDuration > 0) return this.providedDuration;
    const end = this.liveSyncPosition > 0 ? this.liveSyncPosition : this.canPlay ? getTimeRangesEnd(this.seekable) ?? Infinity : 0;
    return this.clipEndTime > 0 ? Math.min(this.clipEndTime, end) : end;
  },
  get seekableWindow() {
    const window = this.seekableEnd - this.seekableStart;
    return !isNaN(window) ? Math.max(0, window) : Infinity;
  },
  // ~~ remote playback ~~
  canAirPlay: false,
  canGoogleCast: false,
  remotePlaybackState: "disconnected",
  remotePlaybackType: "none",
  remotePlaybackLoader: null,
  remotePlaybackInfo: null,
  get isAirPlayConnected() {
    return this.remotePlaybackType === "airplay" && this.remotePlaybackState === "connected";
  },
  get isGoogleCastConnected() {
    return this.remotePlaybackType === "google-cast" && this.remotePlaybackState === "connected";
  },
  // ~~ responsive design ~~
  pointer: "fine",
  orientation: "landscape",
  width: 0,
  height: 0,
  mediaWidth: 0,
  mediaHeight: 0,
  lastKeyboardAction: null,
  // ~~ user props ~~
  userBehindLiveEdge: false,
  // ~~ live props ~~
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  get canSeek() {
    return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.duration) && (!this.isLiveDVR || this.duration >= this.liveDVRWindow);
  },
  get live() {
    return this.streamType.includes("live") || !Number.isFinite(this.duration);
  },
  get liveEdgeStart() {
    return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, this.seekableEnd - this.liveEdgeTolerance) : 0;
  },
  get liveEdge() {
    return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart);
  },
  get liveEdgeWindow() {
    return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0;
  },
  get isLiveDVR() {
    return /:dvr/.test(this.streamType);
  },
  get liveDVRWindow() {
    return Math.max(this.inferredLiveDVRWindow, this.minLiveDVRWindow);
  },
  // ~~ internal props ~~
  autoPlaying: false,
  providedTitle: "",
  inferredTitle: "",
  providedLoop: false,
  userPrefersLoop: false,
  providedPoster: "",
  inferredPoster: "",
  inferredViewType: "unknown",
  providedViewType: "unknown",
  providedStreamType: "unknown",
  inferredStreamType: "unknown",
  liveSyncPosition: null,
  inferredLiveDVRWindow: 0,
  savedState: null
});
const RESET_ON_SRC_QUALITY_CHANGE = /* @__PURE__ */ new Set([
  "autoPlayError",
  "autoPlaying",
  "buffered",
  "canPlay",
  "error",
  "paused",
  "played",
  "playing",
  "seekable",
  "seeking",
  "waiting"
]);
const RESET_ON_SRC_CHANGE = /* @__PURE__ */ new Set([
  ...RESET_ON_SRC_QUALITY_CHANGE,
  "ended",
  "inferredPoster",
  "inferredStreamType",
  "inferredTitle",
  "intrinsicDuration",
  "inferredLiveDVRWindow",
  "liveSyncPosition",
  "realCurrentTime",
  "savedState",
  "started",
  "userBehindLiveEdge"
]);
function softResetMediaState($media, isSourceQualityChange = false) {
  const filter = isSourceQualityChange ? RESET_ON_SRC_QUALITY_CHANGE : RESET_ON_SRC_CHANGE;
  mediaState.reset($media, (prop) => filter.has(prop));
  tick();
}
function boundTime(time, store) {
  const clippedTime = time + store.clipStartTime(), isStart = Math.floor(time) === Math.floor(store.seekableStart()), isEnd = Math.floor(clippedTime) === Math.floor(store.seekableEnd());
  if (isStart) {
    return store.seekableStart();
  }
  if (isEnd) {
    return store.seekableEnd();
  }
  if (store.isLiveDVR() && store.liveDVRWindow() > 0 && clippedTime < store.seekableEnd() - store.liveDVRWindow()) {
    return store.bufferedStart();
  }
  return Math.min(Math.max(store.seekableStart() + 0.1, clippedTime), store.seekableEnd() - 0.1);
}

export { AUDIO_EXTENSIONS, AUDIO_TYPES, DASH_VIDEO_EXTENSIONS, DASH_VIDEO_TYPES, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES, IS_CHROME, TextTrack, TextTrackSymbol, TimeRange, VIDEO_EXTENSIONS, VIDEO_TYPES, boundTime, canChangeVolume, canGoogleCastSrc, canOrientScreen, canPlayHLSNatively, canPlayVideoType, canRotateScreen, canUsePictureInPicture, canUseVideoPresentation, findActiveCue, getDownloadFile, getRequestCredentials, getTimeRangesEnd, getTimeRangesStart, isAudioSrc, isCueActive, isDASHSrc, isDASHSupported, isHLSSrc, isHLSSupported, isMediaStream, isTrackCaptionKind, isVideoSrc, loadScript, mediaState, normalizeTimeIntervals, parseJSONCaptionsFile, preconnect, softResetMediaState, updateTimeIntervals, watchActiveTextTrack, watchCueTextChange };
