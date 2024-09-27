import '@floating-ui/dom';

class VidstackPlayerLayout {
  constructor(props) {
    this.props = props;
  }
  name = "vidstack";
  async load() {
    await import('../define/vidstack-player-default-layout.js');
    await import('../define/vidstack-player-ui.js');
  }
  create() {
    const layouts = [
      document.createElement("media-audio-layout"),
      document.createElement("media-video-layout")
    ];
    if (this.props) {
      for (const [prop, value] of Object.entries(this.props)) {
        for (const el of layouts) el[prop] = value;
      }
    }
    return layouts;
  }
}

class PlyrLayout {
  constructor(props) {
    this.props = props;
  }
  name = "plyr";
  async load() {
    await import('../define/plyr-layout.js');
  }
  create() {
    const layout = document.createElement("media-plyr-layout");
    if (this.props) {
      for (const [prop, value] of Object.entries(this.props)) {
        layout[prop] = value;
      }
    }
    return [layout];
  }
}

class VidstackPlayer {
  static async create({ target, layout, tracks, ...props }) {
    {
      throw Error("[vidstack] can not create player on server.");
    }
  }
}

export { PlyrLayout, VidstackPlayer, VidstackPlayerLayout };
