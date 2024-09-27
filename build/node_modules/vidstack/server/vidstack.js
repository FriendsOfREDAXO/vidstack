import { DOMEvent, EventsTarget, fscreen, ViewController, EventsController, onDispose, signal, listenEvent, peek, isString, isNumber, createContext, useContext, Component, functionThrottle, isDOMNode, isFunction, setAttribute, isKeyboardClick, isTouchEvent, setStyle, effect, untrack, functionDebounce, isArray, isKeyboardEvent, deferredPromise, isUndefined, prop, method, provideContext, animationFrameThrottle, uppercaseFirstChar, camelToKebabCase, computed, tick, scoped, noop, State, isNull, ariaBool as ariaBool$1, isWriteSignal, hasProvidedContext, isObject, useState, createScope, r, wasEnterKeyPressed, isPointerEvent, isMouseEvent, kebabToCamelCase, createDisposalBin } from './chunks/vidstack-1-opvwuv.js';
export { appendTriggerEvent, findTriggerEvent, hasTriggerEvent, walkTriggerEventChain } from './chunks/vidstack-1-opvwuv.js';
import { canOrientScreen, isTrackCaptionKind, TextTrackSymbol, TextTrack, isAudioSrc, isVideoSrc, isHLSSupported, isHLSSrc, isDASHSupported, isDASHSrc, preconnect, boundTime, IS_CHROME, canChangeVolume, softResetMediaState, getTimeRangesEnd, updateTimeIntervals, TimeRange, mediaState, getRequestCredentials, watchActiveTextTrack, isCueActive } from './chunks/vidstack-ffopCUPo.js';
export { AUDIO_EXTENSIONS, AUDIO_TYPES, DASH_VIDEO_EXTENSIONS, DASH_VIDEO_TYPES, HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES, VIDEO_EXTENSIONS, VIDEO_TYPES, canGoogleCastSrc, canPlayHLSNatively, canRotateScreen, canUsePictureInPicture, canUseVideoPresentation, findActiveCue, getDownloadFile, getTimeRangesStart, isMediaStream, normalizeTimeIntervals, parseJSONCaptionsFile, watchCueTextChange } from './chunks/vidstack-ffopCUPo.js';
import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';

const GROUPED_LOG = Symbol(0);
class GroupedLog {
  constructor(logger, level, title, root, parent) {
    this.logger = logger;
    this.level = level;
    this.title = title;
    this.root = root;
    this.parent = parent;
  }
  [GROUPED_LOG] = true;
  logs = [];
  log(...data) {
    this.logs.push({ data });
    return this;
  }
  labelledLog(label, ...data) {
    this.logs.push({ label, data });
    return this;
  }
  groupStart(title) {
    return new GroupedLog(this.logger, this.level, title, this.root ?? this, this);
  }
  groupEnd() {
    this.parent?.logs.push(this);
    return this.parent ?? this;
  }
  dispatch() {
    return this.logger.dispatch(this.level, this.root ?? this);
  }
}

class Logger {
  #target = null;
  error(...data) {
    return this.dispatch("error", ...data);
  }
  warn(...data) {
    return this.dispatch("warn", ...data);
  }
  info(...data) {
    return this.dispatch("info", ...data);
  }
  debug(...data) {
    return this.dispatch("debug", ...data);
  }
  errorGroup(title) {
    return new GroupedLog(this, "error", title);
  }
  warnGroup(title) {
    return new GroupedLog(this, "warn", title);
  }
  infoGroup(title) {
    return new GroupedLog(this, "info", title);
  }
  debugGroup(title) {
    return new GroupedLog(this, "debug", title);
  }
  setTarget(newTarget) {
    this.#target = newTarget;
  }
  dispatch(level, ...data) {
    return this.#target?.dispatchEvent(
      new DOMEvent("vds-log", {
        bubbles: true,
        composed: true,
        detail: { level, data }
      })
    ) || false;
  }
}

const ADD = Symbol(0), REMOVE = Symbol(0), RESET = Symbol(0), SELECT = Symbol(0), READONLY = Symbol(0), SET_READONLY = Symbol(0), ON_RESET = Symbol(0), ON_REMOVE = Symbol(0), ON_USER_SELECT = Symbol(0);
const ListSymbol = {
  add: ADD,
  remove: REMOVE,
  reset: RESET,
  select: SELECT,
  readonly: READONLY,
  setReadonly: SET_READONLY,
  onReset: ON_RESET,
  onRemove: ON_REMOVE,
  onUserSelect: ON_USER_SELECT
};

class List extends EventsTarget {
  items = [];
  /** @internal */
  [ListSymbol.readonly] = false;
  get length() {
    return this.items.length;
  }
  get readonly() {
    return this[ListSymbol.readonly];
  }
  /**
   * Returns the index of the first occurrence of the given item, or -1 if it is not present.
   */
  indexOf(item) {
    return this.items.indexOf(item);
  }
  /**
   * Returns an item matching the given `id`, or `null` if not present.
   */
  getById(id) {
    if (id === "") return null;
    return this.items.find((item) => item.id === id) ?? null;
  }
  /**
   * Transform list to an array.
   */
  toArray() {
    return [...this.items];
  }
  [Symbol.iterator]() {
    return this.items.values();
  }
  /** @internal */
  [ListSymbol.add](item, trigger) {
    const index = this.items.length;
    if (!("" + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this.items[index];
        }
      });
    }
    if (this.items.includes(item)) return;
    this.items.push(item);
    this.dispatchEvent(new DOMEvent("add", { detail: item, trigger }));
  }
  /** @internal */
  [ListSymbol.remove](item, trigger) {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this[ListSymbol.onRemove]?.(item, trigger);
      this.items.splice(index, 1);
      this.dispatchEvent(new DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /** @internal */
  [ListSymbol.reset](trigger) {
    for (const item of [...this.items]) this[ListSymbol.remove](item, trigger);
    this.items = [];
    this[ListSymbol.setReadonly](false, trigger);
    this[ListSymbol.onReset]?.();
  }
  /** @internal */
  [ListSymbol.setReadonly](readonly, trigger) {
    if (this[ListSymbol.readonly] === readonly) return;
    this[ListSymbol.readonly] = readonly;
    this.dispatchEvent(new DOMEvent("readonly-change", { detail: readonly, trigger }));
  }
}

const CAN_FULLSCREEN = fscreen.fullscreenEnabled;
class FullscreenController extends ViewController {
  /**
   * Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
   * listened to globally on the document so we need to know if they relate to the current host
   * element or not.
   */
  #listening = false;
  #active = false;
  get active() {
    return this.#active;
  }
  get supported() {
    return CAN_FULLSCREEN;
  }
  onConnect() {
    new EventsController(fscreen).add("fullscreenchange", this.#onChange.bind(this)).add("fullscreenerror", this.#onError.bind(this));
    onDispose(this.#onDisconnect.bind(this));
  }
  async #onDisconnect() {
    if (CAN_FULLSCREEN) await this.exit();
  }
  #onChange(event) {
    const active = isFullscreen(this.el);
    if (active === this.#active) return;
    if (!active) this.#listening = false;
    this.#active = active;
    this.dispatch("fullscreen-change", { detail: active, trigger: event });
  }
  #onError(event) {
    if (!this.#listening) return;
    this.dispatch("fullscreen-error", { detail: null, trigger: event });
    this.#listening = false;
  }
  async enter() {
    try {
      this.#listening = true;
      if (!this.el || isFullscreen(this.el)) return;
      assertFullscreenAPI();
      return fscreen.requestFullscreen(this.el);
    } catch (error) {
      this.#listening = false;
      throw error;
    }
  }
  async exit() {
    if (!this.el || !isFullscreen(this.el)) return;
    assertFullscreenAPI();
    return fscreen.exitFullscreen();
  }
}
function canFullscreen() {
  return CAN_FULLSCREEN;
}
function isFullscreen(host) {
  if (fscreen.fullscreenElement === host) return true;
  try {
    return host.matches(
      // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
      fscreen.fullscreenPseudoClass
    );
  } catch (error) {
    return false;
  }
}
function assertFullscreenAPI() {
  if (CAN_FULLSCREEN) return;
  throw Error(
    "[vidstack] no fullscreen API"
  );
}

class ScreenOrientationController extends ViewController {
  #type = signal(this.#getScreenOrientation());
  #locked = signal(false);
  #currentLock;
  /**
   * The current screen orientation type.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get type() {
    return this.#type();
  }
  /**
   * Whether the screen orientation is currently locked.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get locked() {
    return this.#locked();
  }
  /**
   * Whether the viewport is in a portrait orientation.
   *
   * @signal
   */
  get portrait() {
    return this.#type().startsWith("portrait");
  }
  /**
   * Whether the viewport is in a landscape orientation.
   *
   * @signal
   */
  get landscape() {
    return this.#type().startsWith("landscape");
  }
  /**
   * Whether the native Screen Orientation API is available.
   */
  static supported = canOrientScreen();
  /**
   * Whether the native Screen Orientation API is available.
   */
  get supported() {
    return ScreenOrientationController.supported;
  }
  onConnect() {
    if (this.supported) {
      listenEvent(screen.orientation, "change", this.#onOrientationChange.bind(this));
    } else {
      const query = window.matchMedia("(orientation: landscape)");
      query.onchange = this.#onOrientationChange.bind(this);
      onDispose(() => query.onchange = null);
    }
    onDispose(this.#onDisconnect.bind(this));
  }
  async #onDisconnect() {
    if (this.supported && this.#locked()) await this.unlock();
  }
  #onOrientationChange(event) {
    this.#type.set(this.#getScreenOrientation());
    this.dispatch("orientation-change", {
      detail: {
        orientation: peek(this.#type),
        lock: this.#currentLock
      },
      trigger: event
    });
  }
  /**
   * Locks the orientation of the screen to the desired orientation type using the
   * Screen Orientation API.
   *
   * @param lockType - The screen lock orientation type.
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async lock(lockType) {
    if (peek(this.#locked) || this.#currentLock === lockType) return;
    this.#assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    this.#locked.set(true);
    this.#currentLock = lockType;
  }
  /**
   * Unlocks the orientation of the screen to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async unlock() {
    if (!peek(this.#locked)) return;
    this.#assertScreenOrientationAPI();
    this.#currentLock = void 0;
    await screen.orientation.unlock();
    this.#locked.set(false);
  }
  #assertScreenOrientationAPI() {
    if (this.supported) return;
    throw Error(
      "[vidstack] no orientation API"
    );
  }
  #getScreenOrientation() {
    return "portrait-primary";
  }
}

function isVideoQualitySrc(src) {
  return !isString(src) && "width" in src && "height" in src && isNumber(src.width) && isNumber(src.height);
}

const mediaContext = createContext();
function useMediaContext() {
  return useContext(mediaContext);
}

class MediaRemoteControl {
  #target = null;
  #player = null;
  #prevTrackIndex = -1;
  #logger;
  constructor(logger = void 0) {
    this.#logger = logger;
  }
  /**
   * Set the target from which to dispatch media requests events from. The events should bubble
   * up from this target to the player element.
   *
   * @example
   * ```ts
   * const button = document.querySelector('button');
   * remote.setTarget(button);
   * ```
   */
  setTarget(target) {
    this.#target = target;
  }
  /**
   * Returns the current player element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target) {
    if (this.#player) return this.#player;
    (target ?? this.#target)?.dispatchEvent(
      new DOMEvent("find-media-player", {
        detail: (player) => void (this.#player = player),
        bubbles: true,
        composed: true
      })
    );
    return this.#player;
  }
  /**
   * Set the current player element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player) {
    this.#player = player;
  }
  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoading(trigger) {
    this.#dispatchRequest("media-start-loading", trigger);
  }
  /**
   * Dispatch a request to start the poster loading process. This will only work if the media
   * player has been initialized with a custom poster loading strategy `posterLoad="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoadingPoster(trigger) {
    this.#dispatchRequest("media-poster-start-loading", trigger);
  }
  /**
   * Dispatch a request to connect to AirPlay.
   *
   * @see {@link https://www.apple.com/au/airplay}
   */
  requestAirPlay(trigger) {
    this.#dispatchRequest("media-airplay-request", trigger);
  }
  /**
   * Dispatch a request to connect to Google Cast.
   *
   * @see {@link https://developers.google.com/cast/docs/overview}
   */
  requestGoogleCast(trigger) {
    this.#dispatchRequest("media-google-cast-request", trigger);
  }
  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger) {
    this.#dispatchRequest("media-play-request", trigger);
  }
  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger) {
    this.#dispatchRequest("media-pause-request", trigger);
  }
  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger) {
    this.#dispatchRequest("media-mute-request", trigger);
  }
  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger) {
    this.#dispatchRequest("media-unmute-request", trigger);
  }
  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  enterFullscreen(target, trigger) {
    this.#dispatchRequest("media-enter-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  exitFullscreen(target, trigger) {
    this.#dispatchRequest("media-exit-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to lock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/screen-orientation#remote-control}
   */
  lockScreenOrientation(lockType, trigger) {
    this.#dispatchRequest("media-orientation-lock-request", trigger, lockType);
  }
  /**
   * Dispatch a request to unlock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/screen-orientation#remote-control}
   */
  unlockScreenOrientation(trigger) {
    this.#dispatchRequest("media-orientation-unlock-request", trigger);
  }
  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  enterPictureInPicture(trigger) {
    this.#dispatchRequest("media-enter-pip-request", trigger);
  }
  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  exitPictureInPicture(trigger) {
    this.#dispatchRequest("media-exit-pip-request", trigger);
  }
  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time, trigger) {
    this.#dispatchRequest("media-seeking-request", trigger, time);
  }
  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time, trigger) {
    this.#dispatchRequest("media-seek-request", trigger, time);
  }
  seekToLiveEdge(trigger) {
    this.#dispatchRequest("media-live-edge-request", trigger);
  }
  /**
   * Dispatch a request to update the length of the media in seconds.
   *
   * @example
   * ```ts
   * remote.changeDuration(100); // 100 seconds
   * ```
   */
  changeDuration(duration, trigger) {
    this.#dispatchRequest("media-duration-change-request", trigger, duration);
  }
  /**
   * Dispatch a request to update the clip start time. This is the time at which media playback
   * should start at.
   *
   * @example
   * ```ts
   * remote.changeClipStart(100); // start at 100 seconds
   * ```
   */
  changeClipStart(startTime, trigger) {
    this.#dispatchRequest("media-clip-start-change-request", trigger, startTime);
  }
  /**
   * Dispatch a request to update the clip end time. This is the time at which media playback
   * should end at.
   *
   * @example
   * ```ts
   * remote.changeClipEnd(100); // end at 100 seconds
   * ```
   */
  changeClipEnd(endTime, trigger) {
    this.#dispatchRequest("media-clip-end-change-request", trigger, endTime);
  }
  /**
   * Dispatch a request to update the media volume to the given `volume` level which is a value
   * between 0 and 1.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/audio-gain#remote-control}
   * @example
   * ```ts
   * remote.changeVolume(0); // 0%
   * remote.changeVolume(0.05); // 5%
   * remote.changeVolume(0.5); // 50%
   * remote.changeVolume(0.75); // 70%
   * remote.changeVolume(1); // 100%
   * ```
   */
  changeVolume(volume, trigger) {
    this.#dispatchRequest("media-volume-change-request", trigger, Math.max(0, Math.min(1, volume)));
  }
  /**
   * Dispatch a request to change the current audio track.
   *
   * @example
   * ```ts
   * remote.changeAudioTrack(1); // track at index 1
   * ```
   */
  changeAudioTrack(index, trigger) {
    this.#dispatchRequest("media-audio-track-change-request", trigger, index);
  }
  /**
   * Dispatch a request to change the video quality. The special value `-1` represents auto quality
   * selection.
   *
   * @example
   * ```ts
   * remote.changeQuality(-1); // auto
   * remote.changeQuality(1); // quality at index 1
   * ```
   */
  changeQuality(index, trigger) {
    this.#dispatchRequest("media-quality-change-request", trigger, index);
  }
  /**
   * Request auto quality selection.
   */
  requestAutoQuality(trigger) {
    this.changeQuality(-1, trigger);
  }
  /**
   * Dispatch a request to change the mode of the text track at the given index.
   *
   * @example
   * ```ts
   * remote.changeTextTrackMode(1, 'showing'); // track at index 1
   * ```
   */
  changeTextTrackMode(index, mode, trigger) {
    this.#dispatchRequest("media-text-track-change-request", trigger, {
      index,
      mode
    });
  }
  /**
   * Dispatch a request to change the media playback rate.
   *
   * @example
   * ```ts
   * remote.changePlaybackRate(0.5); // Half the normal speed
   * remote.changePlaybackRate(1); // Normal speed
   * remote.changePlaybackRate(1.5); // 50% faster than normal
   * remote.changePlaybackRate(2); // Double the normal speed
   * ```
   */
  changePlaybackRate(rate, trigger) {
    this.#dispatchRequest("media-rate-change-request", trigger, rate);
  }
  /**
   * Dispatch a request to change the media audio gain.
   *
   * @example
   * ```ts
   * remote.changeAudioGain(1); // Disable audio gain
   * remote.changeAudioGain(1.5); // 50% louder
   * remote.changeAudioGain(2); // 100% louder
   * ```
   */
  changeAudioGain(gain, trigger) {
    this.#dispatchRequest("media-audio-gain-change-request", trigger, gain);
  }
  /**
   * Dispatch a request to resume idle tracking on controls.
   */
  resumeControls(trigger) {
    this.#dispatchRequest("media-resume-controls-request", trigger);
  }
  /**
   * Dispatch a request to pause controls idle tracking. Pausing tracking will result in the
   * controls being visible until `remote.resumeControls()` is called. This method
   * is generally used when building custom controls and you'd like to prevent the UI from
   * disappearing.
   *
   * @example
   * ```ts
   * // Prevent controls hiding while menu is being interacted with.
   * function onSettingsOpen() {
   *   remote.pauseControls();
   * }
   *
   * function onSettingsClose() {
   *   remote.resumeControls();
   * }
   * ```
   */
  pauseControls(trigger) {
    this.#dispatchRequest("media-pause-controls-request", trigger);
  }
  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.paused) this.play(trigger);
    else this.pause(trigger);
  }
  /**
   * Dispatch a request to toggle the controls visibility.
   */
  toggleControls(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (!player.controls.showing) {
      player.controls.show(0, trigger);
    } else {
      player.controls.hide(0, trigger);
    }
  }
  /**
   * Dispatch a request to toggle the media muted state.
   */
  toggleMuted(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.muted) this.unmute(trigger);
    else this.mute(trigger);
  }
  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  toggleFullscreen(target, trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.fullscreen) this.exitFullscreen(target, trigger);
    else this.enterFullscreen(target, trigger);
  }
  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  togglePictureInPicture(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.pictureInPicture) this.exitPictureInPicture(trigger);
    else this.enterPictureInPicture(trigger);
  }
  /**
   * Show captions.
   */
  showCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    let tracks = player.state.textTracks, index = this.#prevTrackIndex;
    if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
      index = -1;
    }
    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track) && track.default);
    }
    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track));
    }
    if (index >= 0) this.changeTextTrackMode(index, "showing", trigger);
    this.#prevTrackIndex = -1;
  }
  /**
   * Turn captions off.
   */
  disableCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    const tracks = player.state.textTracks, track = player.state.textTrack;
    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, "disabled", trigger);
      this.#prevTrackIndex = index;
    }
  }
  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.textTrack) {
      this.disableCaptions();
    } else {
      this.showCaptions();
    }
  }
  userPrefersLoopChange(prefersLoop, trigger) {
    this.#dispatchRequest("media-user-loop-change-request", trigger, prefersLoop);
  }
  #dispatchRequest(type, trigger, detail) {
    const request = new DOMEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
      trigger
    });
    let target = trigger?.target || null;
    if (target && target instanceof Component) target = target.el;
    const shouldUsePlayer = !target || target === document || target === window || target === document.body || this.#player?.el && target instanceof Node && !this.#player.el.contains(target);
    target = shouldUsePlayer ? this.#target ?? this.getPlayer()?.el : target ?? this.#target;
    if (this.#player) {
      if (type === "media-play-request" && !this.#player.state.canLoad) {
        target?.dispatchEvent(request);
      } else {
        this.#player.canPlayQueue.enqueue(type, () => target?.dispatchEvent(request));
      }
    } else {
      target?.dispatchEvent(request);
    }
  }
  #noPlayerWarning(method) {
  }
}

class LocalMediaStorage {
  playerId = "vds-player";
  mediaId = null;
  #data = {
    volume: null,
    muted: null,
    audioGain: null,
    time: null,
    lang: null,
    captions: null,
    rate: null,
    quality: null
  };
  async getVolume() {
    return this.#data.volume;
  }
  async setVolume(volume) {
    this.#data.volume = volume;
    this.save();
  }
  async getMuted() {
    return this.#data.muted;
  }
  async setMuted(muted) {
    this.#data.muted = muted;
    this.save();
  }
  async getTime() {
    return this.#data.time;
  }
  async setTime(time, ended) {
    const shouldClear = time < 0;
    this.#data.time = !shouldClear ? time : null;
    if (shouldClear || ended) this.saveTime();
    else this.saveTimeThrottled();
  }
  async getLang() {
    return this.#data.lang;
  }
  async setLang(lang) {
    this.#data.lang = lang;
    this.save();
  }
  async getCaptions() {
    return this.#data.captions;
  }
  async setCaptions(enabled) {
    this.#data.captions = enabled;
    this.save();
  }
  async getPlaybackRate() {
    return this.#data.rate;
  }
  async setPlaybackRate(rate) {
    this.#data.rate = rate;
    this.save();
  }
  async getAudioGain() {
    return this.#data.audioGain;
  }
  async setAudioGain(gain) {
    this.#data.audioGain = gain;
    this.save();
  }
  async getVideoQuality() {
    return this.#data.quality;
  }
  async setVideoQuality(quality) {
    this.#data.quality = quality;
    this.save();
  }
  onChange(src, mediaId, playerId = "vds-player") {
    const savedData = playerId ? localStorage.getItem(playerId) : null, savedTime = mediaId ? localStorage.getItem(mediaId) : null;
    this.playerId = playerId;
    this.mediaId = mediaId;
    this.#data = {
      volume: null,
      muted: null,
      audioGain: null,
      lang: null,
      captions: null,
      rate: null,
      quality: null,
      ...savedData ? JSON.parse(savedData) : {},
      time: savedTime ? +savedTime : null
    };
  }
  save() {
    return;
  }
  saveTimeThrottled = functionThrottle(this.saveTime.bind(this), 1e3);
  saveTime() {
    return;
  }
}

const SELECTED = Symbol(0);
class SelectList extends List {
  get selected() {
    return this.items.find((item) => item.selected) ?? null;
  }
  get selectedIndex() {
    return this.items.findIndex((item) => item.selected);
  }
  /** @internal */
  [ListSymbol.onRemove](item, trigger) {
    this[ListSymbol.select](item, false, trigger);
  }
  /** @internal */
  [ListSymbol.add](item, trigger) {
    item[SELECTED] = false;
    Object.defineProperty(item, "selected", {
      get() {
        return this[SELECTED];
      },
      set: (selected) => {
        if (this.readonly) return;
        this[ListSymbol.onUserSelect]?.();
        this[ListSymbol.select](item, selected);
      }
    });
    super[ListSymbol.add](item, trigger);
  }
  /** @internal */
  [ListSymbol.select](item, selected, trigger) {
    if (selected === item?.[SELECTED]) return;
    const prev = this.selected;
    if (item) item[SELECTED] = selected;
    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev) prev[SELECTED] = false;
      this.dispatchEvent(
        new DOMEvent("change", {
          detail: {
            prev,
            current: this.selected
          },
          trigger
        })
      );
    }
  }
}

class AudioTrackList extends SelectList {
}

class LibASSTextRenderer {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
  }
  priority = 1;
  #instance = null;
  #track = null;
  #typeRE = /(ssa|ass)$/;
  canRender(track, video) {
    return !!video && !!track.src && (isString(track.type) && this.#typeRE.test(track.type) || this.#typeRE.test(track.src));
  }
  attach(video) {
    if (!video) return;
    this.loader().then(async (mod) => {
      this.#instance = new mod.default({
        ...this.config,
        video,
        subUrl: this.#track?.src || ""
      });
      new EventsController(this.#instance).add("ready", () => {
        const canvas = this.#instance?._canvas;
        if (canvas) canvas.style.pointerEvents = "none";
      }).add("error", (event) => {
        if (!this.#track) return;
        this.#track[TextTrackSymbol.readyState] = 3;
        this.#track.dispatchEvent(
          new DOMEvent("error", {
            trigger: event,
            detail: event.error
          })
        );
      });
    });
  }
  changeTrack(track) {
    if (!track || track.readyState === 3) {
      this.#freeTrack();
    } else if (this.#track !== track) {
      this.#instance?.setTrackByUrl(track.src);
      this.#track = track;
    }
  }
  detach() {
    this.#freeTrack();
  }
  #freeTrack() {
    this.#instance?.freeTrack();
    this.#track = null;
  }
}

function round(num, decimalPlaces = 2) {
  return Number(num.toFixed(decimalPlaces));
}
function getNumberOfDecimalPlaces(num) {
  return String(num).split(".")[1]?.length ?? 0;
}
function clampNumber(min, value, max) {
  return Math.max(min, Math.min(max, value));
}

function isEventInside(el, event) {
  const target = event.composedPath()[0];
  return isDOMNode(target) && el.contains(target);
}
const rafJobs = /* @__PURE__ */ new Set();
function scheduleRafJob(job) {
  rafJobs.add(job);
  return () => rafJobs.delete(job);
}
function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}
function setARIALabel(target, $label) {
  if (target.hasAttribute("aria-label") || target.hasAttribute("data-no-label")) return;
  if (!isFunction($label)) {
    setAttribute(target, "aria-label", $label);
    return;
  }
  function updateAriaDescription() {
    setAttribute(target, "aria-label", $label());
  }
  updateAriaDescription();
}
function isElementVisible(el) {
  const style = getComputedStyle(el);
  return style.display !== "none" && parseInt(style.opacity) > 0;
}
function checkVisibility(el) {
  return !!el && ("checkVisibility" in el ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : isElementVisible(el));
}
function observeVisibility(el, callback) {
  return scheduleRafJob(() => callback(checkVisibility(el)));
}
function isElementParent(owner, node, test) {
  while (node) {
    if (node === owner) {
      return true;
    } else if (test?.(node)) {
      break;
    } else {
      node = node.parentElement;
    }
  }
  return false;
}
function onPress(target, handler) {
  return new EventsController(target).add("pointerup", (event) => {
    if (event.button === 0 && !event.defaultPrevented) handler(event);
  }).add("keydown", (event) => {
    if (isKeyboardClick(event)) handler(event);
  });
}
function isTouchPinchEvent(event) {
  return isTouchEvent(event) && (event.touches.length > 1 || event.changedTouches.length > 1);
}
function requestScopedAnimationFrame(callback) {
  return callback();
}
function autoPlacement(el, trigger, placement, {
  offsetVarName,
  xOffset,
  yOffset,
  ...options
}) {
  if (!el) return;
  const floatingPlacement = placement.replace(" ", "-").replace("-center", "");
  setStyle(el, "visibility", !trigger ? "hidden" : null);
  if (!trigger) return;
  let isTop = placement.includes("top");
  const negateX = (x) => placement.includes("left") ? `calc(-1 * ${x})` : x, negateY = (y) => isTop ? `calc(-1 * ${y})` : y;
  return autoUpdate(trigger, el, () => {
    computePosition(trigger, el, {
      placement: floatingPlacement,
      middleware: [
        ...options.middleware ?? [],
        flip({ fallbackAxisSideDirection: "start", crossAxis: false }),
        shift()
      ],
      ...options
    }).then(({ x, y, middlewareData }) => {
      const hasFlipped = !!middlewareData.flip?.index;
      isTop = placement.includes(hasFlipped ? "bottom" : "top");
      el.setAttribute(
        "data-placement",
        hasFlipped ? placement.startsWith("top") ? placement.replace("top", "bottom") : placement.replace("bottom", "top") : placement
      );
      Object.assign(el.style, {
        top: `calc(${y + "px"} + ${negateY(
          yOffset ? yOffset + "px" : `var(--${offsetVarName}-y-offset, 0px)`
        )})`,
        left: `calc(${x + "px"} + ${negateX(
          xOffset ? xOffset + "px" : `var(--${offsetVarName}-x-offset, 0px)`
        )})`
      });
    });
  });
}
function hasAnimation(el) {
  const styles = getComputedStyle(el);
  return styles.animationName !== "none";
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}

class NativeTextRenderer {
  priority = 0;
  #display = true;
  #video = null;
  #track = null;
  #tracks = /* @__PURE__ */ new Set();
  canRender(_, video) {
    return !!video;
  }
  attach(video) {
    this.#video = video;
    if (video) video.textTracks.onchange = this.#onChange.bind(this);
  }
  addTrack(track) {
    this.#tracks.add(track);
    this.#attachTrack(track);
  }
  removeTrack(track) {
    track[TextTrackSymbol.native]?.remove?.();
    track[TextTrackSymbol.native] = null;
    this.#tracks.delete(track);
  }
  changeTrack(track) {
    const current = track?.[TextTrackSymbol.native];
    if (current && current.track.mode !== "showing") {
      current.track.mode = "showing";
    }
    this.#track = track;
  }
  setDisplay(display) {
    this.#display = display;
    this.#onChange();
  }
  detach() {
    if (this.#video) this.#video.textTracks.onchange = null;
    for (const track of this.#tracks) this.removeTrack(track);
    this.#tracks.clear();
    this.#video = null;
    this.#track = null;
  }
  #attachTrack(track) {
    if (!this.#video) return;
    const el = track[TextTrackSymbol.native] ??= this.#createTrackElement(track);
    if (isHTMLElement(el)) {
      this.#video.append(el);
      el.track.mode = el.default ? "showing" : "disabled";
    }
  }
  #createTrackElement(track) {
    const el = document.createElement("track"), isDefault = track.default || track.mode === "showing", isSupported = track.src && track.type === "vtt";
    el.id = track.id;
    el.src = isSupported ? track.src : "";
    el.label = track.label;
    el.kind = track.kind;
    el.default = isDefault;
    track.language && (el.srclang = track.language);
    if (isDefault && !isSupported) {
      this.#copyCues(track, el.track);
    }
    return el;
  }
  #copyCues(track, native) {
    if (track.src && track.type === "vtt" || native.cues?.length) return;
    for (const cue of track.cues) native.addCue(cue);
  }
  #onChange(event) {
    for (const track of this.#tracks) {
      const native = track[TextTrackSymbol.native];
      if (!native) continue;
      if (!this.#display) {
        native.track.mode = native.managed ? "hidden" : "disabled";
        continue;
      }
      const isShowing = native.track.mode === "showing";
      if (isShowing) this.#copyCues(track, native.track);
      track.setMode(isShowing ? "showing" : "disabled", event);
    }
  }
}

