import { createContext, useContext } from './vidstack-DVpy0IqK.js';

const mediaContext = createContext();
function useMediaContext() {
  return useContext(mediaContext);
}
function useMediaState() {
  return useMediaContext().$state;
}

export { mediaContext, useMediaContext, useMediaState };
