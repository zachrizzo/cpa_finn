"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardCheck, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getDc } from "@/lib/firebase";
import { formatDate, getDisplayName, getOtherPartyName } from "@/lib/format";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { SuccessMessage, PageHeader, AlertBanner, StateRequirementsCard, Button, StatusBadge } from "@/components";
import { getChartReviews, getMyAgreements, submitChartReview } from "@dataconnect/generated";

const chartReviewSchema = z.object({
  agreementId: z.string().min(1, "Please select a CPA"),
  reviewDate: z.string().min(1, "Review date is required"),
  chartIdentifier: z.string().optional(),
  isTimely: z.boolean(),
  reviewPercentage: z.number().min(0).max(100).optional(),
  isControlledSubstanceChart: z.boolean(),
  notes: z.string().optional(),
});

type ChartReviewFormData = z.infer<typeof chartReviewSchema>;

interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  npLicense: {
    user: {
      id: string;
      displayName: string | null;
      email: string;
      role: string | null;
    };
  };
  physicianLicense: {
    user: {
      id: string;
      displayName: string | null;
      email: string;
      role: string | null;
    };
  };
  state: {
    id: string;
    stateCode: string;
    stateName: string;
    chartReviewFrequency: string | null;
    chartReviewPercentage: number | null;
    chartReviewControlledSubstancesOnly: boolean | null;
  };
}

interface ChartReview {
  id: string;
  reviewDate: string;
  isTimely: boolean;
  notes: string | null;
  chartIdentifier: string | null;
  reviewPercentage: number | null;
  isControlledSubstanceChart: boolean | null;
  createdAt: string;
  reviewer: {
    id: string;
    displayName: string | null;
    email: string;
    role: string | null;
  };
}