class TextRenderers {
  #video = null;
  #textTracks;
  #renderers = [];
  #media;
  #nativeDisplay = false;
  #nativeRenderer = null;
  #customRenderer = null;
  constructor(media) {
    this.#media = media;
    const textTracks = media.textTracks;
    this.#textTracks = textTracks;
    effect(this.#watchControls.bind(this));
    onDispose(this.#detach.bind(this));
    new EventsController(textTracks).add("add", this.#onAddTrack.bind(this)).add("remove", this.#onRemoveTrack.bind(this)).add("mode-change", this.#update.bind(this));
  }
  #watchControls() {
    const { nativeControls } = this.#media.$state;
    this.#nativeDisplay = nativeControls();
    this.#update();
  }
  add(renderer) {
    this.#renderers.push(renderer);
    untrack(this.#update.bind(this));
  }
  remove(renderer) {
    renderer.detach();
    this.#renderers.splice(this.#renderers.indexOf(renderer), 1);
    untrack(this.#update.bind(this));
  }
  /** @internal */
  attachVideo(video) {
    requestAnimationFrame(() => {
      this.#video = video;
      if (video) {
        this.#nativeRenderer = new NativeTextRenderer();
        this.#nativeRenderer.attach(video);
        for (const track of this.#textTracks) this.#addNativeTrack(track);
      }
      this.#update();
    });
  }
  #addNativeTrack(track) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.addTrack(track);
  }
  #removeNativeTrack(track) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.removeTrack(track);
  }
  #onAddTrack(event) {
    this.#addNativeTrack(event.detail);
  }
  #onRemoveTrack(event) {
    this.#removeNativeTrack(event.detail);
  }
  #update() {
    const currentTrack = this.#textTracks.selected;
    if (this.#video && (this.#nativeDisplay || currentTrack?.[TextTrackSymbol.nativeHLS])) {
      this.#customRenderer?.changeTrack(null);
      this.#nativeRenderer?.setDisplay(true);
      this.#nativeRenderer?.changeTrack(currentTrack);
      return;
    }
    this.#nativeRenderer?.setDisplay(false);
    this.#nativeRenderer?.changeTrack(null);
    if (!currentTrack) {
      this.#customRenderer?.changeTrack(null);
      return;
    }
    const customRenderer = this.#renderers.sort((a, b) => a.priority - b.priority).find((renderer) => renderer.canRender(currentTrack, this.#video));
    if (this.#customRenderer !== customRenderer) {
      this.#customRenderer?.detach();
      customRenderer?.attach(this.#video);
      this.#customRenderer = customRenderer ?? null;
    }
    customRenderer?.changeTrack(currentTrack);
  }
  #detach() {
    this.#nativeRenderer?.detach();
    this.#nativeRenderer = null;
    this.#customRenderer?.detach();
    this.#customRenderer = null;
  }
}

class TextTrackList extends List {
  #canLoad = false;
  #defaults = {};
  #storage = null;
  #preferredLang = null;
  /** @internal */
  [TextTrackSymbol.crossOrigin];
  constructor() {
    super();
  }
  get selected() {
    const track = this.items.find((t) => t.mode === "showing" && isTrackCaptionKind(t));
    return track ?? null;
  }
  get selectedIndex() {
    const selected = this.selected;
    return selected ? this.indexOf(selected) : -1;
  }
  get preferredLang() {
    return this.#preferredLang;
  }
  set preferredLang(lang) {
    this.#preferredLang = lang;
    this.#saveLang(lang);
  }
  add(init, trigger) {
    const isTrack = init instanceof TextTrack, track = isTrack ? init : new TextTrack(init), kind = init.kind === "captions" || init.kind === "subtitles" ? "captions" : init.kind;
    if (this.#defaults[kind] && init.default) delete init.default;
    track.addEventListener("mode-change", this.#onTrackModeChangeBind);
    this[ListSymbol.add](track, trigger);
    track[TextTrackSymbol.crossOrigin] = this[TextTrackSymbol.crossOrigin];
    if (this.#canLoad) track[TextTrackSymbol.canLoad]();
    if (init.default) this.#defaults[kind] = track;
    this.#selectTracks();
    return this;
  }
  remove(track, trigger) {
    this.#pendingRemoval = track;
    if (!this.items.includes(track)) return;
    if (track === this.#defaults[track.kind]) delete this.#defaults[track.kind];
    track.mode = "disabled";
    track[TextTrackSymbol.onModeChange] = null;
    track.removeEventListener("mode-change", this.#onTrackModeChangeBind);
    this[ListSymbol.remove](track, trigger);
    this.#pendingRemoval = null;
    return this;
  }
  clear(trigger) {
    for (const track of [...this.items]) {
      this.remove(track, trigger);
    }
    return this;
  }
  getByKind(kind) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this.items.filter((track) => kinds.includes(track.kind));
  }
  /** @internal */
  [TextTrackSymbol.canLoad]() {
    if (this.#canLoad) return;
    for (const track of this.items) track[TextTrackSymbol.canLoad]();
    this.#canLoad = true;
    this.#selectTracks();
  }
  #selectTracks = functionDebounce(async () => {
    if (!this.#canLoad) return;
    if (!this.#preferredLang && this.#storage) {
      this.#preferredLang = await this.#storage.getLang();
    }
    const showCaptions = await this.#storage?.getCaptions(), kinds = [
      ["captions", "subtitles"],
      "chapters",
      "descriptions",
      "metadata"
    ];
    for (const kind of kinds) {
      const tracks = this.getByKind(kind);
      if (tracks.find((t) => t.mode === "showing")) continue;
      const preferredTrack = this.#preferredLang ? tracks.find((track2) => track2.language === this.#preferredLang) : null;
      const defaultTrack = isArray(kind) ? this.#defaults[kind.find((kind2) => this.#defaults[kind2]) || ""] : this.#defaults[kind];
      const track = preferredTrack ?? defaultTrack, isCaptionsKind = track && isTrackCaptionKind(track);
      if (track && (!isCaptionsKind || showCaptions !== false)) {
        track.mode = "showing";
        if (isCaptionsKind) this.#saveCaptionsTrack(track);
      }
    }
  }, 300);
  #pendingRemoval = null;
  #onTrackModeChangeBind = this.#onTrackModeChange.bind(this);
  #onTrackModeChange(event) {
    const track = event.detail;
    if (this.#storage && isTrackCaptionKind(track) && track !== this.#pendingRemoval) {
      this.#saveCaptionsTrack(track);
    }
    if (track.mode === "showing") {
      const kinds = isTrackCaptionKind(track) ? ["captions", "subtitles"] : [track.kind];
      for (const t of this.items) {
        if (t.mode === "showing" && t != track && kinds.includes(t.kind)) {
          t.mode = "disabled";
        }
      }
    }
    this.dispatchEvent(
      new DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
  #saveCaptionsTrack(track) {
    if (track.mode !== "disabled") {
      this.#saveLang(track.language);
    }
    this.#storage?.setCaptions?.(track.mode === "showing");
  }
  #saveLang(lang) {
    this.#storage?.setLang?.(this.#preferredLang = lang);
  }
  setStorage(storage) {
    this.#storage = storage;
  }
}

const SET_AUTO = Symbol(0), ENABLE_AUTO = Symbol(0);
const QualitySymbol = {
  setAuto: SET_AUTO,
  enableAuto: ENABLE_AUTO
};

class VideoQualityList extends SelectList {
  #auto = false;
  /**
   * Configures quality switching:
   *
   * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
   * request if any, flush the whole buffer, and fetch fragment matching with current position
   * and requested quality level.
   *
   * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
   * already buffered next fragment.
   *
   * - `load`: Set quality level for next loaded fragment.
   *
   * @see {@link https://www.vidstack.io/docs/player/api/video-quality#switch}
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
   */
  switch = "current";
  /**
   * Whether automatic quality selection is enabled.
   */
  get auto() {
    return this.#auto || this.readonly;
  }
  /** @internal */
  [QualitySymbol.enableAuto];
  /** @internal */
  [ListSymbol.onUserSelect]() {
    this[QualitySymbol.setAuto](false);
  }
  /** @internal */
  [ListSymbol.onReset](trigger) {
    this[QualitySymbol.enableAuto] = void 0;
    this[QualitySymbol.setAuto](false, trigger);
  }
  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger) {
    if (this.readonly || this.#auto || !this[QualitySymbol.enableAuto]) return;
    this[QualitySymbol.enableAuto]?.(trigger);
    this[QualitySymbol.setAuto](true, trigger);
  }
  getBySrc(src) {
    return this.items.find((quality) => quality.src === src);
  }
  /** @internal */
  [QualitySymbol.setAuto](auto, trigger) {
    if (this.#auto === auto) return;
    this.#auto = auto;
    this.dispatchEvent(
      new DOMEvent("auto-change", {
        detail: auto,
        trigger
      })
    );
  }
}

function sortVideoQualities(qualities, desc) {
  return [...qualities].sort(desc ? compareVideoQualityDesc : compareVideoQualityAsc);
}
function compareVideoQualityAsc(a, b) {
  return a.height === b.height ? (a.bitrate ?? 0) - (b.bitrate ?? 0) : a.height - b.height;
}
function compareVideoQualityDesc(a, b) {
  return b.height === a.height ? (b.bitrate ?? 0) - (a.bitrate ?? 0) : b.height - a.height;
}

function isAudioProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "AUDIO";
}
function isVideoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIDEO";
}
function isHLSProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "HLS";
}
function isDASHProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "DASH";
}
function isYouTubeProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "YOUTUBE";
}
function isVimeoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIMEO";
}
function isGoogleCastProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "GOOGLE_CAST";
}
function isHTMLAudioElement(element) {
  return false;
}
function isHTMLVideoElement(element) {
  return false;
}
function isHTMLMediaElement(element) {
  return isHTMLVideoElement();
}
function isHTMLIFrameElement(element) {
  return false;
}

class MediaPlayerController extends ViewController {
}

const MEDIA_KEY_SHORTCUTS = {
  togglePaused: "k Space",
  toggleMuted: "m",
  toggleFullscreen: "f",
  togglePictureInPicture: "i",
  toggleCaptions: "c",
  seekBackward: "j J ArrowLeft",
  seekForward: "l L ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown",
  speedUp: ">",
  slowDown: "<"
};
const MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Ctrl"]), BUTTON_SELECTORS = 'button, [role="button"]', IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"], [role="timer"]';
class MediaKeyboardController extends MediaPlayerController {
  #media;
  constructor(media) {
    super();
    this.#media = media;
  }
  onConnect() {
    effect(this.#onTargetChange.bind(this));
  }
  #onTargetChange() {
    const { keyDisabled, keyTarget } = this.$props;
    if (keyDisabled()) return;
    const target = keyTarget() === "player" ? this.el : document, $active = signal(false);
    if (target === this.el) {
      new EventsController(this.el).add("focusin", () => $active.set(true)).add("focusout", (event) => {
        if (!this.el.contains(event.target)) $active.set(false);
      });
    } else {
      if (!peek($active)) $active.set(document.querySelector("[data-media-player]") === this.el);
    }
    effect(() => {
      if (!$active()) return;
      new EventsController(target).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("keydown", this.#onPreventVideoKeys.bind(this), { capture: true });
    });
  }
  #onKeyUp(event) {
    const focusedEl = document.activeElement;
    if (!event.key || !this.$state.canSeek() || focusedEl?.matches(IGNORE_SELECTORS)) {
      return;
    }
    let { method, value } = this.#getMatchingMethod(event);
    if (!isString(value) && !isArray(value)) {
      value?.onKeyUp?.({
        event,
        player: this.#media.player,
        remote: this.#media.remote
      });
      value?.callback?.(event, this.#media.remote);
      return;
    }
    if (method?.startsWith("seek")) {
      event.preventDefault();
      event.stopPropagation();
      if (this.#timeSlider) {
        this.#forwardTimeKeyboardEvent(event, method === "seekForward");
        this.#timeSlider = null;
      } else {
        this.#media.remote.seek(this.#seekTotal, event);
        this.#seekTotal = void 0;
      }
    }
    if (method?.startsWith("volume")) {
      const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
      volumeSlider?.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: method === "volumeUp" ? "Up" : "Down",
          shiftKey: event.shiftKey,
          trigger: event
        })
      );
    }
  }
  #onKeyDown(event) {
    if (!event.key || MODIFIER_KEYS.has(event.key)) return;
    const focusedEl = document.activeElement;
    if (focusedEl?.matches(IGNORE_SELECTORS) || isKeyboardClick(event) && focusedEl?.matches(BUTTON_SELECTORS)) {
      return;
    }
    let { method, value } = this.#getMatchingMethod(event), isNumberPress = !event.metaKey && /^[0-9]$/.test(event.key);
    if (!isString(value) && !isArray(value) && !isNumberPress) {
      value?.onKeyDown?.({
        event,
        player: this.#media.player,
        remote: this.#media.remote
      });
      value?.callback?.(event, this.#media.remote);
      return;
    }
    if (!method && isNumberPress) {
      event.preventDefault();
      event.stopPropagation();
      this.#media.remote.seek(this.$state.duration() / 10 * Number(event.key), event);
      return;
    }
    if (!method) return;
    event.preventDefault();
    event.stopPropagation();
    switch (method) {
      case "seekForward":
      case "seekBackward":
        this.#seeking(event, method, method === "seekForward");
        break;
      case "volumeUp":
      case "volumeDown":
        const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
        if (volumeSlider) {
          volumeSlider.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: method === "volumeUp" ? "Up" : "Down",
              shiftKey: event.shiftKey,
              trigger: event
            })
          );
        } else {
          const value2 = event.shiftKey ? 0.1 : 0.05;
          this.#media.remote.changeVolume(
            this.$state.volume() + (method === "volumeUp" ? +value2 : -value2),
            event
          );
        }
        break;
      case "toggleFullscreen":
        this.#media.remote.toggleFullscreen("prefer-media", event);
        break;
      case "speedUp":
      case "slowDown":
        const playbackRate = this.$state.playbackRate();
        this.#media.remote.changePlaybackRate(
          Math.max(0.25, Math.min(2, playbackRate + (method === "speedUp" ? 0.25 : -0.25))),
          event
        );
        break;
      default:
        this.#media.remote[method]?.(event);
    }
    this.$state.lastKeyboardAction.set({
      action: method,
      event
    });
  }
  #onPreventVideoKeys(event) {
    if (isHTMLMediaElement(event.target)) ;
  }
  #getMatchingMethod(event) {
    const keyShortcuts = {
      ...this.$props.keyShortcuts(),
      ...this.#media.ariaKeys
    };
    const method = Object.keys(keyShortcuts).find((method2) => {
      const value = keyShortcuts[method2], keys = isArray(value) ? value.join(" ") : isString(value) ? value : value?.keys;
      const combinations = (isArray(keys) ? keys : keys?.split(" "))?.map(
        (key) => replaceSymbolKeys(key).replace(/Control/g, "Ctrl").split("+")
      );
      return combinations?.some((combo) => {
        const modifierKeys = new Set(combo.filter((key) => MODIFIER_KEYS.has(key)));
        for (const modKey of MODIFIER_KEYS) {
          const modKeyProp = modKey.toLowerCase() + "Key";
          if (!modifierKeys.has(modKey) && event[modKeyProp]) {
            return false;
          }
        }
        return combo.every((key) => {
          return MODIFIER_KEYS.has(key) ? event[key.toLowerCase() + "Key"] : event.key === key.replace("Space", " ");
        });
      });
    });
    return {
      method,
      value: method ? keyShortcuts[method] : null
    };
  }
  #seekTotal;
  #calcSeekAmount(event, type) {
    const seekBy = event.shiftKey ? 10 : 5;
    return this.#seekTotal = Math.max(
      0,
      Math.min(
        (this.#seekTotal ?? this.$state.currentTime()) + (type === "seekForward" ? +seekBy : -seekBy),
        this.$state.duration()
      )
    );
  }
  #timeSlider = null;
  #forwardTimeKeyboardEvent(event, forward) {
    this.#timeSlider?.dispatchEvent(
      new KeyboardEvent(event.type, {
        key: !forward ? "Left" : "Right",
        shiftKey: event.shiftKey,
        trigger: event
      })
    );
  }
  #seeking(event, type, forward) {
    if (!this.$state.canSeek()) return;
    if (!this.#timeSlider) {
      this.#timeSlider = this.el.querySelector("[data-media-time-slider]");
    }
    if (this.#timeSlider) {
      this.#forwardTimeKeyboardEvent(event, forward);
    } else {
      this.#media.remote.seeking(this.#calcSeekAmount(event, type), event);
    }
  }
}
const SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
function replaceSymbolKeys(key) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}

class ARIAKeyShortcuts extends ViewController {
  #shortcut;
  constructor(shortcut) {
    super();
    this.#shortcut = shortcut;
  }
  onAttach(el) {
    const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[this.#shortcut] = keys;
      return;
    }
    const shortcuts = $props.keyShortcuts()[this.#shortcut];
    if (shortcuts) {
      const keys2 = isArray(shortcuts) ? shortcuts.join(" ") : isString(shortcuts) ? shortcuts : shortcuts?.keys;
      el.setAttribute("aria-keyshortcuts", isArray(keys2) ? keys2.join(" ") : keys2);
    }
  }
}

class MediaControls extends MediaPlayerController {
  #idleTimer = -2;
  #pausedTracking = false;
  #hideOnMouseLeave = signal(false);
  #isMouseOutside = signal(false);
  #focusedItem = null;
  #canIdle = signal(true);
  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state (i.e., hide controls).
   *
   * @defaultValue 2000
   */
  defaultDelay = 2e3;
  /**
   * Whether controls can hide after a delay in user interaction. If this is false, controls will
   * not hide and be user controlled.
   */
  get canIdle() {
    return this.#canIdle();
  }
  set canIdle(canIdle) {
    this.#canIdle.set(canIdle);
  }
  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   *
   * @defaultValue false
   */
  get hideOnMouseLeave() {
    const { hideControlsOnMouseLeave } = this.$props;
    return this.#hideOnMouseLeave() || hideControlsOnMouseLeave();
  }
  set hideOnMouseLeave(hide) {
    this.#hideOnMouseLeave.set(hide);
  }
  /**
   * Whether media controls are currently visible.
   */
  get showing() {
    return this.$state.controlsVisible();
  }
  /**
   * Show controls.
   */
  show(delay = 0, trigger) {
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(true, delay, trigger);
    }
  }
  /**
   * Hide controls.
   */
  hide(delay = this.defaultDelay, trigger) {
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(false, delay, trigger);
    }
  }
  /**
   * Whether all idle tracking on controls should be paused until resumed again.
   */
  pause(trigger) {
    this.#pausedTracking = true;
    this.#clearIdleTimer();
    this.#changeVisibility(true, 0, trigger);
  }
  resume(trigger) {
    this.#pausedTracking = false;
    if (this.$state.paused()) return;
    this.#changeVisibility(false, this.defaultDelay, trigger);
  }
  onConnect() {
    effect(this.#init.bind(this));
  }
  #init() {
    const { viewType } = this.$state;
    if (!this.el || !this.#canIdle()) return;
    if (viewType() === "audio") {
      this.show();
      return;
    }
    effect(this.#watchMouse.bind(this));
    effect(this.#watchPaused.bind(this));
    const onPlay = this.#onPlay.bind(this), onPause = this.#onPause.bind(this), onEnd = this.#onEnd.bind(this);
    new EventsController(this.el).add("can-play", (event) => this.show(0, event)).add("play", onPlay).add("pause", onPause).add("end", onEnd).add("auto-play-fail", onPause);
  }
  #watchMouse() {
    if (!this.el) return;
    const { started, pointer, paused } = this.$state;
    if (!started() || pointer() !== "fine") return;
    const events = new EventsController(this.el), shouldHideOnMouseLeave = this.hideOnMouseLeave;
    if (!shouldHideOnMouseLeave || !this.#isMouseOutside()) {
      effect(() => {
        if (!paused()) events.add("pointermove", this.#onStopIdle.bind(this));
      });
    }
    if (shouldHideOnMouseLeave) {
      events.add("mouseenter", this.#onMouseEnter.bind(this)).add("mouseleave", this.#onMouseLeave.bind(this));
    }
  }
  #watchPaused() {
    const { paused, started, autoPlayError } = this.$state;
    if (paused() || autoPlayError() && !started()) return;
    const onStopIdle = this.#onStopIdle.bind(this);
    effect(() => {
      if (!this.el) return;
      const pointer = this.$state.pointer(), isTouch = pointer === "coarse", events = new EventsController(this.el), eventTypes = [isTouch ? "touchend" : "pointerup", "keydown"];
      for (const eventType of eventTypes) {
        events.add(eventType, onStopIdle, { passive: false });
      }
    });
  }
  #onPlay(event) {
    if (event.triggers.hasType("ended")) return;
    this.show(0, event);
    this.hide(void 0, event);
  }
  #onPause(event) {
    this.show(0, event);
  }
  #onEnd(event) {
    const { loop } = this.$state;
    if (loop()) this.hide(0, event);
  }
  #onMouseEnter(event) {
    this.#isMouseOutside.set(false);
    this.show(0, event);
    this.hide(void 0, event);
  }
  #onMouseLeave(event) {
    this.#isMouseOutside.set(true);
    this.hide(0, event);
  }
  #clearIdleTimer() {
    window.clearTimeout(this.#idleTimer);
    this.#idleTimer = -1;
  }
  #onStopIdle(event) {
    if (
      // @ts-expect-error
      event.MEDIA_GESTURE || this.#pausedTracking || isTouchPinchEvent(event)
    ) {
      return;
    }
    if (isKeyboardEvent(event)) {
      if (event.key === "Escape") {
        this.el?.focus();
        this.#focusedItem = null;
      } else if (this.#focusedItem) {
        event.preventDefault();
        requestAnimationFrame(() => {
          this.#focusedItem?.focus();
          this.#focusedItem = null;
        });
      }
    }
    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }
  #changeVisibility(visible, delay, trigger) {
    if (delay === 0) {
      this.#onChange(visible, trigger);
      return;
    }
    this.#idleTimer = window.setTimeout(() => {
      if (!this.scope) return;
      this.#onChange(visible && !this.#pausedTracking, trigger);
    }, delay);
  }
  #onChange(visible, trigger) {
    if (this.$state.controlsVisible() === visible) return;
    this.$state.controlsVisible.set(visible);
    if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
      this.#focusedItem = document.activeElement;
      requestAnimationFrame(() => {
        this.el?.focus({ preventScroll: true });
      });
    }
    this.dispatch("controls-change", {
      detail: visible,
      trigger
    });
  }
}

class AudioProviderLoader {
  name = "audio";
  target;
  canPlay(src) {
    if (!isAudioSrc(src)) return false;
    return true;
  }
  mediaType() {
    return "audio";
  }
  async load(ctx) {
    {
      throw Error("[vidstack] can not load audio provider server-side");
    }
  }
}

class VideoProviderLoader {
  name = "video";
  target;
  canPlay(src) {
    if (!isVideoSrc(src)) return false;
    return true;
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    {
      throw Error("[vidstack] can not load video provider server-side");
    }
  }
}

class HLSProviderLoader extends VideoProviderLoader {
  static supported = isHLSSupported();
  name = "hls";
  canPlay(src) {
    return HLSProviderLoader.supported && isHLSSrc(src);
  }
  async load(context) {
    {
      throw Error("[vidstack] can not load hls provider server-side");
    }
  }
}

function coerceToError(error) {
  return error instanceof Error ? error : Error(typeof error === "string" ? error : JSON.stringify(error));
}
function assert(condition, message) {
  if (!condition) {
    throw Error("Assertion failed.");
  }
}

class DASHProviderLoader extends VideoProviderLoader {
  static supported = isDASHSupported();
  name = "dash";
  canPlay(src) {
    return DASHProviderLoader.supported && isDASHSrc(src);
  }
  async load(context) {
    {
      throw Error("[vidstack] can not load dash provider server-side");
    }
  }
}

class VimeoProviderLoader {
  name = "vimeo";
  target;
  preconnect() {
    const connections = [
      "https://i.vimeocdn.com",
      "https://f.vimeocdn.com",
      "https://fresnel.vimeocdn.com"
    ];
    for (const url of connections) {
    }
  }
  canPlay(src) {
    return isString(src.src) && src.type === "video/vimeo";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    {
      throw Error("[vidstack] can not load vimeo provider server-side");
    }
  }
  async loadPoster(src, ctx, abort) {
    const { resolveVimeoVideoId, getVimeoVideoInfo } = await import('./chunks/vidstack-krOAtKMi.js');
    if (!isString(src.src)) return null;
    const { videoId, hash } = resolveVimeoVideoId(src.src);
    if (videoId) {
      return getVimeoVideoInfo(videoId, abort, hash).then((info) => info ? info.poster : null);
    }
    return null;
  }
}

class YouTubeProviderLoader {
  name = "youtube";
  target;
  preconnect() {
    const connections = [
      // Botguard script.
      "https://www.google.com",
      // Posters.
      "https://i.ytimg.com",
      // Ads.
      "https://googleads.g.doubleclick.net",
      "https://static.doubleclick.net"
    ];
    for (const url of connections) {
    }
  }
  canPlay(src) {
    return isString(src.src) && src.type === "video/youtube";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    {
      throw Error("[vidstack] can not load youtube provider server-side");
    }
  }
  async loadPoster(src, ctx, abort) {
    const { findYouTubePoster, resolveYouTubeVideoId } = await import('./chunks/vidstack-Zc3I7oOd.js');
    const videoId = isString(src.src) && resolveYouTubeVideoId(src.src);
    if (videoId) return findYouTubePoster(videoId, abort);
    return null;
  }
}

const MEDIA_ATTRIBUTES = Symbol(0);
const mediaAttributes = [
  "autoPlay",
  "canAirPlay",
  "canFullscreen",
  "canGoogleCast",
  "canLoad",
  "canLoadPoster",
  "canPictureInPicture",
  "canPlay",
  "canSeek",
  "ended",
  "fullscreen",
  "isAirPlayConnected",
  "isGoogleCastConnected",
  "live",
  "liveEdge",
  "loop",
  "mediaType",
  "muted",
  "paused",
  "pictureInPicture",
  "playing",
  "playsInline",
  "remotePlaybackState",
  "remotePlaybackType",
  "seeking",
  "started",
  "streamType",
  "viewType",
  "waiting"
];

const mediaPlayerProps = {
  artist: "",
  artwork: null,
  autoplay: false,
  autoPlay: false,
  clipStartTime: 0,
  clipEndTime: 0,
  controls: false,
  currentTime: 0,
  crossorigin: null,
  crossOrigin: null,
  duration: -1,
  fullscreenOrientation: "landscape",
  googleCast: {},
  load: "visible",
  posterLoad: "visible",
  logLevel: "silent",
  loop: false,
  muted: false,
  paused: true,
  playsinline: false,
  playsInline: false,
  playbackRate: 1,
  poster: "",
  preload: "metadata",
  preferNativeHLS: false,
  src: "",
  title: "",
  controlsDelay: 2e3,
  hideControlsOnMouseLeave: false,
  viewType: "unknown",
  streamType: "unknown",
  volume: 1,
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  keyDisabled: false,
  keyTarget: "player",
  keyShortcuts: MEDIA_KEY_SHORTCUTS,
  storage: null
};

class MediaLoadController extends MediaPlayerController {
  #type;
  #callback;
  constructor(type, callback) {
    super();
    this.#type = type;
    this.#callback = callback;
  }
  async onAttach(el) {
    return;
  }
}

class MediaPlayerDelegate {
  #handle;
  #media;
  constructor(handle, media) {
    this.#handle = handle;
    this.#media = media;
  }
  notify(type, ...init) {
    return;
  }
  async ready(info, trigger) {
    return;
  }
  async #attemptAutoplay(trigger) {
    const {
      player,
      $state: { autoPlaying, muted }
    } = this.#media;
    autoPlaying.set(true);
    const attemptEvent = new DOMEvent("auto-play-attempt", { trigger });
    try {
      await player.play(attemptEvent);
    } catch (error) {
    }
  }
}

class Queue {
  #queue = /* @__PURE__ */ new Map();
  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  enqueue(key, item) {
    this.#queue.set(key, item);
  }
  /**
   * Process item in queue for the given `key`.
   */
  serve(key) {
    const value = this.peek(key);
    this.#queue.delete(key);
    return value;
  }
  /**
   * Peek at item in queue for the given `key`.
   */
  peek(key) {
    return this.#queue.get(key);
  }
  /**
   * Removes queued item under the given `key`.
   */
  delete(key) {
    this.#queue.delete(key);
  }
  /**
   * Clear all items in the queue.
   */
  clear() {
    this.#queue.clear();
  }
}

