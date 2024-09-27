import { listenEvent, effect, untrack, createScope, keysOf, onDispose, DOMEvent, peek } from '../chunks/vidstack-CRlI3Mh7.js';
import { TimeRange } from '../chunks/vidstack-BmMUBVGQ.js';
import { RAFLoop } from '../chunks/vidstack-DSYpsFWk.js';
import { ListSymbol } from '../chunks/vidstack-D5EzK014.js';
import { getCastSessionMedia, getCastContext, getCastSession, hasActiveCastSession, listenCastContextEvent, getCastErrorMessage } from '../chunks/vidstack-IHrfMzpQ.js';

class GoogleCastMediaInfoBuilder {
  #info;
  constructor(src) {
    this.#info = new chrome.cast.media.MediaInfo(src.src, src.type);
  }
  build() {
    return this.#info;
  }
  setStreamType(streamType) {
    if (streamType.includes("live")) {
      this.#info.streamType = chrome.cast.media.StreamType.LIVE;
    } else {
      this.#info.streamType = chrome.cast.media.StreamType.BUFFERED;
    }
    return this;
  }
  setTracks(tracks) {
    this.#info.tracks = tracks.map(this.#buildCastTrack);
    return this;
  }
  setMetadata(title, poster) {
    this.#info.metadata = new chrome.cast.media.GenericMediaMetadata();
    this.#info.metadata.title = title;
    this.#info.metadata.images = [{ url: poster }];
    return this;
  }
  #buildCastTrack(track, trackId) {
    const castTrack = new chrome.cast.media.Track(trackId, chrome.cast.media.TrackType.TEXT);
    castTrack.name = track.label;
    castTrack.trackContentId = track.src;
    castTrack.trackContentType = "text/vtt";
    castTrack.language = track.language;
    castTrack.subtype = track.kind.toUpperCase();
    return castTrack;
  }
}

const REMOTE_TRACK_TEXT_TYPE = chrome.cast.media.TrackType.TEXT, REMOTE_TRACK_AUDIO_TYPE = chrome.cast.media.TrackType.AUDIO;
class GoogleCastTracksManager {
  #cast;
  #ctx;
  #onNewLocalTracks;
  constructor(cast, ctx, onNewLocalTracks) {
    this.#cast = cast;
    this.#ctx = ctx;
    this.#onNewLocalTracks = onNewLocalTracks;
  }
  setup() {
    const syncRemoteActiveIds = this.syncRemoteActiveIds.bind(this);
    listenEvent(this.#ctx.audioTracks, "change", syncRemoteActiveIds);
    listenEvent(this.#ctx.textTracks, "mode-change", syncRemoteActiveIds);
    effect(this.#syncLocalTracks.bind(this));
  }
  getLocalTextTracks() {
    return this.#ctx.$state.textTracks().filter((track) => track.src && track.type === "vtt");
  }
  #getLocalAudioTracks() {
    return this.#ctx.$state.audioTracks();
  }
  #getRemoteTracks(type) {
    const tracks = this.#cast.mediaInfo?.tracks ?? [];
    return type ? tracks.filter((track) => track.type === type) : tracks;
  }
  #getRemoteActiveIds() {
    const activeIds = [], activeLocalAudioTrack = this.#getLocalAudioTracks().find((track) => track.selected), activeLocalTextTracks = this.getLocalTextTracks().filter((track) => track.mode === "showing");
    if (activeLocalAudioTrack) {
      const remoteAudioTracks = this.#getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE), remoteAudioTrack = this.#findRemoteTrack(remoteAudioTracks, activeLocalAudioTrack);
      if (remoteAudioTrack) activeIds.push(remoteAudioTrack.trackId);
    }
    if (activeLocalTextTracks?.length) {
      const remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
      if (remoteTextTracks.length) {
        for (const localTrack of activeLocalTextTracks) {
          const remoteTextTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
          if (remoteTextTrack) activeIds.push(remoteTextTrack.trackId);
        }
      }
    }
    return activeIds;
  }
  #syncLocalTracks() {
    const localTextTracks = this.getLocalTextTracks();
    if (!this.#cast.isMediaLoaded) return;
    const remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
    for (const localTrack of localTextTracks) {
      const hasRemoteTrack = this.#findRemoteTrack(remoteTextTracks, localTrack);
      if (!hasRemoteTrack) {
        untrack(() => this.#onNewLocalTracks?.());
        break;
      }
    }
  }
  syncRemoteTracks(event) {
    if (!this.#cast.isMediaLoaded) return;
    const localAudioTracks = this.#getLocalAudioTracks(), localTextTracks = this.getLocalTextTracks(), remoteAudioTracks = this.#getRemoteTracks(REMOTE_TRACK_AUDIO_TYPE), remoteTextTracks = this.#getRemoteTracks(REMOTE_TRACK_TEXT_TYPE);
    for (const remoteAudioTrack of remoteAudioTracks) {
      const hasLocalTrack = this.#findLocalTrack(localAudioTracks, remoteAudioTrack);
      if (hasLocalTrack) continue;
      const localAudioTrack = {
        id: remoteAudioTrack.trackId.toString(),
        label: remoteAudioTrack.name,
        language: remoteAudioTrack.language,
        kind: remoteAudioTrack.subtype ?? "main",
        selected: false
      };
      this.#ctx.audioTracks[ListSymbol.add](localAudioTrack, event);
    }
    for (const remoteTextTrack of remoteTextTracks) {
      const hasLocalTrack = this.#findLocalTrack(localTextTracks, remoteTextTrack);
      if (hasLocalTrack) continue;
      const localTextTrack = {
        id: remoteTextTrack.trackId.toString(),
        src: remoteTextTrack.trackContentId,
        label: remoteTextTrack.name,
        language: remoteTextTrack.language,
        kind: remoteTextTrack.subtype.toLowerCase()
      };
      this.#ctx.textTracks.add(localTextTrack, event);
    }
  }
  syncRemoteActiveIds(event) {
    if (!this.#cast.isMediaLoaded) return;
    const activeIds = this.#getRemoteActiveIds(), editRequest = new chrome.cast.media.EditTracksInfoRequest(activeIds);
    this.#editTracksInfo(editRequest).catch((error) => {
    });
  }
  #editTracksInfo(request) {
    const media = getCastSessionMedia();
    return new Promise((resolve, reject) => media?.editTracksInfo(request, resolve, reject));
  }
  #findLocalTrack(localTracks, remoteTrack) {
    return localTracks.find((localTrack) => this.#isMatch(localTrack, remoteTrack));
  }
  #findRemoteTrack(remoteTracks, localTrack) {
    return remoteTracks.find((remoteTrack) => this.#isMatch(localTrack, remoteTrack));
  }
  // Note: we can't rely on id matching because they will differ between local/remote. A local
  // track id might not even exist.
  #isMatch(localTrack, remoteTrack) {
    return remoteTrack.name === localTrack.label && remoteTrack.language === localTrack.language && remoteTrack.subtype.toLowerCase() === localTrack.kind.toLowerCase();
  }
}

