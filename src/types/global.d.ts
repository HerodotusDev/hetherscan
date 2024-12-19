interface Window {
  routeObserver?: MutationObserver & { lastUrl?: string };
  herodotus: {
    destinationChain?: string;
    apiKey?: string;
  };
}