class RequestQueue {
  #serving = false;
  #pending = deferredPromise();
  #queue = /* @__PURE__ */ new Map();
  /**
   * The number of callbacks that are currently in queue.
   */
  get size() {
    return this.#queue.size;
  }
  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get isServing() {
    return this.#serving;
  }
  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async waitForFlush() {
    if (this.#serving) return;
    await this.#pending.promise;
  }
  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  enqueue(key, callback) {
    if (this.#serving) {
      callback();
      return;
    }
    this.#queue.delete(key);
    this.#queue.set(key, callback);
  }
  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  serve(key) {
    this.#queue.get(key)?.();
    this.#queue.delete(key);
  }
  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  start() {
    this.#flush();
    this.#serving = true;
    if (this.#queue.size > 0) this.#flush();
  }
  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  stop() {
    this.#serving = false;
  }
  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  reset() {
    this.stop();
    this.#queue.clear();
    this.#release();
  }
  #flush() {
    for (const key of this.#queue.keys()) this.serve(key);
    this.#release();
  }
  #release() {
    this.#pending.resolve();
    this.#pending = deferredPromise();
  }
}

class MediaRequestManager extends MediaPlayerController {
  #stateMgr;
  #request;
  #media;
  controls;
  #fullscreen;
  #orientation;
  #$provider;
  #providerQueue = new RequestQueue();
  constructor(stateMgr, request, media) {
    super();
    this.#stateMgr = stateMgr;
    this.#request = request;
    this.#media = media;
    this.#$provider = media.$provider;
    this.controls = new MediaControls();
    this.#fullscreen = new FullscreenController();
    this.#orientation = new ScreenOrientationController();
  }
  onAttach() {
    this.listen("fullscreen-change", this.#onFullscreenChange.bind(this));
  }
  onConnect(el) {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), events = new EventsController(el), handleRequest = this.#handleRequest.bind(this);
    for (const name of names) {
      if (name.startsWith("media-")) {
        events.add(name, handleRequest);
      }
    }
    this.#attachLoadPlayListener();
    effect(this.#watchProvider.bind(this));
    effect(this.#watchControlsDelayChange.bind(this));
    effect(this.#watchAudioGainSupport.bind(this));
    effect(this.#watchAirPlaySupport.bind(this));
    effect(this.#watchGoogleCastSupport.bind(this));
    effect(this.#watchFullscreenSupport.bind(this));
    effect(this.#watchPiPSupport.bind(this));
  }
  onDestroy() {
    try {
      const destroyEvent = this.createEvent("destroy"), { pictureInPicture, fullscreen } = this.$state;
      if (fullscreen()) this.exitFullscreen("prefer-media", destroyEvent);
      if (pictureInPicture()) this.exitPictureInPicture(destroyEvent);
    } catch (e) {
    }
    this.#providerQueue.reset();
  }
  #attachLoadPlayListener() {
    const { load } = this.$props, { canLoad } = this.$state;
    if (load() !== "play" || canLoad()) return;
    const off = this.listen("media-play-request", (event) => {
      this.#handleLoadPlayStrategy(event);
      off();
    });
  }
  #watchProvider() {
    const provider = this.#$provider(), canPlay = this.$state.canPlay();
    if (provider && canPlay) {
      this.#providerQueue.start();
    }
    return () => {
      this.#providerQueue.stop();
    };
  }
  #handleRequest(event) {
    event.stopPropagation();
    if (event.defaultPrevented) return;
    if (!this[event.type]) return;
    if (peek(this.#$provider)) {
      this[event.type](event);
    } else {
      this.#providerQueue.enqueue(event.type, () => {
        if (peek(this.#$provider)) this[event.type](event);
      });
    }
  }
  async play(trigger) {
    return;
  }
  #handleLoadPlayStrategy(trigger) {
    const { load } = this.$props, { canLoad } = this.$state;
    if (load() === "play" && !canLoad()) {
      const event = this.createEvent("media-start-loading", { trigger });
      this.dispatchEvent(event);
      this.#providerQueue.enqueue("media-play-request", async () => {
        try {
          await this.play(event);
        } catch (error) {
        }
      });
      return true;
    }
    return false;
  }
  async pause(trigger) {
    return;
  }
  setAudioGain(gain, trigger) {
    const { audioGain, canSetAudioGain } = this.$state;
    if (audioGain() === gain) return;
    const provider = this.#$provider();
    if (!provider?.audioGain || !canSetAudioGain()) {
      throw Error("[vidstack] audio gain api not available");
    }
    if (trigger) {
      this.#request.queue.enqueue("media-audio-gain-change-request", trigger);
    }
    provider.audioGain.setGain(gain);
  }
  seekToLiveEdge(trigger) {
    return;
  }
  #wasPIPActive = false;
  async enterFullscreen(target = "prefer-media", trigger) {
    return;
  }
  async exitFullscreen(target = "prefer-media", trigger) {
    return;
  }
  #getFullscreenAdapter(target) {
    const provider = peek(this.#$provider);
    return target === "prefer-media" && this.#fullscreen.supported || target === "media" ? this.#fullscreen : provider?.fullscreen;
  }
  async enterPictureInPicture(trigger) {
    return;
  }
  async exitPictureInPicture(trigger) {
    return;
  }
  #throwIfPIPNotSupported() {
    if (this.$state.canPictureInPicture()) return;
    throw Error(
      "[vidstack] no pip support"
    );
  }
  #watchControlsDelayChange() {
    this.controls.defaultDelay = this.$props.controlsDelay();
  }
  #watchAudioGainSupport() {
    const { canSetAudioGain } = this.$state, supported = !!this.#$provider()?.audioGain?.supported;
    canSetAudioGain.set(supported);
  }
  #watchAirPlaySupport() {
    const { canAirPlay } = this.$state, supported = !!this.#$provider()?.airPlay?.supported;
    canAirPlay.set(supported);
  }
  #watchGoogleCastSupport() {
    const { canGoogleCast, source } = this.$state, supported = IS_CHROME;
    canGoogleCast.set(supported);
  }
  #watchFullscreenSupport() {
    const { canFullscreen } = this.$state, supported = this.#fullscreen.supported || !!this.#$provider()?.fullscreen?.supported;
    canFullscreen.set(supported);
  }
  #watchPiPSupport() {
    const { canPictureInPicture } = this.$state, supported = !!this.#$provider()?.pictureInPicture?.supported;
    canPictureInPicture.set(supported);
  }
  async ["media-airplay-request"](event) {
    try {
      await this.requestAirPlay(event);
    } catch (error) {
    }
  }
  async requestAirPlay(trigger) {
    try {
      const adapter = this.#$provider()?.airPlay;
      if (!adapter?.supported) {
        throw Error(false ? "AirPlay adapter not available on provider." : "No AirPlay adapter.");
      }
      if (trigger) {
        this.#request.queue.enqueue("media-airplay-request", trigger);
      }
      return await adapter.prompt();
    } catch (error) {
      this.#request.queue.delete("media-airplay-request");
      throw error;
    }
  }
  async ["media-google-cast-request"](event) {
    try {
      await this.requestGoogleCast(event);
    } catch (error) {
    }
  }
  #googleCastLoader;
  async requestGoogleCast(trigger) {
    try {
      const { canGoogleCast } = this.$state;
      if (!peek(canGoogleCast)) {
        const error = Error(
          false ? "Google Cast not available on this platform." : "Cast not available."
        );
        error.code = "CAST_NOT_AVAILABLE";
        throw error;
      }
      preconnect("https://www.gstatic.com");
      if (!this.#googleCastLoader) {
        const $module = await import('./chunks/vidstack-BIlI0d8S.js');
        this.#googleCastLoader = new $module.GoogleCastLoader();
      }
      await this.#googleCastLoader.prompt(this.#media);
      if (trigger) {
        this.#request.queue.enqueue("media-google-cast-request", trigger);
      }
      const isConnecting = peek(this.$state.remotePlaybackState) !== "disconnected";
      if (isConnecting) {
        this.$state.savedState.set({
          paused: peek(this.$state.paused),
          currentTime: peek(this.$state.currentTime)
        });
      }
      this.$state.remotePlaybackLoader.set(isConnecting ? this.#googleCastLoader : null);
    } catch (error) {
      this.#request.queue.delete("media-google-cast-request");
      throw error;
    }
  }
  ["media-clip-start-change-request"](event) {
    const { clipStartTime } = this.$state;
    clipStartTime.set(event.detail);
  }
  ["media-clip-end-change-request"](event) {
    const { clipEndTime } = this.$state;
    clipEndTime.set(event.detail);
    this.dispatch("duration-change", {
      detail: event.detail,
      trigger: event
    });
  }
  ["media-duration-change-request"](event) {
    const { providedDuration, clipEndTime } = this.$state;
    providedDuration.set(event.detail);
    if (clipEndTime() <= 0) {
      this.dispatch("duration-change", {
        detail: event.detail,
        trigger: event
      });
    }
  }
  ["media-audio-track-change-request"](event) {
    const { logger, audioTracks } = this.#media;
    if (audioTracks.readonly) {
      return;
    }
    const index = event.detail, track = audioTracks[index];
    if (track) {
      const key = event.type;
      this.#request.queue.enqueue(key, event);
      track.selected = true;
    }
  }
  async ["media-enter-fullscreen-request"](event) {
    try {
      await this.enterFullscreen(event.detail, event);
    } catch (error) {
      this.#onFullscreenError(error, event);
    }
  }
  async ["media-exit-fullscreen-request"](event) {
    try {
      await this.exitFullscreen(event.detail, event);
    } catch (error) {
      this.#onFullscreenError(error, event);
    }
  }
  async #onFullscreenChange(event) {
    const lockType = peek(this.$props.fullscreenOrientation), isFullscreen = event.detail;
    if (isUndefined(lockType) || lockType === "none" || !this.#orientation.supported) return;
    if (isFullscreen) {
      if (this.#orientation.locked) return;
      this.dispatch("media-orientation-lock-request", {
        detail: lockType,
        trigger: event
      });
    } else if (this.#orientation.locked) {
      this.dispatch("media-orientation-unlock-request", {
        trigger: event
      });
    }
  }
  #onFullscreenError(error, request) {
    this.#stateMgr.handle(
      this.createEvent("fullscreen-error", {
        detail: coerceToError(error)
      })
    );
  }
  async ["media-orientation-lock-request"](event) {
    const key = event.type;
    try {
      this.#request.queue.enqueue(key, event);
      await this.#orientation.lock(event.detail);
    } catch (error) {
      this.#request.queue.delete(key);
    }
  }
  async ["media-orientation-unlock-request"](event) {
    const key = event.type;
    try {
      this.#request.queue.enqueue(key, event);
      await this.#orientation.unlock();
    } catch (error) {
      this.#request.queue.delete(key);
    }
  }
  async ["media-enter-pip-request"](event) {
    try {
      await this.enterPictureInPicture(event);
    } catch (error) {
      this.#onPictureInPictureError(error, event);
    }
  }
  async ["media-exit-pip-request"](event) {
    try {
      await this.exitPictureInPicture(event);
    } catch (error) {
      this.#onPictureInPictureError(error, event);
    }
  }
  #onPictureInPictureError(error, request) {
    this.#stateMgr.handle(
      this.createEvent("picture-in-picture-error", {
        detail: coerceToError(error)
      })
    );
  }
  ["media-live-edge-request"](event) {
    const { live, liveEdge, canSeek } = this.$state;
    if (!live() || liveEdge() || !canSeek()) return;
    this.#request.queue.enqueue("media-seek-request", event);
    try {
      this.seekToLiveEdge();
    } catch (error) {
      this.#request.queue.delete("media-seek-request");
    }
  }
  async ["media-loop-request"](event) {
    try {
      this.#request.looping = true;
      this.#request.replaying = true;
      await this.play(event);
    } catch (error) {
      this.#request.looping = false;
    }
  }
  ["media-user-loop-change-request"](event) {
    this.$state.userPrefersLoop.set(event.detail);
  }
  async ["media-pause-request"](event) {
    if (this.$state.paused()) return;
    try {
      await this.pause(event);
    } catch (error) {
    }
  }
  async ["media-play-request"](event) {
    if (!this.$state.paused()) return;
    try {
      await this.play(event);
    } catch (e) {
    }
  }
  ["media-rate-change-request"](event) {
    const { playbackRate, canSetPlaybackRate } = this.$state;
    if (playbackRate() === event.detail || !canSetPlaybackRate()) return;
    const provider = this.#$provider();
    if (!provider?.setPlaybackRate) return;
    this.#request.queue.enqueue("media-rate-change-request", event);
    provider.setPlaybackRate(event.detail);
  }
  ["media-audio-gain-change-request"](event) {
    try {
      this.setAudioGain(event.detail, event);
    } catch (e) {
    }
  }
  ["media-quality-change-request"](event) {
    const { qualities, storage, logger } = this.#media;
    if (qualities.readonly) {
      return;
    }
    this.#request.queue.enqueue("media-quality-change-request", event);
    const index = event.detail;
    if (index < 0) {
      qualities.autoSelect(event);
      if (event.isOriginTrusted) storage?.setVideoQuality?.(null);
    } else {
      const quality = qualities[index];
      if (quality) {
        quality.selected = true;
        if (event.isOriginTrusted) {
          storage?.setVideoQuality?.({
            id: quality.id,
            width: quality.width,
            height: quality.height,
            bitrate: quality.bitrate
          });
        }
      }
    }
  }
  ["media-pause-controls-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.controls.pause(event);
  }
  ["media-resume-controls-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.controls.resume(event);
  }
  ["media-seek-request"](event) {
    const { canSeek, ended, live, seekableEnd, userBehindLiveEdge } = this.$state, seekTime = event.detail;
    if (ended()) this.#request.replaying = true;
    const key = event.type;
    this.#request.seeking = false;
    this.#request.queue.delete(key);
    const boundedTime = boundTime(seekTime, this.$state);
    if (!Number.isFinite(boundedTime) || !canSeek()) return;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setCurrentTime(boundedTime);
    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundedTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }
  ["media-seeking-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.$state.seeking.set(true);
    this.#request.seeking = true;
  }
  ["media-start-loading"](event) {
    if (this.$state.canLoad()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#stateMgr.handle(this.createEvent("can-load"));
  }
  ["media-poster-start-loading"](event) {
    if (this.$state.canLoadPoster()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#stateMgr.handle(this.createEvent("can-load-poster"));
  }
  ["media-text-track-change-request"](event) {
    const { index, mode } = event.detail, track = this.#media.textTracks[index];
    if (track) {
      const key = event.type;
      this.#request.queue.enqueue(key, event);
      track.setMode(mode, event);
    }
  }
  ["media-mute-request"](event) {
    if (this.$state.muted()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setMuted(true);
  }
  ["media-unmute-request"](event) {
    const { muted, volume } = this.$state;
    if (!muted()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#media.$provider().setMuted(false);
    if (volume() === 0) {
      this.#request.queue.enqueue(key, event);
      this.#$provider().setVolume(0.25);
    }
  }
  ["media-volume-change-request"](event) {
    const { muted, volume } = this.$state;
    const newVolume = event.detail;
    if (volume() === newVolume) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setVolume(newVolume);
    if (newVolume > 0 && muted()) {
      this.#request.queue.enqueue(key, event);
      this.#$provider().setMuted(false);
    }
  }
  #logError(title, error, request) {
    return;
  }
}
class MediaRequestContext {
  seeking = false;
  looping = false;
  replaying = false;
  queue = new Queue();
}

class MediaStateManager extends MediaPlayerController {
  #request;
  #media;
  #trackedEvents = /* @__PURE__ */ new Map();
  #clipEnded = false;
  #playedIntervals = [];
  #playedInterval = [-1, -1];
  #firingWaiting = false;
  #waitingTrigger;
  constructor(request, media) {
    super();
    this.#request = request;
    this.#media = media;
  }
  onAttach(el) {
    el.setAttribute("aria-busy", "true");
    new EventsController(this).add("fullscreen-change", this["fullscreen-change"].bind(this)).add("fullscreen-error", this["fullscreen-error"].bind(this)).add("orientation-change", this["orientation-change"].bind(this));
  }
  onConnect(el) {
    effect(this.#watchCanSetVolume.bind(this));
    this.#addTextTrackListeners();
    this.#addQualityListeners();
    this.#addAudioTrackListeners();
    this.#resumePlaybackOnConnect();
    onDispose(this.#pausePlaybackOnDisconnect.bind(this));
  }
  onDestroy() {
    const { audioTracks, qualities, textTracks } = this.#media;
    audioTracks[ListSymbol.reset]();
    qualities[ListSymbol.reset]();
    textTracks[ListSymbol.reset]();
    this.#stopWatchingQualityResize();
  }
  handle(event) {
    if (!this.scope) return;
    event.type;
    untrack(() => this[event.type]?.(event));
  }
  #isPlayingOnDisconnect = false;
  #resumePlaybackOnConnect() {
    if (!this.#isPlayingOnDisconnect) return;
    requestAnimationFrame(() => {
      if (!this.scope) return;
      this.#media.remote.play(new DOMEvent("dom-connect"));
    });
    this.#isPlayingOnDisconnect = false;
  }
  #pausePlaybackOnDisconnect() {
    if (this.#isPlayingOnDisconnect) return;
    this.#isPlayingOnDisconnect = !this.$state.paused();
    this.#media.$provider()?.pause();
  }
  #resetTracking() {
    this.#stopWaiting();
    this.#clipEnded = false;
    this.#request.replaying = false;
    this.#request.looping = false;
    this.#firingWaiting = false;
    this.#waitingTrigger = void 0;
    this.#trackedEvents.clear();
  }
  #satisfyRequest(request, event) {
    const requestEvent = this.#request.queue.serve(request);
    if (!requestEvent) return;
    event.request = requestEvent;
    event.triggers.add(requestEvent);
  }
  #addTextTrackListeners() {
    this.#onTextTracksChange();
    this.#onTextTrackModeChange();
    const textTracks = this.#media.textTracks;
    new EventsController(textTracks).add("add", this.#onTextTracksChange.bind(this)).add("remove", this.#onTextTracksChange.bind(this)).add("mode-change", this.#onTextTrackModeChange.bind(this));
  }
  #addQualityListeners() {
    const qualities = this.#media.qualities;
    new EventsController(qualities).add("add", this.#onQualitiesChange.bind(this)).add("remove", this.#onQualitiesChange.bind(this)).add("change", this.#onQualityChange.bind(this)).add("auto-change", this.#onAutoQualityChange.bind(this)).add("readonly-change", this.#onCanSetQualityChange.bind(this));
  }
  #addAudioTrackListeners() {
    const audioTracks = this.#media.audioTracks;
    new EventsController(audioTracks).add("add", this.#onAudioTracksChange.bind(this)).add("remove", this.#onAudioTracksChange.bind(this)).add("change", this.#onAudioTrackChange.bind(this));
  }
  #onTextTracksChange(event) {
    const { textTracks } = this.$state;
    textTracks.set(this.#media.textTracks.toArray());
    this.dispatch("text-tracks-change", {
      detail: textTracks(),
      trigger: event
    });
  }
  #onTextTrackModeChange(event) {
    if (event) this.#satisfyRequest("media-text-track-change-request", event);
    const current = this.#media.textTracks.selected, { textTrack } = this.$state;
    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch("text-track-change", {
        detail: current,
        trigger: event
      });
    }
  }
  #onAudioTracksChange(event) {
    const { audioTracks } = this.$state;
    audioTracks.set(this.#media.audioTracks.toArray());
    this.dispatch("audio-tracks-change", {
      detail: audioTracks(),
      trigger: event
    });
  }
  #onAudioTrackChange(event) {
    const { audioTrack } = this.$state;
    audioTrack.set(this.#media.audioTracks.selected);
    if (event) this.#satisfyRequest("media-audio-track-change-request", event);
    this.dispatch("audio-track-change", {
      detail: audioTrack(),
      trigger: event
    });
  }
  #onQualitiesChange(event) {
    const { qualities } = this.$state;
    qualities.set(this.#media.qualities.toArray());
    this.dispatch("qualities-change", {
      detail: qualities(),
      trigger: event
    });
  }
  #onQualityChange(event) {
    const { quality } = this.$state;
    quality.set(this.#media.qualities.selected);
    if (event) this.#satisfyRequest("media-quality-change-request", event);
    this.dispatch("quality-change", {
      detail: quality(),
      trigger: event
    });
  }
  #onAutoQualityChange() {
    const { qualities } = this.#media, isAuto = qualities.auto;
    this.$state.autoQuality.set(isAuto);
    if (!isAuto) this.#stopWatchingQualityResize();
  }
  #stopQualityResizeEffect = null;
  #watchQualityResize() {
    this.#stopWatchingQualityResize();
    this.#stopQualityResizeEffect = effect(() => {
      const { qualities } = this.#media, { mediaWidth, mediaHeight } = this.$state, w = mediaWidth(), h = mediaHeight();
      if (w === 0 || h === 0) return;
      let selectedQuality = null, minScore = Infinity;
      for (const quality of qualities) {
        const score = Math.abs(quality.width - w) + Math.abs(quality.height - h);
        if (score < minScore) {
          minScore = score;
          selectedQuality = quality;
        }
      }
      if (selectedQuality) {
        qualities[ListSymbol.select](
          selectedQuality,
          true,
          new DOMEvent("resize", { detail: { width: w, height: h } })
        );
      }
    });
  }
  #stopWatchingQualityResize() {
    this.#stopQualityResizeEffect?.();
    this.#stopQualityResizeEffect = null;
  }
  #onCanSetQualityChange() {
    this.$state.canSetQuality.set(!this.#media.qualities.readonly);
  }
  #watchCanSetVolume() {
    const { canSetVolume, isGoogleCastConnected } = this.$state;
    if (isGoogleCastConnected()) {
      canSetVolume.set(false);
      return;
    }
    canChangeVolume().then(canSetVolume.set);
  }
  ["provider-change"](event) {
    const prevProvider = this.#media.$provider(), newProvider = event.detail;
    if (prevProvider?.type === newProvider?.type) return;
    prevProvider?.destroy?.();
    prevProvider?.scope?.dispose();
    this.#media.$provider.set(event.detail);
    if (prevProvider && event.detail === null) {
      this.#resetMediaState(event);
    }
  }
  ["provider-loader-change"](event) {
  }
  ["auto-play"](event) {
    this.$state.autoPlayError.set(null);
  }
  ["auto-play-fail"](event) {
    this.$state.autoPlayError.set(event.detail);
    this.#resetTracking();
  }
  ["can-load"](event) {
    this.$state.canLoad.set(true);
    this.#trackedEvents.set("can-load", event);
    this.#media.textTracks[TextTrackSymbol.canLoad]();
    this.#satisfyRequest("media-start-loading", event);
  }
  ["can-load-poster"](event) {
    this.$state.canLoadPoster.set(true);
    this.#trackedEvents.set("can-load-poster", event);
    this.#satisfyRequest("media-poster-start-loading", event);
  }
  ["media-type-change"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const viewType = this.$state.viewType();
    this.$state.mediaType.set(event.detail);
    const providedViewType = this.$state.providedViewType(), currentViewType = providedViewType === "unknown" ? event.detail : providedViewType;
    if (viewType !== currentViewType) {
      {
        this.$state.inferredViewType.set(currentViewType);
      }
    }
  }
  ["stream-type-change"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const { streamType, inferredStreamType } = this.$state;
    inferredStreamType.set(event.detail);
    event.detail = streamType();
  }
  ["rate-change"](event) {
    const { storage } = this.#media, { canPlay } = this.$state;
    this.$state.playbackRate.set(event.detail);
    this.#satisfyRequest("media-rate-change-request", event);
    if (canPlay()) {
      storage?.setPlaybackRate?.(event.detail);
    }
  }
  ["remote-playback-change"](event) {
    const { remotePlaybackState, remotePlaybackType } = this.$state, { type, state } = event.detail, isConnected = state === "connected";
    remotePlaybackType.set(type);
    remotePlaybackState.set(state);
    const key = type === "airplay" ? "media-airplay-request" : "media-google-cast-request";
    if (isConnected) {
      this.#satisfyRequest(key, event);
    } else {
      const requestEvent = this.#request.queue.peek(key);
      if (requestEvent) {
        event.request = requestEvent;
        event.triggers.add(requestEvent);
      }
    }
  }
  ["sources-change"](event) {
    const prevSources = this.$state.sources(), newSources = event.detail;
    this.$state.sources.set(newSources);
    this.#onSourceQualitiesChange(prevSources, newSources, event);
  }
  #onSourceQualitiesChange(prevSources, newSources, trigger) {
    let { qualities } = this.#media, added = false, removed = false;
    for (const prevSrc of prevSources) {
      if (!isVideoQualitySrc(prevSrc)) continue;
      const exists = newSources.some((s) => s.src === prevSrc.src);
      if (!exists) {
        const quality = qualities.getBySrc(prevSrc.src);
        if (quality) {
          qualities[ListSymbol.remove](quality, trigger);
          removed = true;
        }
      }
    }
    if (removed && !qualities.length) {
      this.$state.savedState.set(null);
      qualities[ListSymbol.reset](trigger);
    }
    for (const src of newSources) {
      if (!isVideoQualitySrc(src) || qualities.getBySrc(src.src)) continue;
      const quality = {
        id: src.id ?? src.height + "p",
        bitrate: null,
        codec: null,
        ...src,
        selected: false
      };
      qualities[ListSymbol.add](quality, trigger);
      added = true;
    }
    if (added && !qualities[QualitySymbol.enableAuto]) {
      this.#watchQualityResize();
      qualities[QualitySymbol.enableAuto] = this.#watchQualityResize.bind(this);
      qualities[QualitySymbol.setAuto](true, trigger);
    }
  }
  ["source-change"](event) {
    event.isQualityChange = event.originEvent?.type === "quality-change";
    const source = event.detail;
    this.#resetMediaState(event, event.isQualityChange);
    this.#trackedEvents.set(event.type, event);
    this.$state.source.set(source);
    this.el?.setAttribute("aria-busy", "true");
  }
  #resetMediaState(event, isSourceQualityChange = false) {
    const { audioTracks, qualities } = this.#media;
    if (!isSourceQualityChange) {
      this.#playedIntervals = [];
      this.#playedInterval = [-1, -1];
      audioTracks[ListSymbol.reset](event);
      qualities[ListSymbol.reset](event);
      softResetMediaState(this.$state, isSourceQualityChange);
      this.#resetTracking();
      return;
    }
    softResetMediaState(this.$state, isSourceQualityChange);
    this.#resetTracking();
  }
  ["abort"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const canLoadEvent = this.#trackedEvents.get("can-load");
    if (canLoadEvent && !event.triggers.hasType("can-load")) {
      event.triggers.add(canLoadEvent);
    }
  }
  ["load-start"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
  }
  ["error"](event) {
    this.$state.error.set(event.detail);
    const abortEvent = this.#trackedEvents.get("abort");
    if (abortEvent) event.triggers.add(abortEvent);
  }
  ["loaded-metadata"](event) {
    const loadStartEvent = this.#trackedEvents.get("load-start");
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }
  ["loaded-data"](event) {
    const loadStartEvent = this.#trackedEvents.get("load-start");
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }
  ["can-play"](event) {
    const loadedMetadata = this.#trackedEvents.get("loaded-metadata");
    if (loadedMetadata) event.triggers.add(loadedMetadata);
    this.#onCanPlayDetail(event.detail);
    this.el?.setAttribute("aria-busy", "false");
  }
  ["can-play-through"](event) {
    this.#onCanPlayDetail(event.detail);
    const canPlay = this.#trackedEvents.get("can-play");
    if (canPlay) event.triggers.add(canPlay);
  }
  #onCanPlayDetail(detail) {
    const { seekable, buffered, intrinsicDuration, canPlay } = this.$state;
    canPlay.set(true);
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);
    const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
    intrinsicDuration.set(seekableEnd);
  }
  ["duration-change"](event) {
    const { live, intrinsicDuration, providedDuration, clipEndTime, ended } = this.$state, time = event.detail;
    if (!live()) {
      const duration = !Number.isNaN(time) ? time : 0;
      intrinsicDuration.set(duration);
      if (ended()) this.#onEndPrecisionChange(event);
    }
    if (providedDuration() > 0 || clipEndTime() > 0) {
      event.stopImmediatePropagation();
    }
  }
  ["progress"](event) {
    const { buffered, seekable } = this.$state, { buffered: newBuffered, seekable: newSeekable } = event.detail, newBufferedEnd = getTimeRangesEnd(newBuffered), hasBufferedLengthChanged = newBuffered.length !== buffered().length, hasBufferedEndChanged = newBufferedEnd !== getTimeRangesEnd(buffered()), newSeekableEnd = getTimeRangesEnd(newSeekable), hasSeekableLengthChanged = newSeekable.length !== seekable().length, hasSeekableEndChanged = newSeekableEnd !== getTimeRangesEnd(seekable());
    if (hasBufferedLengthChanged || hasBufferedEndChanged) {
      buffered.set(newBuffered);
    }
    if (hasSeekableLengthChanged || hasSeekableEndChanged) {
      seekable.set(newSeekable);
    }
  }
  ["play"](event) {
    const {
      paused,
      autoPlayError,
      ended,
      autoPlaying,
      playsInline,
      pointer,
      muted,
      viewType,
      live,
      userBehindLiveEdge
    } = this.$state;
    this.#resetPlaybackIfNeeded();
    if (!paused()) {
      event.stopImmediatePropagation();
      return;
    }
    event.autoPlay = autoPlaying();
    const waitingEvent = this.#trackedEvents.get("waiting");
    if (waitingEvent) event.triggers.add(waitingEvent);
    this.#satisfyRequest("media-play-request", event);
    this.#trackedEvents.set("play", event);
    paused.set(false);
    autoPlayError.set(null);
    if (event.autoPlay) {
      this.handle(
        this.createEvent("auto-play", {
          detail: { muted: muted() },
          trigger: event
        })
      );
      autoPlaying.set(false);
    }
    if (ended() || this.#request.replaying) {
      this.#request.replaying = false;
      ended.set(false);
      this.handle(this.createEvent("replay", { trigger: event }));
    }
    if (!playsInline() && viewType() === "video" && pointer() === "coarse") {
      this.#media.remote.enterFullscreen("prefer-media", event);
    }
    if (live() && !userBehindLiveEdge()) {
      this.#media.remote.seekToLiveEdge(event);
    }
  }
  #resetPlaybackIfNeeded(trigger) {
    const provider = peek(this.#media.$provider);
    if (!provider) return;
    const { ended, seekableStart, clipEndTime, currentTime, realCurrentTime, duration } = this.$state;
    const shouldReset = ended() || realCurrentTime() < seekableStart() || clipEndTime() > 0 && realCurrentTime() >= clipEndTime() || Math.abs(currentTime() - duration()) < 0.1;
    if (shouldReset) {
      this.dispatch("media-seek-request", {
        detail: seekableStart(),
        trigger
      });
    }
    return shouldReset;
  }
  ["play-fail"](event) {
    const { muted, autoPlaying } = this.$state;
    const playEvent = this.#trackedEvents.get("play");
    if (playEvent) event.triggers.add(playEvent);
    this.#satisfyRequest("media-play-request", event);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    this.#resetTracking();
    this.#trackedEvents.set("play-fail", event);
    if (event.autoPlay) {
      this.handle(
        this.createEvent("auto-play-fail", {
          detail: {
            muted: muted(),
            error: event.detail
          },
          trigger: event
        })
      );
      autoPlaying.set(false);
    }
  }
  ["playing"](event) {
    const playEvent = this.#trackedEvents.get("play"), seekedEvent = this.#trackedEvents.get("seeked");
    if (playEvent) event.triggers.add(playEvent);
    else if (seekedEvent) event.triggers.add(seekedEvent);
    setTimeout(() => this.#resetTracking(), 0);
    const {
      paused,
      playing,
      live,
      liveSyncPosition,
      seekableEnd,
      started,
      currentTime,
      seeking,
      ended
    } = this.$state;
    paused.set(false);
    playing.set(true);
    seeking.set(false);
    ended.set(false);
    if (this.#request.looping) {
      this.#request.looping = false;
      return;
    }
    if (live() && !started() && currentTime() === 0) {
      const end = liveSyncPosition() ?? seekableEnd() - 2;
      if (Number.isFinite(end)) this.#media.$provider().setCurrentTime(end);
    }
    this["started"](event);
  }
  ["started"](event) {
    const { started } = this.$state;
    if (!started()) {
      started.set(true);
      this.handle(this.createEvent("started", { trigger: event }));
    }
  }
  ["pause"](event) {
    if (!this.el?.isConnected) {
      this.#isPlayingOnDisconnect = true;
    }
    this.#satisfyRequest("media-pause-request", event);
    const seekedEvent = this.#trackedEvents.get("seeked");
    if (seekedEvent) event.triggers.add(seekedEvent);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    if (this.#clipEnded) {
      setTimeout(() => {
        this.handle(this.createEvent("end", { trigger: event }));
        this.#clipEnded = false;
      }, 0);
    }
    this.#resetTracking();
  }
  ["time-change"](event) {
    if (this.#request.looping) {
      event.stopImmediatePropagation();
      return;
    }
    let { waiting, played, clipEndTime, realCurrentTime, currentTime } = this.$state, newTime = event.detail, endTime = clipEndTime();
    realCurrentTime.set(newTime);
    this.#updatePlayed();
    waiting.set(false);
    for (const track of this.#media.textTracks) {
      track[TextTrackSymbol.updateActiveCues](newTime, event);
    }
    if (endTime > 0 && newTime >= endTime) {
      this.#clipEnded = true;
      this.dispatch("media-pause-request", { trigger: event });
    }
    this.#saveTime();
    this.dispatch("time-update", {
      detail: { currentTime: currentTime(), played: played() },
      trigger: event
    });
  }
  #updatePlayed() {
    const { currentTime, played, paused } = this.$state;
    if (paused()) return;
    this.#playedInterval = updateTimeIntervals(
      this.#playedIntervals,
      this.#playedInterval,
      currentTime()
    );
    played.set(new TimeRange(this.#playedIntervals));
  }
  // Called to update time again incase duration precision has changed.
  #onEndPrecisionChange(trigger) {
    const { clipStartTime, clipEndTime, duration } = this.$state, isClipped = clipStartTime() > 0 || clipEndTime() > 0;
    if (isClipped) return;
    this.handle(
      this.createEvent("time-change", {
        detail: duration(),
        trigger
      })
    );
  }
  #saveTime() {
    const { storage } = this.#media, { canPlay, realCurrentTime } = this.$state;
    if (canPlay()) {
      storage?.setTime?.(realCurrentTime());
    }
  }
  ["audio-gain-change"](event) {
    const { storage } = this.#media, { canPlay, audioGain } = this.$state;
    audioGain.set(event.detail);
    this.#satisfyRequest("media-audio-gain-change-request", event);
    if (canPlay()) storage?.setAudioGain?.(audioGain());
  }
  ["volume-change"](event) {
    const { storage } = this.#media, { volume, muted, canPlay } = this.$state, detail = event.detail;
    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);
    this.#satisfyRequest("media-volume-change-request", event);
    this.#satisfyRequest(detail.muted ? "media-mute-request" : "media-unmute-request", event);
    if (canPlay()) {
      storage?.setVolume?.(volume());
      storage?.setMuted?.(muted());
    }
  }
  ["seeking"] = functionThrottle(
    (event) => {
      const { seeking, realCurrentTime, paused } = this.$state;
      seeking.set(true);
      realCurrentTime.set(event.detail);
      this.#satisfyRequest("media-seeking-request", event);
      if (paused()) {
        this.#waitingTrigger = event;
        this.#fireWaiting();
      }
      this.#playedInterval = [-1, -1];
    },
    150,
    { leading: true }
  );
  ["seeked"](event) {
    const { seeking, currentTime, realCurrentTime, paused, seekableEnd, ended, live } = this.$state;
    if (this.#request.seeking) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this.#trackedEvents.get("waiting");
      if (waitingEvent) event.triggers.add(waitingEvent);
      const seekingEvent = this.#trackedEvents.get("seeking");
      if (seekingEvent && !event.triggers.has(seekingEvent)) {
        event.triggers.add(seekingEvent);
      }
      if (paused()) this.#stopWaiting();
      seeking.set(false);
      realCurrentTime.set(event.detail);
      this.#satisfyRequest("media-seek-request", event);
      const origin = event?.originEvent;
      if (origin?.isTrusted && !(origin instanceof MessageEvent) && !/seek/.test(origin.type)) {
        this["started"](event);
      }
    }
    if (!live()) {
      if (Math.floor(currentTime()) !== Math.floor(seekableEnd())) {
        ended.set(false);
      } else {
        this.end(event);
      }
    }
  }
  ["waiting"](event) {
    if (this.#firingWaiting || this.#request.seeking) return;
    event.stopImmediatePropagation();
    this.#waitingTrigger = event;
    this.#fireWaiting();
  }
  #fireWaiting = functionDebounce(() => {
    if (!this.#waitingTrigger) return;
    this.#firingWaiting = true;
    const { waiting, playing } = this.$state;
    waiting.set(true);
    playing.set(false);
    const event = this.createEvent("waiting", { trigger: this.#waitingTrigger });
    this.#trackedEvents.set("waiting", event);
    this.dispatch(event);
    this.#waitingTrigger = void 0;
    this.#firingWaiting = false;
  }, 300);
  ["end"](event) {
    const { loop, ended } = this.$state;
    if (!loop() && ended()) return;
    if (loop()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.#resetPlaybackIfNeeded(event);
          this.dispatch("media-loop-request", { trigger: event });
        });
      }, 10);
      return;
    }
    setTimeout(() => this.#onEnded(event), 0);
  }
  #onEnded(event) {
    const { storage } = this.#media, { paused, seeking, ended, duration } = this.$state;
    this.#onEndPrecisionChange(event);
    if (!paused()) {
      this.dispatch("pause", { trigger: event });
    }
    if (seeking()) {
      this.dispatch("seeked", {
        detail: duration(),
        trigger: event
      });
    }
    ended.set(true);
    this.#resetTracking();
    storage?.setTime?.(duration(), true);
    this.dispatch("ended", {
      trigger: event
    });
  }
  #stopWaiting() {
    this.#fireWaiting.cancel();
    this.$state.waiting.set(false);
  }
  ["fullscreen-change"](event) {
    const isFullscreen = event.detail;
    this.$state.fullscreen.set(isFullscreen);
    this.#satisfyRequest(
      isFullscreen ? "media-enter-fullscreen-request" : "media-exit-fullscreen-request",
      event
    );
  }
  ["fullscreen-error"](event) {
    this.#satisfyRequest("media-enter-fullscreen-request", event);
    this.#satisfyRequest("media-exit-fullscreen-request", event);
  }
  ["orientation-change"](event) {
    const isLocked = event.detail.lock;
    this.#satisfyRequest(
      isLocked ? "media-orientation-lock-request" : "media-orientation-unlock-request",
      event
    );
  }
  ["picture-in-picture-change"](event) {
    const isPiP = event.detail;
    this.$state.pictureInPicture.set(isPiP);
    this.#satisfyRequest(isPiP ? "media-enter-pip-request" : "media-exit-pip-request", event);
  }
  ["picture-in-picture-error"](event) {
    this.#satisfyRequest("media-enter-pip-request", event);
    this.#satisfyRequest("media-exit-pip-request", event);
  }
  ["title-change"](event) {
    if (!event.trigger) return;
    event.stopImmediatePropagation();
    this.$state.inferredTitle.set(event.detail);
  }
  ["poster-change"](event) {
    if (!event.trigger) return;
    event.stopImmediatePropagation();
    this.$state.inferredPoster.set(event.detail);
  }
}

