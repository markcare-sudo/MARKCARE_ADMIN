import Card from "./Card";

const SectionCard = ({ title, action, children }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {action}
      </div>

      {children}
    </Card>
  );
};

export default SectionCard;