import { useCallback, useEffect, useState } from "react";
import defaultServices from "../data/services";
import { DATA_EVENT, readJson, SERVICES_KEY, writeJson } from "../utils/storage";

const loadServices = () => {
  const saved = readJson(SERVICES_KEY, null);
  if (saved === null) {
    writeJson(SERVICES_KEY, defaultServices);
    return defaultServices;
  }
  return saved;
};

export default function useServices() {
  const [services, setServices] = useState(loadServices);
  const refresh = useCallback(() => setServices(loadServices()), []);

  useEffect(() => {
    const sync = (event) => (!event.key || event.key === SERVICES_KEY) && refresh();
    window.addEventListener("storage", sync);
    window.addEventListener(DATA_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(DATA_EVENT, sync);
    };
  }, [refresh]);

  return services;
}
