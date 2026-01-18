"use client";

import type { ReactElement } from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Modal } from "./Modal";
import { AlertBanner } from "./ErrorMessage";

interface VerificationModalProps {
  isOpen: boolean;
  stateName: string;
  verificationUrl: string | null | undefined;
  onVerify: () => void;
  onSkip: () => void;
}

export function VerificationModal({
  isOpen,
  stateName,
  verificationUrl,
  onVerify,
  onSkip,
}: VerificationModalProps): ReactElement | null {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onSkip} title="">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your license has been saved!
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          To verify your license, click below to visit the {stateName} state board website.
          Once you have confirmed your license details, you can mark it as verified in the licenses list.
        </p>

        <div className="flex flex-col gap-3">
          {verificationUrl ? (
            <>
              <button
                onClick={onVerify}
                className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ExternalLink className="h-4 w-4" />
                Verify on State Board Website
              </button>
              <button
                onClick={onSkip}
                className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Skip for now
              </button>
            </>
          ) : (
            <>
              <AlertBanner
                title=""
                description={`No verification URL is available for ${stateName}. You can manually search for the state board website to verify your license.`}
                variant="warning"
              />
              <button
                onClick={onSkip}
                className="inline-flex items-center justify-center w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Licenses
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
