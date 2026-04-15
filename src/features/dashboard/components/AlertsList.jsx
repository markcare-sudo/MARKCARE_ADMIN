import SectionCard from "@/components/ui/SectionCard";

const AlertsList = ({ alerts }) => {
  return (
    <SectionCard title="Recent Alerts" action={<button>View All →</button>}>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              {alert.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-gray-400">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default AlertsList;