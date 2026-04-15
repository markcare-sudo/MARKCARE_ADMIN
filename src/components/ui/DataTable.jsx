const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="bg-white rounded shadow-sm overflow-visible">

      {/* SCROLL CONTAINER */}
      <div className="overflow-x-auto overflow-y-visible relative">
        <table className="min-w-[800px] w-full text-left">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="p-4 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-4 text-sm whitespace-nowrap relative"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default DataTable;