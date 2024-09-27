import { Icon$24, effect } from './vidstack-DVpy0IqK.js';
import { cloneTemplateContent, createTemplate } from './vidstack-CGUlKgT8.js';
import '@floating-ui/dom';

const svgTemplate = /* @__PURE__ */ createTemplate(
  `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"></svg>`
);
function insertContent(container, $state) {
  const icon = cloneTemplateContent(svgTemplate);
  icon.innerHTML = Icon$24;
  container.append(icon);
  const text = document.createElement("span");
  text.classList.add("vds-google-cast-info");
  container.append(text);
  const deviceName = document.createElement("span");
  deviceName.classList.add("vds-google-cast-device-name");
  effect(() => {
    const { remotePlaybackInfo } = $state, info = remotePlaybackInfo();
    if (info?.deviceName) {
      deviceName.textContent = info.deviceName;
      text.append("Google Cast on ", deviceName);
    }
    return () => {
      text.textContent = "";
    };
  });
}

export { insertContent };
