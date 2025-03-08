export async function getItem<T>(key: string): Promise<T> {
  if (chrome && chrome.storage && chrome.storage.local) {
    const value = await chrome.storage.local.get([key]);
    return value && value[key] ? JSON.parse(value[key]) : null;
  }
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem<T>(key: string, value: T) {
  if (chrome && chrome.storage && chrome.storage.local) {
    return await chrome.storage.local.set({ [key]: JSON.stringify(value) });
  }
  return localStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  if (chrome && chrome.storage && chrome.storage.local) {
    return await chrome.storage.local.remove([key]);
  }
  return localStorage.removeItem(key);
}
