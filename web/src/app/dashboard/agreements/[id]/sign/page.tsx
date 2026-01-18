"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, FileSignature, Loader2, X } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { getDc, storage } from "@/lib/firebase";
import { getDisplayName } from "@/lib/format";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { LoadingState, EmptyState, Button } from "@/components";
import { createMedia, getAgreementById, signAgreement } from "@dataconnect/generated";

interface Agreement {
  id: string;
  status: string;
  isActive: boolean;
  createdAt: string;
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
    stateCode: string;
    stateName: string;
    complianceNotes: string | null;
  };
}

export default function SignAgreementPage(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const agreementId = params.id as string;
  const signatureRef = useRef<SignatureCanvas>(null);
  const currentUserId = useCurrentUserId();

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  useEffect(() => {
    async function fetchAgreement() {
      try {
        const { data } = await getAgreementById(getDc(), { agreementId });
        setAgreement(data.collaborationAgreement as Agreement);
      } catch {
        toast.error("Failed to load agreement");
      } finally {
        setLoading(false);
      }
    }

    if (currentUserId) {
      fetchAgreement();
    }
  }, [agreementId, currentUserId]);

  const handleClear = () => {
    signatureRef.current?.clear();
    setSignatureEmpty(true);
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setSignatureEmpty(false);
    }
  };

  const getClientIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  // Convert data URL to Blob for upload
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Please provide your signature before submitting.");
      return;
    }

    if (!acknowledged) {
      toast.error("Please acknowledge the terms before submitting your signature.");
      return;
    }

    if (!currentUserId) {
      toast.error("You must be logged in to sign.");
      return;
    }

    setSigning(true);
    setUploadProgress("Capturing signature...");

    try {
      // Step 1: Get signature as data URL and convert to blob
      const signatureDataUrl = signatureRef.current.toDataURL("image/png");
      const signatureBlob = dataURLtoBlob(signatureDataUrl);

      // Step 2: Generate unique media ID and filename
      const mediaId = crypto.randomUUID();
      const fileName = `signature_${agreementId}_${Date.now()}.png`;

      // Step 3: Upload to Firebase Storage
      setUploadProgress("Uploading signature...");
      const storageRef = ref(storage, `signatures/${currentUserId}/${fileName}`);
      await uploadBytes(storageRef, signatureBlob, {
        contentType: "image/png",
        customMetadata: {
          agreementId,
          signerId: currentUserId,
          timestamp: new Date().toISOString(),
        },
      });

      // Step 4: Get download URL
      const downloadUrl = await getDownloadURL(storageRef);

      // Step 5: Create Media record in Data Connect
      setUploadProgress("Recording signature...");
      try {
        await createMedia(getDc(), {
          mediaId,
          mediaType: "signature",
          fileName,
          fileUrl: downloadUrl,
          fileSize: signatureBlob.size,
          mimeType: "image/png",
          containsPhi: false,
        });
      } catch (mediaError) {
        console.warn("Failed to create media record:", mediaError);
        // Continue even if media creation fails - signature is still uploaded
      }

      // Step 6: Get client information
      const ipAddress = await getClientIp();
      const userAgent = navigator.userAgent;

      // Step 7: Sign the agreement
      setUploadProgress("Finalizing signature...");
      await signAgreement(getDc(), {
        agreementId,
        mediaId,
        signatureMethod: "electronic_canvas",
        ipAddress: ipAddress || "unknown",
        userAgent,
      });

      toast.success("Agreement signed successfully!");
      router.push(`/dashboard/agreements/${agreementId}`);
    } catch (error) {
      console.error("Signature error:", error);
      toast.error("Failed to sign agreement. Please try again.");
    } finally {
      setSigning(false);
      setUploadProgress("");
    }
  };

  if (loading) {
    return <LoadingState message="Loading agreement..." />;
  }

  if (!agreement) {
    return <EmptyState icon={FileSignature} title="Agreement not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(`/dashboard/agreements/${agreementId}`)}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign Agreement</h1>
          <p className="text-sm text-gray-500 mt-1">
            Collaboration Agreement - {agreement.state.stateName}
          </p>
        </div>
      </div>

      {/* Agreement Preview */}
      <div className="rounded-md border bg-white shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-blue-100 p-2">
            <FileSignature className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Agreement Summary</h2>
        </div>
        <div className="prose prose-sm max-w-none">
          <h3>Collaboration Practice Agreement</h3>
          <p>
            This Collaboration Practice Agreement (&quot;Agreement&quot;) is entered into between:
          </p>
          <ul>
            <li>
              <strong>Nurse Practitioner:</strong> {getDisplayName(agreement.npLicense.user)}
            </li>
            <li>
              <strong>Collaborating Physician:</strong> {getDisplayName(agreement.physicianLicense.user)}
            </li>
            <li>
              <strong>State:</strong> {agreement.state.stateName} ({agreement.state.stateCode})
            </li>
          </ul>

          <h4>Terms and Conditions</h4>
          <p>
            This agreement is entered into in accordance with the laws and regulations of the State of{" "}
            {agreement.state.stateName} governing the collaborative practice of nurse practitioners.
          </p>

          {agreement.state.complianceNotes && (
            <div className="bg-gray-50 p-4 rounded-md my-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">State-Specific Requirements</h5>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{agreement.state.complianceNotes}</p>
            </div>
          )}

          <h4>Collaborative Responsibilities</h4>
          <p>
            The collaborating physician agrees to provide supervision, consultation, and quality assurance
            as required by state regulations. The nurse practitioner agrees to maintain appropriate
            communication and documentation as specified in this agreement.
          </p>

          <h4>Duration and Termination</h4>
          <p>
            This agreement shall remain in effect until terminated by either party with appropriate notice
            as required by state law. Termination must be reported to the appropriate state board as required.
          </p>
        </div>
      </div>

      {/* Legal Acknowledgment */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Legal Acknowledgment</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I acknowledge that I have read and understood this Collaboration Practice Agreement. I agree
              to all terms and conditions outlined above. I understand that my electronic signature has the
              same legal effect as a handwritten signature. I am signing this agreement voluntarily and with
              full knowledge of its contents.
            </span>
          </label>
        </div>
      </div>

      {/* Signature Canvas */}
      <div className="rounded-md border bg-white shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Signature</h2>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Please sign in the box below using your mouse, trackpad, or touchscreen.
          </p>
          <div className="border-2 border-gray-300 rounded-md bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "w-full h-48 cursor-crosshair",
              }}
              backgroundColor="white"
              onEnd={handleSignatureEnd}
            />
          </div>
          <p className="text-xs text-gray-500">
            Your signature will be timestamped and your IP address will be recorded for verification purposes.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => router.push(`/dashboard/agreements/${agreementId}`)}
        >
          Cancel
        </Button>
        <Button
          icon={signing ? Loader2 : Check}
          onClick={handleSubmit}
          disabled={signing || signatureEmpty || !acknowledged}
          loading={signing}
        >
          {signing ? (uploadProgress || "Processing...") : "Sign & Submit"}
        </Button>
      </div>
    </div>
  );
}
