import PermissionMatrix from "./PermissionModule";

const PermissionTree = ({ tree = [], permissions = [], setPermissions }) => {

  const togglePermission = (id) => {
    if (!id) return;

    const updated = new Set(permissions);

    updated.has(id)
      ? updated.delete(id)
      : updated.add(id);

    setPermissions([...updated]);
  };

  // 🔥 GROUP ROOT + CHILDREN
  const rootModules = tree.filter(m => !m.parent_id);

  return (
    <div className="space-y-6">
      {rootModules.map((parent) => {
        return (
          <PermissionMatrix
            key={parent.id}
            parent={parent}
            children={parent.children || []}
            permissions={permissions}
            togglePermission={togglePermission}
            setPermissions={setPermissions}
          />
        );
      })}
    </div>
  );
};

export default PermissionTree;