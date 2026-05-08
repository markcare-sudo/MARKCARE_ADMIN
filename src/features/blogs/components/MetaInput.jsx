// import React, { useState, useMemo, useRef, useEffect } from "react";
// import { X } from "lucide-react";

// const MetaInput = ({ label, items = [], onUpdate, color, allSuggestions = [] }) => {
//     const [input, setInput] = useState("");
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const suggestionRef = useRef(null);

//     const colorClasses = color === "red"
//         ? "bg-red-100 text-red-600 border-red-200"
//         : "bg-blue-100 text-blue-600 border-blue-200";

//     // Filter suggestions based on current input
//     const filteredSuggestions = useMemo(() => {
//         const search = input.toLowerCase().trim();
//         if (!search || !allSuggestions.length) return [];

//         return allSuggestions.filter((s) => {
//             const text = (s?.name || s?.keyword || s).toLowerCase();
//             return text.includes(search) && !items.some(item => item.toLowerCase() === text);
//         }).slice(0, 5);
//     }, [input, allSuggestions, items]);

//     // Handle clicking outside to close dropdown
//     useEffect(() => {
//         const handleClick = (e) => {
//             if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
//                 setShowSuggestions(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClick);
//         return () => document.removeEventListener("mousedown", handleClick);
//     }, []);

//     const addItems = (rawInput) => {
//         const newItems = rawInput.split(",")
//             .map(p => p.trim().toLowerCase())
//             .filter(p => p && !items.includes(p));

//         if (newItems.length > 0) {
//             onUpdate([...items, ...newItems]);
//         }
//         setInput("");
//         setShowSuggestions(false);
//     };

//     const removeItem = (target) => {
//         onUpdate(items.filter(item => item !== target));
//     };

//     return (
//         <div className="space-y-2 relative" ref={suggestionRef}>
//             <label className="text-sm font-semibold text-gray-700">{label}</label>
//             <div className="w-full bg-white border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500">
//                 {items.map((item) => (
//                     <div key={item} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
//                         {item}
//                         <button type="button" onClick={() => removeItem(item)}><X size={12} /></button>
//                     </div>
//                 ))}
//                 <input
//                     value={input}
//                     onFocus={() => setShowSuggestions(true)}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItems(input))}
//                     placeholder={`Add ${label.toLowerCase()}...`}
//                     className="flex-1 bg-transparent outline-none min-w-[150px] text-sm"
//                 />
//             </div>

//             {showSuggestions && filteredSuggestions.length > 0 && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//                     {filteredSuggestions.map((s) => {
//                         const name = s.name || s.keyword || s;
//                         return (
//                             <button
//                                 key={name}
//                                 type="button"
//                                 className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
//                                 onClick={() => addItems(name)}
//                             >
//                                 <span>{name}</span>
//                                 <span className="text-[10px] text-gray-400">Use existing</span>
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MetaInput;




import React, { useState, useMemo, useRef, useEffect } from "react";
import { X } from "lucide-react";

function MetaInput({
    label,
    items = [],
    onUpdate,
    color,
    allSuggestions = []
}) {
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    // Updated colors for LIGHT THEME (matches your screenshot)
    const colorClasses = color === "red"
        ? "bg-red-50 text-red-600 border-red-200"
        : "bg-blue-50 text-blue-600 border-blue-200";

    const filteredSuggestions = useMemo(() => {
        const suggestionsArray = Array.isArray(allSuggestions)
            ? allSuggestions
            : (allSuggestions?.data && Array.isArray(allSuggestions.data))
                ? allSuggestions.data
                : [];

        if (!input.trim() || suggestionsArray.length === 0) return [];

        const search = input.toLowerCase();

        return suggestionsArray.filter(s => {
            const suggestionText = s?.name || s?.keyword || (typeof s === 'string' ? s : "");
            if (!suggestionText) return false;

            const normalizedText = suggestionText.toLowerCase();

            return (
                normalizedText.includes(search) &&
                !items.some(alreadySelected =>
                    String(alreadySelected).toLowerCase() === normalizedText
                )
            );
        }).slice(0, 5);
    }, [input, allSuggestions, items]);

    const handleAdd = (value) => {
        const parts = value.split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0 && !items.includes(p));

        if (parts.length > 0) {
            onUpdate([...items, ...parts]);
        }
        setInput("");
        setShowSuggestions(false);
    };

    const handleRemove = (target) => {
        onUpdate(items.filter(item => item !== target));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-1.5 relative w-full" ref={suggestionRef}>
            <label className="block text-sm font-semibold text-gray-700">{label}</label>

            <div className="min-h-[48px] w-full bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                {items.map((item) => (
                    <div key={item} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${colorClasses}`}>
                        {item}
                        <button type="button" onClick={() => handleRemove(item)} className="hover:opacity-70 transition">
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <input
                    value={input}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes(',')) {
                            handleAdd(val);
                        } else {
                            setInput(val);
                            setShowSuggestions(true);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd(input);
                        }
                    }}
                    placeholder={items.length === 0 ? `Add ${label.toLowerCase()}...` : ""}
                    className="flex-1 bg-transparent outline-none min-w-[120px] text-sm text-gray-800 placeholder:text-gray-400"
                />
            </div>

            {/* Suggestions Dropdown - Re-styled for Visibility */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-[9999] mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                        Suggestions
                    </div>
                    {filteredSuggestions.map((s) => {
                        const displayName = s.name || s.keyword || s;
                        return (
                            <button
                                key={s.id || displayName}
                                type="button"
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-between group"
                                onClick={() => handleAdd(displayName)}
                            >
                                <span className="font-medium">{displayName}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase group-hover:bg-blue-100 group-hover:text-blue-600">
                                    Existing
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MetaInput;