import { signal, effect, listenEvent, EventsController } from './vidstack-DVpy0IqK.js';
import './vidstack-uKxEd7nI.js';

class HTMLRemotePlaybackAdapter {
  #media;
  #ctx;
  #state;
  #supported = signal(false);
  get supported() {
    return this.#supported();
  }
  constructor(media, ctx) {
    this.#media = media;
    this.#ctx = ctx;
    this.#setup();
  }
  #setup() {
    if (!this.#media?.remote || !this.canPrompt) return;
    this.#media.remote.watchAvailability((available) => {
      this.#supported.set(available);
    }).catch(() => {
      this.#supported.set(false);
    });
    effect(this.#watchSupported.bind(this));
  }
  #watchSupported() {
    if (!this.#supported()) return;
    const events = ["connecting", "connect", "disconnect"], onStateChange = this.#onStateChange.bind(this);
    onStateChange();
    listenEvent(this.#media, "playing", onStateChange);
    const remoteEvents = new EventsController(this.#media.remote);
    for (const type of events) {
      remoteEvents.add(type, onStateChange);
    }
  }
  async prompt() {
    if (!this.supported) throw Error("Not supported on this platform.");
    if (this.type === "airplay" && this.#media.webkitShowPlaybackTargetPicker) {
      return this.#media.webkitShowPlaybackTargetPicker();
    }
    return this.#media.remote.prompt();
  }
  #onStateChange(event) {
    const state = this.#media.remote.state;
    if (state === this.#state) return;
    const detail = { type: this.type, state };
    this.#ctx.notify("remote-playback-change", detail, event);
    this.#state = state;
  }
}
class HTMLAirPlayAdapter extends HTMLRemotePlaybackAdapter {
  type = "airplay";
  get canPrompt() {
    return "WebKitPlaybackTargetAvailabilityEvent" in window;
  }
}

export { HTMLAirPlayAdapter };
