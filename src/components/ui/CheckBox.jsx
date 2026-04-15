const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-start justify-between gap-2 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-indigo-600 shrink-0 h-4 w-4 md:h-5 md:w-5"
      />

      <span className="md:whitespace-nowrap text-[12px]">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;