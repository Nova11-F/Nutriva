export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export function loadTable(key, initialData) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    //
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

export function saveTable(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}