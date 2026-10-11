import { useContext } from "react";
import { ChildContext } from "../context/ChildContext";

export function useChild() {
  const context = useContext(ChildContext);
  if (!context) throw new Error("useChild harus dipakai di dalam ChildProvider");
  return context;
}