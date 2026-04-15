const PermissionModule = ({
  module,
  permissions,
  togglePermission,
  setPermissions
}) => {
  // --- 1. HANDLE HYBRID DATA ---
  // If the module has features, get permissions from all features.
  // If it doesn't, get permissions directly from the module.
  const modulePermissions = module.has_features
    ? module.features?.flatMap(f => f.permissions.map(p => p.id)) || []
    : module.permissions?.map(p => p.id) || [];

  const moduleSelected =
    modulePermissions.length > 0 &&
    modulePermissions.every(p => permissions.includes(p));

  const toggleModule = () => {
    const updated = new Set(permissions);
    if (moduleSelected) {
      modulePermissions.forEach(p => updated.delete(p));
    } else {
      modulePermissions.forEach(p => updated.add(p));
    }
    setPermissions([...updated]);
  };

  // Helper to render a table row for permissions
  const renderPermissionRow = (name, perms, uniqueKey, isFeature = true) => {
    const actionMap = {};
    perms.forEach(p => { actionMap[p.action] = p.id; });

    const rowPermissionIds = perms.map(p => p.id);
    const rowSelected = rowPermissionIds.length > 0 &&
      rowPermissionIds.every(id => permissions.includes(id));

    const toggleRow = () => {
      const updated = new Set(permissions);
      if (rowSelected) {
        rowPermissionIds.forEach(id => updated.delete(id));
      } else {
        rowPermissionIds.forEach(id => updated.add(id));
      }
      setPermissions([...updated]);
    };

    return (
      <tr key={uniqueKey} className="border-t hover:bg-gray-50 transition-colors">
        <td className="p-3 font-medium flex items-center gap-3">
          <span className={isFeature ? "text-gray-700" : "text-blue-700 font-bold"}>
            {name}
          </span>
          <label className="text-[10px] uppercase bg-gray-200 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={rowSelected} onChange={toggleRow} />
            All
          </label>
        </td>
        {["READ", "WRITE", "UPDATE", "DELETE"].map(action => {
          const id = actionMap[action];
          return (
            <td key={action} className="text-center p-3">
              {id ? (
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  checked={permissions.includes(id)}
                  onChange={() => togglePermission(id)}
                />
              ) : <span className="text-gray-300">-</span>}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-sm mb-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#063C66] text-white">
        <div className="font-bold text-xs uppercase tracking-widest">
          {module.name} {module.has_features ? "Module" : "Direct Access"}
        </div>
        <label className="flex gap-2 text-xs items-center cursor-pointer bg-white/10 px-3 py-1 rounded-md hover:bg-white/20">
          <input type="checkbox" checked={moduleSelected} onChange={toggleModule} />
          SELECT ALL
        </label>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-gray-500 font-bold uppercase text-[10px]">Scope</th>
              <th className="p-3 text-gray-500 font-bold uppercase text-[10px]">Read</th>
              <th className="p-3 text-gray-500 font-bold uppercase text-[10px]">Write</th>
              <th className="p-3 text-gray-500 font-bold uppercase text-[10px]">Update</th>
              <th className="p-3 text-gray-500 font-bold uppercase text-[10px]">Delete</th>
            </tr>
          </thead>
          <tbody>
            {module.has_features ? (
              // Case A: Render multiple rows for features
              module.features?.map(f => renderPermissionRow(f.name, f.permissions, f.code, true))
            ) : (
              // Case B: Render one single row for the module direct permissions
              renderPermissionRow("Global Access", module.permissions || [], `direct-${module.id}`, false)
            )}

            {/* Fallback if no data */}
            {(!module.has_features && (!module.permissions || module.permissions.length === 0)) && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-400 italic">No permissions defined</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionModule;