"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, CheckCircle, Clock, Video, Phone, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, getDc } from "@/lib/firebase";
import {
  getMyAgreements,
  scheduleQaMeeting,
  completeQaMeeting,
  getQaMeetings,
} from "@dataconnect/generated";
import { toast } from "sonner";

const scheduleMeetingSchema = z.object({
  agreementId: z.string().min(1, "Please select a CPA"),
  meetingDate: z.string().min(1, "Meeting date is required"),
  meetingTime: z.string().min(1, "Meeting time is required"),
  meetingType: z.string().min(1, "Meeting type is required"),
  notes: z.string().optional(),
});

const completeMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required"),
  notes: z.string().min(10, "Please provide meeting notes (minimum 10 characters)"),
  meetingDocumentUrl: z.string().optional(),
});

type ScheduleMeetingFormData = z.infer<typeof scheduleMeetingSchema>;
type CompleteMeetingFormData = z.infer<typeof completeMeetingSchema>;

interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  npLicense: {
    user: {
      id: string;
      displayName: string | null;
      email: string;
    };
  };
  physicianLicense: {
    user: {
      id: string;
      displayName: string | null;
      email: string;
    };
  };
  state: {
    id: string;
    stateCode: string;
    stateName: string;
    qaMeetingFrequency: string | null;
    qaMeetingDurationMonths: number | null;
  };
}

interface QAMeeting {
  id: string;
  meetingDate: string;
  notes: string | null;
  meetingDocumentUrl: string | null;
  meetingType: string | null;
  createdAt: string;
  host: {
    id: string;
    displayName: string | null;
    email: string;
    role: string | null;
  };
}

