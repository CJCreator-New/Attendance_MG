// Browser compatibility check
export const checkBrowserCompatibility = () => {
  const features = {
    localStorage: typeof Storage !== 'undefined',
    fileReader: typeof FileReader !== 'undefined',
    promises: typeof Promise !== 'undefined',
    fetch: typeof fetch !== 'undefined',
  };

  const unsupported = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  return {
    isSupported: unsupported.length === 0,
    unsupported,
    message: unsupported.length > 0 
      ? `Your browser doesn't support: ${unsupported.join(', ')}. Please use a modern browser.`
      : null
  };
};