class GoogleCastProvider {
  $$PROVIDER_TYPE = "GOOGLE_CAST";
  scope = createScope();
  #player;
  #ctx;
  #tracks;
  #currentSrc = null;
  #state = "disconnected";
  #currentTime = 0;
  #played = 0;
  #seekableRange = new TimeRange(0, 0);
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #playerEventHandlers;
  #reloadInfo = null;
  #isIdle = false;
  constructor(player, ctx) {
    this.#player = player;
    this.#ctx = ctx;
    this.#tracks = new GoogleCastTracksManager(player, ctx, this.#onNewLocalTracks.bind(this));
  }
  get type() {
    return "google-cast";
  }
  get currentSrc() {
    return this.#currentSrc;
  }
  /**
   * The Google Cast remote player.
   *
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.RemotePlayer}
   */
  get player() {
    return this.#player;
  }
  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
   */
  get cast() {
    return getCastContext();
  }
  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastSession}
   */
  get session() {
    return getCastSession();
  }
  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media.Media}
   */
  get media() {
    return getCastSessionMedia();
  }
  /**
   * Whether the current Google Cast session belongs to this provider.
   */
  get hasActiveSession() {
    return hasActiveCastSession(this.#currentSrc);
  }
  setup() {
    this.#attachCastContextEventListeners();
    this.#attachCastPlayerEventListeners();
    this.#tracks.setup();
    this.#ctx.notify("provider-setup", this);
  }
  #attachCastContextEventListeners() {
    listenCastContextEvent(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this.#onCastStateChange.bind(this)
    );
  }
  #attachCastPlayerEventListeners() {
    const Event2 = cast.framework.RemotePlayerEventType, handlers = {
      [Event2.IS_CONNECTED_CHANGED]: this.#onCastStateChange,
      [Event2.IS_MEDIA_LOADED_CHANGED]: this.#onMediaLoadedChange,
      [Event2.CAN_CONTROL_VOLUME_CHANGED]: this.#onCanControlVolumeChange,
      [Event2.CAN_SEEK_CHANGED]: this.#onCanSeekChange,
      [Event2.DURATION_CHANGED]: this.#onDurationChange,
      [Event2.IS_MUTED_CHANGED]: this.#onVolumeChange,
      [Event2.VOLUME_LEVEL_CHANGED]: this.#onVolumeChange,
      [Event2.IS_PAUSED_CHANGED]: this.#onPausedChange,
      [Event2.LIVE_SEEKABLE_RANGE_CHANGED]: this.#onProgress,
      [Event2.PLAYER_STATE_CHANGED]: this.#onPlayerStateChange
    };
    this.#playerEventHandlers = handlers;
    const handler = this.#onRemotePlayerEvent.bind(this);
    for (const type of keysOf(handlers)) {
      this.#player.controller.addEventListener(type, handler);
    }
    onDispose(() => {
      for (const type of keysOf(handlers)) {
        this.#player.controller.removeEventListener(type, handler);
      }
    });
  }
  async play() {
    if (!this.#player.isPaused && !this.#isIdle) return;
    if (this.#isIdle) {
      await this.#reload(false, 0);
      return;
    }
    this.#player.controller?.playOrPause();
  }
  async pause() {
    if (this.#player.isPaused) return;
    this.#player.controller?.playOrPause();
  }
  getMediaStatus(request) {
    return new Promise((resolve, reject) => {
      this.media?.getStatus(request, resolve, reject);
    });
  }
  setMuted(muted) {
    const hasChanged = muted && !this.#player.isMuted || !muted && this.#player.isMuted;
    if (hasChanged) this.#player.controller?.muteOrUnmute();
  }
  setCurrentTime(time) {
    this.#player.currentTime = time;
    this.#ctx.notify("seeking", time);
    this.#player.controller?.seek();
  }
  setVolume(volume) {
    this.#player.volumeLevel = volume;
    this.#player.controller?.setVolumeLevel();
  }
  async loadSource(src) {
    if (this.#reloadInfo?.src !== src) this.#reloadInfo = null;
    if (hasActiveCastSession(src)) {
      this.#resumeSession();
      this.#currentSrc = src;
      return;
    }
    this.#ctx.notify("load-start");
    const loadRequest = this.#buildLoadRequest(src), errorCode = await this.session.loadMedia(loadRequest);
    if (errorCode) {
      this.#currentSrc = null;
      this.#ctx.notify("error", Error(getCastErrorMessage(errorCode)));
      return;
    }
    this.#currentSrc = src;
  }
  destroy() {
    this.#reset();
    this.#endSession();
  }
  #reset() {
    if (!this.#reloadInfo) {
      this.#played = 0;
      this.#seekableRange = new TimeRange(0, 0);
    }
    this.#timeRAF.stop();
    this.#currentTime = 0;
    this.#reloadInfo = null;
  }
  #resumeSession() {
    const resumeSessionEvent = new DOMEvent("resume-session", { detail: this.session });
    this.#onMediaLoadedChange(resumeSessionEvent);
    const { muted, volume, savedState } = this.#ctx.$state, localState = savedState();
    this.setCurrentTime(Math.max(this.#player.currentTime, localState?.currentTime ?? 0));
    this.setMuted(muted());
    this.setVolume(volume());
    if (localState?.paused === false) this.play();
  }
  #endSession() {
    this.cast.endCurrentSession(true);
    const { remotePlaybackLoader } = this.#ctx.$state;
    remotePlaybackLoader.set(null);
  }
  #disconnectFromReceiver() {
    const { savedState } = this.#ctx.$state;
    savedState.set({
      paused: this.#player.isPaused,
      currentTime: this.#player.currentTime
    });
    this.#endSession();
  }
  #onAnimationFrame() {
    this.#onCurrentTimeChange();
  }
  #onRemotePlayerEvent(event) {
    this.#playerEventHandlers[event.type].call(this, event);
  }
  #onCastStateChange(data) {
    const castState = this.cast.getCastState(), state = castState === cast.framework.CastState.CONNECTED ? "connected" : castState === cast.framework.CastState.CONNECTING ? "connecting" : "disconnected";
    if (this.#state === state) return;
    const detail = { type: "google-cast", state }, trigger = this.#createEvent(data);
    this.#state = state;
    this.#ctx.notify("remote-playback-change", detail, trigger);
    if (state === "disconnected") {
      this.#disconnectFromReceiver();
    }
  }
  #onMediaLoadedChange(event) {
    const hasLoaded = !!this.#player.isMediaLoaded;
    if (!hasLoaded) return;
    const src = peek(this.#ctx.$state.source);
    Promise.resolve().then(() => {
      if (src !== peek(this.#ctx.$state.source) || !this.#player.isMediaLoaded) return;
      this.#reset();
      const duration = this.#player.duration;
      this.#seekableRange = new TimeRange(0, duration);
      const detail = {
        provider: this,
        duration,
        buffered: new TimeRange(0, 0),
        seekable: this.#getSeekableRange()
      }, trigger = this.#createEvent(event);
      this.#ctx.notify("loaded-metadata", void 0, trigger);
      this.#ctx.notify("loaded-data", void 0, trigger);
      this.#ctx.notify("can-play", detail, trigger);
      this.#onCanControlVolumeChange();
      this.#onCanSeekChange(event);
      const { volume, muted } = this.#ctx.$state;
      this.setVolume(volume());
      this.setMuted(muted());
      this.#timeRAF.start();
      this.#tracks.syncRemoteTracks(trigger);
      this.#tracks.syncRemoteActiveIds(trigger);
    });
  }
  #onCanControlVolumeChange() {
    this.#ctx.$state.canSetVolume.set(this.#player.canControlVolume);
  }
  #onCanSeekChange(event) {
    const trigger = this.#createEvent(event);
    this.#ctx.notify("stream-type-change", this.#getStreamType(), trigger);
  }
  #getStreamType() {
    const streamType = this.#player.mediaInfo?.streamType;
    return streamType === chrome.cast.media.StreamType.LIVE ? this.#player.canSeek ? "live:dvr" : "live" : "on-demand";
  }
  #onCurrentTimeChange() {
    if (this.#reloadInfo) return;
    const currentTime = this.#player.currentTime;
    if (currentTime === this.#currentTime) return;
    this.#ctx.notify("time-change", currentTime);
    if (currentTime > this.#played) {
      this.#played = currentTime;
      this.#onProgress();
    }
    if (this.#ctx.$state.seeking()) {
      this.#ctx.notify("seeked", currentTime);
    }
    this.#currentTime = currentTime;
  }
  #onDurationChange(event) {
    if (!this.#player.isMediaLoaded || this.#reloadInfo) return;
    const duration = this.#player.duration, trigger = this.#createEvent(event);
    this.#seekableRange = new TimeRange(0, duration);
    this.#ctx.notify("duration-change", duration, trigger);
  }
  #onVolumeChange(event) {
    if (!this.#player.isMediaLoaded) return;
    const detail = {
      muted: this.#player.isMuted,
      volume: this.#player.volumeLevel
    }, trigger = this.#createEvent(event);
    this.#ctx.notify("volume-change", detail, trigger);
  }
  #onPausedChange(event) {
    const trigger = this.#createEvent(event);
    if (this.#player.isPaused) {
      this.#ctx.notify("pause", void 0, trigger);
    } else {
      this.#ctx.notify("play", void 0, trigger);
    }
  }
  #onProgress(event) {
    const detail = {
      seekable: this.#getSeekableRange(),
      buffered: new TimeRange(0, this.#played)
    }, trigger = event ? this.#createEvent(event) : void 0;
    this.#ctx.notify("progress", detail, trigger);
  }
  #onPlayerStateChange(event) {
    const state = this.#player.playerState, PlayerState = chrome.cast.media.PlayerState;
    this.#isIdle = state === PlayerState.IDLE;
    if (state === PlayerState.PAUSED) return;
    const trigger = this.#createEvent(event);
    switch (state) {
      case PlayerState.PLAYING:
        this.#ctx.notify("playing", void 0, trigger);
        break;
      case PlayerState.BUFFERING:
        this.#ctx.notify("waiting", void 0, trigger);
        break;
      case PlayerState.IDLE:
        this.#timeRAF.stop();
        this.#ctx.notify("pause");
        this.#ctx.notify("end");
        break;
    }
  }
  #getSeekableRange() {
    return this.#player.liveSeekableRange ? new TimeRange(this.#player.liveSeekableRange.start, this.#player.liveSeekableRange.end) : this.#seekableRange;
  }
  #createEvent(detail) {
    return detail instanceof Event ? detail : new DOMEvent(detail.type, { detail });
  }
  #buildMediaInfo(src) {
    const { streamType, title, poster } = this.#ctx.$state;
    return new GoogleCastMediaInfoBuilder(src).setMetadata(title(), poster()).setStreamType(streamType()).setTracks(this.#tracks.getLocalTextTracks()).build();
  }
  #buildLoadRequest(src) {
    const mediaInfo = this.#buildMediaInfo(src), request = new chrome.cast.media.LoadRequest(mediaInfo), savedState = this.#ctx.$state.savedState();
    request.autoplay = (this.#reloadInfo?.paused ?? savedState?.paused) === false;
    request.currentTime = this.#reloadInfo?.time ?? savedState?.currentTime ?? 0;
    return request;
  }
  async #reload(paused, time) {
    const src = peek(this.#ctx.$state.source);
    this.#reloadInfo = { src, paused, time };
    await this.loadSource(src);
  }
  #onNewLocalTracks() {
    this.#reload(this.#player.isPaused, this.#player.currentTime).catch((error) => {
    });
  }
}

export { GoogleCastProvider };
