type ContractConfig = {
  functionSelector: string;
  functionName: string;
};
type ContractAddress = string;

type HerodotusSingleton = {
  destinationChain: string | undefined;
  apiKey: string | undefined;
  contractConfigs: Record<ContractAddress, ContractConfig>;
};

const defaultHerodotusData: HerodotusSingleton = {
  destinationChain: undefined,
  apiKey: undefined,
  contractConfigs: {},
};

export async function setHerodotusData(
  data: Partial<HerodotusSingleton>
): Promise<void> {
  const currentData = await getHerodotusData();
  const updatedData = { ...currentData, ...data };
  await chrome.storage.local.set({ herodotus: updatedData });
}

export async function getHerodotusData(): Promise<HerodotusSingleton> {
  const result = await chrome.storage.local.get("herodotus");
  return result.herodotus || defaultHerodotusData;
}

export async function deleteHerodotusData(): Promise<void> {
  await chrome.storage.local.remove("herodotus");
}
