import Checkbox from "@/components/ui/CheckBox";
import Input from "@/components/ui/Input";

const FeatureManager = ({ availableFeatures = [], selectedFeatures = [], onChange }) => {

    const updateFeature = (featureId, updates) => {
        const newList = [...selectedFeatures];
        const index = newList.findIndex((f) => f.feature_id === featureId);

        if (index >= 0) {
            newList[index] = { ...newList[index], ...updates };
        } else {
            newList.push({
                feature_id: featureId,
                is_enabled: true,
                limit_value: null,
                ...updates
            });
        }
        onChange(newList);
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Plan Features & Limits
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Define what this plan can access</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {availableFeatures?.length || 0} Features
                </span>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 gap-3">
                {availableFeatures?.map((feature) => {
                    const planFeature = selectedFeatures.find((f) => f.feature_id === feature.id) || {
                        is_enabled: false,
                        limit_value: "",
                    };

                    const isEnabled = planFeature.is_enabled;

                    return (
                        <div
                            key={feature.id}
                            className={`group flex items-center justify-between p-4 rounded border transition-all duration-200 ${isEnabled
                                ? "bg-white border-blue-300 shadow-sm ring-1 ring-blue-50"
                                : "bg-gray-50 border-gray-200 opacity-80 hover:opacity-100"
                                }`}
                        >
                            {/* Left Side: Checkbox & Info */}
                            <div className="flex items-start flex-1 min-w-0 mr-4">
                                <div className="pt-0.5">
                                    <Checkbox
                                        checked={isEnabled}
                                        onChange={(e) => updateFeature(feature.id, { is_enabled: e.target.checked })}
                                    />
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <label
                                        onClick={() => updateFeature(feature.id, { is_enabled: !isEnabled })}
                                        className={`block text-sm font-semibold cursor-pointer truncate transition-colors ${isEnabled ? "text-gray-900" : "text-gray-500"
                                            }`}
                                    >
                                        {feature.name}
                                    </label>
                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                        {feature.description || "Assign module access to this plan"}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Limit Input */}
                            <div className="flex flex-col items-end w-32 shrink-0">
                                <span className={`text-[10px] font-bold uppercase mb-1.5 transition-colors ${isEnabled ? "text-blue-600" : "text-gray-400"
                                    }`}>
                                    Limit
                                </span>
                                <Input
                                    type="number"
                                    placeholder="∞"
                                    value={planFeature.limit_value ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                                        updateFeature(feature.id, { limit_value: val, is_enabled: true });
                                    }}
                                    disabled={!isEnabled}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeatureManager;