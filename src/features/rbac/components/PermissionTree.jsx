// import PermissionModule from "./PermissionModule";

// const PermissionTree = ({ tree, permissions, setPermissions }) => {

//   const togglePermission = (id) => {

//     const updated = new Set(permissions);

//     updated.has(id)
//       ? updated.delete(id)
//       : updated.add(id);

//     setPermissions([...updated]);
//   };

//   return (
//     <div className="space-y-6">

//       {tree?.map((module) => (
//         <PermissionModule
//           key={module.code}
//           module={module}
//           permissions={permissions}
//           togglePermission={togglePermission}
//           setPermissions={setPermissions}
//         />
//       ))}

//     </div>
//   );
// };

// export default PermissionTree;




import PermissionModule from "./PermissionModule";

const PermissionTree = ({ tree, permissions, setPermissions }) => {

  const togglePermission = (id) => {

    const updated = new Set(permissions);

    updated.has(id)
      ? updated.delete(id)
      : updated.add(id);

    setPermissions([...updated]);
  };

  return (
    <div className="space-y-6">

      {tree?.map((module) => (
        <PermissionModule
          key={module.code}
          module={module}
          permissions={permissions}
          togglePermission={togglePermission}
          setPermissions={setPermissions}
        />
      ))}

    </div>
  );
};

export default PermissionTree;