interface Window {
  herodotus: {
    destinationChain?: string;
    apiKey?: string;
    routeObserver?: MutationObserver & { lastUrl?: string };
  };
}
