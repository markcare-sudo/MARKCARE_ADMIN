
import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboard.service";

const useDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
};

export default useDashboard;