export default function ChartReviewPage(): React.ReactNode {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [chartReviews, setChartReviews] = useState<ChartReview[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentUserId = useCurrentUserId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChartReviewFormData>({
    resolver: zodResolver(chartReviewSchema),
    defaultValues: {
      isTimely: true,
      isControlledSubstanceChart: false,
    },
  });

  const selectedAgreementId = watch("agreementId");

  useEffect(() => {
    async function fetchAgreements() {
      try {
        const { data } = await getMyAgreements(getDc());
        const activeAgreements = data.collaborationAgreements.filter(
          (a: { isActive?: boolean; status?: string }) => a.isActive && a.status === "active"
        ) as unknown as Agreement[];

        setAgreements(activeAgreements);

        // Get current user's role from first agreement
        if (activeAgreements.length > 0 && currentUserId) {
          const firstAgreement = activeAgreements[0];
          if (firstAgreement.npLicense.user.id === currentUserId) {
            setCurrentUserRole(firstAgreement.npLicense.user.role);
          } else {
            setCurrentUserRole(firstAgreement.physicianLicense.user.role);
          }
        }

        // If agreement ID provided in query params, select it
        const agreementIdFromQuery = searchParams.get("agreement");
        if (agreementIdFromQuery) {
          setValue("agreementId", agreementIdFromQuery);
        }
      } catch {
        toast.error("Failed to load agreements");
      }
    }

    if (currentUserId) {
      fetchAgreements();
    }
  }, [currentUserId, searchParams, setValue]);

  useEffect(() => {
    async function fetchChartReviews() {
      if (!selectedAgreementId) {
        setChartReviews([]);
        setSelectedAgreement(null);
        return;
      }

      try {
        const agreement = agreements.find(a => a.id === selectedAgreementId);
        setSelectedAgreement(agreement || null);

        const { data } = await getChartReviews(getDc(), { agreementId: selectedAgreementId });
        setChartReviews(data.chartReviews as unknown as ChartReview[]);
      } catch {
        toast.error("Failed to load chart reviews");
      }
    }

    if (selectedAgreementId) {
      fetchChartReviews();
    }
  }, [selectedAgreementId, agreements]);

  const onSubmit = async (formData: ChartReviewFormData) => {
    setSubmitting(true);
    setSuccessMessage(null);

    try {
      await submitChartReview(getDc(), {
        agreementId: formData.agreementId,
        reviewDate: formData.reviewDate,
        isTimely: formData.isTimely,
        chartIdentifier: formData.chartIdentifier || null,
        reviewPercentage: formData.reviewPercentage || null,
        isControlledSubstanceChart: formData.isControlledSubstanceChart || false,
        notes: formData.notes || null,
      });

      setSuccessMessage("Chart review submitted successfully!");

      // Refresh chart reviews
      if (selectedAgreementId) {
        const { data } = await getChartReviews(getDc(), { agreementId: selectedAgreementId });
        setChartReviews(data.chartReviews as unknown as ChartReview[]);
      }

      // Reset form (keep agreementId selected)
      const currentAgreementId = formData.agreementId;
      setValue("reviewDate", "");
      setValue("chartIdentifier", "");
      setValue("notes", "");
      setValue("reviewPercentage", undefined);
      setValue("isTimely", true);
      setValue("isControlledSubstanceChart", false);
      setValue("agreementId", currentAgreementId);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      toast.error("Error submitting chart review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitReview = currentUserRole === "physician";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chart Review"
        description="Submit and track chart reviews for your collaboration agreements"
      />

      {!canSubmitReview && (
        <AlertBanner
          title="Physician Only"
          description="Only physicians can submit chart reviews. You can view past reviews below."
          variant="warning"
        />
      )}

      {/* Submit Chart Review Form */}
      {canSubmitReview && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit New Chart Review</h2>

          {successMessage && <SuccessMessage message={successMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Select CPA */}
            <div>
              <label htmlFor="agreementId" className="block text-sm font-medium text-gray-700">
                Collaboration Agreement <span className="text-red-600">*</span>
              </label>
              <select
                id="agreementId"
                {...register("agreementId")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a CPA...</option>
                {agreements.map((agreement) => (
                  <option key={agreement.id} value={agreement.id}>
                    {agreement.state.stateCode} - {getOtherPartyName(agreement, currentUserId)}
                  </option>
                ))}
              </select>
              {errors.agreementId && (
                <p className="mt-1 text-sm text-red-600">{errors.agreementId.message}</p>
              )}
            </div>

            {/* State Requirements Display */}
            {selectedAgreement && (
              <StateRequirementsCard
                stateCode={selectedAgreement.state.stateCode}
                requirements={[
                  { label: "Frequency", value: selectedAgreement.state.chartReviewFrequency },
                  { label: "Required Percentage", value: selectedAgreement.state.chartReviewPercentage ? `${selectedAgreement.state.chartReviewPercentage}% of charts` : null },
                  { label: "Focus", value: selectedAgreement.state.chartReviewControlledSubstancesOnly ? "Controlled substances only" : null },
                ]}
              />
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Review Date */}
              <div>
                <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700">
                  Review Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="reviewDate"
                  {...register("reviewDate")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.reviewDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.reviewDate.message}</p>
                )}
              </div>

              {/* Chart Identifier */}
              <div>
                <label htmlFor="chartIdentifier" className="block text-sm font-medium text-gray-700">
                  Patient Chart ID
                </label>
                <input
                  type="text"
                  id="chartIdentifier"
                  {...register("chartIdentifier")}
                  placeholder="e.g., CHART-12345"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Review Percentage */}
              <div>
                <label htmlFor="reviewPercentage" className="block text-sm font-medium text-gray-700">
                  Review Percentage
                </label>
                <input
                  type="number"
                  id="reviewPercentage"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register("reviewPercentage", { valueAsNumber: true })}
                  placeholder="e.g., 10"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTimely"
                  {...register("isTimely")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isTimely" className="text-sm font-medium text-gray-700">
                  Review completed within required timeframe
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isControlledSubstanceChart"
                  {...register("isControlledSubstanceChart")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isControlledSubstanceChart" className="text-sm font-medium text-gray-700">
                  Controlled substance chart
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes / Feedback
              </label>
              <textarea
                id="notes"
                rows={4}
                {...register("notes")}
                placeholder="Enter any compliance findings, feedback, or notes..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" icon={ClipboardCheck} loading={submitting}>
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Past Chart Reviews */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Past Chart Reviews</h2>
          <p className="mt-1 text-sm text-gray-500">
            {selectedAgreementId ? "Reviews for selected CPA" : "Select a CPA to view reviews"}
          </p>
        </div>

        {!selectedAgreementId ? (
          <div className="p-8 text-center text-gray-500">
            Please select a collaboration agreement to view chart reviews
          </div>
        ) : chartReviews.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No chart reviews yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              {canSubmitReview ? "Submit your first chart review above" : "No reviews have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Review Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Chart ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {chartReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(review.reviewDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {review.chartIdentifier || "N/A"}
                      {review.isControlledSubstanceChart && (
                        <span className="ml-2 text-xs text-orange-600">(CS)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getDisplayName(review.reviewer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        variant={review.isTimely ? "success" : "warning"}
                        label={review.isTimely ? "Timely" : "Late"}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {review.notes ? (
                        <div className="max-w-xs truncate" title={review.notes}>
                          {review.notes}
                        </div>
                      ) : (
                        <span className="text-gray-400">No notes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {selectedAgreement && chartReviews.length > 0 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Reviews Completed</span>
              <span className="text-sm font-medium text-gray-900">{chartReviews.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Timely Reviews</span>
              <span className="text-sm font-medium text-gray-900">
                {chartReviews.filter(r => r.isTimely).length}
              </span>
            </div>
            {selectedAgreement.state.chartReviewPercentage && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Required Percentage</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedAgreement.state.chartReviewPercentage}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
