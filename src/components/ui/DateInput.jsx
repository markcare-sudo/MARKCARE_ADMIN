import React, { useState } from 'react';
import {
    format, addDays, startOfWeek, endOfWeek, startOfMonth,
    endOfMonth, startOfYear, endOfYear, isSameDay, isWithinInterval
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const DateRangePicker = ({ onApply, onCancel }) => {
    const [selectedRange, setSelectedRange] = useState('Custom');
    const [startDate, setStartDate] = useState(new Date(2022, 4, 22)); // May 22, 2022
    const [endDate, setEndDate] = useState(new Date(2023, 0, 15));   // Jan 15, 2023

    const sideOptions = [
        { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
        { label: 'This week', getValue: () => ({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }) },
        { label: 'This month', getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
        { label: 'This year', getValue: () => ({ start: startOfYear(new Date()), end: endOfYear(new Date()) }) },
        { label: 'Custom', getValue: null },
    ];

    const handleRangeClick = (option) => {
        setSelectedRange(option.label);
        if (option.getValue) {
            const { start, end } = option.getValue();
            setStartDate(start);
            setEndDate(end);
        }
    };

    return (
        <div className="flex flex-col bg-white border rounded-lg shadow-xl w-[700px] overflow-hidden font-sans">
            <div className="flex flex-row border-b">

                {/* SIDEBAR */}
                <div className="w-48 bg-gray-50 border-r py-2">
                    {sideOptions.map((option) => (
                        <label
                            key={option.label}
                            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${selectedRange === option.label ? 'bg-gray-200 font-medium' : ''}`}
                            onClick={() => handleRangeClick(option)}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${selectedRange === option.label ? 'border-blue-600' : 'border-gray-400'}`}>
                                {selectedRange === option.label && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                            </div>
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>

                {/* CALENDARS CONTAINER */}
                <div className="flex flex-1 p-4 gap-4">
                    <CalendarPane month={new Date(2022, 4)} startDate={startDate} endDate={endDate} />
                    <div className="w-[1px] bg-gray-200" />
                    <CalendarPane month={new Date(2023, 5)} startDate={startDate} endDate={endDate} />
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center gap-2 text-sm">
                    <input
                        type="text"
                        readOnly
                        value={format(startDate, 'MM.dd.yyyy')}
                        className="border rounded-full px-4 py-2 w-32 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="text"
                        readOnly
                        value={format(endDate, 'MM.dd.yyyy')}
                        className="border-2 border-black rounded-full px-4 py-2 w-32 text-center outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
                        Cancel
                    </button>
                    <button onClick={() => onApply({ startDate, endDate })} className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

// HELPER COMPONENT FOR INDIVIDUAL CALENDAR
const CalendarPane = ({ month, startDate, endDate }) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Logic to generate dates for the specific month view
    // (Simplified for visual representation)
    const generatePlaceholderDays = () => {
        const dates = [];
        for (let i = 1; i <= 31; i++) dates.push(i);
        return dates;
    };

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex gap-1 text-gray-600">
                    <FiChevronsLeft className="cursor-pointer hover:text-black" />
                    <FiChevronLeft className="cursor-pointer hover:text-black" />
                </div>
                <span className="text-sm font-bold text-gray-800">{format(month, 'yyyy MMM')}</span>
                <div className="flex gap-1 text-gray-600">
                    <FiChevronRight className="cursor-pointer hover:text-black" />
                    <FiChevronsRight className="cursor-pointer hover:text-black" />
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1">
                {days.map(d => (
                    <div key={d} className={`text-center text-xs font-bold py-2 ${d === 'S' ? 'text-red-500' : 'text-gray-400'}`}>
                        {d}
                    </div>
                ))}
                {/* Example Grid Logic */}
                {generatePlaceholderDays().map(day => {
                    const isSelected = day === 22 && month.getMonth() === 4; // Mock selection logic
                    const isInRange = day > 22 && month.getMonth() === 4;

                    return (
                        <div
                            key={day}
                            className={`
                text-center py-2 text-sm cursor-pointer relative
                ${isSelected ? 'bg-blue-600 text-white rounded-md z-10' : 'text-gray-700 hover:bg-blue-50'}
                ${isInRange ? 'bg-blue-50' : ''}
              `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DateRangePicker;