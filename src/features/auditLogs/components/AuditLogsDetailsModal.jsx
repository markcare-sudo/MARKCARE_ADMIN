import ConfirmDialog from "@/components/ui/ConfirmDialog";

const AuditLogDetailsModal = ({ log, onClose }) => {

  if (!log) return null;

  return (
    <ConfirmDialog
      open={true}
      title="Audit Log Details"
      confirmText="Close"
      cancelText={null}
      onConfirm={onClose}
    >

      <div className="space-y-4 text-sm">

        <div>
          <b>Module:</b> {log.module}
        </div>

        <div>
          <b>Action:</b> {log.action}
        </div>

        <div>
          <b>Description:</b> {log.description}
        </div>

        <div>
          <b>IP Address:</b> {log.ip_address}
        </div>

        <div>
          <b>User Agent:</b> {log.user_agent}
        </div>

        <div>
          <b>Old Values</b>

          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(log.old_values, null, 2)}
          </pre>
        </div>

        <div>
          <b>New Values</b>

          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(log.new_values, null, 2)}
          </pre>
        </div>

      </div>

    </ConfirmDialog>
  );
};

export default AuditLogDetailsModal;