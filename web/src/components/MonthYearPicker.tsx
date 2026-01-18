"use client";

import type { ReactElement } from "react";
import { useMemo, useCallback } from "react";

interface MonthYearPickerProps {
    value?: string;
    onChange: (value: string) => void;
    minYear?: number;
    maxYear?: number;
    disabled?: boolean;
    className?: string;
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

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

function parseDate(value: string | undefined): { year: string; month: string; day: string } {
    if (!value) return { year: "", month: "", day: "" };
    const parts = value.split("-");
    if (parts.length !== 3) return { year: "", month: "", day: "" };
    return { year: parts[0], month: parts[1], day: parts[2] };
}

function generateYears(minYear: number, maxYear: number): number[] {
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y);
    }
    return years;
}

function generateDays(year: string, month: string): string[] {
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    const monthNum = month ? parseInt(month) : 1;
    const daysInMonth = getDaysInMonth(yearNum, monthNum);
    return Array.from({ length: daysInMonth }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );
}

const SELECT_CLASS =
    "block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

interface DateSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    options: { value: string; label: string }[];
    placeholder: string;
}

function DateSelect({
    id,
    label,
    value,
    onChange,
    disabled,
    options,
    placeholder,
}: DateSelectProps): ReactElement {
    return (
        <div>
            <label htmlFor={id} className="sr-only">{label}</label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={SELECT_CLASS}
                aria-label={label}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function MonthYearPicker({
    value,
    onChange,
    minYear = 1970,
    maxYear = new Date().getFullYear() + 10,
    disabled = false,
    className = "",
    id = "date-picker",
}: MonthYearPickerProps): ReactElement {
    const parsedDate = useMemo(() => parseDate(value), [value]);
    const years = useMemo(() => generateYears(minYear, maxYear), [minYear, maxYear]);
    const days = useMemo(
        () => generateDays(parsedDate.year, parsedDate.month),
        [parsedDate.year, parsedDate.month]
    );

    const handleChange = useCallback(
        (field: "year" | "month" | "day", newValue: string) => {
            const current = { ...parsedDate, [field]: newValue };

            if (current.year && current.month && current.day) {
                const daysInMonth = getDaysInMonth(
                    parseInt(current.year),
                    parseInt(current.month)
                );
                if (parseInt(current.day) > daysInMonth) {
                    current.day = String(daysInMonth).padStart(2, "0");
                }
                onChange(`${current.year}-${current.month}-${current.day}`);
            } else if (current.year && current.month) {
                onChange(`${current.year}-${current.month}-01`);
            } else if (newValue === "") {
                onChange("");
            }
        },
        [parsedDate, onChange]
    );

    const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));
    const dayOptions = days.map((d) => ({ value: d, label: String(parseInt(d)) }));

    return (
        <div className={`grid grid-cols-3 gap-2 ${className}`}>
            <DateSelect
                id={`${id}-month`}
                label="Month"
                value={parsedDate.month}
                onChange={(v) => handleChange("month", v)}
                disabled={disabled}
                options={MONTHS}
                placeholder="Month"
            />
            <DateSelect
                id={`${id}-day`}
                label="Day"
                value={parsedDate.day}
                onChange={(v) => handleChange("day", v)}
                disabled={disabled}
                options={dayOptions}
                placeholder="Day"
            />
            <DateSelect
                id={`${id}-year`}
                label="Year"
                value={parsedDate.year}
                onChange={(v) => handleChange("year", v)}
                disabled={disabled}
                options={yearOptions}
                placeholder="Year"
            />
        </div>
    );
}
