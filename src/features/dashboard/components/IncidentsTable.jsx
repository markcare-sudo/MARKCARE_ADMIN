import DataTable from "@/components/ui/DataTable";
import SectionCard from "@/components/ui/SectionCard";


const IncidentTable = ({ data }) => {
  const columns = ["Date", "Incident", "Impact", "Status"];

  return (
    <SectionCard
      title="Open Incidents"
      action={<button className="text-blue-500">View All →</button>}
    >
      <DataTable columns={columns} data={data} />
    </SectionCard>
  );
};

export default IncidentTable;