export default function QAMeetingPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [qaMeetings, setQaMeetings] = useState<QAMeeting[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "complete">("schedule");
  // const [selectedMeeting, setSelectedMeeting] = useState<QAMeeting | null>(null);
  const searchParams = useSearchParams();

  const scheduleForm = useForm<ScheduleMeetingFormData>({
    resolver: zodResolver(scheduleMeetingSchema),
  });

  const completeForm = useForm<CompleteMeetingFormData>({
    resolver: zodResolver(completeMeetingSchema),
  });

  const selectedAgreementId = scheduleForm.watch("agreementId");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchAgreements() {
      try {
        const { data } = await getMyAgreements(getDc());
        const activeAgreements = data.collaborationAgreements.filter(
          (a: { isActive?: boolean; status?: string }) => a.isActive && a.status === "active"
        ) as unknown as Agreement[];

        setAgreements(activeAgreements);

        // If agreement ID provided in query params, select it
        const agreementIdFromQuery = searchParams.get("agreement");
        if (agreementIdFromQuery) {
          scheduleForm.setValue("agreementId", agreementIdFromQuery);
        }
      } catch {
        toast.error("Failed to load agreements");
      }
    }

    if (currentUserId) {
      fetchAgreements();
    }
  }, [currentUserId, searchParams, scheduleForm]);

  useEffect(() => {
    async function fetchQAMeetings() {
      if (!selectedAgreementId) {
        setQaMeetings([]);
        setSelectedAgreement(null);
        return;
      }

      try {
        const agreement = agreements.find(a => a.id === selectedAgreementId);
        setSelectedAgreement(agreement || null);

        const { data } = await getQaMeetings(getDc(), { agreementId: selectedAgreementId });
        setQaMeetings(data.qualityAssuranceMeetings as unknown as QAMeeting[]);
      } catch {
        toast.error("Failed to load QA meetings");
      }
    }

    if (selectedAgreementId) {
      fetchQAMeetings();
    }
  }, [selectedAgreementId, agreements]);

  const onScheduleSubmit = async (formData: ScheduleMeetingFormData) => {
    setSubmitting(true);
    setSuccessMessage(null);

    try {
      // Combine date and time into timestamp
      const meetingDateTime = new Date(`${formData.meetingDate}T${formData.meetingTime}`);
      const meetingTimestamp = meetingDateTime.toISOString();

      await scheduleQaMeeting(getDc(), {
        agreementId: formData.agreementId,
        meetingDate: meetingTimestamp,
        meetingType: formData.meetingType,
        notes: formData.notes || null,
      });

      setSuccessMessage("QA meeting scheduled successfully!");

      // Refresh QA meetings
      if (selectedAgreementId) {
        const { data } = await getQaMeetings(getDc(), { agreementId: selectedAgreementId });
        setQaMeetings(data.qualityAssuranceMeetings as unknown as QAMeeting[]);
      }

      // Reset form (keep agreementId selected)
      const currentAgreementId = formData.agreementId;
      scheduleForm.reset({
        agreementId: currentAgreementId,
        meetingDate: "",
        meetingTime: "",
        meetingType: "",
        notes: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      toast.error("Error scheduling QA meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onCompleteSubmit = async (formData: CompleteMeetingFormData) => {
    setSubmitting(true);
    setSuccessMessage(null);

    try {
      await completeQaMeeting(getDc(), {
        meetingId: formData.meetingId,
        notes: formData.notes,
        meetingDocumentUrl: formData.meetingDocumentUrl || null,
      });

      setSuccessMessage("Meeting notes saved successfully!");

      // Refresh QA meetings
      if (selectedAgreementId) {
        const { data } = await getQaMeetings(getDc(), { agreementId: selectedAgreementId });
        setQaMeetings(data.qualityAssuranceMeetings as unknown as QAMeeting[]);
      }

      // Reset form
      completeForm.reset({
        meetingId: "",
        notes: "",
        meetingDocumentUrl: "",
      });
      // setSelectedMeeting(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      toast.error("Error saving meeting notes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getOtherParty = (agreement: Agreement) => {
    if (!currentUserId) return "";
    if (agreement.npLicense.user.id === currentUserId) {
      return agreement.physicianLicense.user.displayName || agreement.physicianLicense.user.email;
    }
    return agreement.npLicense.user.displayName || agreement.npLicense.user.email;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getMeetingTypeIcon = (type: string | null) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const isMeetingPast = (meetingDate: string) => {
    return new Date(meetingDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">QA Meetings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and track quality assurance meetings for your collaboration agreements
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === "schedule"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Schedule Meeting
          </button>
          <button
            onClick={() => setActiveTab("complete")}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === "complete"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Complete Meeting
          </button>
        </nav>
      </div>

      {/* Schedule Meeting Form */}
      {activeTab === "schedule" && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule New QA Meeting</h2>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={scheduleForm.handleSubmit(onScheduleSubmit)} className="space-y-4">
            {/* Select CPA */}
            <div>
              <label htmlFor="agreementId" className="block text-sm font-medium text-gray-700">
                Collaboration Agreement <span className="text-red-600">*</span>
              </label>
              <select
                id="agreementId"
                {...scheduleForm.register("agreementId")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a CPA...</option>
                {agreements.map((agreement) => (
                  <option key={agreement.id} value={agreement.id}>
                    {agreement.state.stateCode} - {getOtherParty(agreement)}
                  </option>
                ))}
              </select>
              {scheduleForm.formState.errors.agreementId && (
                <p className="mt-1 text-sm text-red-600">{scheduleForm.formState.errors.agreementId.message}</p>
              )}
            </div>

            {/* State Requirements Display */}
            {selectedAgreement && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">State Requirements - {selectedAgreement.state.stateCode}</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  {selectedAgreement.state.qaMeetingFrequency && (
                    <p>Frequency: {selectedAgreement.state.qaMeetingFrequency}</p>
                  )}
                  {selectedAgreement.state.qaMeetingDurationMonths && (
                    <p>Duration: Every {selectedAgreement.state.qaMeetingDurationMonths} months</p>
                  )}
                  {!selectedAgreement.state.qaMeetingFrequency && (
                    <p>No specific state requirements</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Meeting Date */}
              <div>
                <label htmlFor="meetingDate" className="block text-sm font-medium text-gray-700">
                  Meeting Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  {...scheduleForm.register("meetingDate")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {scheduleForm.formState.errors.meetingDate && (
                  <p className="mt-1 text-sm text-red-600">{scheduleForm.formState.errors.meetingDate.message}</p>
                )}
              </div>

              {/* Meeting Time */}
              <div>
                <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700">
                  Meeting Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  id="meetingTime"
                  {...scheduleForm.register("meetingTime")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {scheduleForm.formState.errors.meetingTime && (
                  <p className="mt-1 text-sm text-red-600">{scheduleForm.formState.errors.meetingTime.message}</p>
                )}
              </div>

              {/* Meeting Type */}
              <div className="sm:col-span-2">
                <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700">
                  Meeting Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="meetingType"
                  {...scheduleForm.register("meetingType")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select meeting type...</option>
                  <option value="video">Video Conference</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                </select>
                {scheduleForm.formState.errors.meetingType && (
                  <p className="mt-1 text-sm text-red-600">{scheduleForm.formState.errors.meetingType.message}</p>
                )}
              </div>
            </div>

            {/* Agenda Items / Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Agenda Items / Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                {...scheduleForm.register("notes")}
                placeholder="Enter meeting agenda or notes..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="h-4 w-4" />
                {submitting ? "Scheduling..." : "Schedule Meeting"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complete Meeting Form */}
      {activeTab === "complete" && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Complete Meeting</h2>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={completeForm.handleSubmit(onCompleteSubmit)} className="space-y-4">
            {/* Select Meeting */}
            <div>
              <label htmlFor="meetingId" className="block text-sm font-medium text-gray-700">
                Select Meeting to Complete <span className="text-red-600">*</span>
              </label>
              <select
                id="meetingId"
                {...completeForm.register("meetingId")}
                onChange={(e) => {
                  const meeting = qaMeetings.find(m => m.id === e.target.value);
                  // setSelectedMeeting(meeting || null);
                  if (meeting?.notes) {
                    completeForm.setValue("notes", meeting.notes);
                  }
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a meeting...</option>
                {qaMeetings
                  .filter(meeting => isMeetingPast(meeting.meetingDate))
                  .map((meeting) => {
                    const { date, time } = formatDateTime(meeting.meetingDate);
                    return (
                      <option key={meeting.id} value={meeting.id}>
                        {date} at {time} - {meeting.meetingType || "Meeting"}
                      </option>
                    );
                  })}
              </select>
              {completeForm.formState.errors.meetingId && (
                <p className="mt-1 text-sm text-red-600">{completeForm.formState.errors.meetingId.message}</p>
              )}
            </div>

            {/* Meeting Notes */}
            <div>
              <label htmlFor="completeNotes" className="block text-sm font-medium text-gray-700">
                Meeting Notes / Discussion Topics <span className="text-red-600">*</span>
              </label>
              <textarea
                id="completeNotes"
                rows={6}
                {...completeForm.register("notes")}
                placeholder="Enter detailed meeting notes, discussion topics, action items, etc..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {completeForm.formState.errors.notes && (
                <p className="mt-1 text-sm text-red-600">{completeForm.formState.errors.notes.message}</p>
              )}
            </div>

            {/* Document URL */}
            <div>
              <label htmlFor="meetingDocumentUrl" className="block text-sm font-medium text-gray-700">
                Meeting Document URL (Optional)
              </label>
              <input
                type="url"
                id="meetingDocumentUrl"
                {...completeForm.register("meetingDocumentUrl")}
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Link to meeting recording, notes document, etc.</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                {submitting ? "Saving..." : "Save Meeting Notes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scheduled and Completed Meetings */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">All QA Meetings</h2>
          <p className="mt-1 text-sm text-gray-500">
            {selectedAgreementId ? "Meetings for selected CPA" : "Select a CPA to view meetings"}
          </p>
        </div>

        {!selectedAgreementId ? (
          <div className="p-8 text-center text-gray-500">
            Please select a collaboration agreement to view QA meetings
          </div>
        ) : qaMeetings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No QA meetings scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule your first QA meeting above
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Meeting Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Host
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
                {qaMeetings.map((meeting) => {
                  const { date, time } = formatDateTime(meeting.meetingDate);
                  const isPast = isMeetingPast(meeting.meetingDate);
                  const hasNotes = meeting.notes && meeting.notes.length > 0;

                  return (
                    <tr key={meeting.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span>{date}</span>
                          <span className="text-xs text-gray-500">{time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {getMeetingTypeIcon(meeting.meetingType)}
                          <span className="capitalize">{meeting.meetingType || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {meeting.host.displayName || meeting.host.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isPast ? (
                          hasNotes ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                              <Clock className="h-3 w-3" />
                              Needs Notes
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            <Calendar className="h-3 w-3" />
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {meeting.notes ? (
                          <div className="max-w-xs truncate" title={meeting.notes}>
                            {meeting.notes}
                          </div>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Status */}
      {selectedAgreement && qaMeetings.length > 0 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Compliance Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Meetings</span>
              <span className="text-sm font-medium text-gray-900">{qaMeetings.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed with Notes</span>
              <span className="text-sm font-medium text-gray-900">
                {qaMeetings.filter(m => m.notes && m.notes.length > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upcoming Meetings</span>
              <span className="text-sm font-medium text-gray-900">
                {qaMeetings.filter(m => !isMeetingPast(m.meetingDate)).length}
              </span>
            </div>
            {selectedAgreement.state.qaMeetingFrequency && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Required Frequency</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedAgreement.state.qaMeetingFrequency}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
