const PermissionMatrix = ({
  parent,
  children = [],
  permissions,
  togglePermission,
  setPermissions,
}) => {

  // 🔥 Collect all permission IDs
  const allPermissionIds = [
    ...(parent.permissions || []).map(p => p.id),
    ...children.flatMap(c => (c.permissions || []).map(p => p.id))
  ];

  const isAllSelected =
    allPermissionIds.length > 0 &&
    allPermissionIds.every(id => permissions.includes(id));

  const toggleAll = () => {
    const updated = new Set(permissions);

    if (isAllSelected) {
      allPermissionIds.forEach(id => updated.delete(id));
    } else {
      allPermissionIds.forEach(id => updated.add(id));
    }

    setPermissions([...updated]);
  };

  // 🔥 Render row
  const renderRow = (module) => {
    const actionMap = {};
    module.permissions?.forEach(p => {
      actionMap[p.action] = p.id;
    });

    return (
      <tr key={module.id} className="border-t hover:bg-gray-50">
        <td className="p-3 font-medium text-gray-700">
          {module.name}
        </td>

        {["READ", "WRITE", "UPDATE", "DELETE"].map((action) => {
          const id = actionMap[action];

          return (
            <td key={action} className="text-center p-3">
              {id ? (
                <input
                  type="checkbox"
                  className="w-4 cursor-pointer h-4 accent-blue-600"
                  checked={permissions.includes(id)}
                  onChange={() => togglePermission(id)}
                />
              ) : (
                "-"
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="border rounded overflow-hidden shadow-sm">

      {/* 🔥 SECTION HEADER (LIKE IMAGE) */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#063C66] text-white">
        <span className="font-semibold uppercase text-sm">
          {parent.name}
        </span>

        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer accent-white"
          checked={isAllSelected}
          onChange={toggleAll}
        />
      </div>

      {/* 🔥 TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-xs uppercase border-b">
          <tr>
            <th className="text-left p-3 w-[40%]">Module</th>
            <th className="text-center">Read</th>
            <th className="text-center">Write</th>
            <th className="text-center">Update</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>

        <tbody>
          {/* 🔥 If no children → show parent */}
          {children.length === 0
            ? renderRow(parent)
            : children.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;