class MediaStateSync extends MediaPlayerController {
  onSetup() {
    this.#init();
    return;
  }
  #init() {
    const providedProps = {
      duration: "providedDuration",
      loop: "providedLoop",
      poster: "providedPoster",
      streamType: "providedStreamType",
      title: "providedTitle",
      viewType: "providedViewType"
    };
    const skip = /* @__PURE__ */ new Set([
      "currentTime",
      "paused",
      "playbackRate",
      "volume"
    ]);
    for (const prop of Object.keys(this.$props)) {
      if (skip.has(prop)) continue;
      this.$state[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }
    this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }
  // Sync "provided" props with internal state. Provided props are used to differentiate from
  // provider inferred values.
  #watchProvidedTypes() {
    const { viewType, streamType, title, poster, loop } = this.$props, $state = this.$state;
    $state.providedPoster.set(poster());
    $state.providedStreamType.set(streamType());
    $state.providedViewType.set(viewType());
    $state.providedTitle.set(title());
    $state.providedLoop.set(loop());
  }
  #watchLogLevel() {
    return;
  }
  #watchMetadata() {
    const { artist, artwork } = this.$props;
    this.$state.artist.set(artist());
    this.$state.artwork.set(artwork());
  }
  #watchTitle() {
    const { title } = this.$state;
    this.dispatch("title-change", { detail: title() });
  }
  #watchAutoplay() {
    const autoPlay = this.$props.autoPlay() || this.$props.autoplay();
    this.$state.autoPlay.set(autoPlay);
    this.dispatch("auto-play-change", { detail: autoPlay });
  }
  #watchLoop() {
    const loop = this.$state.loop();
    this.dispatch("loop-change", { detail: loop });
  }
  #watchControls() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }
  #watchPoster() {
    const { poster } = this.$state;
    this.dispatch("poster-change", { detail: poster() });
  }
  #watchCrossOrigin() {
    const crossOrigin = this.$props.crossOrigin() ?? this.$props.crossorigin(), value = crossOrigin === true ? "" : crossOrigin;
    this.$state.crossOrigin.set(value);
  }
  #watchDuration() {
    const { duration } = this.$props;
    this.dispatch("media-duration-change-request", {
      detail: duration()
    });
  }
  #watchPlaysInline() {
    const inline = this.$props.playsInline() || this.$props.playsinline();
    this.$state.playsInline.set(inline);
    this.dispatch("plays-inline-change", { detail: inline });
  }
  #watchClipStartTime() {
    const { clipStartTime } = this.$props;
    this.dispatch("media-clip-start-change-request", {
      detail: clipStartTime()
    });
  }
  #watchClipEndTime() {
    const { clipEndTime } = this.$props;
    this.dispatch("media-clip-end-change-request", {
      detail: clipEndTime()
    });
  }
  #watchLive() {
    this.dispatch("live-change", { detail: this.$state.live() });
  }
  #watchLiveTolerance() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }
  #watchLiveEdge() {
    this.dispatch("live-edge-change", { detail: this.$state.liveEdge() });
  }
}

const actions = ["play", "pause", "seekforward", "seekbackward", "seekto"];
class NavigatorMediaSession extends MediaPlayerController {
  onConnect() {
    effect(this.#onMetadataChange.bind(this));
    effect(this.#onPlaybackStateChange.bind(this));
    const handleAction = this.#handleAction.bind(this);
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, handleAction);
    }
    onDispose(this.#onDisconnect.bind(this));
  }
  #onDisconnect() {
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, null);
    }
  }
  #onMetadataChange() {
    const { title, artist, artwork, poster } = this.$state;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title(),
      artist: artist(),
      artwork: artwork() ?? [{ src: poster() }]
    });
  }
  #onPlaybackStateChange() {
    const { canPlay, paused } = this.$state;
    navigator.mediaSession.playbackState = !canPlay() ? "none" : paused() ? "paused" : "playing";
  }
  #handleAction(details) {
    const trigger = new DOMEvent(`media-session-action`, { detail: details });
    switch (details.action) {
      case "play":
        this.dispatch("media-play-request", { trigger });
        break;
      case "pause":
        this.dispatch("media-pause-request", { trigger });
        break;
      case "seekto":
      case "seekforward":
      case "seekbackward":
        this.dispatch("media-seek-request", {
          detail: isNumber(details.seekTime) ? details.seekTime : this.$state.currentTime() + (details.seekOffset ?? (details.action === "seekforward" ? 10 : -10)),
          trigger
        });
        break;
    }
  }
}

let $keyboard = signal(false);
class FocusVisibleController extends ViewController {
  #focused = signal(false);
  onConnect(el) {
    effect(() => {
      const events = new EventsController(el);
      if (!$keyboard()) {
        this.#focused.set(false);
        updateFocusAttr(el, false);
        events.add("pointerenter", this.#onPointerEnter.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this));
        return;
      }
      const active = document.activeElement === el;
      this.#focused.set(active);
      updateFocusAttr(el, active);
      events.add("focus", this.#onFocus.bind(this)).add("blur", this.#onBlur.bind(this));
    });
  }
  focused() {
    return this.#focused();
  }
  #onFocus() {
    this.#focused.set(true);
    updateFocusAttr(this.el, true);
  }
  #onBlur() {
    this.#focused.set(false);
    updateFocusAttr(this.el, false);
  }
  #onPointerEnter() {
    updateHoverAttr(this.el, true);
  }
  #onPointerLeave() {
    updateHoverAttr(this.el, false);
  }
}
function updateFocusAttr(el, isFocused) {
  setAttribute(el, "data-focus", isFocused);
  setAttribute(el, "data-hocus", isFocused);
}
function updateHoverAttr(el, isHovering) {
  setAttribute(el, "data-hocus", isHovering);
  setAttribute(el, "data-hover", isHovering);
}

class MediaPlayer extends Component {
  static props = mediaPlayerProps;
  static state = mediaState;
  #media;
  #stateMgr;
  #requestMgr;
  canPlayQueue = new RequestQueue();
  remoteControl;
  get #provider() {
    return this.#media.$provider();
  }
  get #props() {
    return this.$props;
  }
  constructor() {
    super();
    new MediaStateSync();
    const context = {
      player: this,
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      storage: null,
      $provider: signal(null),
      $providerSetup: signal(false),
      $props: this.$props,
      $state: this.$state
    };
    context.remote = this.remoteControl = new MediaRemoteControl(
      void 0
    );
    context.remote.setPlayer(this);
    context.textTracks = new TextTrackList();
    context.textTracks[TextTrackSymbol.crossOrigin] = this.$state.crossOrigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};
    this.#media = context;
    provideContext(mediaContext, context);
    this.orientation = new ScreenOrientationController();
    new FocusVisibleController();
    new MediaKeyboardController(context);
    const request = new MediaRequestContext();
    this.#stateMgr = new MediaStateManager(request, context);
    this.#requestMgr = new MediaRequestManager(this.#stateMgr, request, context);
    context.delegate = new MediaPlayerDelegate(this.#stateMgr.handle.bind(this.#stateMgr), context);
    context.notify = context.delegate.notify.bind(context.delegate);
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      new NavigatorMediaSession();
    }
    new MediaLoadController("load", this.startLoading.bind(this));
    new MediaLoadController("posterLoad", this.startLoadingPoster.bind(this));
  }
  onSetup() {
    this.#setupMediaAttributes();
    effect(this.#watchCanPlay.bind(this));
    effect(this.#watchMuted.bind(this));
    effect(this.#watchPaused.bind(this));
    effect(this.#watchVolume.bind(this));
    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchPlaysInline.bind(this));
    effect(this.#watchPlaybackRate.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-player", "");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "region");
    effect(this.#watchStorage.bind(this));
    this.#watchTitle();
    this.#watchOrientation();
    listenEvent(el, "find-media-player", this.#onFindPlayer.bind(this));
  }
  onConnect(el) {
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    this.#onPointerChange(pointerQuery);
    pointerQuery.onchange = this.#onPointerChange.bind(this);
    const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
    resize.observe(el);
    effect(this.#onResize.bind(this));
    this.dispatch("media-player-connect", {
      detail: this,
      bubbles: true,
      composed: true
    });
    onDispose(() => {
      resize.disconnect();
      pointerQuery.onchange = null;
    });
  }
  onDestroy() {
    this.#media.player = null;
    this.canPlayQueue.reset();
  }
  #skipTitleUpdate = false;
  #watchTitle() {
    this.$el; const { title, live, viewType, providedTitle } = this.$state, isLive = live(), type = uppercaseFirstChar(viewType()), typeText = type !== "Unknown" ? `${isLive ? "Live " : ""}${type}` : isLive ? "Live" : "Media", currentTitle = title();
    setAttribute(
      this.el,
      "aria-label",
      `${typeText} Player` + (currentTitle ? ` - ${currentTitle}` : "")
    );
  }
  #watchOrientation() {
    const orientation = this.orientation.landscape ? "landscape" : "portrait";
    this.$state.orientation.set(orientation);
    setAttribute(this.el, "data-orientation", orientation);
    this.#onResize();
  }
  #watchCanPlay() {
    if (this.$state.canPlay() && this.#provider) this.canPlayQueue.start();
    else this.canPlayQueue.stop();
  }
  #setupMediaAttributes() {
    if (MediaPlayer[MEDIA_ATTRIBUTES]) {
      this.setAttributes(MediaPlayer[MEDIA_ATTRIBUTES]);
      return;
    }
    const $attrs = {
      "data-load": function() {
        return this.$props.load();
      },
      "data-captions": function() {
        const track = this.$state.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      "data-ios-controls": function() {
        return this.$state.iOSControls();
      },
      "data-controls": function() {
        return this.controls.showing;
      },
      "data-buffering": function() {
        const { canLoad, canPlay, waiting } = this.$state;
        return canLoad() && (!canPlay() || waiting());
      },
      "data-error": function() {
        const { error } = this.$state;
        return !!error();
      },
      "data-autoplay-error": function() {
        const { autoPlayError } = this.$state;
        return !!autoPlayError();
      }
    };
    const alias = {
      autoPlay: "autoplay",
      canAirPlay: "can-airplay",
      canPictureInPicture: "can-pip",
      pictureInPicture: "pip",
      playsInline: "playsinline",
      remotePlaybackState: "remote-state",
      remotePlaybackType: "remote-type",
      isAirPlayConnected: "airplay",
      isGoogleCastConnected: "google-cast"
    };
    for (const prop2 of mediaAttributes) {
      const attrName = "data-" + (alias[prop2] ?? camelToKebabCase(prop2));
      $attrs[attrName] = function() {
        return this.$state[prop2]();
      };
    }
    delete $attrs.title;
    MediaPlayer[MEDIA_ATTRIBUTES] = $attrs;
    this.setAttributes($attrs);
  }
  #onFindPlayer(event) {
    event.detail(this);
  }
  #onResize() {
    return;
  }
  #onPointerChange(queryList) {
    return;
  }
  /**
   * The current media provider.
   */
  get provider() {
    return this.#provider;
  }
  /**
   * Media controls settings.
   */
  get controls() {
    return this.#requestMgr.controls;
  }
  set controls(controls) {
    this.#props.controls.set(controls);
  }
  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on the player.
   */
  orientation;
  /**
   * The title of the current media.
   */
  get title() {
    return peek(this.$state.title);
  }
  set title(newTitle) {
    if (this.#skipTitleUpdate) {
      this.#skipTitleUpdate = false;
      return;
    }
    this.#props.title.set(newTitle);
  }
  /**
   * A list of all `VideoQuality` objects representing the set of available video renditions.
   *
   * @see {@link https://vidstack.io/docs/player/api/video-quality}
   */
  get qualities() {
    return this.#media.qualities;
  }
  /**
   * A list of all `AudioTrack` objects representing the set of available audio tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
   */
  get audioTracks() {
    return this.#media.audioTracks;
  }
  /**
   * A list of all `TextTrack` objects representing the set of available text tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/text-tracks}
   */
  get textTracks() {
    return this.#media.textTracks;
  }
  /**
   * Contains text renderers which are responsible for loading, parsing, and rendering text
   * tracks.
   */
  get textRenderers() {
    return this.#media.textRenderers;
  }
  get duration() {
    return this.$state.duration();
  }
  set duration(duration) {
    this.#props.duration.set(duration);
  }
  get paused() {
    return peek(this.$state.paused);
  }
  set paused(paused) {
    this.#queuePausedUpdate(paused);
  }
  #watchPaused() {
    this.#queuePausedUpdate(this.$props.paused());
  }
  #queuePausedUpdate(paused) {
    if (paused) {
      this.canPlayQueue.enqueue("paused", () => this.#requestMgr.pause());
    } else this.canPlayQueue.enqueue("paused", () => this.#requestMgr.play());
  }
  get muted() {
    return peek(this.$state.muted);
  }
  set muted(muted) {
    this.#queueMutedUpdate(muted);
  }
  #watchMuted() {
    this.#queueMutedUpdate(this.$props.muted());
  }
  #queueMutedUpdate(muted) {
    this.canPlayQueue.enqueue("muted", () => {
      if (this.#provider) this.#provider.setMuted(muted);
    });
  }
  get currentTime() {
    return peek(this.$state.currentTime);
  }
  set currentTime(time) {
    this.#queueCurrentTimeUpdate(time);
  }
  #watchCurrentTime() {
    this.#queueCurrentTimeUpdate(this.$props.currentTime());
  }
  #queueCurrentTimeUpdate(time) {
    this.canPlayQueue.enqueue("currentTime", () => {
      const { currentTime } = this.$state;
      if (time === peek(currentTime)) return;
      peek(() => {
        if (!this.#provider) return;
        const boundedTime = boundTime(time, this.$state);
        if (Number.isFinite(boundedTime)) {
          this.#provider.setCurrentTime(boundedTime);
        }
      });
    });
  }
  get volume() {
    return peek(this.$state.volume);
  }
  set volume(volume) {
    this.#queueVolumeUpdate(volume);
  }
  #watchVolume() {
    this.#queueVolumeUpdate(this.$props.volume());
  }
  #queueVolumeUpdate(volume) {
    const clampedVolume = clampNumber(0, volume, 1);
    this.canPlayQueue.enqueue("volume", () => {
      if (this.#provider) this.#provider.setVolume(clampedVolume);
    });
  }
  get playbackRate() {
    return peek(this.$state.playbackRate);
  }
  set playbackRate(rate) {
    this.#queuePlaybackRateUpdate(rate);
  }
  #watchPlaybackRate() {
    this.#queuePlaybackRateUpdate(this.$props.playbackRate());
  }
  #queuePlaybackRateUpdate(rate) {
    this.canPlayQueue.enqueue("rate", () => {
      if (this.#provider) this.#provider.setPlaybackRate?.(rate);
    });
  }
  #watchPlaysInline() {
    this.#queuePlaysInlineUpdate(this.$props.playsInline());
  }
  #queuePlaysInlineUpdate(inline) {
    this.canPlayQueue.enqueue("playsinline", () => {
      if (this.#provider) this.#provider.setPlaysInline?.(inline);
    });
  }
  #watchStorage() {
    let storageValue = this.$props.storage(), storage = isString(storageValue) ? new LocalMediaStorage() : storageValue;
    if (storage?.onChange) {
      const { source } = this.$state, playerId = isString(storageValue) ? storageValue : this.el?.id, mediaId = computed(this.#computeMediaId.bind(this));
      effect(() => storage.onChange(source(), mediaId(), playerId || void 0));
    }
    this.#media.storage = storage;
    this.#media.textTracks.setStorage(storage);
    onDispose(() => {
      storage?.onDestroy?.();
      this.#media.storage = null;
      this.#media.textTracks.setStorage(null);
    });
  }
  #computeMediaId() {
    const { clipStartTime, clipEndTime } = this.$props, { source } = this.$state, src = source();
    return src.src ? `${src.src}:${clipStartTime()}:${clipEndTime()}` : null;
  }
  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies. This method will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  async play(trigger) {
    return this.#requestMgr.play(trigger);
  }
  /**
   * Pauses playback of the media. This method will throw if called before media is ready for
   * playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  async pause(trigger) {
    return this.#requestMgr.pause(trigger);
  }
  /**
   * Attempts to display the player in fullscreen. The promise will resolve if successful, and
   * reject if not. This method will throw if any fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  async enterFullscreen(target, trigger) {
    return this.#requestMgr.enterFullscreen(target, trigger);
  }
  /**
   * Attempts to display the player inline by exiting fullscreen. This method will throw if any
   * fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  async exitFullscreen(target, trigger) {
    return this.#requestMgr.exitFullscreen(target, trigger);
  }
  /**
   * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
   * not supported. This method will also return a `PictureInPictureWindow` if the current
   * provider supports it.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  enterPictureInPicture(trigger) {
    return this.#requestMgr.enterPictureInPicture(trigger);
  }
  /**
   * Attempts to display the player in inline by exiting picture-in-picture mode. This method
   * will throw if not supported.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  exitPictureInPicture(trigger) {
    return this.#requestMgr.exitPictureInPicture(trigger);
  }
  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   *
   * @see {@link https://vidstack.io/docs/player/api/live}
   */
  seekToLiveEdge(trigger) {
    this.#requestMgr.seekToLiveEdge(trigger);
  }
  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoading(trigger) {
    this.#media.notify("can-load", void 0, trigger);
  }
  /**
   * Called when the poster image can begin loading. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoadingPoster(trigger) {
    this.#media.notify("can-load-poster", void 0, trigger);
  }
  /**
   * Request Apple AirPlay picker to open.
   */
  requestAirPlay(trigger) {
    return this.#requestMgr.requestAirPlay(trigger);
  }
  /**
   * Request Google Cast device picker to open. The Google Cast framework will be loaded if it
   * hasn't yet.
   */
  requestGoogleCast(trigger) {
    return this.#requestMgr.requestGoogleCast(trigger);
  }
  /**
   * Set the audio gain, amplifying volume and enabling a maximum volume above 100%.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-gain}
   */
  setAudioGain(gain, trigger) {
    return this.#requestMgr.setAudioGain(gain, trigger);
  }
  destroy() {
    super.destroy();
    this.#media.remote.setPlayer(null);
    this.dispatch("destroy");
  }
}
const mediaplayer__proto = MediaPlayer.prototype;
prop(mediaplayer__proto, "canPlayQueue");
prop(mediaplayer__proto, "remoteControl");
prop(mediaplayer__proto, "provider");
prop(mediaplayer__proto, "controls");
prop(mediaplayer__proto, "orientation");
prop(mediaplayer__proto, "title");
prop(mediaplayer__proto, "qualities");
prop(mediaplayer__proto, "audioTracks");
prop(mediaplayer__proto, "textTracks");
prop(mediaplayer__proto, "textRenderers");
prop(mediaplayer__proto, "duration");
prop(mediaplayer__proto, "paused");
prop(mediaplayer__proto, "muted");
prop(mediaplayer__proto, "currentTime");
prop(mediaplayer__proto, "volume");
prop(mediaplayer__proto, "playbackRate");
method(mediaplayer__proto, "play");
method(mediaplayer__proto, "pause");
method(mediaplayer__proto, "enterFullscreen");
method(mediaplayer__proto, "exitFullscreen");
method(mediaplayer__proto, "enterPictureInPicture");
method(mediaplayer__proto, "exitPictureInPicture");
method(mediaplayer__proto, "seekToLiveEdge");
method(mediaplayer__proto, "startLoading");
method(mediaplayer__proto, "startLoadingPoster");
method(mediaplayer__proto, "requestAirPlay");
method(mediaplayer__proto, "requestGoogleCast");
method(mediaplayer__proto, "setAudioGain");

function resolveStreamTypeFromDASHManifest(manifestSrc, requestInit) {
  return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
    return /type="static"/.test(manifest) ? "on-demand" : "live";
  });
}
function resolveStreamTypeFromHLSManifest(manifestSrc, requestInit) {
  return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
    const renditionURI = resolveHLSRenditionURI(manifest);
    if (renditionURI) {
      return resolveStreamTypeFromHLSManifest(
        /^https?:/.test(renditionURI) ? renditionURI : new URL(renditionURI, manifestSrc).href,
        requestInit
      );
    }
    const streamType = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(manifest) ? "on-demand" : "live";
    if (streamType === "live" && resolveTargetDuration(manifest) >= 10 && (/#EXT-X-DVR-ENABLED:\s*true/.test(manifest) || manifest.includes("#EXT-X-DISCONTINUITY"))) {
      return "live:dvr";
    }
    return streamType;
  });
}
function resolveHLSRenditionURI(manifest) {
  const matches = manifest.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
  return matches ? matches[0].split("\n")[1].trim() : null;
}
function resolveTargetDuration(manifest) {
  const lines = manifest.split("\n");
  for (const line of lines) {
    if (line.startsWith("#EXT-X-TARGETDURATION")) {
      const duration = parseFloat(line.split(":")[1]);
      if (!isNaN(duration)) {
        return duration;
      }
    }
  }
  return -1;
}

