"use client";

import type { ReactElement, ReactNode } from "react";
import { INPUT_CLASS } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  helpText,
  children,
}: FormFieldProps): ReactElement {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helpText,
  required = false,
  id,
  ...props
}: FormInputProps): ReactElement {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <FormField label={label} htmlFor={inputId} required={required} error={error} helpText={helpText}>
      <input id={inputId} className={INPUT_CLASS} {...props} />
    </FormField>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function FormSelect({
  label,
  error,
  helpText,
  required = false,
  options,
  placeholder = "Select...",
  id,
  ...props
}: FormSelectProps): ReactElement {
  const selectId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <FormField label={label} htmlFor={selectId} required={required} error={error} helpText={helpText}>
      <select id={selectId} className={INPUT_CLASS} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  helpText,
  required = false,
  id,
  rows = 4,
  ...props
}: FormTextareaProps): ReactElement {
  const textareaId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <FormField label={label} htmlFor={textareaId} required={required} error={error} helpText={helpText}>
      <textarea id={textareaId} rows={rows} className={INPUT_CLASS} {...props} />
    </FormField>
  );
}

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function FormCheckbox({ label, error, id, ...props }: FormCheckboxProps): ReactElement {
  const checkboxId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          id={checkboxId}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          {...props}
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
