const SectionHeader = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;