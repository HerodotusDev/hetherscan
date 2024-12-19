type HerodotusSingleton = {
  destinationChain: string;
  apiKey: string;
  // Add other properties as needed
};

// Setter function to save data to Chrome storage
export function setHerodotusData(data: HerodotusSingleton): void {
  chrome.storage.local.set({ herodotus: data });
}

// Modified getter to use a callback
export function getHerodotusData(
  callback: (data: HerodotusSingleton | undefined) => void
): void {
  chrome.storage.local.get("herodotus", (result) => {
    callback(result.herodotus);
  });
}
