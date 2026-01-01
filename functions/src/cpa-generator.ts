import { onCall, HttpsError } from 'firebase-functions/v2/https';

interface CPAGeneratorRequest {
  agreementId: string;
  npUserId: string;
  physicianUserId: string;
  stateId: string;
}

// Import the Data Connect generated functions
import { getStateById } from '@dataconnect/admin-generated';

/**
 * Cloud Function: generateCPADocument
 *
 * Generates a Collaboration Practice Agreement (CPA) document with state-specific requirements.
 *
 * Input:
 * - agreementId: UUID of the collaboration agreement
 * - npUserId: UUID of the nurse practitioner
 * - physicianUserId: UUID of the collaborating physician
 * - stateId: UUID of the state
 *
 * Output:
 * - agreementId: The agreement ID
 * - documentText: Generated CPA document text with state-specific clauses
 * - status: Status of the generation (success/error)
 * - message: Success or error message
 */
export const generateCPADocument = onCall<CPAGeneratorRequest>(
  async (request) => {
    const { agreementId, npUserId, physicianUserId, stateId } = request.data;
    const userId = request.auth?.uid;

    if (!userId) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    if (!agreementId || !npUserId || !physicianUserId || !stateId) {
      throw new HttpsError(
        'invalid-argument',
        'agreementId, npUserId, physicianUserId, and stateId are required'
      );
    }

    try {
      // Fetch state compliance rules
      const stateResult = await getStateById({ id: stateId });

      if (!stateResult.data.state) {
        throw new HttpsError('not-found', 'State not found');
      }

      const state = stateResult.data.state;

      // Generate CPA document text
      const documentText = generateCPAText(state);

      return {
        agreementId,
        documentText,
        status: 'success',
        message: 'CPA document generated successfully',
      };
    } catch (error: any) {
      console.error('Error generating CPA document:', error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError('internal', `Failed to generate CPA document: ${error.message}`);
    }
  }
);

/**
 * Generate CPA document text with state-specific requirements
 */
function generateCPAText(state: any): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let document = `
COLLABORATION PRACTICE AGREEMENT

State: ${state.stateName} (${state.stateCode})
Date: ${currentDate}

This Collaboration Practice Agreement ("Agreement") is entered into in accordance with the laws and regulations of the State of ${state.stateName} governing the collaborative practice of nurse practitioners and physicians.

═══════════════════════════════════════════════════════════════════════════

1. PURPOSE AND SCOPE

This Agreement establishes the framework for collaboration between the Nurse Practitioner and the Collaborating Physician in accordance with ${state.stateName} state law and the rules of the ${state.stateName} Board of Nursing and Board of Medicine.

The Nurse Practitioner will practice within the scope of their license and certification, providing healthcare services including but not limited to:
- Patient assessment and diagnosis
- Development and implementation of treatment plans
- Prescribing medications and treatments
- Ordering and interpreting diagnostic tests
- Patient education and counseling

═══════════════════════════════════════════════════════════════════════════

2. STATE-SPECIFIC REQUIREMENTS

${state.stateName} requires the following for collaborative practice:
`;

  // Add physician-to-NP ratio requirements
  if (state.physicianNpRatio) {
    document += `\n✓ PHYSICIAN TO NP RATIO: ${state.physicianNpRatio}`;
    if (state.ratioIsFte) {
      document += ' (measured in full-time equivalents)';
    }
    document += '\n  The collaborating physician shall not supervise more nurse practitioners than permitted by state law.';
  }

  // Add chart review requirements
  if (state.chartReviewFrequency) {
    document += `\n\n✓ CHART REVIEW REQUIREMENTS:`;
    document += `\n  Frequency: ${state.chartReviewFrequency}`;
    if (state.chartReviewPercentage) {
      document += `\n  Percentage: ${state.chartReviewPercentage}% of all patient charts`;
    }
    if (state.chartReviewControlledSubstancesOnly) {
      document += `\n  Note: Chart review required for controlled substance prescriptions only`;
    }
    document += `\n  The collaborating physician agrees to review patient charts as required, providing feedback`;
    document += `\n  and consultation on patient care, treatment plans, and clinical decision-making.`;
  }

  // Add QA meeting requirements
  if (state.qaMeetingFrequency) {
    document += `\n\n✓ QUALITY ASSURANCE MEETINGS:`;
    document += `\n  Frequency: ${state.qaMeetingFrequency}`;
    if (state.qaMeetingDurationMonths) {
      document += ` (every ${state.qaMeetingDurationMonths} months)`;
    }
    document += `\n  The parties agree to meet regularly to discuss clinical cases, review outcomes, address`;
    document += `\n  quality improvement initiatives, and ensure compliance with all applicable standards of care.`;
  }

  // Add CPA renewal information
  if (state.cpaRenewalFrequency) {
    document += `\n\n✓ AGREEMENT RENEWAL:`;
    document += `\n  Frequency: ${state.cpaRenewalFrequency}`;
    if (state.cpaAutoRenews) {
      document += ` (automatically renews unless terminated)`;
    } else {
      document += ` (must be actively renewed)`;
    }
  }

  // Add board filing requirements
  if (state.boardFilingRequired) {
    document += `\n\n✓ BOARD FILING REQUIREMENTS:`;
    document += `\n  ${state.stateName} requires this agreement to be filed with the state board.`;
    if (state.boardFilingWho) {
      document += `\n  Responsible party: ${state.boardFilingWho}`;
    }
    if (state.boardFilingFee) {
      document += `\n  Filing fee: $${state.boardFilingFee}`;
    }
    if (state.boardPortalUrl) {
      document += `\n  Board portal: ${state.boardPortalUrl}`;
    }
  }

  // Add compliance notes if available
  if (state.complianceNotes) {
    document += `\n\n✓ ADDITIONAL STATE REQUIREMENTS:`;
    document += `\n${state.complianceNotes}`;
  }

  document += `

═══════════════════════════════════════════════════════════════════════════

3. COLLABORATIVE RESPONSIBILITIES

NURSE PRACTITIONER RESPONSIBILITIES:
• Maintain current licensure and certification in good standing
• Practice within the scope of education, training, and experience
• Consult with the collaborating physician as needed for complex cases
• Maintain accurate and complete patient records
• Participate in quality assurance meetings as required
• Report any adverse events or patient safety concerns
• Maintain professional liability insurance
• Comply with all DEA and controlled substance regulations
• Adhere to HIPAA and patient privacy requirements

COLLABORATING PHYSICIAN RESPONSIBILITIES:
• Maintain current medical license in good standing
• Be available for consultation in person, by phone, or electronically
• Review patient charts as required by state law
• Provide guidance on complex medical cases
• Participate in quality assurance meetings as required
• Report any concerns about patient care or practice standards
• Maintain professional liability insurance
• Support the professional development of the nurse practitioner

═══════════════════════════════════════════════════════════════════════════

4. PRESCRIPTIVE AUTHORITY

The Nurse Practitioner is authorized to prescribe medications, including controlled substances, within the scope of their license and in accordance with ${state.stateName} law and federal DEA regulations.

The Nurse Practitioner agrees to:
• Prescribe medications based on evidence-based guidelines
• Maintain DEA registration for controlled substance prescribing
• Follow state and federal regulations for prescription monitoring programs
• Consult with the collaborating physician on complex pharmacological cases
• Document all prescriptions in the patient medical record

═══════════════════════════════════════════════════════════════════════════

5. COMMUNICATION AND AVAILABILITY

The collaborating physician agrees to be available for consultation during normal business hours and for urgent matters as needed. Communication may occur through:
• In-person consultation
• Telephone consultation
• Secure electronic messaging
• Video conferencing

Emergency consultation protocols will be established to ensure patient safety outside of normal business hours.

═══════════════════════════════════════════════════════════════════════════

6. QUALITY ASSURANCE AND PATIENT SAFETY

Both parties commit to:
• Maintaining the highest standards of patient care
• Participating in peer review and quality improvement activities
• Reporting adverse events through appropriate channels
• Implementing evidence-based clinical guidelines
• Engaging in continuing education and professional development
• Addressing any quality concerns promptly and professionally

═══════════════════════════════════════════════════════════════════════════

7. PROFESSIONAL LIABILITY AND INSURANCE

Both the Nurse Practitioner and Collaborating Physician shall maintain professional liability insurance coverage appropriate to their scope of practice and in compliance with state requirements.

Each party is responsible for their own professional actions and decisions. This Agreement does not create a partnership, joint venture, or employer-employee relationship.

═══════════════════════════════════════════════════════════════════════════

8. CONFIDENTIALITY AND HIPAA COMPLIANCE

Both parties agree to:
• Comply with all HIPAA regulations and state privacy laws
• Maintain the confidentiality of patient information
• Use secure methods for transmitting patient data
• Report any privacy breaches according to legal requirements
• Implement appropriate technical and administrative safeguards

═══════════════════════════════════════════════════════════════════════════

9. DURATION AND TERMINATION

This Agreement shall remain in effect until terminated by either party. Either party may terminate this Agreement with written notice as required by ${state.stateName} law.

TERMINATION REQUIREMENTS:
• Written notice must be provided to the other party
• Notice must be filed with the ${state.stateName} Board of Nursing and Board of Medicine
• Adequate transition time must be provided to ensure continuity of patient care
• Patient notifications must be completed as required by law
• All final chart reviews and documentation must be completed

Termination does not affect the parties' obligations to complete any pending quality assurance activities or to cooperate with board investigations.

═══════════════════════════════════════════════════════════════════════════

10. COMPLIANCE WITH LAWS AND REGULATIONS

This Agreement is subject to all applicable federal and state laws and regulations, including but not limited to:
• ${state.stateName} Nurse Practice Act
• ${state.stateName} Medical Practice Act
• DEA Controlled Substances Act
• HIPAA Privacy and Security Rules
• Medicare and Medicaid regulations
• State board rules and regulations

Any provision of this Agreement found to be in conflict with applicable law shall be modified to comply with such law.

═══════════════════════════════════════════════════════════════════════════

11. AMENDMENTS

This Agreement may be amended only by written agreement signed by both parties. Any amendments must comply with ${state.stateName} law and be filed with the appropriate boards if required.

═══════════════════════════════════════════════════════════════════════════

12. DISPUTE RESOLUTION

Any disputes arising from this Agreement shall be resolved through:
1. Good faith negotiation between the parties
2. Mediation by a mutually agreed-upon neutral third party
3. Other legal remedies as may be appropriate

═══════════════════════════════════════════════════════════════════════════

13. ACKNOWLEDGMENT

By signing this Agreement, both parties acknowledge that they have read and understood all terms and conditions, agree to comply with all applicable laws and regulations, and commit to maintaining the highest standards of patient care and professional conduct.

This Agreement represents the entire understanding between the parties regarding collaborative practice and supersedes any prior agreements or understandings, whether written or oral.

═══════════════════════════════════════════════════════════════════════════

SIGNATURES

This Agreement is executed electronically through the FINN Healthcare Compliance Platform. Electronic signatures have the same legal effect as handwritten signatures under the federal ESIGN Act and ${state.stateName} state law.

Each signature is timestamped and includes verification information (IP address, user agent) to ensure authenticity and non-repudiation.

Date of Agreement: ${currentDate}
State: ${state.stateName}
Platform: FINN Healthcare Compliance Platform

═══════════════════════════════════════════════════════════════════════════

END OF COLLABORATION PRACTICE AGREEMENT
`;

  return document;
}
