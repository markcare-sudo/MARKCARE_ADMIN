import { useState, useEffect, useRef } from "react";
import { FiXCircle, FiPlus, FiFilter } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const GenericFilter = ({ fields, onFilterChange, onAdd, addLabel = "Add New" }) => {
    const [filters, setFilters] = useState(() =>
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), { page: 1 })
    );

    const isFirstRender = useRef(true);

    const handleChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleClear = () => {
        const cleared = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), { page: 1 });
        setFilters(cleared);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => onFilterChange(filters), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Check if any filter is currently active to highlight the "Clear" button
    const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== 1);

    return (
        <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded border border-gray-100 shadow-sm mb-4 transition-all">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                        <FiFilter size={18} />
                    </div>
                    <span>Filter Results</span>
                </div>

                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClear}
                            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1"
                        >
                            <FiXCircle /> Reset All
                        </button>
                    )}
                    {onAdd && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onAdd}
                            className="rounded-lg shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
                        >
                            <FiPlus className="mr-2" /> {addLabel}
                        </Button>
                    )}
                </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {fields.map((field) => (
                    <div key={field.name} className="group flex flex-col space-y-1">
                        <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">
                            {field.label}
                        </label>

                        {field.type === "select" ? (
                            <div className="relative">
                                <select
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded px-4 py-2.5 text-sm 
                                             focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 
                                             appearance-none transition-all outline-none cursor-pointer text-gray-700"
                                    value={filters[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                >
                                    <option value="">All {field.label}s</option>
                                    {field.options.map((opt) => {
                                        const val = typeof opt === "object" ? opt.value : opt;
                                        const label = typeof opt === "object" ? opt.label : opt;
                                        return (
                                            <option key={val} value={val}>{label}</option>
                                        );
                                    })}
                                </select>
                                {/* Custom Chevron */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <Input
                                type={field.type || "text"}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                value={filters[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenericFilter;