const sourceTypes = /* @__PURE__ */ new Map();
class SourceSelection {
  #initialize = false;
  #loaders;
  #domSources;
  #media;
  #loader;
  constructor(domSources, media, loader, customLoaders = []) {
    this.#domSources = domSources;
    this.#media = media;
    this.#loader = loader;
    const DASH_LOADER = new DASHProviderLoader(), HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader(), YOUTUBE_LOADER = new YouTubeProviderLoader(), VIMEO_LOADER = new VimeoProviderLoader(), EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];
    this.#loaders = computed(() => {
      const remoteLoader = media.$state.remotePlaybackLoader();
      const loaders = media.$props.preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, ...EMBED_LOADERS, ...customLoaders];
      return remoteLoader ? [remoteLoader, ...loaders] : loaders;
    });
    const { $state } = media;
    $state.sources.set(normalizeSrc(media.$props.src()));
    for (const src of $state.sources()) {
      const loader2 = this.#loaders().find((loader3) => loader3.canPlay(src));
      if (!loader2) continue;
      const mediaType = loader2.mediaType(src);
      media.$state.source.set(src);
      media.$state.mediaType.set(mediaType);
      media.$state.inferredViewType.set(mediaType);
      this.#loader.set(loader2);
      this.#initialize = true;
      break;
    }
  }
  connect() {
    const loader = this.#loader();
    if (this.#initialize) {
      this.#notifySourceChange(this.#media.$state.source(), loader);
      this.#notifyLoaderChange(loader);
      this.#initialize = false;
    }
    effect(this.#onSourcesChange.bind(this));
    effect(this.#onSourceChange.bind(this));
    effect(this.#onSetup.bind(this));
    effect(this.#onLoadSource.bind(this));
    effect(this.#onLoadPoster.bind(this));
  }
  #onSourcesChange() {
    this.#media.notify("sources-change", [
      ...normalizeSrc(this.#media.$props.src()),
      ...this.#domSources()
    ]);
  }
  #onSourceChange() {
    const { $state } = this.#media;
    const sources = $state.sources(), currentSource = peek($state.source), newSource = this.#findNewSource(currentSource, sources), noMatch = sources[0]?.src && !newSource.src && !newSource.type;
    if (noMatch) {
      const { crossOrigin } = $state, credentials = getRequestCredentials(crossOrigin()), abort = new AbortController();
      Promise.all(
        sources.map(
          (source) => isString(source.src) && source.type === "?" ? fetch(source.src, {
            method: "HEAD",
            credentials,
            signal: abort.signal
          }).then((res) => {
            source.type = res.headers.get("content-type") || "??";
            sourceTypes.set(source.src, source.type);
            return source;
          }).catch(() => source) : source
        )
      ).then((sources2) => {
        if (abort.signal.aborted) return;
        const newSource2 = this.#findNewSource(peek($state.source), sources2);
        tick();
        if (!newSource2.src) {
          this.#media.notify("error", {
            message: "Failed to load resource.",
            code: 4
          });
        }
      });
      return () => abort.abort();
    }
    tick();
  }
  #findNewSource(currentSource, sources) {
    let newSource = { src: "", type: "" }, newLoader = null, triggerEvent = new DOMEvent("sources-change", { detail: { sources } }), loaders = this.#loaders(), { started, paused, currentTime, quality, savedState } = this.#media.$state;
    for (const src of sources) {
      const loader = loaders.find((loader2) => loader2.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
        break;
      }
    }
    if (isVideoQualitySrc(newSource)) {
      const currentQuality = quality(), sourceQuality = sources.find((s) => s.src === currentQuality?.src);
      if (peek(started)) {
        savedState.set({
          paused: peek(paused),
          currentTime: peek(currentTime)
        });
      } else {
        savedState.set(null);
      }
      if (sourceQuality) {
        newSource = sourceQuality;
        triggerEvent = new DOMEvent("quality-change", {
          detail: { quality: currentQuality }
        });
      }
    }
    if (!isSameSrc(currentSource, newSource)) {
      this.#notifySourceChange(newSource, newLoader, triggerEvent);
    }
    if (newLoader !== peek(this.#loader)) {
      this.#notifyLoaderChange(newLoader, triggerEvent);
    }
    return newSource;
  }
  #notifySourceChange(src, loader, trigger) {
    this.#media.notify("source-change", src, trigger);
    this.#media.notify("media-type-change", loader?.mediaType(src) || "unknown", trigger);
  }
  #notifyLoaderChange(loader, trigger) {
    this.#media.$providerSetup.set(false);
    this.#media.notify("provider-change", null, trigger);
    loader && peek(() => loader.preconnect?.(this.#media));
    this.#loader.set(loader);
    this.#media.notify("provider-loader-change", loader, trigger);
  }
  #onSetup() {
    const provider = this.#media.$provider();
    if (!provider || peek(this.#media.$providerSetup)) return;
    if (this.#media.$state.canLoad()) {
      scoped(() => provider.setup(), provider.scope);
      this.#media.$providerSetup.set(true);
      return;
    }
    peek(() => provider.preconnect?.());
  }
  #onLoadSource() {
    if (!this.#media.$providerSetup()) return;
    const provider = this.#media.$provider(), source = this.#media.$state.source(), crossOrigin = peek(this.#media.$state.crossOrigin), preferNativeHLS = peek(this.#media.$props.preferNativeHLS);
    if (isSameSrc(provider?.currentSrc, source)) {
      return;
    }
    if (this.#media.$state.canLoad()) {
      const abort = new AbortController();
      if (isHLSSrc(source)) {
        if (preferNativeHLS || !isHLSSupported()) {
          resolveStreamTypeFromHLSManifest(source.src, {
            credentials: getRequestCredentials(crossOrigin),
            signal: abort.signal
          }).then((streamType) => {
            this.#media.notify("stream-type-change", streamType);
          }).catch(noop);
        }
      } else if (isDASHSrc(source)) {
        resolveStreamTypeFromDASHManifest(source.src, {
          credentials: getRequestCredentials(crossOrigin),
          signal: abort.signal
        }).then((streamType) => {
          this.#media.notify("stream-type-change", streamType);
        }).catch(noop);
      } else {
        this.#media.notify("stream-type-change", "on-demand");
      }
      peek(() => {
        const preload = peek(this.#media.$state.preload);
        return provider?.loadSource(source, preload).catch((error) => {
        });
      });
      return () => abort.abort();
    }
    try {
      isString(source.src) && preconnect(new URL(source.src).origin);
    } catch (error) {
    }
  }
  #onLoadPoster() {
    const loader = this.#loader(), { providedPoster, source, canLoadPoster } = this.#media.$state;
    if (!loader || !loader.loadPoster || !source() || !canLoadPoster() || providedPoster()) return;
    const abort = new AbortController(), trigger = new DOMEvent("source-change", { detail: source });
    loader.loadPoster(source(), this.#media, abort).then((url) => {
      this.#media.notify("poster-change", url || "", trigger);
    }).catch(() => {
      this.#media.notify("poster-change", "", trigger);
    });
    return () => {
      abort.abort();
    };
  }
}
function normalizeSrc(src) {
  return (isArray(src) ? src : [src]).map((src2) => {
    if (isString(src2)) {
      return { src: src2, type: inferType(src2) };
    } else {
      return { ...src2, type: inferType(src2.src, src2.type) };
    }
  });
}
function inferType(src, type) {
  if (isString(type) && type.length) {
    return type;
  } else if (isString(src) && sourceTypes.has(src)) {
    return sourceTypes.get(src);
  } else if (!type && isHLSSrc({ src, type: "" })) {
    return "application/x-mpegurl";
  } else if (!type && isDASHSrc({ src, type: "" })) {
    return "application/dash+xml";
  } else if (!isString(src) || src.startsWith("blob:")) {
    return "video/object";
  } else if (src.includes("youtube") || src.includes("youtu.be")) {
    return "video/youtube";
  } else if (src.includes("vimeo") && !src.includes("progressive_redirect") && !src.includes(".m3u8")) {
    return "video/vimeo";
  }
  return "?";
}
function isSameSrc(a, b) {
  return a?.src === b?.src && a?.type === b?.type;
}

class Tracks {
  #domTracks;
  #media;
  #prevTracks = [];
  constructor(domTracks, media) {
    this.#domTracks = domTracks;
    this.#media = media;
    effect(this.#onTracksChange.bind(this));
  }
  #onTracksChange() {
    const newTracks = this.#domTracks();
    for (const oldTrack of this.#prevTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this.#media.textTracks.getById(oldTrack.id);
        if (track) this.#media.textTracks.remove(track);
      }
    }
    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this.#media.textTracks.getById(id)) {
        newTrack.id = id;
        this.#media.textTracks.add(newTrack);
      }
    }
    this.#prevTracks = newTracks;
  }
}

class MediaProvider extends Component {
  static props = {
    loaders: []
  };
  static state = new State({
    loader: null
  });
  #media;
  #sources;
  #domSources = signal([]);
  #domTracks = signal([]);
  #loader = null;
  onSetup() {
    this.#media = useMediaContext();
    this.#sources = new SourceSelection(
      this.#domSources,
      this.#media,
      this.$state.loader,
      this.$props.loaders()
    );
  }
  onAttach(el) {
    el.setAttribute("data-media-provider", "");
  }
  onConnect(el) {
    this.#sources.connect();
    new Tracks(this.#domTracks, this.#media);
    const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
    resize.observe(el);
    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributes: true, childList: true });
    this.#onResize();
    this.#onMutation();
    onDispose(() => {
      resize.disconnect();
      mutations.disconnect();
    });
  }
  #loadRafId = -1;
  load(target) {
    target?.setAttribute("aria-hidden", "true");
    window.cancelAnimationFrame(this.#loadRafId);
    this.#loadRafId = requestAnimationFrame(() => this.#runLoader(target));
    onDispose(() => {
      window.cancelAnimationFrame(this.#loadRafId);
    });
  }
  #runLoader(target) {
    if (!this.scope) return;
    const loader = this.$state.loader(), { $provider } = this.#media;
    if (this.#loader === loader && loader?.target === target && peek($provider)) return;
    this.#destroyProvider();
    this.#loader = loader;
    if (loader) loader.target = target || null;
    if (!loader || !target) return;
    loader.load(this.#media).then((provider) => {
      if (!this.scope) return;
      if (peek(this.$state.loader) !== loader) return;
      this.#media.notify("provider-change", provider);
    });
  }
  onDestroy() {
    this.#loader = null;
    this.#destroyProvider();
  }
  #destroyProvider() {
    this.#media?.notify("provider-change", null);
  }
  #onResize() {
    if (!this.el) return;
    const { player, $state } = this.#media, width = this.el.offsetWidth, height = this.el.offsetHeight;
    if (!player) return;
    $state.mediaWidth.set(width);
    $state.mediaHeight.set(height);
    if (player.el) {
      setStyle(player.el, "--media-width", width + "px");
      setStyle(player.el, "--media-height", height + "px");
    }
  }
  #onMutation() {
    const sources = [], tracks = [], children = this.el.children;
    for (const el of children) {
      if (el.hasAttribute("data-vds")) continue;
      if (el instanceof HTMLSourceElement) {
        const src = {
          id: el.id,
          src: el.src,
          type: el.type
        };
        for (const prop of ["id", "src", "width", "height", "bitrate", "codec"]) {
          const value = el.getAttribute(`data-${prop}`);
          if (isString(value)) src[prop] = /id|src|codec/.test(prop) ? value : Number(value);
        }
        sources.push(src);
      } else if (el instanceof HTMLTrackElement) {
        const track = {
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute("data-type")
        };
        tracks.push({
          id: el.id || TextTrack.createId(track),
          ...track
        });
      }
    }
    this.#domSources.set(sources);
    this.#domTracks.set(tracks);
    tick();
  }
}
const mediaprovider__proto = MediaProvider.prototype;
method(mediaprovider__proto, "load");

function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, { padHrs = null, padMins = null, showHrs = false, showMs = false } = {}) {
  const { hours, minutes, seconds, fraction } = parseTime(duration), paddedHours = padHrs ? padNumberWithZeroes(hours, 2) : hours, paddedMinutes = padMins || isNull(padMins) && duration >= 3600 ? padNumberWithZeroes(minutes, 2) : minutes, paddedSeconds = padNumberWithZeroes(seconds, 2), paddedMs = showMs && fraction > 0 ? `.${String(fraction).replace(/^0?\./, "")}` : "", time = `${paddedMinutes}:${paddedSeconds}${paddedMs}`;
  return hours > 0 || showHrs ? `${paddedHours}:${time}` : time;
}
function formatSpokenTime(duration) {
  const spokenParts = [];
  const { hours, minutes, seconds } = parseTime(duration);
  if (hours > 0) {
    spokenParts.push(`${hours} hour`);
  }
  if (minutes > 0) {
    spokenParts.push(`${minutes} min`);
  }
  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} sec`);
  }
  return spokenParts.join(" ");
}

class MediaAnnouncer extends Component {
  static props = {
    translations: null
  };
  static state = new State({
    label: null,
    busy: false
  });
  #media;
  #initializing = false;
  onSetup() {
    this.#media = useMediaContext();
  }
  onAttach(el) {
    el.style.display = "contents";
  }
  onConnect(el) {
    el.setAttribute("data-media-announcer", "");
    setAttributeIfEmpty(el, "role", "status");
    setAttributeIfEmpty(el, "aria-live", "polite");
    const { busy } = this.$state;
    this.setAttributes({
      "aria-busy": () => busy() ? "true" : null
    });
    this.#initializing = true;
    effect(this.#watchPaused.bind(this));
    effect(this.#watchVolume.bind(this));
    effect(this.#watchCaptions.bind(this));
    effect(this.#watchFullscreen.bind(this));
    effect(this.#watchPiP.bind(this));
    effect(this.#watchSeeking.bind(this));
    effect(this.#watchLabel.bind(this));
    tick();
    this.#initializing = false;
  }
  #watchPaused() {
    const { paused } = this.#media.$state;
    this.#setLabel(!paused() ? "Play" : "Pause");
  }
  #watchFullscreen() {
    const { fullscreen } = this.#media.$state;
    this.#setLabel(fullscreen() ? "Enter Fullscreen" : "Exit Fullscreen");
  }
  #watchPiP() {
    const { pictureInPicture } = this.#media.$state;
    this.#setLabel(pictureInPicture() ? "Enter PiP" : "Exit PiP");
  }
  #watchCaptions() {
    const { textTrack } = this.#media.$state;
    this.#setLabel(textTrack() ? "Closed-Captions On" : "Closed-Captions Off");
  }
  #watchVolume() {
    const { muted, volume, audioGain } = this.#media.$state;
    this.#setLabel(
      muted() || volume() === 0 ? "Mute" : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this.#translate("Volume")}`
    );
  }
  #startedSeekingAt = -1;
  #seekTimer = -1;
  #watchSeeking() {
    const { seeking, currentTime } = this.#media.$state, isSeeking = seeking();
    if (this.#startedSeekingAt > 0) {
      window.clearTimeout(this.#seekTimer);
      this.#seekTimer = window.setTimeout(() => {
        if (!this.scope) return;
        const newTime = peek(currentTime), seconds = Math.abs(newTime - this.#startedSeekingAt);
        if (seconds >= 1) {
          const isForward = newTime >= this.#startedSeekingAt, spokenTime = formatSpokenTime(seconds);
          this.#setLabel(
            `${this.#translate(isForward ? "Seek Forward" : "Seek Backward")} ${spokenTime}`
          );
        }
        this.#startedSeekingAt = -1;
        this.#seekTimer = -1;
      }, 300);
    } else if (isSeeking) {
      this.#startedSeekingAt = peek(currentTime);
    }
  }
  #translate(word) {
    const { translations } = this.$props;
    return translations?.()?.[word || ""] ?? word;
  }
  #watchLabel() {
    const { label, busy } = this.$state, $label = this.#translate(label());
    if (this.#initializing) return;
    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);
    this.el && setAttribute(this.el, "aria-label", $label);
    if (isString($label)) {
      this.dispatch("change", { detail: $label });
    }
    return () => window.clearTimeout(id);
  }
  #setLabel(word) {
    const { label } = this.$state;
    label.set(word);
  }
}

class Controls extends Component {
  static props = {
    hideDelay: 2e3,
    hideOnMouseLeave: false
  };
  #media;
  onSetup() {
    this.#media = useMediaContext();
    effect(this.#watchProps.bind(this));
  }
  onAttach(el) {
    const { pictureInPicture, fullscreen } = this.#media.$state;
    setStyle(el, "pointer-events", "none");
    setAttributeIfEmpty(el, "role", "group");
    this.setAttributes({
      "data-visible": this.#isShowing.bind(this),
      "data-fullscreen": fullscreen,
      "data-pip": pictureInPicture
    });
    effect(() => {
      this.dispatch("change", { detail: this.#isShowing() });
    });
    effect(this.#hideControls.bind(this));
    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ["top", "right", "bottom", "left"]) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }
  #hideControls() {
    if (!this.el) return;
    const { nativeControls } = this.#media.$state, isHidden = nativeControls();
    setAttribute(this.el, "aria-hidden", isHidden ? "true" : null);
    setStyle(this.el, "display", isHidden ? "none" : null);
  }
  #watchProps() {
    const { controls } = this.#media.player, { hideDelay, hideOnMouseLeave } = this.$props;
    controls.defaultDelay = hideDelay() === 2e3 ? this.#media.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }
  #isShowing() {
    const { controlsVisible } = this.#media.$state;
    return controlsVisible();
  }
}

class ControlsGroup extends Component {
  onAttach(el) {
    if (!el.style.pointerEvents) setStyle(el, "pointer-events", "auto");
  }
}

class Popper extends ViewController {
  #delegate;
  constructor(delegate) {
    super();
    this.#delegate = delegate;
    effect(this.#watchTrigger.bind(this));
  }
  onDestroy() {
    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;
  }
  #watchTrigger() {
    const trigger = this.#delegate.trigger();
    if (!trigger) {
      this.hide();
      return;
    }
    const show = this.show.bind(this), hide = this.hide.bind(this);
    this.#delegate.listen(trigger, show, hide);
  }
  #showTimerId = -1;
  #hideRafId = -1;
  #stopAnimationEndListener = null;
  show(trigger) {
    this.#cancelShowing();
    window.cancelAnimationFrame(this.#hideRafId);
    this.#hideRafId = -1;
    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;
    this.#showTimerId = window.setTimeout(() => {
      this.#showTimerId = -1;
      const content = this.#delegate.content();
      if (content) content.style.removeProperty("display");
      peek(() => this.#delegate.onChange(true, trigger));
    }, this.#delegate.showDelay?.() ?? 0);
  }
  hide(trigger) {
    this.#cancelShowing();
    peek(() => this.#delegate.onChange(false, trigger));
    this.#hideRafId = requestAnimationFrame(() => {
      this.#cancelShowing();
      this.#hideRafId = -1;
      const content = this.#delegate.content();
      if (content) {
        const onHide = () => {
          content.style.display = "none";
          this.#stopAnimationEndListener = null;
        };
        const isAnimated = hasAnimation(content);
        if (isAnimated) {
          this.#stopAnimationEndListener?.();
          const stop = listenEvent();
          this.#stopAnimationEndListener = stop;
        } else {
          onHide();
        }
      }
    });
  }
  #cancelShowing() {
    window.clearTimeout(this.#showTimerId);
    this.#showTimerId = -1;
  }
}

const tooltipContext = createContext();

let id = 0;
class Tooltip extends Component {
  static props = {
    showDelay: 700
  };
  #id = `media-tooltip-${++id}`;
  #trigger = signal(null);
  #content = signal(null);
  #showing = signal(false);
  constructor() {
    super();
    new FocusVisibleController();
    const { showDelay } = this.$props;
    new Popper({
      trigger: this.#trigger,
      content: this.#content,
      showDelay,
      listen(trigger, show, hide) {
        effect(() => {
          if ($keyboard()) ;
        });
        new EventsController(trigger).add("touchstart", (e) => e.preventDefault(), { passive: false }).add("mouseenter", show).add("mouseleave", hide);
      },
      onChange: this.#onShowingChange.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onSetup() {
    provideContext(tooltipContext, {
      trigger: this.#trigger,
      content: this.#content,
      showing: this.#showing,
      attachTrigger: this.#attachTrigger.bind(this),
      detachTrigger: this.#detachTrigger.bind(this),
      attachContent: this.#attachContent.bind(this),
      detachContent: this.#detachContent.bind(this)
    });
  }
  #attachTrigger(el) {
    this.#trigger.set(el);
    let tooltipName = el.getAttribute("data-media-tooltip");
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
    }
    setAttribute(el, "data-describedby", this.#id);
  }
  #detachTrigger(el) {
    el.removeAttribute("data-describedby");
    el.removeAttribute("aria-describedby");
    this.#trigger.set(null);
  }
  #attachContent(el) {
    el.setAttribute("id", this.#id);
    el.style.display = "none";
    setAttributeIfEmpty(el, "role", "tooltip");
    this.#content.set(el);
  }
  #detachContent(el) {
    el.removeAttribute("id");
    el.removeAttribute("role");
    this.#content.set(null);
  }
  #onShowingChange(isShowing) {
    const trigger = this.#trigger(), content = this.#content();
    if (trigger) {
      setAttribute(trigger, "aria-describedby", isShowing ? this.#id : null);
    }
    for (const el of [this.el, trigger, content]) {
      el && setAttribute(el, "data-visible", isShowing);
    }
    this.#showing.set(isShowing);
  }
}

class TooltipTrigger extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  onConnect(el) {
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        this.#attach();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this.#getButton();
          button && tooltip.detachTrigger(button);
        });
      })
    );
  }
  #attach() {
    const button = this.#getButton(), tooltip = useContext(tooltipContext);
    button && tooltip.attachTrigger(button);
  }
  #getButton() {
    const candidate = this.el.firstElementChild;
    return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
  }
}

class TooltipContent extends Component {
  static props = {
    placement: "top center",
    offset: 0,
    alignOffset: 0
  };
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.#attach(el);
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    this.#attach(el);
    const tooltip = useContext(tooltipContext);
    onDispose(() => tooltip.detachContent(el));
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.#watchPlacement.bind(this));
      })
    );
  }
  #attach(el) {
    const tooltip = useContext(tooltipContext);
    tooltip.attachContent(el);
  }
  #watchPlacement() {
    const { showing } = useContext(tooltipContext);
    if (!showing()) return;
    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this.#getTrigger(), placement(), {
      offsetVarName: "media-tooltip",
      xOffset: alignOffset(),
      yOffset: mainOffset()
    });
  }
  #getTrigger() {
    return useContext(tooltipContext).trigger();
  }
}

class ToggleButtonController extends ViewController {
  static props = {
    disabled: false
  };
  #delegate;
  constructor(delegate) {
    super();
    this.#delegate = delegate;
    new FocusVisibleController();
    if (delegate.keyShortcut) {
      new ARIAKeyShortcuts(delegate.keyShortcut);
    }
  }
  onSetup() {
    const { disabled } = this.$props;
    this.setAttributes({
      "data-pressed": this.#delegate.isPresssed,
      "aria-pressed": this.#isARIAPressed.bind(this),
      "aria-disabled": () => disabled() ? "true" : null
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    const events = onPress(el, this.#onMaybePress.bind(this));
    for (const type of ["click", "touchstart"]) {
      events.add(type, this.#onInteraction.bind(this), {
        passive: true
      });
    }
  }
  #isARIAPressed() {
    return ariaBool$1(this.#delegate.isPresssed());
  }
  #onPressed(event) {
    if (isWriteSignal(this.#delegate.isPresssed)) {
      this.#delegate.isPresssed.set((p) => !p);
    }
  }
  #onMaybePress(event) {
    const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (this.#delegate.onPress ?? this.#onPressed).call(this, event);
  }
  #onInteraction(event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

class ToggleButton extends Component {
  static props = {
    disabled: false,
    defaultPressed: false
  };
  #pressed = signal(false);
  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  get pressed() {
    return this.#pressed();
  }
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#pressed
    });
  }
}
const togglebutton__proto = ToggleButton.prototype;
prop(togglebutton__proto, "pressed");

function ariaBool(value) {
  return value ? "true" : "false";
}
function $ariaBool(signal) {
  return () => ariaBool(signal());
}

class AirPlayButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { canAirPlay, isAirPlayConnected } = this.#media.$state;
    this.setAttributes({
      "data-active": isAirPlayConnected,
      "data-supported": canAirPlay,
      "data-state": this.#getState.bind(this),
      "aria-hidden": $ariaBool(() => !canAirPlay())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "airplay");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  #onPress(event) {
    const remote = this.#media.remote;
    remote.requestAirPlay(event);
  }
  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState() !== "disconnected";
  }
  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState();
  }
  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `AirPlay ${remotePlaybackState()}`;
  }
}

class GoogleCastButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { canGoogleCast, isGoogleCastConnected } = this.#media.$state;
    this.setAttributes({
      "data-active": isGoogleCastConnected,
      "data-supported": canGoogleCast,
      "data-state": this.#getState.bind(this),
      "aria-hidden": $ariaBool(() => !canGoogleCast())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "google-cast");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  #onPress(event) {
    const remote = this.#media.remote;
    remote.requestGoogleCast(event);
  }
  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState() !== "disconnected";
  }
  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState();
  }
  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `Google Cast ${remotePlaybackState()}`;
  }
}

class PlayButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "togglePaused",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { paused, ended } = this.#media.$state;
    this.setAttributes({
      "data-paused": paused,
      "data-ended": ended
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "play");
    setARIALabel(el, "Play");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.pause(event) : remote.play(event);
  }
  #isPressed() {
    const { paused } = this.#media.$state;
    return !paused();
  }
}

class CaptionButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleCaptions",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "data-active": this.#isPressed.bind(this),
      "data-supported": () => !this.#isHidden(),
      "aria-hidden": $ariaBool(this.#isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "caption");
    setARIALabel(el, "Captions");
  }
  #onPress(event) {
    this.#media.remote.toggleCaptions(event);
  }
  #isPressed() {
    const { textTrack } = this.#media.$state, track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }
  #isHidden() {
    const { hasCaptions } = this.#media.$state;
    return !hasCaptions();
  }
}

class FullscreenButton extends Component {
  static props = {
    ...ToggleButtonController.props,
    target: "prefer-media"
  };
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleFullscreen",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { fullscreen } = this.#media.$state, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      "data-active": fullscreen,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "fullscreen");
    setARIALabel(el, "Fullscreen");
  }
  #onPress(event) {
    const remote = this.#media.remote, target = this.$props.target();
    this.#isPressed() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }
  #isPressed() {
    const { fullscreen } = this.#media.$state;
    return fullscreen();
  }
  #isSupported() {
    const { canFullscreen } = this.#media.$state;
    return canFullscreen();
  }
}

class MuteButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleMuted",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "data-muted": this.#isPressed.bind(this),
      "data-state": this.#getState.bind(this)
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-mute-button", "");
    el.setAttribute("data-media-tooltip", "mute");
    setARIALabel(el, "Mute");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.unmute(event) : remote.mute(event);
  }
  #isPressed() {
    const { muted, volume } = this.#media.$state;
    return muted() || volume() === 0;
  }
  #getState() {
    const { muted, volume } = this.#media.$state, $volume = volume();
    if (muted() || $volume === 0) return "muted";
    else if ($volume >= 0.5) return "high";
    else if ($volume < 0.5) return "low";
  }
}

class PIPButton extends Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "togglePictureInPicture",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { pictureInPicture } = this.#media.$state, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      "data-active": pictureInPicture,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "pip");
    setARIALabel(el, "PiP");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }
  #isPressed() {
    const { pictureInPicture } = this.#media.$state;
    return pictureInPicture();
  }
  #isSupported() {
    const { canPictureInPicture } = this.#media.$state;
    return canPictureInPicture();
  }
}

class SeekButton extends Component {
  static props = {
    disabled: false,
    seconds: 30
  };
  #media;
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#media = useMediaContext();
    const { seeking } = this.#media.$state, { seconds } = this.$props, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      seconds,
      "data-seeking": seeking,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "seek");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  onConnect(el) {
    onPress(el, this.#onPress.bind(this));
  }
  #isSupported() {
    const { canSeek } = this.#media.$state;
    return canSeek();
  }
  #getDefaultLabel() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
  }
  #onPress(event) {
    const { seconds, disabled } = this.$props;
    if (disabled()) return;
    const { currentTime } = this.#media.$state, seekTo = currentTime() + seconds();
    this.#media.remote.seek(seekTo, event);
  }
}

class LiveButton extends Component {
  static props = {
    disabled: false
  };
  #media;
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#media = useMediaContext();
    const { disabled } = this.$props, { live, liveEdge } = this.#media.$state, isHidden = () => !live();
    this.setAttributes({
      "data-edge": liveEdge,
      "data-hidden": isHidden,
      "aria-disabled": $ariaBool(() => disabled() || liveEdge()),
      "aria-hidden": $ariaBool(isHidden)
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "live");
  }
  onConnect(el) {
    onPress(el, this.#onPress.bind(this));
  }
  #onPress(event) {
    const { disabled } = this.$props, { liveEdge } = this.#media.$state;
    if (disabled() || liveEdge()) return;
    this.#media.remote.seekToLiveEdge(event);
  }
}

const sliderState = new State({
  min: 0,
  max: 100,
  value: 0,
  step: 1,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  hidden: false,
  get active() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}

class IntersectionObserverController extends ViewController {
  #init;
  #observer;
  constructor(init) {
    super();
    this.#init = init;
  }
  onConnect(el) {
    this.#observer = new IntersectionObserver((entries) => {
      this.#init.callback?.(entries, this.#observer);
    }, this.#init);
    this.#observer.observe(el);
    onDispose(this.#onDisconnect.bind(this));
  }
  /**
   * Disconnect any active intersection observers.
   */
  #onDisconnect() {
    this.#observer?.disconnect();
    this.#observer = void 0;
  }
}

const sliderContext = createContext();
const sliderObserverContext = createContext();

function getClampedValue(min, max, value, step) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}
function getValueFromRate(min, max, rate, step) {
  const boundRate = clampNumber(0, rate, 1), range = max - min, fill = range * boundRate, stepRatio = fill / step, steps = step * Math.round(stepRatio);
  return min + steps;
}

