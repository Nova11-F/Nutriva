import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { childService } from "../services/childService";

export const ChildContext = createContext(null);

const ACTIVE_KEY = "nutriva_active_child";
const EMPTY = []; 

export function ChildProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [record, setRecord] = useState({ userId: null, list: EMPTY });
  const [activeId, setActiveId] = useState(
    () => Number(localStorage.getItem(ACTIVE_KEY)) || null
  );

  const childList = record.userId === userId ? record.list : EMPTY;
  const loading = userId !== null && record.userId !== userId;

  const child = childList.find((c) => c.id === activeId) ?? childList[0] ?? null;

  useEffect(() => {
    if (userId === null) return;
    let ignore = false;

    childService
      .getAllByUserId(userId)
      .then((list) => {
        if (!ignore) setRecord({ userId, list });
      })
      .catch(() => {
        if (!ignore) setRecord({ userId, list: EMPTY });
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const selectChild = useCallback((id) => {
    setActiveId(id);
    localStorage.setItem(ACTIVE_KEY, String(id));
  }, []);

  const saveChild = useCallback(
    async (data) => {
      const created = await childService.create(userId, data);
      setRecord((prev) => ({
        userId,
        list: [...(prev.userId === userId ? prev.list : []), created],
      }));
      selectChild(created.id);
      return created;
    },
    [userId, selectChild]
  );

  const updateChild = useCallback(
    async (data, id = child?.id) => {
      const updated = await childService.update(id, data);
      setRecord((prev) => ({
        ...prev,
        list: prev.list.map((c) => (c.id === id ? updated : c)),
      }));
      return updated;
    },
    [child]
  );

  const clearChild = useCallback(
    async (id = child?.id) => {
      await childService.remove(id);
      setRecord((prev) => ({ ...prev, list: prev.list.filter((c) => c.id !== id) }));
    },
    [child]
  );

  const value = useMemo(
    () => ({ child, childList, loading, selectChild, saveChild, updateChild, clearChild }),
    [child, childList, loading, selectChild, saveChild, updateChild, clearChild]
  );

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
}