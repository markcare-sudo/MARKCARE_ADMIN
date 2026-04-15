import React from 'react';

const InfoSection = ({ title, subtitle, features, trialText, supportPhone }) => {
  return (
    <div className="flex-1 bg-[#0077c8] p-12 text-white flex flex-col justify-between min-h-[600px]">
      <div>
        <h1 className="text-4xl font-bold mb-2 leading-tight">{title}</h1>
        <p className="text-blue-100 mb-10 opacity-80">{subtitle}</p>

        {/* Illustration Placeholder - Using your uploaded style */}
        <div className="mb-10 flex justify-center">
            <div className="bg-white/10 rounded-full p-8 backdrop-blur-sm border border-white/20">
                {/* Replace with an actual SVG/Image of the lab illustration */}
                <div className="w-64 h-64 bg-white/20 rounded-lg flex items-center justify-center italic text-xs">
                    [Lab Illustration]
                </div>
            </div>
        </div>

        <ul className="space-y-6">
          {features.map((item, index) => (
            <li key={index} className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-[#f15a24] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-lg font-medium">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">{trialText}</h2>
        <p className="text-sm opacity-70">Need help? Call us {supportPhone}</p>
      </div>
    </div>
  );
};

export default InfoSection;