const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1
};
class SliderEventsController extends ViewController {
  #delegate;
  #media;
  #observer;
  constructor(delegate, media) {
    super();
    this.#delegate = delegate;
    this.#media = media;
  }
  onSetup() {
    if (hasProvidedContext(sliderObserverContext)) {
      this.#observer = useContext(sliderObserverContext);
    }
  }
  onConnect(el) {
    effect(this.#attachEventListeners.bind(this, el));
    effect(this.#attachPointerListeners.bind(this, el));
    if (this.#delegate.swipeGesture) effect(this.#watchSwipeGesture.bind(this));
  }
  #watchSwipeGesture() {
    const { pointer } = this.#media.$state;
    if (pointer() !== "coarse" || !this.#delegate.swipeGesture()) {
      this.#provider = null;
      return;
    }
    this.#provider = this.#media.player.el?.querySelector(
      "media-provider,[data-media-provider]"
    );
    if (!this.#provider) return;
    new EventsController(this.#provider).add("touchstart", this.#onTouchStart.bind(this), {
      passive: true
    }).add("touchmove", this.#onTouchMove.bind(this), { passive: false });
  }
  #provider = null;
  #touch = null;
  #touchStartValue = null;
  #onTouchStart(event) {
    this.#touch = event.touches[0];
  }
  #onTouchMove(event) {
    if (isNull(this.#touch) || isTouchPinchEvent(event)) return;
    const touch = event.touches[0], xDiff = touch.clientX - this.#touch.clientX, yDiff = touch.clientY - this.#touch.clientY, isDragging = this.$state.dragging();
    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }
    if (isDragging) return;
    event.preventDefault();
    if (Math.abs(xDiff) > 20) {
      this.#touch = touch;
      this.#touchStartValue = this.$state.value();
      this.#onStartDragging(this.#touchStartValue, event);
    }
  }
  #attachEventListeners(el) {
    const { hidden } = this.$props;
    listenEvent(el, "focus", this.#onFocus.bind(this));
    if (hidden() || this.#delegate.isDisabled()) return;
    new EventsController(el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("pointerenter", this.#onPointerEnter.bind(this)).add("pointermove", this.#onPointerMove.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this)).add("pointerdown", this.#onPointerDown.bind(this));
  }
  #attachPointerListeners(el) {
    if (this.#delegate.isDisabled() || !this.$state.dragging()) return;
    new EventsController(document).add("pointerup", this.#onDocumentPointerUp.bind(this), { capture: true }).add("pointermove", this.#onDocumentPointerMove.bind(this)).add("touchmove", this.#onDocumentTouchMove.bind(this), {
      passive: false
    });
  }
  #onFocus() {
    this.#updatePointerValue(this.$state.value());
  }
  #updateValue(newValue, trigger) {
    const { value, min, max, dragging } = this.$state;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);
    const event = this.createEvent("value-change", { detail: clampedValue, trigger });
    this.dispatch(event);
    this.#delegate.onValueChange?.(event);
    if (dragging()) {
      const event2 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
      this.dispatch(event2);
      this.#delegate.onDragValueChange?.(event2);
    }
  }
  #updatePointerValue(value, trigger) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch("pointer-value-change", { detail: value, trigger });
    if (dragging()) {
      this.#updateValue(value, trigger);
    }
  }
  #getPointerValue(event) {
    let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min, max } = this.$state;
    if (this.$props.orientation() === "vertical") {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this.#touch && isNumber(this.#touchStartValue)) {
        const { width } = this.#provider.getBoundingClientRect(), rate = (event.clientX - this.#touch.clientX) / width, range = max() - min(), diff = range * Math.abs(rate);
        thumbPositionRate = (rate < 0 ? this.#touchStartValue - diff : this.#touchStartValue + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }
    return Math.max(
      min(),
      Math.min(
        max(),
        this.#delegate.roundValue(
          getValueFromRate(min(), max(), thumbPositionRate, this.#delegate.getStep())
        )
      )
    );
  }
  #onPointerEnter(event) {
    this.$state.pointing.set(true);
  }
  #onPointerMove(event) {
    const { dragging } = this.$state;
    if (dragging()) return;
    this.#updatePointerValue(this.#getPointerValue(event), event);
  }
  #onPointerLeave(event) {
    this.$state.pointing.set(false);
  }
  #onPointerDown(event) {
    if (event.button !== 0) return;
    const value = this.#getPointerValue(event);
    this.#onStartDragging(value, event);
    this.#updatePointerValue(value, event);
  }
  #onStartDragging(value, trigger) {
    const { dragging } = this.$state;
    if (dragging()) return;
    dragging.set(true);
    this.#media.remote.pauseControls(trigger);
    const event = this.createEvent("drag-start", { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragStart?.(event);
    this.#observer?.onDragStart?.();
  }
  #onStopDragging(value, trigger) {
    const { dragging } = this.$state;
    if (!dragging()) return;
    dragging.set(false);
    this.#media.remote.resumeControls(trigger);
    const event = this.createEvent("drag-end", { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragEnd?.(event);
    this.#touch = null;
    this.#touchStartValue = null;
    this.#observer?.onDragEnd?.();
  }
  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------
  #lastDownKey;
  #repeatedKeys = false;
  #onKeyDown(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey) return;
    const { key } = event, jumpValue = this.#calcJumpValue(event);
    if (!isNull(jumpValue)) {
      this.#updatePointerValue(jumpValue, event);
      this.#updateValue(jumpValue, event);
      return;
    }
    const newValue = this.#calcNewKeyValue(event);
    if (!this.#repeatedKeys) {
      this.#repeatedKeys = key === this.#lastDownKey;
      if (!this.$state.dragging() && this.#repeatedKeys) {
        this.#onStartDragging(newValue, event);
      }
    }
    this.#updatePointerValue(newValue, event);
    this.#lastDownKey = key;
  }
  #onKeyUp(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey || !isNull(this.#calcJumpValue(event))) return;
    const newValue = this.#repeatedKeys ? this.$state.pointerValue() : this.#calcNewKeyValue(event);
    this.#updateValue(newValue, event);
    this.#onStopDragging(newValue, event);
    this.#lastDownKey = "";
    this.#repeatedKeys = false;
  }
  #calcJumpValue(event) {
    let key = event.key, { min, max } = this.$state;
    if (key === "Home" || key === "PageUp") {
      return min();
    } else if (key === "End" || key === "PageDown") {
      return max();
    } else if (!event.metaKey && /^[0-9]$/.test(key)) {
      return (max() - min()) / 10 * Number(key);
    }
    return null;
  }
  #calcNewKeyValue(event) {
    const { key, shiftKey } = event;
    event.preventDefault();
    event.stopPropagation();
    const { shiftKeyMultiplier } = this.$props;
    const { min, max, value, pointerValue } = this.$state, step = this.#delegate.getStep(), keyStep = this.#delegate.getKeyStep();
    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, currentValue = this.#repeatedKeys ? pointerValue() : this.#delegate.getValue?.() ?? value(), steps = (currentValue + diff) / step;
    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }
  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------
  #onDocumentPointerUp(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const value = this.#getPointerValue(event);
    this.#updatePointerValue(value, event);
    this.#onStopDragging(value, event);
  }
  #onDocumentTouchMove(event) {
    event.preventDefault();
  }
  #onDocumentPointerMove = functionThrottle(
    (event) => {
      this.#updatePointerValue(this.#getPointerValue(event), event);
    },
    20,
    { leading: true }
  );
}

const sliderValueFormatContext = createContext(() => ({}));

class SliderController extends ViewController {
  static props = {
    hidden: false,
    disabled: false,
    step: 1,
    keyStep: 1,
    orientation: "horizontal",
    shiftKeyMultiplier: 5
  };
  #media;
  #delegate;
  #isVisible = signal(true);
  #isIntersecting = signal(true);
  constructor(delegate) {
    super();
    this.#delegate = delegate;
  }
  onSetup() {
    this.#media = useMediaContext();
    const focus = new FocusVisibleController();
    focus.attach(this);
    this.$state.focused = focus.focused.bind(focus);
    if (!hasProvidedContext(sliderValueFormatContext)) {
      provideContext(sliderValueFormatContext, {
        default: "value"
      });
    }
    provideContext(sliderContext, {
      orientation: this.$props.orientation,
      disabled: this.#delegate.isDisabled,
      preview: signal(null)
    });
    effect(this.#watchValue.bind(this));
    effect(this.#watchStep.bind(this));
    effect(this.#watchDisabled.bind(this));
    this.#setupAttrs();
    new SliderEventsController(this.#delegate, this.#media).attach(this);
    new IntersectionObserverController({
      callback: this.#onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "role", "slider");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "autocomplete", "off");
    this.#watchCSSVars();
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this.#isVisible.set));
    effect(this.#watchHidden.bind(this));
  }
  #onIntersectionChange(entries) {
    this.#isIntersecting.set(entries[0].isIntersecting);
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  #watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting.bind(this));
  }
  #watchValue() {
    const { dragging, value, min, max } = this.$state;
    if (peek(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this.#delegate.getStep()));
  }
  #watchStep() {
    this.$state.step.set(this.#delegate.getStep());
  }
  #watchDisabled() {
    if (!this.#delegate.isDisabled()) return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  #getARIADisabled() {
    return ariaBool$1(this.#delegate.isDisabled());
  }
  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------
  #setupAttrs() {
    const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
    this.setAttributes({
      "data-dragging": dragging,
      "data-pointing": pointing,
      "data-active": active,
      "aria-disabled": this.#getARIADisabled.bind(this),
      "aria-valuemin": this.#delegate.aria.valueMin ?? this.$state.min,
      "aria-valuemax": this.#delegate.aria.valueMax ?? this.$state.max,
      "aria-valuenow": this.#delegate.aria.valueNow,
      "aria-valuetext": this.#delegate.aria.valueText,
      "aria-orientation": orientation
    });
  }
  #watchCSSVars() {
    const { fillPercent, pointerPercent } = this.$state;
    this.#updateSliderVars(round(fillPercent(), 3), round(pointerPercent(), 3));
  }
  #updateSliderVars = animationFrameThrottle();
}

class Slider extends Component {
  static props = {
    ...SliderController.props,
    min: 0,
    max: 100,
    value: 0
  };
  static state = sliderState;
  constructor() {
    super();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.$props.disabled,
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      }
    });
  }
  onSetup() {
    effect(this.#watchValue.bind(this));
    effect(this.#watchMinMax.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  #watchValue() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

const cache = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map();
class ThumbnailsLoader {
  #media;
  #src;
  #crossOrigin;
  $images = signal([]);
  static create(src, crossOrigin) {
    const media = useMediaContext();
    return new ThumbnailsLoader(src, crossOrigin, media);
  }
  constructor(src, crossOrigin, media) {
    this.#src = src;
    this.#crossOrigin = crossOrigin;
    this.#media = media;
    effect(this.#onLoadCues.bind(this));
  }
  #onLoadCues() {
    const { canLoad } = this.#media.$state;
    if (!canLoad()) return;
    const src = this.#src();
    if (!src) return;
    if (isString(src) && cache.has(src)) {
      const cues = cache.get(src);
      cache.delete(src);
      cache.set(src, cues);
      if (cache.size > 99) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      this.$images.set(cache.get(src));
    } else if (isString(src)) {
      const crossOrigin = this.#crossOrigin(), currentKey = src + "::" + crossOrigin;
      if (!pending.has(currentKey)) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(src, {
              credentials: getRequestCredentials(crossOrigin)
            }), isJSON = response.headers.get("content-type") === "application/json";
            if (isJSON) {
              const json = await response.json();
              if (isArray(json)) {
                if (json[0] && "text" in json[0]) {
                  resolve(this.#processVTTCues(json));
                } else {
                  for (let i = 0; i < json.length; i++) {
                    const image = json[i];
                    assert(isObject(image), false);
                    assert(
                      "url" in image && isString(image.url),
                      false
                    );
                    assert(
                      "startTime" in image && isNumber(image.startTime),
                      false
                    );
                  }
                  resolve(json);
                }
              } else {
                resolve(this.#processStoryboard(json));
              }
              return;
            }
            import('media-captions').then(async ({ parseResponse }) => {
              try {
                const { cues } = await parseResponse(response);
                resolve(this.#processVTTCues(cues));
              } catch (e) {
                reject(e);
              }
            });
          } catch (e) {
            reject(e);
          }
        }).then((images) => {
          cache.set(currentKey, images);
          return images;
        }).catch((error) => {
          this.#onError(src, error);
        }).finally(() => {
          if (isString(currentKey)) pending.delete(currentKey);
        });
        pending.set(currentKey, promise);
      }
      pending.get(currentKey)?.then((images) => {
        this.$images.set(images || []);
      });
    } else if (isArray(src)) {
      try {
        this.$images.set(this.#processImages(src));
      } catch (error) {
        this.#onError(src, error);
      }
    } else {
      try {
        this.$images.set(this.#processStoryboard(src));
      } catch (error) {
        this.#onError(src, error);
      }
    }
    return () => {
      this.$images.set([]);
    };
  }
  #processImages(images) {
    const baseURL = this.#resolveBaseUrl();
    return images.map((img, i) => {
      assert(
        img.url && isString(img.url));
      assert(
        "startTime" in img && isNumber(img.startTime));
      return {
        ...img,
        url: isString(img.url) ? this.#resolveURL(img.url, baseURL) : img.url
      };
    });
  }
  #processStoryboard(board) {
    assert(isString(board.url));
    assert(isArray(board.tiles) && board.tiles?.length);
    const url = new URL(board.url), images = [];
    const tileWidth = "tile_width" in board ? board.tile_width : board.tileWidth, tileHeight = "tile_height" in board ? board.tile_height : board.tileHeight;
    for (const tile of board.tiles) {
      images.push({
        url,
        startTime: "start" in tile ? tile.start : tile.startTime,
        width: tileWidth,
        height: tileHeight,
        coords: { x: tile.x, y: tile.y }
      });
    }
    return images;
  }
  #processVTTCues(cues) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      assert(
        "startTime" in cue && isNumber(cue.startTime));
      assert(
        "text" in cue && isString(cue.text));
    }
    const images = [], baseURL = this.#resolveBaseUrl();
    for (const cue of cues) {
      const [url, hash] = cue.text.split("#"), data = this.#resolveData(hash);
      images.push({
        url: this.#resolveURL(url, baseURL),
        startTime: cue.startTime,
        endTime: cue.endTime,
        width: data?.w,
        height: data?.h,
        coords: data && isNumber(data.x) && isNumber(data.y) ? { x: data.x, y: data.y } : void 0
      });
    }
    return images;
  }
  #resolveBaseUrl() {
    let baseURL = peek(this.#src);
    if (!isString(baseURL) || !/^https?:/.test(baseURL)) {
      return location.href;
    }
    return baseURL;
  }
  #resolveURL(src, baseURL) {
    return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
  }
  #resolveData(hash) {
    if (!hash) return {};
    const [hashProps, values] = hash.split("="), hashValues = values?.split(","), data = {};
    if (!hashProps || !hashValues) {
      return null;
    }
    for (let i = 0; i < hashProps.length; i++) {
      const value = +hashValues[i];
      if (!isNaN(value)) data[hashProps[i]] = value;
    }
    return data;
  }
  #onError(src, error) {
    return;
  }
}

class Thumbnail extends Component {
  static props = {
    src: null,
    time: 0,
    crossOrigin: null
  };
  static state = new State({
    src: "",
    img: null,
    thumbnails: [],
    activeThumbnail: null,
    crossOrigin: null,
    loading: false,
    error: null,
    hidden: false
  });
  media;
  #loader;
  #styleResets = [];
  onSetup() {
    this.media = useMediaContext();
    this.#loader = ThumbnailsLoader.create(this.$props.src, this.$state.crossOrigin);
    this.#watchCrossOrigin();
    this.setAttributes({
      "data-loading": this.#isLoading.bind(this),
      "data-error": this.#hasError.bind(this),
      "data-hidden": this.$state.hidden,
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onConnect(el) {
    effect(this.#watchImg.bind(this));
    effect(this.#watchHidden.bind(this));
    effect(this.#watchCrossOrigin.bind(this));
    effect(this.#onLoadStart.bind(this));
    effect(this.#onFindActiveThumbnail.bind(this));
    effect(this.#resize.bind(this));
  }
  #watchImg() {
    const img = this.$state.img();
    if (!img) return;
    new EventsController(img).add("load", this.#onLoaded.bind(this)).add("error", this.#onError.bind(this));
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  #onLoadStart() {
    const { src, loading, error } = this.$state;
    if (src()) {
      loading.set(true);
      error.set(null);
    }
    return () => {
      this.#resetStyles();
      loading.set(false);
      error.set(null);
    };
  }
  #onLoaded() {
    const { loading, error } = this.$state;
    this.#resize();
    loading.set(false);
    error.set(null);
  }
  #onError(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
  #isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  #hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }
  #watchHidden() {
    const { hidden } = this.$state, { duration } = this.media.$state, images = this.#loader.$images();
    hidden.set(this.#hasError() || !Number.isFinite(duration()) || images.length === 0);
  }
  getTime() {
    return this.$props.time();
  }
  #onFindActiveThumbnail() {
    let images = this.#loader.$images();
    if (!images.length) return;
    let time = this.getTime(), { src, activeThumbnail } = this.$state, activeIndex = -1, activeImage = null;
    for (let i = images.length - 1; i >= 0; i--) {
      const image = images[i];
      if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
        activeIndex = i;
        break;
      }
    }
    if (images[activeIndex]) {
      activeImage = images[activeIndex];
    }
    activeThumbnail.set(activeImage);
    src.set(activeImage?.url.href || "");
  }
  #resize() {
    if (!this.scope || this.$state.hidden()) return;
    const rootEl = this.el, imgEl = this.$state.img(), thumbnail = this.$state.activeThumbnail();
    if (!imgEl || !thumbnail || !rootEl) return;
    let width = thumbnail.width ?? imgEl.naturalWidth, height = thumbnail?.height ?? imgEl.naturalHeight, {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      width: elWidth,
      height: elHeight
    } = getComputedStyle(this.el);
    if (minWidth === "100%") minWidth = parseFloat(elWidth) + "";
    if (minHeight === "100%") minHeight = parseFloat(elHeight) + "";
    let minRatio = Math.max(parseInt(minWidth) / width, parseInt(minHeight) / height), maxRatio = Math.min(
      Math.max(parseInt(minWidth), parseInt(maxWidth)) / width,
      Math.max(parseInt(minHeight), parseInt(maxHeight)) / height
    ), scale = !isNaN(maxRatio) && maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
    this.#style(rootEl, "--thumbnail-width", `${width * scale}px`);
    this.#style(rootEl, "--thumbnail-height", `${height * scale}px`);
    this.#style(rootEl, "--thumbnail-aspect-ratio", String(round(width / height, 5)));
    this.#style(imgEl, "width", `${imgEl.naturalWidth * scale}px`);
    this.#style(imgEl, "height", `${imgEl.naturalHeight * scale}px`);
    this.#style(
      imgEl,
      "transform",
      thumbnail.coords ? `translate(-${thumbnail.coords.x * scale}px, -${thumbnail.coords.y * scale}px)` : ""
    );
    this.#style(imgEl, "max-width", "none");
  }
  #style(el, name, value) {
    el.style.setProperty(name, value);
    this.#styleResets.push(() => el.style.removeProperty(name));
  }
  #resetStyles() {
    for (const reset of this.#styleResets) reset();
    this.#styleResets = [];
  }
}

class SliderThumbnail extends Thumbnail {
  #slider;
  onAttach(el) {
    this.#slider = useState(Slider.state);
  }
  getTime() {
    const { duration, clipStartTime } = this.media.$state;
    return clipStartTime() + this.#slider.pointerRate() * duration();
  }
}

class SliderVideo extends Component {
  static props = {
    src: null,
    crossOrigin: null
  };
  static state = new State({
    video: null,
    src: null,
    crossOrigin: null,
    canPlay: false,
    error: null,
    hidden: false
  });
  #media;
  #slider;
  get video() {
    return this.$state.video();
  }
  onSetup() {
    this.#media = useMediaContext();
    this.#slider = useState(Slider.state);
    this.#watchCrossOrigin();
    this.setAttributes({
      "data-loading": this.#isLoading.bind(this),
      "data-hidden": this.$state.hidden,
      "data-error": this.#hasError.bind(this),
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onAttach(el) {
    effect(this.#watchVideo.bind(this));
    effect(this.#watchSrc.bind(this));
    effect(this.#watchCrossOrigin.bind(this));
    effect(this.#watchHidden.bind(this));
    effect(this.#onSrcChange.bind(this));
    effect(this.#onUpdateTime.bind(this));
  }
  #watchVideo() {
    const video = this.$state.video();
    if (!video) return;
    if (video.readyState >= 2) this.#onCanPlay();
    new EventsController(video).add("canplay", this.#onCanPlay.bind(this)).add("error", this.#onError.bind(this));
  }
  #watchSrc() {
    const { src } = this.$state, { canLoad } = this.#media.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  #isLoading() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }
  #hasError() {
    const { error } = this.$state;
    return !isNull(error);
  }
  #watchHidden() {
    const { src, hidden } = this.$state, { canLoad, duration } = this.#media.$state;
    hidden.set(canLoad() && (!src() || this.#hasError() || !Number.isFinite(duration())));
  }
  #onSrcChange() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }
  #onCanPlay(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch("can-play", { trigger: event });
  }
  #onError(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch("error", { trigger: event });
  }
  #onUpdateTime() {
    const { video, canPlay } = this.$state, { duration } = this.#media.$state, { pointerRate } = this.#slider, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
    if (canUpdate) {
      media.currentTime = pointerRate() * duration();
    }
  }
}
const slidervideo__proto = SliderVideo.prototype;
prop(slidervideo__proto, "video");

class SliderValue extends Component {
  static props = {
    type: "pointer",
    format: null,
    showHours: false,
    showMs: false,
    padHours: null,
    padMinutes: null,
    decimalPlaces: 2
  };
  #format;
  #text;
  #slider;
  onSetup() {
    this.#slider = useState(Slider.state);
    this.#format = useContext(sliderValueFormatContext);
    this.#text = computed(this.getValueText.bind(this));
  }
  /**
   * Returns the current value formatted as text based on prop settings.
   */
  getValueText() {
    const {
      type,
      format: $format,
      decimalPlaces,
      padHours,
      padMinutes,
      showHours,
      showMs
    } = this.$props, { value: sliderValue, pointerValue, min, max } = this.#slider, format = $format?.() ?? this.#format.default;
    const value = type() === "current" ? sliderValue() : pointerValue();
    if (format === "percent") {
      const range = max() - min();
      const percent = value / range * 100;
      return (this.#format.percent ?? round)(percent, decimalPlaces()) + "%";
    } else if (format === "time") {
      return (this.#format.time ?? formatTime)(value, {
        padHrs: padHours(),
        padMins: padMinutes(),
        showHrs: showHours(),
        showMs: showMs()
      });
    } else {
      return (this.#format.value?.(value) ?? value.toFixed(2)) + "";
    }
  }
}
const slidervalue__proto = SliderValue.prototype;
method(slidervalue__proto, "getValueText");

class SliderPreview extends Component {
  static props = {
    offset: 0,
    noClamp: false
  };
  #slider;
  onSetup() {
    this.#slider = useContext(sliderContext);
    const { active } = useState(Slider.state);
    this.setAttributes({
      "data-visible": active
    });
  }
  onAttach(el) {
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    const { preview } = this.#slider;
    preview.set(el);
    onDispose(() => preview.set(null));
    effect(this.#updatePlacement.bind(this));
    const resize = new ResizeObserver(this.#updatePlacement.bind(this));
    resize.observe(el);
    onDispose(() => resize.disconnect());
  }
  #updatePlacement = animationFrameThrottle();
}
function updateSliderPreviewPlacement(el, {
  clamp,
  offset,
  orientation
}) {
  const computedStyle = getComputedStyle(el), width = parseFloat(computedStyle.width), height = parseFloat(computedStyle.height), styles = {
    top: null,
    right: null,
    bottom: null,
    left: null
  };
  styles[orientation === "horizontal" ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${offset}px))`;
  if (orientation === "horizontal") {
    const widthHalf = width / 2;
    if (!clamp) {
      styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
    } else {
      const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`, rightClamp = `calc(100% - ${width}px)`;
      styles.left = `min(${leftClamp}, ${rightClamp})`;
    }
  } else {
    const heightHalf = height / 2;
    if (!clamp) {
      styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
    } else {
      const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`, bottomClamp = `calc(100% - ${height}px)`;
      styles.bottom = `min(${topClamp}, ${bottomClamp})`;
    }
  }
  Object.assign(el.style, styles);
}

class VolumeSlider extends Component {
  static props = {
    ...SliderController.props,
    keyStep: 5,
    shiftKeyMultiplier: 2
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    const { audioGain } = this.#media.$state;
    provideContext(sliderValueFormatContext, {
      default: "percent",
      value(value) {
        return (value * (audioGain() ?? 1)).toFixed(2);
      },
      percent(value) {
        return Math.round(value * (audioGain() ?? 1));
      }
    });
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueMax: this.#getARIAValueMax.bind(this),
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    effect(this.#watchVolume.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-volume-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Volume");
    const { canSetVolume } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetVolume,
      "aria-hidden": $ariaBool(() => !canSetVolume())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state, { audioGain } = this.#media.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }
  #getARIAValueText() {
    const { value, max } = this.$state, { audioGain } = this.#media.$state;
    return round(value() / max() * (audioGain() ?? 1) * 100, 2) + "%";
  }
  #getARIAValueMax() {
    const { audioGain } = this.#media.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetVolume } = this.#media.$state;
    return disabled() || !canSetVolume();
  }
  #watchVolume() {
    const { muted, volume } = this.#media.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  #throttleVolumeChange = functionThrottle(this.#onVolumeChange.bind(this), 25);
  #onVolumeChange(event) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this.#media.remote.changeVolume(mediaVolume, event);
  }
  #onValueChange(event) {
    this.#throttleVolumeChange(event);
  }
  #onDragValueChange(event) {
    this.#throttleVolumeChange(event);
  }
}

class AudioGainSlider extends Component {
  static props = {
    ...SliderController.props,
    step: 25,
    keyStep: 25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 300
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "percent",
      percent: (_, decimalPlaces) => {
        return round(this.$state.value(), decimalPlaces) + "%";
      }
    });
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    effect(this.#watchMinMax.bind(this));
    effect(this.#watchAudioGain.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-audio-gain-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Audio Boost");
    const { canSetAudioGain } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetAudioGain,
      "aria-hidden": $ariaBool(() => !canSetAudioGain())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const { value } = this.$state;
    return value() + "%";
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  #watchAudioGain() {
    const { audioGain } = this.#media.$state, value = ((audioGain() ?? 1) - 1) * 100;
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetAudioGain } = this.#media.$state;
    return disabled() || !canSetAudioGain();
  }
  #onAudioGainChange(event) {
    if (!event.trigger) return;
    const gain = round(1 + event.detail / 100, 2);
    this.#media.remote.changeAudioGain(gain, event);
  }
  #onValueChange(event) {
    this.#onAudioGainChange(event);
  }
  #onDragValueChange(event) {
    this.#onAudioGainChange(event);
  }
}

class SpeedSlider extends Component {
  static props = {
    ...SliderController.props,
    step: 0.25,
    keyStep: 0.25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 2
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    effect(this.#watchMinMax.bind(this));
    effect(this.#watchPlaybackRate.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-speed-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Speed");
    const { canSetPlaybackRate } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetPlaybackRate,
      "aria-hidden": $ariaBool(() => !canSetPlaybackRate())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  #getARIAValueText() {
    const { value } = this.$state;
    return value() + "x";
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  #watchPlaybackRate() {
    const { playbackRate } = this.#media.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  #roundValue(value) {
    return round(value, 2);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetPlaybackRate } = this.#media.$state;
    return disabled() || !canSetPlaybackRate();
  }
  #throttledSpeedChange = functionThrottle(this.#onPlaybackRateChange.bind(this), 25);
  #onPlaybackRateChange(event) {
    if (!event.trigger) return;
    const rate = event.detail;
    this.#media.remote.changePlaybackRate(rate, event);
  }
  #onValueChange(event) {
    this.#throttledSpeedChange(event);
  }
  #onDragValueChange(event) {
    this.#throttledSpeedChange(event);
  }
}

class QualitySlider extends Component {
  static props = {
    ...SliderController.props,
    step: 1,
    keyStep: 1,
    shiftKeyMultiplier: 1
  };
  static state = sliderState;
  #media;
  #sortedQualities = computed(() => {
    const { qualities } = this.#media.$state;
    return sortVideoQualities(qualities());
  });
  onSetup() {
    this.#media = useMediaContext();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    effect(this.#watchMax.bind(this));
    effect(this.#watchQuality.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-quality-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Video Quality");
    const { qualities, canSetQuality } = this.#media.$state, $supported = computed(() => canSetQuality() && qualities().length > 0);
    this.setAttributes({
      "data-supported": $supported,
      "aria-hidden": $ariaBool(() => !$supported())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  #getARIAValueText() {
    const { quality } = this.#media.$state;
    if (!quality()) return "";
    const { height, bitrate } = quality(), bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null;
    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : "Auto";
  }
  #watchMax() {
    const $qualities = this.#sortedQualities();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }
  #watchQuality() {
    let { quality } = this.#media.$state, $qualities = this.#sortedQualities(), value = Math.max(0, $qualities.indexOf(quality()));
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetQuality, qualities } = this.#media.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }
  #throttledQualityChange = functionThrottle(this.#onQualityChange.bind(this), 25);
  #onQualityChange(event) {
    if (!event.trigger) return;
    const { qualities } = this.#media, quality = peek(this.#sortedQualities)[event.detail];
    this.#media.remote.changeQuality(qualities.indexOf(quality), event);
  }
  #onValueChange(event) {
    this.#throttledQualityChange(event);
  }
  #onDragValueChange(event) {
    this.#throttledQualityChange(event);
  }
}

class TimeSlider extends Component {
  static props = {
    ...SliderController.props,
    step: 0.1,
    keyStep: 5,
    shiftKeyMultiplier: 2,
    pauseWhileDragging: false,
    noSwipeGesture: false,
    seekingRequestThrottle: 100
  };
  static state = sliderState;
  #media;
  #dispatchSeeking;
  #chapter = signal(null);
  constructor() {
    super();
    const { noSwipeGesture } = this.$props;
    new SliderController({
      swipeGesture: () => !noSwipeGesture(),
      getValue: this.#getValue.bind(this),
      getStep: this.#getStep.bind(this),
      getKeyStep: this.#getKeyStep.bind(this),
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragStart: this.#onDragStart.bind(this),
      onDragValueChange: this.#onDragValueChange.bind(this),
      onDragEnd: this.#onDragEnd.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "time",
      value: this.#formatValue.bind(this),
      time: this.#formatTime.bind(this)
    });
    this.setAttributes({
      "data-chapters": this.#hasChapters.bind(this)
    });
    this.setStyles({
      "--slider-progress": this.#calcBufferedPercent.bind(this)
    });
    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchSeekingThrottle.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-time-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Seek");
  }
  onConnect(el) {
    effect(this.#watchPreviewing.bind(this));
    watchActiveTextTrack(this.#media.textTracks, "chapters", this.#chapter.set);
  }
  #calcBufferedPercent() {
    const { bufferedEnd, duration } = this.#media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
  }
  #hasChapters() {
    const { duration } = this.#media.$state;
    return this.#chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }
  #watchSeekingThrottle() {
    this.#dispatchSeeking = functionThrottle(
      this.#seeking.bind(this),
      this.$props.seekingRequestThrottle()
    );
  }
  #watchCurrentTime() {
    if (this.$state.hidden()) return;
    const { value, dragging } = this.$state, newValue = this.#getValue();
    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch("value-change", { detail: newValue });
    }
  }
  #watchPreviewing() {
    const player = this.#media.player.el, { preview } = useContext(sliderContext);
    player && preview() && setAttribute(player, "data-preview", this.$state.active());
  }
  #seeking(time, event) {
    this.#media.remote.seeking(time, event);
  }
  #seek(time, percent, event) {
    this.#dispatchSeeking.cancel();
    const { live } = this.#media.$state;
    if (live() && percent >= 99) {
      this.#media.remote.seekToLiveEdge(event);
      return;
    }
    this.#media.remote.seek(time, event);
  }
  #playingBeforeDragStart = false;
  #onDragStart(event) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this.#media.$state;
      this.#playingBeforeDragStart = !paused();
      this.#media.remote.pause(event);
    }
  }
  #onDragValueChange(event) {
    this.#dispatchSeeking(this.#percentToTime(event.detail), event);
  }
  #onDragEnd(event) {
    const { seeking } = this.#media.$state;
    if (!peek(seeking)) this.#seeking(this.#percentToTime(event.detail), event);
    const percent = event.detail;
    this.#seek(this.#percentToTime(percent), percent, event);
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this.#playingBeforeDragStart) {
      this.#media.remote.play(event);
      this.#playingBeforeDragStart = false;
    }
  }
  #onValueChange(event) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this.#onDragEnd(event);
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  #getValue() {
    const { currentTime } = this.#media.$state;
    return this.#timeToPercent(currentTime());
  }
  #getStep() {
    const value = this.$props.step() / this.#media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  #getKeyStep() {
    const value = this.$props.keyStep() / this.#media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  #roundValue(value) {
    return round(value, 3);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSeek } = this.#media.$state;
    return disabled() || !canSeek();
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const time = this.#percentToTime(this.$state.value()), { duration } = this.#media.$state;
    return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
  }
  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------
  #percentToTime(percent) {
    const { duration } = this.#media.$state;
    return round(percent / 100 * duration(), 5);
  }
  #timeToPercent(time) {
    const { liveEdge, duration } = this.#media.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }
  #formatValue(percent) {
    const time = this.#percentToTime(percent), { live, duration } = this.#media.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
  }
  #formatTime(percent, options) {
    const time = this.#percentToTime(percent), { live, duration } = this.#media.$state, value = live() ? time - duration() : time;
    return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), options)}` : "LIVE";
  }
}

class SliderChapters extends Component {
  static props = {
    disabled: false
  };
  #media;
  #sliderState;
  #updateScope;
  #titleRef = null;
  #refs = [];
  #$track = signal(null);
  #$cues = signal([]);
  #activeIndex = signal(-1);
  #activePointerIndex = signal(-1);
  #bufferedIndex = 0;
  get cues() {
    return this.#$cues();
  }
  get activeCue() {
    return this.#$cues()[this.#activeIndex()] || null;
  }
  get activePointerCue() {
    return this.#$cues()[this.#activePointerIndex()] || null;
  }
  onSetup() {
    this.#media = useMediaContext();
    this.#sliderState = useState(TimeSlider.state);
  }
  onAttach(el) {
    watchActiveTextTrack(this.#media.textTracks, "chapters", this.#setTrack.bind(this));
    effect(this.#watchSource.bind(this));
  }
  onConnect() {
    onDispose(() => this.#reset.bind(this));
  }
  onDestroy() {
    this.#setTrack(null);
  }
  setRefs(refs) {
    this.#refs = refs;
    this.#updateScope?.dispose();
    if (this.#refs.length === 1) {
      const el = this.#refs[0];
      el.style.width = "100%";
      el.style.setProperty("--chapter-fill", "var(--slider-fill)");
      el.style.setProperty("--chapter-progress", "var(--slider-progress)");
    } else if (this.#refs.length > 0) {
      scoped(() => this.#watch(), this.#updateScope = createScope());
    }
  }
  #setTrack(track) {
    if (peek(this.#$track) === track) return;
    this.#reset();
    this.#$track.set(track);
  }
  #reset() {
    this.#refs = [];
    this.#$cues.set([]);
    this.#activeIndex.set(-1);
    this.#activePointerIndex.set(-1);
    this.#bufferedIndex = 0;
    this.#updateScope?.dispose();
  }
  #watch() {
    if (!this.#refs.length) return;
    effect(this.#watchUpdates.bind(this));
  }
  #watchUpdates() {
    const { hidden } = this.#sliderState;
    if (hidden()) return;
    effect(this.#watchContainerWidths.bind(this));
    effect(this.#watchFillPercent.bind(this));
    effect(this.#watchPointerPercent.bind(this));
    effect(this.#watchBufferedPercent.bind(this));
  }
  #watchContainerWidths() {
    const cues = this.#$cues();
    if (!cues.length) return;
    let cue, { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd() || cues[cues.length - 1].endTime, duration = endTime - startTime, remainingWidth = 100;
    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this.#refs[i]) {
        const width = i === cues.length - 1 ? remainingWidth : round((cue.endTime - Math.max(startTime, cue.startTime)) / duration * 100, 3);
        this.#refs[i].style.width = width + "%";
        remainingWidth -= width;
      }
    }
  }
  #watchFillPercent() {
    let { liveEdge, seekableStart, seekableEnd } = this.#media.$state, { fillPercent, value } = this.#sliderState, cues = this.#$cues(), isLiveEdge = liveEdge(), prevActiveIndex = peek(this.#activeIndex), currentChapter = cues[prevActiveIndex];
    let currentActiveIndex = isLiveEdge ? this.#$cues.length - 1 : this.#findActiveChapterIndex(
      currentChapter ? currentChapter.startTime / seekableEnd() * 100 <= peek(value) ? prevActiveIndex : 0 : 0,
      fillPercent()
    );
    if (isLiveEdge || !currentChapter) {
      this.#updateFillPercents(0, cues.length, 100);
    } else if (currentActiveIndex > prevActiveIndex) {
      this.#updateFillPercents(prevActiveIndex, currentActiveIndex, 100);
    } else if (currentActiveIndex < prevActiveIndex) {
      this.#updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, 0);
    }
    const percent = isLiveEdge ? 100 : this.#calcPercent(
      cues[currentActiveIndex],
      fillPercent(),
      seekableStart(),
      this.#getEndTime(cues)
    );
    this.#updateFillPercent(this.#refs[currentActiveIndex], percent);
    this.#activeIndex.set(currentActiveIndex);
  }
  #watchPointerPercent() {
    let { pointing, pointerPercent } = this.#sliderState;
    if (!pointing()) {
      this.#activePointerIndex.set(-1);
      return;
    }
    const activeIndex = this.#findActiveChapterIndex(0, pointerPercent());
    this.#activePointerIndex.set(activeIndex);
  }
  #updateFillPercents(start, end, percent) {
    for (let i = start; i < end; i++) this.#updateFillPercent(this.#refs[i], percent);
  }
  #updateFillPercent(ref, percent) {
    if (!ref) return;
    ref.style.setProperty("--chapter-fill", percent + "%");
    setAttribute(ref, "data-active", percent > 0 && percent < 100);
    setAttribute(ref, "data-ended", percent === 100);
  }
  #findActiveChapterIndex(startIndex, percent) {
    let chapterPercent = 0, cues = this.#$cues();
    if (percent === 0) return 0;
    else if (percent === 100) return cues.length - 1;
    let { seekableStart } = this.#media.$state, startTime = seekableStart(), endTime = this.#getEndTime(cues);
    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this.#calcPercent(cues[i], percent, startTime, endTime);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }
    return 0;
  }
  #watchBufferedPercent() {
    this.#updateBufferedPercent(this.#bufferedPercent());
  }
  #updateBufferedPercent = animationFrameThrottle();
  #bufferedPercent = computed(this.#calcMediaBufferedPercent.bind(this));
  #calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this.#media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }
  #getEndTime(cues) {
    const { seekableEnd } = this.#media.$state, endTime = seekableEnd();
    return Number.isFinite(endTime) ? endTime : cues[cues.length - 1]?.endTime || 0;
  }
  #calcPercent(cue, percent, startTime, endTime) {
    if (!cue) return 0;
    const cues = this.#$cues();
    if (cues.length === 0) return 0;
    const duration = endTime - startTime, cueStartTime = Math.max(0, cue.startTime - startTime), cueEndTime = Math.min(endTime, cue.endTime) - startTime;
    const startRatio = cueStartTime / duration, startPercent = startRatio * 100, endPercent = Math.min(1, startRatio + (cueEndTime - cueStartTime) / duration) * 100;
    return Math.max(
      0,
      round(
        percent >= endPercent ? 100 : (percent - startPercent) / (endPercent - startPercent) * 100,
        3
      )
    );
  }
  #fillGaps(cues) {
    let chapters = [], { seekableStart, seekableEnd, duration } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
    cues = cues.filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime);
    const firstCue = cues[0];
    if (firstCue && firstCue.startTime > startTime) {
      chapters.push(new window.VTTCue(startTime, firstCue.startTime, ""));
    }
    for (let i = 0; i < cues.length - 1; i++) {
      const currentCue = cues[i], nextCue = cues[i + 1];
      chapters.push(currentCue);
      if (nextCue) {
        const timeDiff = nextCue.startTime - currentCue.endTime;
        if (timeDiff > 0) {
          chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ""));
        }
      }
    }
    const lastCue = cues[cues.length - 1];
    if (lastCue) {
      chapters.push(lastCue);
      const endTime2 = duration();
      if (endTime2 >= 0 && endTime2 - lastCue.endTime > 1) {
        chapters.push(new window.VTTCue(lastCue.endTime, duration(), ""));
      }
    }
    return chapters;
  }
  #watchSource() {
    const { source } = this.#media.$state;
    source();
    this.#onTrackChange();
  }
  #onTrackChange() {
    if (!this.scope) return;
    const { disabled } = this.$props;
    if (disabled()) {
      this.#$cues.set([]);
      this.#activeIndex.set(0);
      this.#bufferedIndex = 0;
      return;
    }
    const track = this.#$track();
    if (track) {
      const onCuesChange = this.#onCuesChange.bind(this);
      onCuesChange();
      new EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
      effect(this.#watchMediaDuration.bind(this));
    }
    this.#titleRef = this.#findChapterTitleRef();
    if (this.#titleRef) effect(this.#onChapterTitleChange.bind(this));
    return () => {
      if (this.#titleRef) {
        this.#titleRef.textContent = "";
        this.#titleRef = null;
      }
    };
  }
  #watchMediaDuration() {
    this.#media.$state.duration();
    this.#onCuesChange();
  }
  #onCuesChange = functionDebounce(
    () => {
      const track = peek(this.#$track);
      if (!this.scope || !track || !track.cues.length) return;
      this.#$cues.set(this.#fillGaps(track.cues));
      this.#activeIndex.set(0);
      this.#bufferedIndex = 0;
    },
    150,
    true
  );
  #onChapterTitleChange() {
    const cue = this.activePointerCue || this.activeCue;
    if (this.#titleRef) this.#titleRef.textContent = cue?.text || "";
  }
  #findParentSlider() {
    let node = this.el;
    while (node && node.getAttribute("role") !== "slider") {
      node = node.parentElement;
    }
    return node;
  }
  #findChapterTitleRef() {
    const slider = this.#findParentSlider();
    return slider ? slider.querySelector('[data-part="chapter-title"]') : null;
  }
}
const sliderchapters__proto = SliderChapters.prototype;
prop(sliderchapters__proto, "cues");
prop(sliderchapters__proto, "activeCue");
prop(sliderchapters__proto, "activePointerCue");
method(sliderchapters__proto, "setRefs");

