// // src/components/ui/LocationSelector.jsx
// import React, { useMemo } from "react";
// import { Country, State, City } from "country-state-city";

// const LocationSelector = ({ data, onChange, errors = {}, disabled = false }) => {
//     // Memoize lists to prevent unnecessary re-renders when typing in other fields
//     const countries = useMemo(() => Country.getAllCountries(), []);

//     const states = useMemo(() =>
//         data.country ? State.getStatesOfCountry(data.country) : [],
//         [data.country]
//     );

//     const cities = useMemo(() =>
//         (data.country && data.state) ? City.getCitiesOfState(data.country, data.state) : [],
//         [data.country, data.state]
//     );

//     const handleSelectChange = (name, value) => {
//         // Reset child fields when parent changes
//         const updates = { [name]: value };
//         if (name === "country") {
//             updates.state = "";
//             updates.city = "";
//         }
//         if (name === "state") {
//             updates.city = "";
//         }
//         onChange(updates);
//     };

//     const selectClass = (error) => `
//     w-full border rounded px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 
//     ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-indigo-200"}
//     ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
//   `;

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Country */}
//             <div className="flex flex-col gap-1.5">
//                 <label className="text-sm font-medium text-gray-700">Country *</label>
//                 <select
//                     className={selectClass(errors.country)}
//                     value={data.country || ""}
//                     onChange={(e) => handleSelectChange("country", e.target.value)}
//                     disabled={disabled}
//                 >
//                     <option value="">Select Country</option>
//                     {countries.map((c) => (
//                         <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
//                     ))}
//                 </select>
//                 {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
//             </div>

//             {/* State */}
//             <div className="flex flex-col gap-1.5">
//                 <label className="text-sm font-medium text-gray-700">State *</label>
//                 <select
//                     className={selectClass(errors.state)}
//                     value={data.state || ""}
//                     onChange={(e) => handleSelectChange("state", e.target.value)}
//                     disabled={disabled || !states.length}
//                 >
//                     <option value="">{states.length ? "Select State" : "No states available"}</option>
//                     {states.map((s) => (
//                         <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
//                     ))}
//                 </select>
//                 {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
//             </div>

//             {/* City */}
//             <div className="flex flex-col gap-1.5">
//                 <label className="text-sm font-medium text-gray-700">City *</label>
//                 <select
//                     className={selectClass(errors.city)}
//                     value={data.city || ""}
//                     onChange={(e) => handleSelectChange("city", e.target.value)}
//                     disabled={disabled || !cities.length}
//                 >
//                     <option value="">{cities.length ? "Select City" : "No cities available"}</option>
//                     {cities.map((c) => (
//                         <option key={c.name} value={c.name}>{c.name}</option>
//                     ))}
//                 </select>
//                 {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
//             </div>
//         </div>
//     );
// };

// export default LocationSelector;




// src/components/ui/LocationSelector.jsx
import React, { useMemo } from "react";
import { Country, State, City } from "country-state-city";
import Select from "./Select"; // Using your existing component

const LocationSelector = ({ data, onChange, errors = {}, disabled = false }) => {

    // 1. Get all country names
    const countryNames = useMemo(() =>
        Country.getAllCountries().map((c) => c.name),
        []);

    // 2. Find selected country object to fetch states
    const selectedCountryObj = useMemo(() =>
        Country.getAllCountries().find(c => c.name === data.country),
        [data.country]
    );

    const stateNames = useMemo(() =>
        selectedCountryObj
            ? State.getStatesOfCountry(selectedCountryObj.isoCode).map(s => s.name)
            : [],
        [selectedCountryObj]
    );

    // 3. Find selected state object to fetch cities
    const selectedStateObj = useMemo(() =>
        selectedCountryObj && data.state
            ? State.getStatesOfCountry(selectedCountryObj.isoCode).find(s => s.name === data.state)
            : null,
        [selectedCountryObj, data.state]
    );

    const cityNames = useMemo(() =>
        (selectedCountryObj && selectedStateObj)
            ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode).map(c => c.name)
            : [],
        [selectedCountryObj, selectedStateObj]
    );

    const handleSelectChange = (name, value) => {
        const updates = { [name]: value };
        if (name === "country") {
            updates.state = "";
            updates.city = "";
        }
        if (name === "state") {
            updates.city = "";
        }
        onChange(updates);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
                label="Country"
                value={data.country || ""}
                options={countryNames}
                error={errors.country}
                onChange={(e) => handleSelectChange("country", e.target.value)}
            />

            <Select
                label="State"
                value={data.state || ""}
                options={stateNames}
                error={errors.state}
                disabled={disabled || !stateNames.length}
                onChange={(e) => handleSelectChange("state", e.target.value)}
            />

            <Select
                label="City"
                value={data.city || ""}
                options={cityNames}
                error={errors.city}
                disabled={disabled || !cityNames.length}
                onChange={(e) => handleSelectChange("city", e.target.value)}
            />
        </div>
    );
};

export default LocationSelector;