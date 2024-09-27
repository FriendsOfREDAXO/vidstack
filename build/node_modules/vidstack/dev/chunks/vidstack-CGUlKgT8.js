import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { getScope, scoped, onDispose, isDOMNode, isFunction, setAttribute, effect, EventsController, isKeyboardClick, isTouchEvent, setStyle, toggleClass, signal, listenEvent, animationFrameThrottle, computed } from './vidstack-DVpy0IqK.js';

function isEventInside(el, event) {
  const target = event.composedPath()[0];
  return isDOMNode(target) && el.contains(target);
}
const rafJobs = /* @__PURE__ */ new Set();
{
  let processJobs = function() {
    for (const job of rafJobs) {
      try {
        job();
      } catch (e) {
        console.error(`[vidstack] failed job:

${e}`);
      }
    }
    window.requestAnimationFrame(processJobs);
  };
  processJobs();
}
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
  effect(updateAriaDescription);
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
  let scope = getScope(), id = window.requestAnimationFrame(() => {
    scoped(callback, scope);
    id = -1;
  });
  return () => void window.cancelAnimationFrame(id);
}
function cloneTemplate(template, length, onCreate) {
  let current, prev = template, parent = template.parentElement, content = template.content.firstElementChild, elements = [];
  if (!content && template.firstElementChild) {
    template.innerHTML = template.firstElementChild.outerHTML;
    template.firstElementChild.remove();
    content = template.content.firstElementChild;
  }
  if (content?.nodeType !== 1) {
    throw Error("[vidstack] template must contain root element");
  }
  for (let i = 0; i < length; i++) {
    current = document.importNode(content, true);
    onCreate?.(current, i);
    parent.insertBefore(current, prev.nextSibling);
    elements.push(current);
    prev = current;
  }
  onDispose(() => {
    for (let i = 0; i < elements.length; i++) elements[i].remove();
  });
  return elements;
}
function createTemplate(content) {
  const template = document.createElement("template");
  template.innerHTML = content;
  return template.content;
}
function cloneTemplateContent(content) {
  const fragment = content.cloneNode(true);
  return fragment.firstElementChild;
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
function createSlot(name) {
  const slot = document.createElement("slot");
  slot.name = name;
  return slot;
}
function useTransitionActive($el) {
  const $active = signal(false);
  effect(() => {
    const el = $el();
    if (!el) return;
    new EventsController(el).add("transitionstart", () => $active.set(true)).add("transitionend", () => $active.set(false));
  });
  return $active;
}
function useResizeObserver($el, onResize) {
  function onElementChange() {
    const el = $el();
    if (!el) return;
    onResize();
    const observer = new ResizeObserver(animationFrameThrottle(onResize));
    observer.observe(el);
    return () => observer.disconnect();
  }
  effect(onElementChange);
}
function useActive($el) {
  const $isMouseEnter = useMouseEnter($el), $isFocusedIn = useFocusIn($el);
  let prevMouseEnter = false;
  return computed(() => {
    const isMouseEnter = $isMouseEnter();
    if (prevMouseEnter && !isMouseEnter) return false;
    prevMouseEnter = isMouseEnter;
    return isMouseEnter || $isFocusedIn();
  });
}
function useMouseEnter($el) {
  const $isMouseEnter = signal(false);
  effect(() => {
    const el = $el();
    if (!el) {
      $isMouseEnter.set(false);
      return;
    }
    new EventsController(el).add("mouseenter", () => $isMouseEnter.set(true)).add("mouseleave", () => $isMouseEnter.set(false));
  });
  return $isMouseEnter;
}
function useFocusIn($el) {
  const $isFocusIn = signal(false);
  effect(() => {
    const el = $el();
    if (!el) {
      $isFocusIn.set(false);
      return;
    }
    new EventsController(el).add("focusin", () => $isFocusIn.set(true)).add("focusout", () => $isFocusIn.set(false));
  });
  return $isFocusIn;
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}
function useColorSchemePreference() {
  const colorScheme = signal("dark");
  const media = window.matchMedia("(prefers-color-scheme: light)");
  function onChange() {
    colorScheme.set(media.matches ? "light" : "dark");
  }
  onChange();
  listenEvent(media, "change", onChange);
  return colorScheme;
}
function watchColorScheme(el, colorScheme) {
  effect(() => {
    const scheme = colorScheme();
    if (scheme === "system") {
      const preference = useColorSchemePreference();
      effect(() => updateColorScheme(preference()));
      return;
    }
    updateColorScheme(scheme);
  });
  function updateColorScheme(scheme) {
    toggleClass(el, "light", scheme === "light");
    toggleClass(el, "dark", scheme === "dark");
  }
}

export { autoPlacement, cloneTemplate, cloneTemplateContent, createSlot, createTemplate, hasAnimation, isElementParent, isElementVisible, isEventInside, isHTMLElement, isTouchPinchEvent, observeVisibility, onPress, requestScopedAnimationFrame, setARIALabel, setAttributeIfEmpty, useActive, useResizeObserver, useTransitionActive, watchColorScheme };
