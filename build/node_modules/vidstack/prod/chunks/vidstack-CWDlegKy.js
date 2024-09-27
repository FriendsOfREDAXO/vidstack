import { IS_CHROME, IS_IOS, canGoogleCastSrc } from './vidstack-DwhHIY5e.js';
import { loadScript } from './vidstack-A9j--j6J.js';
import { getCastContext, getCastSession, isCastConnected, hasLoadedCastFramework, getCastFrameworkURL, isCastAvailable, getCastErrorMessage, getDefaultCastOptions } from './vidstack-IHrfMzpQ.js';
import { peek } from './vidstack-CRlI3Mh7.js';

class GoogleCastLoader {
  name = "google-cast";
  target;
  #player;
  /**
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext}
   */
  get cast() {
    return getCastContext();
  }
  mediaType() {
    return "video";
  }
  canPlay(src) {
    return IS_CHROME && !IS_IOS && canGoogleCastSrc(src);
  }
  async prompt(ctx) {
    let loadEvent, openEvent, errorEvent;
    try {
      loadEvent = await this.#loadCastFramework(ctx);
      if (!this.#player) {
        this.#player = new cast.framework.RemotePlayer();
        new cast.framework.RemotePlayerController(this.#player);
      }
      openEvent = ctx.player.createEvent("google-cast-prompt-open", {
        trigger: loadEvent
      });
      ctx.player.dispatchEvent(openEvent);
      this.#notifyRemoteStateChange(ctx, "connecting", openEvent);
      await this.#showPrompt(peek(ctx.$props.googleCast));
      ctx.$state.remotePlaybackInfo.set({
        deviceName: getCastSession()?.getCastDevice().friendlyName
      });
      if (isCastConnected()) this.#notifyRemoteStateChange(ctx, "connected", openEvent);
    } catch (code) {
      const error = code instanceof Error ? code : this.#createError(
        (code + "").toUpperCase(),
        "Prompt failed."
      );
      errorEvent = ctx.player.createEvent("google-cast-prompt-error", {
        detail: error,
        trigger: openEvent ?? loadEvent,
        cancelable: true
      });
      ctx.player.dispatch(errorEvent);
      this.#notifyRemoteStateChange(
        ctx,
        isCastConnected() ? "connected" : "disconnected",
        errorEvent
      );
      throw error;
    } finally {
      ctx.player.dispatch("google-cast-prompt-close", {
        trigger: errorEvent ?? openEvent ?? loadEvent
      });
    }
  }
  async load(ctx) {
    if (!this.#player) {
      throw Error("[vidstack] google cast player was not initialized");
    }
    return new (await import('../providers/vidstack-google-cast.js')).GoogleCastProvider(this.#player, ctx);
  }
  async #loadCastFramework(ctx) {
    if (hasLoadedCastFramework()) return;
    const loadStartEvent = ctx.player.createEvent("google-cast-load-start");
    ctx.player.dispatch(loadStartEvent);
    await loadScript(getCastFrameworkURL());
    await customElements.whenDefined("google-cast-launcher");
    const loadedEvent = ctx.player.createEvent("google-cast-loaded", { trigger: loadStartEvent });
    ctx.player.dispatch(loadedEvent);
    if (!isCastAvailable()) {
      throw this.#createError("CAST_NOT_AVAILABLE", "Google Cast not available on this platform.");
    }
    return loadedEvent;
  }
  async #showPrompt(options) {
    this.#setOptions(options);
    const errorCode = await this.cast.requestSession();
    if (errorCode) {
      throw this.#createError(
        errorCode.toUpperCase(),
        getCastErrorMessage(errorCode)
      );
    }
  }
  #setOptions(options) {
    this.cast?.setOptions({
      ...getDefaultCastOptions(),
      ...options
    });
  }
  #notifyRemoteStateChange(ctx, state, trigger) {
    const detail = { type: "google-cast", state };
    ctx.notify("remote-playback-change", detail, trigger);
  }
  #createError(code, message) {
    const error = Error(message);
    error.code = code;
    return error;
  }
}

export { GoogleCastLoader };
