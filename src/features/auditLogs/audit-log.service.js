import apiClient from "@/utils/api";


const getAuditLogs = async (params = {}) => {
  return await apiClient.get("/audit-logs", { params });
};


const getAuditLogById = async (id) => {
  return await apiClient.get(`/audit-logs/${id}`);
};



const auditLogsService = {
  getAuditLogs,
  getAuditLogById,

};

export default auditLogsService;
