import { listenEvent } from './vidstack-DVpy0IqK.js';

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
function getCastSessionMedia() {
  return getCastSession()?.getSessionObj().media[0];
}
function hasActiveCastSession(src) {
  const contentId = getCastSessionMedia()?.media.contentId;
  return contentId === src?.src;
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
  {
    switch (code) {
      case chrome.cast.ErrorCode.API_NOT_INITIALIZED:
        return "The API is not initialized.";
      case chrome.cast.ErrorCode.CANCEL:
        return "The operation was canceled by the user";
      case chrome.cast.ErrorCode.CHANNEL_ERROR:
        return "A channel to the receiver is not available.";
      case chrome.cast.ErrorCode.EXTENSION_MISSING:
        return "The Cast extension is not available.";
      case chrome.cast.ErrorCode.INVALID_PARAMETER:
        return "The parameters to the operation were not valid.";
      case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE:
        return "No receiver was compatible with the session request.";
      case chrome.cast.ErrorCode.SESSION_ERROR:
        return "A session could not be created, or a session was invalid.";
      case chrome.cast.ErrorCode.TIMEOUT:
        return "The operation timed out.";
      default:
        return defaultMessage;
    }
  }
}
function listenCastContextEvent(type, handler) {
  return listenEvent(getCastContext(), type, handler);
}

export { getCastContext, getCastErrorMessage, getCastFrameworkURL, getCastSession, getCastSessionMedia, getDefaultCastOptions, hasActiveCastSession, hasLoadedCastFramework, isCastAvailable, isCastConnected, listenCastContextEvent };
