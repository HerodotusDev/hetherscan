type HerodotusSingleton = {
  destinationChain: string;
  apiKey: string;
  // Add other properties as needed
};

// Setter function to save data to Chrome storage
export async function setHerodotusData(
  data: HerodotusSingleton
): Promise<void> {
  await chrome.storage.local.set({ herodotus: data });
}

// Modified getter to use a callback
export async function getHerodotusData(): Promise<
  HerodotusSingleton | undefined
> {
  const result = await chrome.storage.local.get("herodotus");
  return result.herodotus;
}