const menuContext = createContext();

function scrollIntoView(el, options) {
  const scrolls = r(el, options);
  for (const { el: el2, top, left } of scrolls) {
    el2.scroll({ top, left, behavior: options.behavior });
  }
}
function scrollIntoCenter(el, options = {}) {
  scrollIntoView(el, {
    scrollMode: "if-needed",
    block: "center",
    inline: "center",
    ...options
  });
}

const FOCUSABLE_ELEMENTS_SELECTOR = /* @__PURE__ */ [
  "a[href]",
  "[tabindex]",
  "input",
  "select",
  "button"
].map((selector) => `${selector}:not([aria-hidden='true'])`).join(",");
const VALID_KEYS = /* @__PURE__ */ new Set([
  "Escape",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "PageUp",
  "End",
  "PageDown",
  "Enter",
  " "
]);
class MenuFocusController {
  #index = -1;
  #el = null;
  #elements = [];
  #delegate;
  get items() {
    return this.#elements;
  }
  constructor(delegate) {
    this.#delegate = delegate;
  }
  attachMenu(el) {
    listenEvent(el, "focus", this.#onFocus.bind(this));
    this.#el = el;
    onDispose(() => {
      this.#el = null;
    });
  }
  listen() {
    if (!this.#el) return;
    this.update();
    new EventsController(this.#el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this));
    onDispose(() => {
      this.#index = -1;
      this.#elements = [];
    });
  }
  update() {
    this.#index = 0;
    this.#elements = this.#getFocusableElements();
  }
  scroll(index = this.#findActiveIndex()) {
    const element = this.#elements[index];
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollIntoCenter(element, {
            behavior: "smooth",
            boundary: (el) => {
              return !el.hasAttribute("data-root");
            }
          });
        });
      });
    }
  }
  focusActive(scroll = true) {
    const index = this.#findActiveIndex();
    this.#focusAt(index >= 0 ? index : 0, scroll);
  }
  #focusAt(index, scroll = true) {
    this.#index = index;
    if (this.#elements[index]) {
      this.#elements[index].focus({ preventScroll: true });
      if (scroll) this.scroll(index);
    } else {
      this.#el?.focus({ preventScroll: true });
    }
  }
  #findActiveIndex() {
    return this.#elements.findIndex(
      (el) => document.activeElement === el || el.getAttribute("role") === "menuitemradio" && el.getAttribute("aria-checked") === "true"
    );
  }
  #onFocus() {
    if (this.#index >= 0) return;
    this.update();
    this.focusActive();
  }
  #validateKeyEvent(event) {
    const el = event.target;
    if (wasEnterKeyPressed(event) && el instanceof Element) {
      const role = el.getAttribute("role");
      return !/a|input|select|button/.test(el.localName) && !role;
    }
    return VALID_KEYS.has(event.key);
  }
  #onKeyUp(event) {
    if (!this.#validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
  }
  #onKeyDown(event) {
    if (!this.#validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case "Escape":
        this.#delegate.closeMenu(event);
        break;
      case "Tab":
        this.#focusAt(this.#nextIndex(event.shiftKey ? -1 : 1));
        break;
      case "ArrowUp":
        this.#focusAt(this.#nextIndex(-1));
        break;
      case "ArrowDown":
        this.#focusAt(this.#nextIndex(1));
        break;
      case "Home":
      case "PageUp":
        this.#focusAt(0);
        break;
      case "End":
      case "PageDown":
        this.#focusAt(this.#elements.length - 1);
        break;
    }
  }
  #nextIndex(delta) {
    let index = this.#index;
    do {
      index = (index + delta + this.#elements.length) % this.#elements.length;
    } while (this.#elements[index]?.offsetParent === null);
    return index;
  }
  #getFocusableElements() {
    if (!this.#el) return [];
    const focusableElements = this.#el.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
    const is = (node) => {
      return node.getAttribute("role") === "menu";
    };
    for (const el of focusableElements) {
      if (isHTMLElement(el) && el.offsetParent !== null && // does not have display: none
      isElementParent(this.#el, el, is)) {
        elements.push(el);
      }
    }
    return elements;
  }
}

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$1(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$1(target, key, result);
  return result;
};
let idCount = 0;
class Menu extends Component {
  static props = {
    showDelay: 0
  };
  #media;
  #menuId;
  #menuButtonId;
  #expanded = signal(false);
  #disabled = signal(false);
  #trigger = signal(null);
  #content = signal(null);
  #parentMenu;
  #submenus = /* @__PURE__ */ new Set();
  #menuObserver = null;
  #popper;
  #focus;
  #isSliderActive = false;
  #isTriggerDisabled = signal(false);
  #transitionCallbacks = /* @__PURE__ */ new Set();
  get triggerElement() {
    return this.#trigger();
  }
  get contentElement() {
    return this.#content();
  }
  get isSubmenu() {
    return !!this.#parentMenu;
  }
  constructor() {
    super();
    const { showDelay } = this.$props;
    this.#popper = new Popper({
      trigger: this.#trigger,
      content: this.#content,
      showDelay,
      listen: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this.#expanded()) hide(event);
          else show(event);
        });
        const closeTarget = this.#getCloseTarget();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      onChange: this.#onExpandedChange.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const currentIdCount = ++idCount;
    this.#menuId = `media-menu-${currentIdCount}`;
    this.#menuButtonId = `media-menu-button-${currentIdCount}`;
    this.#focus = new MenuFocusController({
      closeMenu: this.close.bind(this)
    });
    if (hasProvidedContext(menuContext)) {
      this.#parentMenu = useContext(menuContext);
    }
    this.#observeSliders();
    this.setAttributes({
      "data-open": this.#expanded,
      "data-root": !this.isSubmenu,
      "data-submenu": this.isSubmenu,
      "data-disabled": this.#isDisabled.bind(this)
    });
    provideContext(menuContext, {
      button: this.#trigger,
      content: this.#content,
      expanded: this.#expanded,
      hint: signal(""),
      submenu: !!this.#parentMenu,
      disable: this.#disable.bind(this),
      attachMenuButton: this.#attachMenuButton.bind(this),
      attachMenuItems: this.#attachMenuItems.bind(this),
      attachObserver: this.#attachObserver.bind(this),
      disableMenuButton: this.#disableMenuButton.bind(this),
      addSubmenu: this.#addSubmenu.bind(this),
      onTransitionEvent: (callback) => {
        this.#transitionCallbacks.add(callback);
        onDispose(() => {
          this.#transitionCallbacks.delete(callback);
        });
      }
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onConnect(el) {
    effect(this.#watchExpanded.bind(this));
    if (this.isSubmenu) {
      this.#parentMenu?.addSubmenu(this);
    }
  }
  onDestroy() {
    this.#trigger.set(null);
    this.#content.set(null);
    this.#menuObserver = null;
    this.#transitionCallbacks.clear();
  }
  #observeSliders() {
    let sliderActiveTimer = -1, parentSliderObserver = hasProvidedContext(sliderObserverContext) ? useContext(sliderObserverContext) : null;
    provideContext(sliderObserverContext, {
      onDragStart: () => {
        parentSliderObserver?.onDragStart?.();
        window.clearTimeout(sliderActiveTimer);
        sliderActiveTimer = -1;
        this.#isSliderActive = true;
      },
      onDragEnd: () => {
        parentSliderObserver?.onDragEnd?.();
        sliderActiveTimer = window.setTimeout(() => {
          this.#isSliderActive = false;
          sliderActiveTimer = -1;
        }, 300);
      }
    });
  }
  #watchExpanded() {
    const expanded = this.#isExpanded();
    if (!this.isSubmenu) this.#onResize();
    this.#updateMenuItemsHidden(expanded);
    if (!expanded) return;
    effect(() => {
      const { height } = this.#media.$state, content = this.#content();
      content && setStyle(content, "--player-height", height() + "px");
    });
    this.#focus.listen();
    this.listen("pointerup", this.#onPointerUp.bind(this));
    listenEvent(window, "pointerup", this.#onWindowPointerUp.bind(this));
  }
  #attachMenuButton(button) {
    const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this.#isDisabled.bind(this));
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
    setAttribute(el, "id", this.#menuButtonId);
    setAttribute(el, "aria-haspopup", "menu");
    setAttribute(el, "aria-expanded", "false");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    const watchAttrs = () => {
      setAttribute(el, "data-open", this.#expanded());
      setAttribute(el, "aria-disabled", isARIADisabled());
    };
    watchAttrs();
    this.#trigger.set(el);
    onDispose(() => {
      this.#trigger.set(null);
    });
  }
  #attachMenuItems(items) {
    const el = items.el;
    el.style.setProperty("display", "none");
    setAttribute(el, "id", this.#menuId);
    setAttributeIfEmpty(el, "role", "menu");
    setAttributeIfEmpty(el, "tabindex", "-1");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    this.#content.set(el);
    onDispose(() => this.#content.set(null));
    const watchAttrs = () => setAttribute(el, "data-open", this.#expanded());
    watchAttrs();
    this.#focus.attachMenu(el);
    this.#updateMenuItemsHidden(false);
    const onTransition = this.#onResizeTransition.bind(this);
    if (!this.isSubmenu) {
      items.listen("transitionstart", onTransition);
      items.listen("transitionend", onTransition);
      items.listen("animationend", this.#onResize);
      items.listen("vds-menu-resize", this.#onResize);
    } else {
      this.#parentMenu?.onTransitionEvent(onTransition);
    }
  }
  #attachObserver(observer) {
    this.#menuObserver = observer;
  }
  #updateMenuItemsHidden(expanded) {
    const content = peek(this.#content);
    if (content) setAttribute(content, "aria-hidden", ariaBool$1(!expanded));
  }
  #disableMenuButton(disabled) {
    this.#isTriggerDisabled.set(disabled);
  }
  #wasKeyboardExpand = false;
  #onExpandedChange(isExpanded, event) {
    this.#wasKeyboardExpand = isKeyboardEvent(event);
    event?.stopPropagation();
    if (this.#expanded() === isExpanded) return;
    if (this.#isDisabled()) {
      if (isExpanded) this.#popper.hide(event);
      return;
    }
    this.el?.dispatchEvent(
      new Event("vds-menu-resize", {
        bubbles: true,
        composed: true
      })
    );
    const trigger = this.#trigger(), content = this.#content();
    if (trigger) {
      setAttribute(trigger, "aria-controls", isExpanded && this.#menuId);
      setAttribute(trigger, "aria-expanded", ariaBool$1(isExpanded));
    }
    if (content) setAttribute(content, "aria-labelledby", isExpanded && this.#menuButtonId);
    this.#expanded.set(isExpanded);
    this.#toggleMediaControls(event);
    tick();
    if (this.#wasKeyboardExpand) {
      if (isExpanded) content?.focus();
      else trigger?.focus();
      for (const el of [this.el, content]) {
        el && el.setAttribute("data-keyboard", "");
      }
    } else {
      for (const el of [this.el, content]) {
        el && el.removeAttribute("data-keyboard");
      }
    }
    this.dispatch(isExpanded ? "open" : "close", { trigger: event });
    if (isExpanded) {
      if (!this.isSubmenu && this.#media.activeMenu !== this) {
        this.#media.activeMenu?.close(event);
        this.#media.activeMenu = this;
      }
      this.#menuObserver?.onOpen?.(event);
    } else {
      if (this.isSubmenu) {
        for (const el of this.#submenus) el.close(event);
      } else {
        this.#media.activeMenu = null;
      }
      this.#menuObserver?.onClose?.(event);
    }
    if (isExpanded) {
      requestAnimationFrame(this.#updateFocus.bind(this));
    }
  }
  #updateFocus() {
    if (this.#isTransitionActive || this.#isSubmenuOpen) return;
    this.#focus.update();
    requestAnimationFrame(() => {
      if (this.#wasKeyboardExpand) {
        this.#focus.focusActive();
      } else {
        this.#focus.scroll();
      }
    });
  }
  #isExpanded() {
    return !this.#isDisabled() && this.#expanded();
  }
  #isDisabled() {
    return this.#disabled() || this.#isTriggerDisabled();
  }
  #disable(disabled) {
    this.#disabled.set(disabled);
  }
  #onPointerUp(event) {
    const content = this.#content();
    if (this.#isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    event.stopPropagation();
  }
  #onWindowPointerUp(event) {
    const content = this.#content();
    if (this.#isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    this.close(event);
  }
  #getCloseTarget() {
    const target = this.el?.querySelector('[data-part="close-target"]');
    return this.el && target && isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
  }
  #toggleMediaControls(trigger) {
    if (this.isSubmenu) return;
    if (this.#expanded()) this.#media.remote.pauseControls(trigger);
    else this.#media.remote.resumeControls(trigger);
  }
  #addSubmenu(menu) {
    this.#submenus.add(menu);
    new EventsController(menu).add("open", this.#onSubmenuOpenBind).add("close", this.#onSubmenuCloseBind);
    onDispose(this.#removeSubmenuBind);
  }
  #removeSubmenuBind = this.#removeSubmenu.bind(this);
  #removeSubmenu(menu) {
    this.#submenus.delete(menu);
  }
  #isSubmenuOpen = false;
  #onSubmenuOpenBind = this.#onSubmenuOpen.bind(this);
  #onSubmenuOpen(event) {
    this.#isSubmenuOpen = true;
    const content = this.#content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "true");
    }
    for (const target of this.#submenus) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute("aria-hidden", "true");
        }
      }
    }
    if (content) {
      const el = event.target.el;
      for (const child of content.children) {
        if (child.contains(el)) {
          child.setAttribute("data-open", "");
        } else if (child !== el) {
          child.setAttribute("data-hidden", "");
        }
      }
    }
  }
  #onSubmenuCloseBind = this.#onSubmenuClose.bind(this);
  #onSubmenuClose(event) {
    this.#isSubmenuOpen = false;
    const content = this.#content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "false");
    }
    for (const target of this.#submenus) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute("aria-hidden", "false");
      }
    }
    if (content) {
      for (const child of content.children) {
        child.removeAttribute("data-open");
        child.removeAttribute("data-hidden");
      }
    }
  }
  #onResize = animationFrameThrottle();
  #isTransitionActive = false;
  #onResizeTransition(event) {
    const content = this.#content();
    if (content && event.propertyName === "height") {
      this.#isTransitionActive = event.type === "transitionstart";
      setAttribute(content, "data-transition", this.#isTransitionActive ? "height" : null);
      if (this.#expanded()) this.#updateFocus();
    }
    for (const callback of this.#transitionCallbacks) callback(event);
  }
  open(trigger) {
    if (peek(this.#expanded)) return;
    this.#popper.show(trigger);
    tick();
  }
  close(trigger) {
    if (!peek(this.#expanded)) return;
    this.#popper.hide(trigger);
    tick();
  }
}
__decorateClass$1([
  prop
], Menu.prototype, "triggerElement");
__decorateClass$1([
  prop
], Menu.prototype, "contentElement");
__decorateClass$1([
  prop
], Menu.prototype, "isSubmenu");
__decorateClass$1([
  method
], Menu.prototype, "open");
__decorateClass$1([
  method
], Menu.prototype, "close");

class MenuButton extends Component {
  static props = {
    disabled: false
  };
  #menu;
  #hintEl = signal(null);
  get expanded() {
    return this.#menu?.expanded() ?? false;
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#menu = useContext(menuContext);
  }
  onAttach(el) {
    this.#menu.attachMenuButton(this);
    effect(this.#watchDisabled.bind(this));
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    effect(this.#watchHintEl.bind(this));
    this.#onMutation();
    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributeFilter: ["data-part"], childList: true, subtree: true });
    onDispose(() => mutations.disconnect());
    onPress(el, (trigger) => {
      this.dispatch("select", { trigger });
    });
  }
  #watchDisabled() {
    this.#menu.disableMenuButton(this.$props.disabled());
  }
  #watchHintEl() {
    const el = this.#hintEl();
    if (!el) return;
    effect(() => {
      const text = this.#menu.hint();
      if (text) el.textContent = text;
    });
  }
  #onMutation() {
    const hintEl = this.el?.querySelector('[data-part="hint"]');
    this.#hintEl.set(hintEl ?? null);
  }
}
const menubutton__proto = MenuButton.prototype;
prop(menubutton__proto, "expanded");

class MenuItem extends MenuButton {
}

class MenuPortal extends Component {
  static props = {
    container: null,
    disabled: false
  };
  #target = null;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    provideContext(menuPortalContext, {
      attach: this.#attachElement.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  // Need this so connect scope is defined.
  onConnect(el) {
  }
  onDestroy() {
    this.#target?.remove();
    this.#target = null;
  }
  #attachElement(el) {
    this.#portal(false);
    this.#target = el;
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.#watchDisabled.bind(this));
      });
    });
  }
  #watchDisabled() {
    const { fullscreen } = this.#media.$state, { disabled } = this.$props;
    this.#portal(disabled() === "fullscreen" ? !fullscreen() : !disabled());
  }
  #portal(shouldPortal) {
    if (!this.#target) return;
    let container = this.#getContainer(this.$props.container());
    if (!container) return;
    const isPortalled = this.#target.parentElement === container;
    setAttribute(this.#target, "data-portal", shouldPortal);
    if (shouldPortal) {
      if (!isPortalled) {
        this.#target.remove();
        container.append(this.#target);
      }
    } else if (isPortalled && this.#target.parentElement === container) {
      this.#target.remove();
      this.el?.append(this.#target);
    }
  }
  #getContainer(selector) {
    if (isHTMLElement(selector)) return selector;
    return selector ? document.querySelector(selector) : document.body;
  }
}
const menuPortalContext = createContext();

class MenuItems extends Component {
  static props = {
    placement: null,
    offset: 0,
    alignOffset: 0
  };
  #menu;
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.#menu = useContext(menuContext);
    this.#menu.attachMenuItems(this);
    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        provideContext(menuPortalContext, null);
        portal.attach(el);
        onDispose(() => portal.attach(null));
      }
    }
  }
  onConnect(el) {
    effect(this.#watchPlacement.bind(this));
  }
  #watchPlacement() {
    const { expanded } = this.#menu;
    if (!this.el || !expanded()) return;
    const placement = this.$props.placement();
    if (!placement) return;
    Object.assign(this.el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
    const { offset: mainOffset, alignOffset } = this.$props;
    onDispose(
      autoPlacement(this.el, this.#getButton(), placement, {
        offsetVarName: "media-menu",
        xOffset: alignOffset(),
        yOffset: mainOffset()
      })
    );
    onDispose(this.#hide.bind(this));
  }
  #hide() {
    if (!this.el) return;
    this.el.removeAttribute("style");
    this.el.style.display = "none";
  }
  #getButton() {
    return this.#menu.button();
  }
}

