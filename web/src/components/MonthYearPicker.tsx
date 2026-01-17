"use client";

import { useMemo, useCallback } from "react";

interface MonthYearPickerProps {
    /** Current value in YYYY-MM-DD format */
    value?: string;
    /** Callback when date changes, returns YYYY-MM-DD format */
    onChange: (value: string) => void;
    /** Minimum year to show in dropdown */
    minYear?: number;
    /** Maximum year to show in dropdown */
    maxYear?: number;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Additional className for the container */
    className?: string;
    /** ID prefix for form labels */
    id?: string;
}

const MONTHS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

/**
 * Get the number of days in a given month/year
 */
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

/**
 * A mobile-friendly date picker with separate Month, Day, and Year dropdowns.
 * Returns date in YYYY-MM-DD format for compatibility with existing forms.
 */
export default function MonthYearPicker({
    value,
    onChange,
    minYear = 1970,
    maxYear = new Date().getFullYear() + 10,
    disabled = false,
    className = "",
    id = "date-picker",
}: MonthYearPickerProps) {
    // Parse current value
    const parsedDate = useMemo(() => {
        if (!value) return { year: "", month: "", day: "" };
        const parts = value.split("-");
        if (parts.length !== 3) return { year: "", month: "", day: "" };
        return {
            year: parts[0],
            month: parts[1],
            day: parts[2],
        };
    }, [value]);

    // Generate year options
    const years = useMemo(() => {
        const yearList: number[] = [];
        for (let y = maxYear; y >= minYear; y--) {
            yearList.push(y);
        }
        return yearList;
    }, [minYear, maxYear]);

    // Generate day options based on selected month/year
    const days = useMemo(() => {
        const year = parsedDate.year ? parseInt(parsedDate.year) : new Date().getFullYear();
        const month = parsedDate.month ? parseInt(parsedDate.month) : 1;
        const daysInMonth = getDaysInMonth(year, month);
        return Array.from({ length: daysInMonth }, (_, i) =>
            String(i + 1).padStart(2, "0")
        );
    }, [parsedDate.year, parsedDate.month]);

    // Handle changes
    const handleChange = useCallback(
        (field: "year" | "month" | "day", newValue: string) => {
            const current = { ...parsedDate };
            current[field] = newValue;

            // If we have all three parts, construct the date
            if (current.year && current.month && current.day) {
                // Validate day doesn't exceed days in month
                const daysInMonth = getDaysInMonth(
                    parseInt(current.year),
                    parseInt(current.month)
                );
                if (parseInt(current.day) > daysInMonth) {
                    current.day = String(daysInMonth).padStart(2, "0");
                }
                onChange(`${current.year}-${current.month}-${current.day}`);
            } else if (current.year && current.month) {
                // Default to first of month if day not selected
                onChange(`${current.year}-${current.month}-01`);
            } else if (newValue === "") {
                // Clear the value if any field is cleared
                onChange("");
            }
        },
        [parsedDate, onChange]
    );

    const selectClassName =
        "block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

    return (
        <div className={`grid grid-cols-3 gap-2 ${className}`}>
            {/* Month dropdown */}
            <div>
                <label
                    htmlFor={`${id}-month`}
                    className="sr-only"
                >
                    Month
                </label>
                <select
                    id={`${id}-month`}
                    value={parsedDate.month}
                    onChange={(e) => handleChange("month", e.target.value)}
                    disabled={disabled}
                    className={selectClassName}
                    aria-label="Month"
                >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Day dropdown */}
            <div>
                <label
                    htmlFor={`${id}-day`}
                    className="sr-only"
                >
                    Day
                </label>
                <select
                    id={`${id}-day`}
                    value={parsedDate.day}
                    onChange={(e) => handleChange("day", e.target.value)}
                    disabled={disabled}
                    className={selectClassName}
                    aria-label="Day"
                >
                    <option value="">Day</option>
                    {days.map((d) => (
                        <option key={d} value={d}>
                            {parseInt(d)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year dropdown */}
            <div>
                <label
                    htmlFor={`${id}-year`}
                    className="sr-only"
                >
                    Year
                </label>
                <select
                    id={`${id}-year`}
                    value={parsedDate.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    disabled={disabled}
                    className={selectClassName}
                    aria-label="Year"
                >
                    <option value="">Year</option>
                    {years.map((y) => (
                        <option key={y} value={String(y)}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
