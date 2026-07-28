import { useCallback, useEffect, useState } from "react";
import defaultServices from "../data/services";
import { api } from "../utils/api";

export default function useServices() {
  const [services, setServices] = useState(defaultServices);
  const refresh = useCallback(() => {
    api("/services")
      .then((result) => setServices(result.services))
      .catch(() => setServices(defaultServices));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return services;
}