const radioControllerContext = createContext();

class RadioGroupController extends ViewController {
  #group = /* @__PURE__ */ new Set();
  #value = signal("");
  #controller = null;
  onValueChange;
  get values() {
    return Array.from(this.#group).map((radio) => radio.value());
  }
  get value() {
    return this.#value();
  }
  set value(value) {
    this.#onChange(value);
  }
  onSetup() {
    provideContext(radioControllerContext, {
      add: this.#addRadio.bind(this),
      remove: this.#removeRadio.bind(this)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, "role", "radiogroup");
    this.setAttributes({ value: this.#value });
  }
  onDestroy() {
    this.#group.clear();
  }
  #addRadio(radio) {
    if (this.#group.has(radio)) return;
    this.#group.add(radio);
    radio.onCheck = this.#onChangeBind;
    radio.check(radio.value() === this.#value());
  }
  #removeRadio(radio) {
    radio.onCheck = null;
    this.#group.delete(radio);
  }
  #onChangeBind = this.#onChange.bind(this);
  #onChange(newValue, trigger) {
    const currentValue = peek(this.#value);
    if (!newValue || newValue === currentValue) return;
    const currentRadio = this.#findRadio(currentValue), newRadio = this.#findRadio(newValue);
    currentRadio?.check(false, trigger);
    newRadio?.check(true, trigger);
    this.#value.set(newValue);
    this.onValueChange?.(newValue, trigger);
  }
  #findRadio(newValue) {
    for (const radio of this.#group) {
      if (newValue === peek(radio.value)) return radio;
    }
    return null;
  }
}

class RadioGroup extends Component {
  static props = {
    value: ""
  };
  #controller;
  /**
   * A list of radio values that belong this group.
   */
  get values() {
    return this.#controller.values;
  }
  /**
   * The radio value that is checked in this group.
   */
  get value() {
    return this.#controller.value;
  }
  set value(newValue) {
    this.#controller.value = newValue;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#watchValue();
  }
  #watchValue() {
    this.#controller.value = this.$props.value();
  }
  #onValueChange(value, trigger) {
    const event = this.createEvent("change", { detail: value, trigger });
    this.dispatch(event);
  }
}
const radiogroup__proto = RadioGroup.prototype;
prop(radiogroup__proto, "values");
prop(radiogroup__proto, "value");

class Radio extends Component {
  static props = {
    value: ""
  };
  #checked = signal(false);
  #controller = {
    value: this.$props.value,
    check: this.#check.bind(this),
    onCheck: null
  };
  /**
   * Whether this radio is currently checked.
   */
  get checked() {
    return this.#checked();
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.setAttributes({
      value: this.$props.value,
      "data-checked": this.#checked,
      "aria-checked": $ariaBool(this.#checked)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
    effect(this.#watchValue.bind(this));
  }
  onConnect(el) {
    this.#addToGroup();
    onPress(el, this.#onPress.bind(this));
    onDispose(this.#onDisconnect.bind(this));
  }
  #onDisconnect() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this.#controller);
    }, this.connectScope);
  }
  #addToGroup() {
    const group = useContext(radioControllerContext);
    group.add(this.#controller);
  }
  #watchValue() {
    const { value } = this.$props, newValue = value();
    if (peek(this.#checked)) {
      this.#controller.onCheck?.(newValue);
    }
  }
  #onPress(event) {
    if (peek(this.#checked)) return;
    this.#onChange(true, event);
    this.#onSelect(event);
    this.#controller.onCheck?.(peek(this.$props.value), event);
  }
  #check(value, trigger) {
    if (peek(this.#checked) === value) return;
    this.#onChange(value, trigger);
  }
  #onChange(value, trigger) {
    this.#checked.set(value);
    this.dispatch("change", { detail: value, trigger });
  }
  #onSelect(trigger) {
    this.dispatch("select", { trigger });
  }
}
const radio__proto = Radio.prototype;
prop(radio__proto, "checked");

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
class ChaptersRadioGroup extends Component {
  static props = {
    thumbnails: null
  };
  #media;
  #menu;
  #controller;
  #track = signal(null);
  #cues = signal([]);
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    return !this.#cues()?.length;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
    const { thumbnails } = this.$props;
    this.setAttributes({
      "data-thumbnails": () => !!thumbnails()
    });
  }
  onAttach(el) {
    this.#menu?.attachObserver({
      onOpen: this.#onOpen.bind(this)
    });
  }
  getOptions() {
    const { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
    return this.#cues().map((cue, i) => ({
      cue,
      value: i.toString(),
      label: cue.text,
      startTime: formatTime(Math.max(0, cue.startTime - startTime)),
      duration: formatSpokenTime(
        Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime)
      )
    }));
  }
  #onOpen() {
    peek(() => this.#watchCurrentTime());
  }
  onConnect(el) {
    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchTrack.bind(this));
    watchActiveTextTrack(this.#media.textTracks, "chapters", this.#track.set);
  }
  #watchTrack() {
    const track = this.#track();
    if (!track) return;
    const onCuesChange = this.#onCuesChange.bind(this, track);
    onCuesChange();
    new EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
    return () => {
      this.#cues.set([]);
    };
  }
  #onCuesChange(track) {
    const { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
    this.#cues.set(
      [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime)
    );
  }
  #watchCurrentTime() {
    if (!this.#menu?.expanded()) return;
    const track = this.#track();
    if (!track) {
      this.#controller.value = "-1";
      return;
    }
    const { realCurrentTime, seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd(), time = realCurrentTime(), activeCueIndex = this.#cues().findIndex((cue) => isCueActive(cue, time));
    this.#controller.value = activeCueIndex.toString();
    if (activeCueIndex >= 0) {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        const cue = this.#cues()[activeCueIndex], radio = this.el.querySelector(`[aria-checked='true']`), cueStartTime = Math.max(startTime, cue.startTime), duration = Math.min(endTime, cue.endTime) - cueStartTime, playedPercent = Math.max(0, time - cueStartTime) / duration * 100;
        radio && setStyle(radio, "--progress", round(playedPercent, 3) + "%");
      });
    }
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #onValueChange(value, trigger) {
    if (this.disabled || !trigger) return;
    const index = +value, cues = this.#cues(), { clipStartTime } = this.#media.$state;
    if (isNumber(index) && cues?.[index]) {
      this.#controller.value = index.toString();
      this.#media.remote.seek(cues[index].startTime - clipStartTime(), trigger);
      this.dispatch("change", { detail: cues[index], trigger });
    }
  }
}
__decorateClass([
  prop
], ChaptersRadioGroup.prototype, "value");
__decorateClass([
  prop
], ChaptersRadioGroup.prototype, "disabled");
__decorateClass([
  method
], ChaptersRadioGroup.prototype, "getOptions");

class AudioRadioGroup extends Component {
  static props = {
    emptyLabel: "Default"
  };
  #menu;
  #media;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { audioTracks } = this.#media.$state;
    return audioTracks().length <= 1;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.#watchValue.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchHintText.bind(this));
  }
  getOptions() {
    const { audioTracks } = this.#media.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase()
    }));
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { emptyLabel } = this.$props, { audioTrack } = this.#media.$state, track = audioTrack();
    this.#menu?.hint.set(track?.label ?? emptyLabel());
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { audioTrack } = this.#media.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : "";
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    const index = this.#media.audioTracks.toArray().findIndex((track) => track.label.toLowerCase() === value);
    if (index >= 0) {
      const track = this.#media.audioTracks[index];
      this.#media.remote.changeAudioTrack(index, trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
}
const audioradiogroup__proto = AudioRadioGroup.prototype;
prop(audioradiogroup__proto, "value");
prop(audioradiogroup__proto, "disabled");
method(audioradiogroup__proto, "getOptions");

const DEFAULT_AUDIO_GAINS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
class AudioGainRadioGroup extends Component {
  static props = {
    normalLabel: "Disabled",
    gains: DEFAULT_AUDIO_GAINS
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { gains } = this.$props, { canSetAudioGain } = this.#media.$state;
    return !canSetAudioGain() || gains().length === 0;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.#watchValue.bind(this));
    effect(this.#watchHintText.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
  }
  getOptions() {
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + "%",
      value: gain.toString()
    }));
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { normalLabel } = this.$props, { audioGain } = this.#media.$state, gain = audioGain();
    this.#menu?.hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + "%");
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { audioGain } = this.#media.$state;
    return audioGain()?.toString() ?? "1";
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    const gain = +value;
    this.#media.remote.changeAudioGain(gain, trigger);
    this.dispatch("change", { detail: gain, trigger });
  }
}
const audiogainradiogroup__proto = AudioGainRadioGroup.prototype;
prop(audiogainradiogroup__proto, "value");
prop(audiogainradiogroup__proto, "disabled");
method(audiogainradiogroup__proto, "getOptions");

class CaptionsRadioGroup extends Component {
  static props = {
    offLabel: "Off"
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { hasCaptions } = this.#media.$state;
    return !hasCaptions();
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    super.onConnect?.(el);
    effect(this.#watchValue.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchHintText.bind(this));
  }
  getOptions() {
    const { offLabel } = this.$props, { textTracks } = this.#media.$state;
    return [
      { value: "off", label: offLabel },
      ...textTracks().filter(isTrackCaptionKind).map((track) => ({
        track,
        label: track.label,
        value: this.#getTrackValue(track)
      }))
    ];
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { offLabel } = this.$props, { textTrack } = this.#media.$state, track = textTrack();
    this.#menu?.hint.set(
      track && isTrackCaptionKind(track) && track.mode === "showing" ? track.label : offLabel()
    );
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { textTrack } = this.#media.$state, track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === "showing" ? this.#getTrackValue(track) : "off";
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    if (value === "off") {
      const track = this.#media.textTracks.selected;
      if (track) {
        const index2 = this.#media.textTracks.indexOf(track);
        this.#media.remote.changeTextTrackMode(index2, "disabled", trigger);
        this.dispatch("change", { detail: null, trigger });
      }
      return;
    }
    const index = this.#media.textTracks.toArray().findIndex((track) => this.#getTrackValue(track) === value);
    if (index >= 0) {
      const track = this.#media.textTracks[index];
      this.#media.remote.changeTextTrackMode(index, "showing", trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
  #getTrackValue(track) {
    return track.id + ":" + track.kind + "-" + track.label.toLowerCase();
  }
}
const captionsradiogroup__proto = CaptionsRadioGroup.prototype;
prop(captionsradiogroup__proto, "value");
prop(captionsradiogroup__proto, "disabled");
method(captionsradiogroup__proto, "getOptions");

const DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
class SpeedRadioGroup extends Component {
  static props = {
    normalLabel: "Normal",
    rates: DEFAULT_PLAYBACK_RATES
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { rates } = this.$props, { canSetPlaybackRate } = this.#media.$state;
    return !canSetPlaybackRate() || rates().length === 0;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.#watchValue.bind(this));
    effect(this.#watchHintText.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
  }
  getOptions() {
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + "\xD7",
      value: rate.toString()
    }));
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { normalLabel } = this.$props, { playbackRate } = this.#media.$state, rate = playbackRate();
    this.#menu?.hint.set(rate === 1 ? normalLabel() : rate + "\xD7");
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { playbackRate } = this.#media.$state;
    return playbackRate().toString();
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    const rate = +value;
    this.#media.remote.changePlaybackRate(rate, trigger);
    this.dispatch("change", { detail: rate, trigger });
  }
}
const speedradiogroup__proto = SpeedRadioGroup.prototype;
prop(speedradiogroup__proto, "value");
prop(speedradiogroup__proto, "disabled");
method(speedradiogroup__proto, "getOptions");

class QualityRadioGroup extends Component {
  static props = {
    autoLabel: "Auto",
    hideBitrate: false,
    sort: "descending"
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { canSetQuality, qualities } = this.#media.$state;
    return !canSetQuality() || qualities().length <= 1;
  }
  #sortedQualities = computed(() => {
    const { sort } = this.$props, { qualities } = this.#media.$state;
    return sortVideoQualities(qualities(), sort() === "descending");
  });
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.#watchValue.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchHintText.bind(this));
  }
  getOptions() {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: "auto", label: autoLabel },
      ...this.#sortedQualities().map((quality) => {
        const bitrate = quality.bitrate && quality.bitrate >= 0 ? `${round(quality.bitrate / 1e6, 2)} Mbps` : null;
        return {
          quality,
          label: quality.height + "p",
          value: this.#getQualityId(quality),
          bitrate: () => !hideBitrate() ? bitrate : null
        };
      })
    ];
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { autoLabel } = this.$props, { autoQuality, quality } = this.#media.$state, qualityText = quality() ? quality().height + "p" : "";
    this.#menu?.hint.set(
      !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : "")
    );
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    if (value === "auto") {
      this.#media.remote.changeQuality(-1, trigger);
      this.dispatch("change", { detail: "auto", trigger });
      return;
    }
    const { qualities } = this.#media.$state, index = peek(qualities).findIndex((quality) => this.#getQualityId(quality) === value);
    if (index >= 0) {
      const quality = peek(qualities)[index];
      this.#media.remote.changeQuality(index, trigger);
      this.dispatch("change", { detail: quality, trigger });
    }
  }
  #getValue() {
    const { quality, autoQuality } = this.#media.$state;
    if (autoQuality()) return "auto";
    const currentQuality = quality();
    return currentQuality ? this.#getQualityId(currentQuality) : "auto";
  }
  #getQualityId(quality) {
    return quality.height + "_" + quality.bitrate;
  }
}
const qualityradiogroup__proto = QualityRadioGroup.prototype;
prop(qualityradiogroup__proto, "value");
prop(qualityradiogroup__proto, "disabled");
method(qualityradiogroup__proto, "getOptions");

class Gesture extends Component {
  static props = {
    disabled: false,
    event: void 0,
    action: void 0
  };
  #media;
  #provider = null;
  onSetup() {
    this.#media = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-gesture", "");
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    this.#provider = this.#media.player.el?.querySelector(
      "[data-media-provider]"
    );
    effect(this.#attachListener.bind(this));
  }
  #attachListener() {
    let eventType = this.$props.event(), disabled = this.$props.disabled();
    if (!this.#provider || !eventType || disabled) return;
    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1];
    }
    if (eventType === "pointerup" || eventType === "pointerdown") {
      const pointer = this.#media.$state.pointer();
      if (pointer === "coarse") {
        eventType = eventType === "pointerup" ? "touchend" : "touchstart";
      }
    }
    listenEvent(
      this.#provider,
      eventType,
      this.#acceptEvent.bind(this));
  }
  #presses = 0;
  #pressTimerId = -1;
  #acceptEvent(event) {
    if (this.$props.disabled() || isPointerEvent(event) && (event.button !== 0 || this.#media.activeMenu) || isTouchEvent(event) && this.#media.activeMenu || isTouchPinchEvent(event) || !this.#inBounds(event)) {
      return;
    }
    event.MEDIA_GESTURE = true;
    event.preventDefault();
    const eventType = peek(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
    if (!isDblEvent) {
      if (this.#presses === 0) {
        setTimeout(() => {
          if (this.#presses === 1) this.#handleEvent(event);
        }, 250);
      }
    } else if (this.#presses === 1) {
      queueMicrotask(() => this.#handleEvent(event));
      clearTimeout(this.#pressTimerId);
      this.#presses = 0;
      return;
    }
    if (this.#presses === 0) {
      this.#pressTimerId = window.setTimeout(() => {
        this.#presses = 0;
      }, 275);
    }
    this.#presses++;
  }
  #handleEvent(event) {
    this.el.setAttribute("data-triggered", "");
    requestAnimationFrame(() => {
      if (this.#isTopLayer()) {
        this.#performAction(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el.removeAttribute("data-triggered");
      });
    });
  }
  /** Validate event occurred in gesture bounds. */
  #inBounds(event) {
    if (!this.el) return false;
    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? event.changedTouches[0] ?? event.touches[0] : void 0;
      const clientX = touch?.clientX ?? event.clientX;
      const clientY = touch?.clientY ?? event.clientY;
      const rect = this.el.getBoundingClientRect();
      const inBounds = clientY >= rect.top && clientY <= rect.bottom && clientX >= rect.left && clientX <= rect.right;
      return event.type.includes("leave") ? !inBounds : inBounds;
    }
    return true;
  }
  /** Validate gesture has the highest z-index in this triggered group. */
  #isTopLayer() {
    const gestures = this.#media.player.el.querySelectorAll(
      "[data-media-gesture][data-triggered]"
    );
    return Array.from(gestures).sort(
      (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex
    )[0] === this.el;
  }
  #performAction(action, trigger) {
    if (!action) return;
    const willTriggerEvent = new DOMEvent("will-trigger", {
      detail: action,
      cancelable: true,
      trigger
    });
    this.dispatchEvent(willTriggerEvent);
    if (willTriggerEvent.defaultPrevented) return;
    const [method, value] = action.replace(/:([a-z])/, "-$1").split(":");
    if (action.includes(":fullscreen")) {
      this.#media.remote.toggleFullscreen("prefer-media", trigger);
    } else if (action.includes("seek:")) {
      this.#media.remote.seek(peek(this.#media.$state.currentTime) + (+value || 0), trigger);
    } else {
      this.#media.remote[kebabToCamelCase(method)](trigger);
    }
    this.dispatch("trigger", {
      detail: action,
      trigger
    });
  }
}

class CaptionsTextRenderer {
  priority = 10;
  #track = null;
  #renderer;
  #events;
  constructor(renderer) {
    this.#renderer = renderer;
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this.#events?.abort();
    this.#events = void 0;
    this.#renderer.reset();
    this.#track = null;
  }
  changeTrack(track) {
    if (!track || this.#track === track) return;
    this.#events?.abort();
    this.#events = new EventsController(track);
    if (track.readyState < 2) {
      this.#renderer.reset();
      this.#events.add("load", () => this.#changeTrack(track), { once: true });
    } else {
      this.#changeTrack(track);
    }
    this.#events.add("add-cue", (event) => {
      this.#renderer.addCue(event.detail);
    }).add("remove-cue", (event) => {
      this.#renderer.removeCue(event.detail);
    });
    this.#track = track;
  }
  #changeTrack(track) {
    this.#renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
}

class Captions extends Component {
  static props = {
    textDir: "ltr",
    exampleText: "Captions look like this."
  };
  #media;
  static lib = signal(null);
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "aria-hidden": $ariaBool(this.#isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    if (!Captions.lib()) {
      import('media-captions').then((lib) => Captions.lib.set(lib));
    }
    effect(this.#watchViewType.bind(this));
  }
  #isHidden() {
    const { textTrack, remotePlaybackState, iOSControls } = this.#media.$state, track = textTrack();
    return iOSControls() || remotePlaybackState() === "connected" || !track || !isTrackCaptionKind(track);
  }
  #watchViewType() {
    if (!Captions.lib()) return;
    const { viewType } = this.#media.$state;
    if (viewType() === "audio") {
      return this.#setupAudioView();
    } else {
      return this.#setupVideoView();
    }
  }
  #setupAudioView() {
    effect(this.#onTrackChange.bind(this));
    this.#listenToFontStyleChanges(null);
    return () => {
      this.el.textContent = "";
    };
  }
  #onTrackChange() {
    if (this.#isHidden()) return;
    this.#onCueChange();
    const { textTrack } = this.#media.$state;
    listenEvent(textTrack(), "cue-change", this.#onCueChange.bind(this));
    effect(this.#onUpdateTimedNodes.bind(this));
  }
  #onCueChange() {
    this.el.textContent = "";
    if (this.#hideExampleTimer >= 0) {
      this.#removeExample();
    }
    const { realCurrentTime, textTrack } = this.#media.$state, { renderVTTCueString } = Captions.lib(), time = peek(realCurrentTime), activeCues = peek(textTrack).activeCues;
    for (const cue of activeCues) {
      const displayEl = this.#createCueDisplayElement(), cueEl = this.#createCueElement();
      cueEl.innerHTML = renderVTTCueString(cue, time);
      displayEl.append(cueEl);
      this.el.append(cueEl);
    }
  }
  #onUpdateTimedNodes() {
    const { realCurrentTime } = this.#media.$state, { updateTimedVTTCueNodes } = Captions.lib();
    updateTimedVTTCueNodes(this.el, realCurrentTime());
  }
  #setupVideoView() {
    const { CaptionsRenderer } = Captions.lib(), renderer = new CaptionsRenderer(this.el), textRenderer = new CaptionsTextRenderer(renderer);
    this.#media.textRenderers.add(textRenderer);
    effect(this.#watchTextDirection.bind(this, renderer));
    effect(this.#watchMediaTime.bind(this, renderer));
    this.#listenToFontStyleChanges(renderer);
    return () => {
      this.el.textContent = "";
      this.#media.textRenderers.remove(textRenderer);
      renderer.destroy();
    };
  }
  #watchTextDirection(renderer) {
    renderer.dir = this.$props.textDir();
  }
  #watchMediaTime(renderer) {
    if (this.#isHidden()) return;
    const { realCurrentTime, textTrack } = this.#media.$state;
    renderer.currentTime = realCurrentTime();
    if (this.#hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
      this.#removeExample();
    }
  }
  #listenToFontStyleChanges(renderer) {
    const player = this.#media.player;
    if (!player) return;
    this.#onFontStyleChange.bind(this, renderer);
  }
  #onFontStyleChange(renderer) {
    if (this.#hideExampleTimer >= 0) {
      this.#hideExample();
      return;
    }
    const { textTrack } = this.#media.$state;
    if (!textTrack()?.activeCues[0]) {
      this.#showExample();
    } else {
      renderer?.update(true);
    }
  }
  #showExample() {
    const display = this.#createCueDisplayElement();
    setAttribute(display, "data-example", "");
    const cue = this.#createCueElement();
    setAttribute(cue, "data-example", "");
    cue.textContent = this.$props.exampleText();
    display?.append(cue);
    this.el?.append(display);
    this.el?.setAttribute("data-example", "");
    this.#hideExample();
  }
  #hideExampleTimer = -1;
  #hideExample() {
    window.clearTimeout(this.#hideExampleTimer);
    this.#hideExampleTimer = window.setTimeout(this.#removeExample.bind(this), 2500);
  }
  #removeExample() {
    this.el?.removeAttribute("data-example");
    if (this.el?.querySelector("[data-example]")) this.el.textContent = "";
    this.#hideExampleTimer = -1;
  }
  #createCueDisplayElement() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue-display");
    return el;
  }
  #createCueElement() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue");
    return el;
  }
}

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

class Time extends Component {
  static props = {
    type: "current",
    showHours: false,
    padHours: null,
    padMinutes: null,
    remainder: false,
    toggle: false,
    hidden: false
  };
  static state = new State({
    timeText: "",
    hidden: false
  });
  #media;
  #invert = signal(null);
  #isVisible = signal(true);
  #isIntersecting = signal(true);
  onSetup() {
    this.#media = useMediaContext();
    this.#watchTime();
    const { type } = this.$props;
    this.setAttributes({
      "data-type": type,
      "data-remainder": this.#shouldInvert.bind(this)
    });
    new IntersectionObserverController({
      callback: this.#onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    if (!el.hasAttribute("role")) effect(this.#watchRole.bind(this));
    effect(this.#watchTime.bind(this));
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this.#isVisible.set));
    effect(this.#watchHidden.bind(this));
    effect(this.#watchToggle.bind(this));
  }
  #onIntersectionChange(entries) {
    this.#isIntersecting.set(entries[0].isIntersecting);
  }
  #watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting());
  }
  #watchToggle() {
    if (!this.$props.toggle()) {
      this.#invert.set(null);
      return;
    }
    if (this.el) {
      onPress(this.el, this.#onToggle.bind(this));
    }
  }
  #watchTime() {
    const { hidden, timeText } = this.$state, { duration } = this.#media.$state;
    if (hidden()) return;
    const { type, padHours, padMinutes, showHours } = this.$props, seconds = this.#getSeconds(type()), $duration = duration(), shouldInvert = this.#shouldInvert();
    if (!Number.isFinite(seconds + $duration)) {
      timeText.set("LIVE");
      return;
    }
    const time = shouldInvert ? Math.max(0, $duration - seconds) : seconds, formattedTime = formatTime(time, {
      padHrs: padHours(),
      padMins: padMinutes(),
      showHrs: showHours()
    });
    timeText.set((shouldInvert ? "-" : "") + formattedTime);
  }
  #watchRole() {
    if (!this.el) return;
    const { toggle } = this.$props;
    setAttribute(this.el, "role", toggle() ? "timer" : null);
    setAttribute(this.el, "tabindex", toggle() ? 0 : null);
  }
  #getSeconds(type) {
    const { bufferedEnd, duration, currentTime } = this.#media.$state;
    switch (type) {
      case "buffered":
        return bufferedEnd();
      case "duration":
        return duration();
      default:
        return currentTime();
    }
  }
  #shouldInvert() {
    return this.$props.remainder() && this.#invert() !== false;
  }
  #onToggle(event) {
    event.preventDefault();
    if (this.#invert() === null) {
      this.#invert.set(!this.$props.remainder());
      return;
    }
    this.#invert.set((v) => !v);
  }
}

function usePlyrLayoutClasses(el, media) {
  const {
    canAirPlay,
    canFullscreen,
    canPictureInPicture,
    controlsHidden,
    currentTime,
    fullscreen,
    hasCaptions,
    isAirPlayConnected,
    paused,
    pictureInPicture,
    playing,
    pointer,
    poster,
    textTrack,
    viewType,
    waiting
  } = media.$state;
  el.classList.add("plyr");
  el.classList.add("plyr--full-ui");
  const classes = {
    "plyr--airplay-active": isAirPlayConnected,
    "plyr--airplay-supported": canAirPlay,
    "plyr--fullscreen-active": fullscreen,
    "plyr--fullscreen-enabled": canFullscreen,
    "plyr--hide-controls": controlsHidden,
    "plyr--is-touch": () => pointer() === "coarse",
    "plyr--loading": waiting,
    "plyr--paused": paused,
    "plyr--pip-active": pictureInPicture,
    "plyr--pip-enabled": canPictureInPicture,
    "plyr--playing": playing,
    "plyr__poster-enabled": poster,
    "plyr--stopped": () => paused() && currentTime() === 0,
    "plyr--captions-active": textTrack,
    "plyr--captions-enabled": hasCaptions
  };
  const disposal = createDisposalBin();
  for (const token of Object.keys(classes)) {
    disposal.add(effect(() => void el.classList.toggle(token, !!classes[token]())));
  }
  disposal.add(
    effect(() => {
      const token = `plyr--${viewType()}`;
      el.classList.add(token);
      return () => el.classList.remove(token);
    }),
    effect(() => {
      const { $provider } = media, type = $provider()?.type, token = `plyr--${isHTMLProvider(type) ? "html5" : type}`;
      el.classList.toggle(token, !!type);
      return () => el.classList.remove(token);
    })
  );
  return () => disposal.empty();
}
function isHTMLProvider(type) {
  return type === "audio" || type === "video";
}

export { ARIAKeyShortcuts, AirPlayButton, AudioGainRadioGroup, AudioGainSlider, AudioProviderLoader, AudioRadioGroup, AudioTrackList, CaptionButton, Captions, CaptionsRadioGroup, ChaptersRadioGroup, Controls, ControlsGroup, DASHProviderLoader, DEFAULT_AUDIO_GAINS, DEFAULT_PLAYBACK_RATES, FullscreenButton, FullscreenController, Gesture, GoogleCastButton, HLSProviderLoader, LibASSTextRenderer, List, LiveButton, LocalMediaStorage, Logger, MEDIA_KEY_SHORTCUTS, MediaAnnouncer, MediaControls, MediaPlayer, MediaProvider, MediaRemoteControl, Menu, MenuButton, MenuItem, MenuItems, MenuPortal, MuteButton, PIPButton, PlayButton, Poster, QualityRadioGroup, QualitySlider, Radio, RadioGroup, ScreenOrientationController, SeekButton, Slider, SliderChapters, SliderController, SliderPreview, SliderThumbnail, SliderValue, SliderVideo, SpeedRadioGroup, SpeedSlider, TextRenderers, TextTrack, TextTrackList, Thumbnail, ThumbnailsLoader, Time, TimeRange, TimeSlider, ToggleButton, Tooltip, TooltipContent, TooltipTrigger, VideoProviderLoader, VideoQualityList, VimeoProviderLoader, VolumeSlider, YouTubeProviderLoader, boundTime, canChangeVolume, canFullscreen, canOrientScreen, formatSpokenTime, formatTime, getTimeRangesEnd, isAudioProvider, isAudioSrc, isCueActive, isDASHProvider, isDASHSrc, isGoogleCastProvider, isHLSProvider, isHLSSrc, isHTMLAudioElement, isHTMLIFrameElement, isHTMLMediaElement, isHTMLVideoElement, isKeyboardClick, isKeyboardEvent, isPointerEvent, isTrackCaptionKind, isVideoProvider, isVideoQualitySrc, isVideoSrc, isVimeoProvider, isYouTubeProvider, mediaContext, mediaState, menuPortalContext, sliderContext, sliderState, softResetMediaState, sortVideoQualities, updateSliderPreviewPlacement, updateTimeIntervals, usePlyrLayoutClasses, watchActiveTextTrack };
