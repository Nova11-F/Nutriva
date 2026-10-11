import { createContext, useCallback, useState } from "react";

export const ChildContext = createContext(null);

const STORAGE_KEY = "nutriva_child";

function loadChild() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function ChildProvider({ children }) {
  const [child, setChild] = useState(loadChild);

  const saveChild = useCallback((data) => {
    const newChild = { id: Date.now(), ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChild));
    setChild(newChild);
    return newChild;
  }, []);

  const updateChild = useCallback((data) => {
    setChild((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearChild = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChild(null);
  }, []);

  return (
    <ChildContext.Provider value={{ child, saveChild, updateChild, clearChild }}>
      {children}
    </ChildContext.Provider>
  );
}