"use client";

import type { ReactElement, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps): ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className={`relative bg-white rounded-lg shadow-xl ${MAX_WIDTH_CLASSES[maxWidth]} w-full p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
}

const BUTTON_CANCEL_CLASS =
  "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

const BUTTON_SUBMIT_CLASS =
  "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50";

export function ModalActions({
  onCancel,
  onSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  isSubmitting = false,
  submitDisabled = false,
}: ModalActionsProps): ReactElement {
  return (
    <div className="flex gap-3 justify-end mt-6">
      <button onClick={onCancel} className={BUTTON_CANCEL_CLASS}>
        {cancelLabel}
      </button>
      <button
        onClick={onSubmit}
        disabled={submitDisabled || isSubmitting}
        className={BUTTON_SUBMIT_CLASS}
      >
        {isSubmitting ? "Processing..." : submitLabel}
      </button>
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormActions({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  isSubmitting = false,
}: FormActionsProps): ReactElement {
  return (
    <div className="flex gap-3 justify-end">
      <button type="button" onClick={onCancel} className={BUTTON_CANCEL_CLASS}>
        {cancelLabel}
      </button>
      <button type="submit" disabled={isSubmitting} className={BUTTON_SUBMIT_CLASS}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
