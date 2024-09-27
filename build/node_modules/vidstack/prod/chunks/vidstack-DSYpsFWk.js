import { isUndefined, isNumber } from './vidstack-CRlI3Mh7.js';

class RAFLoop {
  #id;
  #callback;
  constructor(callback) {
    this.#callback = callback;
  }
  start() {
    if (!isUndefined(this.#id)) return;
    this.#loop();
  }
  stop() {
    if (isNumber(this.#id)) window.cancelAnimationFrame(this.#id);
    this.#id = void 0;
  }
  #loop() {
    this.#id = window.requestAnimationFrame(() => {
      if (isUndefined(this.#id)) return;
      this.#callback();
      this.#loop();
    });
  }
}

export { RAFLoop };
