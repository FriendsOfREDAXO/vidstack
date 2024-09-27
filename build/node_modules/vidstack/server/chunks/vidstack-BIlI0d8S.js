import { IS_CHROME, loadScript } from './vidstack-ffopCUPo.js';
import { peek } from './vidstack-1-opvwuv.js';

function getCastFrameworkURL() {
  return "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
}
function hasLoadedCastFramework() {
  return !!window.cast?.framework;
}
function isCastAvailable() {
  return !!window.chrome?.cast?.isAvailable;
}
function isCastConnected() {
  return getCastContext().getCastState() === cast.framework.CastState.CONNECTED;
}
function getCastContext() {
  return window.cast.framework.CastContext.getInstance();
}
function getCastSession() {
  return getCastContext().getCurrentSession();
}
function getDefaultCastOptions() {
  return {
    language: "en-US",
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    resumeSavedSession: true,
    androidReceiverCompatible: true
  };
}
function getCastErrorMessage(code) {
  const defaultMessage = `Google Cast Error Code: ${code}`;
  return defaultMessage;
}

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
    return IS_CHROME;
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
    {
      throw Error("[vidstack] can not load google cast provider server-side");
    }
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
