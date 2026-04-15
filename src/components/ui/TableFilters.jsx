import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const TableFilters = ({
    onFilterChange,
    fields = [],
    initialFilters = {},
    searchPlaceholder = "Search..."
}) => {

    const [filters, setFilters] = useState(initialFilters);

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const isFirstRender = useRef(true);

    // Debounce API call
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => clearTimeout(timer);

    }, [filters, onFilterChange]);

    const handleClear = () => {
        setFilters(initialFilters);
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded border border-gray-100 shadow-sm mb-6">

            {/* Global Search */}
            {filters.search !== undefined && (
                <div className="w-full">
                    <Input
                        placeholder={searchPlaceholder}
                        value={filters.search || ""}
                        onChange={(e) => handleChange("search", e.target.value)}
                    />
                </div>
            )}

            {/* Dynamic Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">

                {fields.map((field) => {

                    if (field.type === "input") {
                        return (
                            <Input
                                key={field.name}
                                type={field.inputType || "text"}
                                label={field.label}
                                placeholder={field.placeholder}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                    handleChange(field.name, e.target.value)
                                }
                            />
                        );
                    }

                    if (field.type === "select") {
                        return (
                            <Select
                                key={field.name}
                                label={field.label}
                                options={field.options || []}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                    handleChange(field.name, e.target.value)
                                }
                            />
                        );
                    }

                    return null;
                })}

            </div>

            {/* Clear Filters */}
            <div className="flex justify-end mt-2">
                <Button variant="outline" size="md" onClick={handleClear}>
                    Clear All Filters
                </Button>
            </div>

        </div>
    );
};

export default TableFilters;