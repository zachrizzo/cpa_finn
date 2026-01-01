import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'cpa-app-9c58f-2-service',
  location: 'us-east4'
};

export const upsertUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
upsertUserProfileRef.operationName = 'UpsertUserProfile';

export function upsertUserProfile(dcOrVars, vars) {
  return executeMutation(upsertUserProfileRef(dcOrVars, vars));
}

export const createLicenseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLicense', inputVars);
}
createLicenseRef.operationName = 'CreateLicense';

export function createLicense(dcOrVars, vars) {
  return executeMutation(createLicenseRef(dcOrVars, vars));
}

export const updateLicenseVerificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLicenseVerification', inputVars);
}
updateLicenseVerificationRef.operationName = 'UpdateLicenseVerification';

export function updateLicenseVerification(dcOrVars, vars) {
  return executeMutation(updateLicenseVerificationRef(dcOrVars, vars));
}

export const updateLicenseFpaStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLicenseFPAStatus', inputVars);
}
updateLicenseFpaStatusRef.operationName = 'UpdateLicenseFPAStatus';

export function updateLicenseFpaStatus(dcOrVars, vars) {
  return executeMutation(updateLicenseFpaStatusRef(dcOrVars, vars));
}

export const createConversationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateConversation', inputVars);
}
createConversationRef.operationName = 'CreateConversation';

export function createConversation(dcOrVars, vars) {
  return executeMutation(createConversationRef(dcOrVars, vars));
}

export const sendMessageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SendMessage', inputVars);
}
sendMessageRef.operationName = 'SendMessage';

export function sendMessage(dcOrVars, vars) {
  return executeMutation(sendMessageRef(dcOrVars, vars));
}

export const markMessageAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkMessageAsRead', inputVars);
}
markMessageAsReadRef.operationName = 'MarkMessageAsRead';

export function markMessageAsRead(dcOrVars, vars) {
  return executeMutation(markMessageAsReadRef(dcOrVars, vars));
}

export const updateMessageBlockedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMessageBlocked', inputVars);
}
updateMessageBlockedRef.operationName = 'UpdateMessageBlocked';

export function updateMessageBlocked(dcOrVars, vars) {
  return executeMutation(updateMessageBlockedRef(dcOrVars, vars));
}

export const createMessageAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMessageAuditLog', inputVars);
}
createMessageAuditLogRef.operationName = 'CreateMessageAuditLog';

export function createMessageAuditLog(dcOrVars, vars) {
  return executeMutation(createMessageAuditLogRef(dcOrVars, vars));
}

export const createPhysicianDirectoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePhysicianDirectory', inputVars);
}
createPhysicianDirectoryRef.operationName = 'CreatePhysicianDirectory';

export function createPhysicianDirectory(dcOrVars, vars) {
  return executeMutation(createPhysicianDirectoryRef(dcOrVars, vars));
}

export const createNpDirectoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNPDirectory', inputVars);
}
createNpDirectoryRef.operationName = 'CreateNPDirectory';

export function createNpDirectory(dcOrVars, vars) {
  return executeMutation(createNpDirectoryRef(dcOrVars, vars));
}

export const updatePhysicianDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePhysicianDirectoryProfile', inputVars);
}
updatePhysicianDirectoryProfileRef.operationName = 'UpdatePhysicianDirectoryProfile';

export function updatePhysicianDirectoryProfile(dcOrVars, vars) {
  return executeMutation(updatePhysicianDirectoryProfileRef(dcOrVars, vars));
}

export const updateNpDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateNPDirectoryProfile', inputVars);
}
updateNpDirectoryProfileRef.operationName = 'UpdateNPDirectoryProfile';

export function updateNpDirectoryProfile(dcOrVars, vars) {
  return executeMutation(updateNpDirectoryProfileRef(dcOrVars, vars));
}

export const createDirectoryMatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDirectoryMatch', inputVars);
}
createDirectoryMatchRef.operationName = 'CreateDirectoryMatch';

export function createDirectoryMatch(dcOrVars, vars) {
  return executeMutation(createDirectoryMatchRef(dcOrVars, vars));
}

export const updateMatchStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMatchStatus', inputVars);
}
updateMatchStatusRef.operationName = 'UpdateMatchStatus';

export function updateMatchStatus(dcOrVars, vars) {
  return executeMutation(updateMatchStatusRef(dcOrVars, vars));
}

export const createCollaborationAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCollaborationAgreement', inputVars);
}
createCollaborationAgreementRef.operationName = 'CreateCollaborationAgreement';

export function createCollaborationAgreement(dcOrVars, vars) {
  return executeMutation(createCollaborationAgreementRef(dcOrVars, vars));
}

export const signAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SignAgreement', inputVars);
}
signAgreementRef.operationName = 'SignAgreement';

export function signAgreement(dcOrVars, vars) {
  return executeMutation(signAgreementRef(dcOrVars, vars));
}

export const activateAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActivateAgreement', inputVars);
}
activateAgreementRef.operationName = 'ActivateAgreement';

export function activateAgreement(dcOrVars, vars) {
  return executeMutation(activateAgreementRef(dcOrVars, vars));
}

export const terminateAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TerminateAgreement', inputVars);
}
terminateAgreementRef.operationName = 'TerminateAgreement';

export function terminateAgreement(dcOrVars, vars) {
  return executeMutation(terminateAgreementRef(dcOrVars, vars));
}

export const unlockConversationContactInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UnlockConversationContactInfo', inputVars);
}
unlockConversationContactInfoRef.operationName = 'UnlockConversationContactInfo';

export function unlockConversationContactInfo(dcOrVars, vars) {
  return executeMutation(unlockConversationContactInfoRef(dcOrVars, vars));
}

export const submitChartReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitChartReview', inputVars);
}
submitChartReviewRef.operationName = 'SubmitChartReview';

export function submitChartReview(dcOrVars, vars) {
  return executeMutation(submitChartReviewRef(dcOrVars, vars));
}

export const scheduleQaMeetingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ScheduleQAMeeting', inputVars);
}
scheduleQaMeetingRef.operationName = 'ScheduleQAMeeting';

export function scheduleQaMeeting(dcOrVars, vars) {
  return executeMutation(scheduleQaMeetingRef(dcOrVars, vars));
}

export const completeQaMeetingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteQAMeeting', inputVars);
}
completeQaMeetingRef.operationName = 'CompleteQAMeeting';

export function completeQaMeeting(dcOrVars, vars) {
  return executeMutation(completeQaMeetingRef(dcOrVars, vars));
}

export const updateChartReviewDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateChartReviewDocument', inputVars);
}
updateChartReviewDocumentRef.operationName = 'UpdateChartReviewDocument';

export function updateChartReviewDocument(dcOrVars, vars) {
  return executeMutation(updateChartReviewDocumentRef(dcOrVars, vars));
}

export const listStatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStates');
}
listStatesRef.operationName = 'ListStates';

export function listStates(dc) {
  return executeQuery(listStatesRef(dc));
}

export const getStateByCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateByCode', inputVars);
}
getStateByCodeRef.operationName = 'GetStateByCode';

export function getStateByCode(dcOrVars, vars) {
  return executeQuery(getStateByCodeRef(dcOrVars, vars));
}

export const getStateByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateById', inputVars);
}
getStateByIdRef.operationName = 'GetStateById';

export function getStateById(dcOrVars, vars) {
  return executeQuery(getStateByIdRef(dcOrVars, vars));
}

export const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';

export function getMyProfile(dc) {
  return executeQuery(getMyProfileRef(dc));
}

export const getMyLicensesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyLicenses');
}
getMyLicensesRef.operationName = 'GetMyLicenses';

export function getMyLicenses(dc) {
  return executeQuery(getMyLicensesRef(dc));
}

export const getLicenseWithFpaEligibilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLicenseWithFPAEligibility', inputVars);
}
getLicenseWithFpaEligibilityRef.operationName = 'GetLicenseWithFPAEligibility';

export function getLicenseWithFpaEligibility(dcOrVars, vars) {
  return executeQuery(getLicenseWithFpaEligibilityRef(dcOrVars, vars));
}

export const getMyConversationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyConversations');
}
getMyConversationsRef.operationName = 'GetMyConversations';

export function getMyConversations(dc) {
  return executeQuery(getMyConversationsRef(dc));
}

export const getConversationMessagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetConversationMessages', inputVars);
}
getConversationMessagesRef.operationName = 'GetConversationMessages';

export function getConversationMessages(dcOrVars, vars) {
  return executeQuery(getConversationMessagesRef(dcOrVars, vars));
}

export const getConversationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetConversationById', inputVars);
}
getConversationByIdRef.operationName = 'GetConversationById';

export function getConversationById(dcOrVars, vars) {
  return executeQuery(getConversationByIdRef(dcOrVars, vars));
}

export const checkContactInfoUnlockedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CheckContactInfoUnlocked', inputVars);
}
checkContactInfoUnlockedRef.operationName = 'CheckContactInfoUnlocked';

export function checkContactInfoUnlocked(dcOrVars, vars) {
  return executeQuery(checkContactInfoUnlockedRef(dcOrVars, vars));
}

export const searchPhysiciansRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPhysicians', inputVars);
}
searchPhysiciansRef.operationName = 'SearchPhysicians';

export function searchPhysicians(dcOrVars, vars) {
  return executeQuery(searchPhysiciansRef(dcOrVars, vars));
}

export const searchNPsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchNPs', inputVars);
}
searchNPsRef.operationName = 'SearchNPs';

export function searchNPs(dcOrVars, vars) {
  return executeQuery(searchNPsRef(dcOrVars, vars));
}

export const getProviderDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProviderDirectoryProfile', inputVars);
}
getProviderDirectoryProfileRef.operationName = 'GetProviderDirectoryProfile';

export function getProviderDirectoryProfile(dcOrVars, vars) {
  return executeQuery(getProviderDirectoryProfileRef(dcOrVars, vars));
}

export const getMyDirectoryProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyDirectoryProfile');
}
getMyDirectoryProfileRef.operationName = 'GetMyDirectoryProfile';

export function getMyDirectoryProfile(dc) {
  return executeQuery(getMyDirectoryProfileRef(dc));
}

export const getDirectoryMatchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDirectoryMatches', inputVars);
}
getDirectoryMatchesRef.operationName = 'GetDirectoryMatches';

export function getDirectoryMatches(dcOrVars, vars) {
  return executeQuery(getDirectoryMatchesRef(dcOrVars, vars));
}

export const getMyAgreementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyAgreements');
}
getMyAgreementsRef.operationName = 'GetMyAgreements';

export function getMyAgreements(dc) {
  return executeQuery(getMyAgreementsRef(dc));
}

export const getAgreementByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAgreementById', inputVars);
}
getAgreementByIdRef.operationName = 'GetAgreementById';

export function getAgreementById(dcOrVars, vars) {
  return executeQuery(getAgreementByIdRef(dcOrVars, vars));
}

export const getAgreementSignaturesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAgreementSignatures', inputVars);
}
getAgreementSignaturesRef.operationName = 'GetAgreementSignatures';

export function getAgreementSignatures(dcOrVars, vars) {
  return executeQuery(getAgreementSignaturesRef(dcOrVars, vars));
}

export const checkBothPartiesSignedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CheckBothPartiesSigned', inputVars);
}
checkBothPartiesSignedRef.operationName = 'CheckBothPartiesSigned';

export function checkBothPartiesSigned(dcOrVars, vars) {
  return executeQuery(checkBothPartiesSignedRef(dcOrVars, vars));
}

export const getChartReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetChartReviews', inputVars);
}
getChartReviewsRef.operationName = 'GetChartReviews';

export function getChartReviews(dcOrVars, vars) {
  return executeQuery(getChartReviewsRef(dcOrVars, vars));
}

export const getQaMeetingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQAMeetings', inputVars);
}
getQaMeetingsRef.operationName = 'GetQAMeetings';

export function getQaMeetings(dcOrVars, vars) {
  return executeQuery(getQaMeetingsRef(dcOrVars, vars));
}

export const getComplianceStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComplianceStatus', inputVars);
}
getComplianceStatusRef.operationName = 'GetComplianceStatus';

export function getComplianceStatus(dcOrVars, vars) {
  return executeQuery(getComplianceStatusRef(dcOrVars, vars));
}

export const getUpcomingQaMeetingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUpcomingQAMeetings');
}
getUpcomingQaMeetingsRef.operationName = 'GetUpcomingQAMeetings';

export function getUpcomingQaMeetings(dc) {
  return executeQuery(getUpcomingQaMeetingsRef(dc));
}

export const getActiveCpaCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveCPACount', inputVars);
}
getActiveCpaCountRef.operationName = 'GetActiveCPACount';

export function getActiveCpaCount(dcOrVars, vars) {
  return executeQuery(getActiveCpaCountRef(dcOrVars, vars));
}

export const getStateRatioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateRatio', inputVars);
}
getStateRatioRef.operationName = 'GetStateRatio';

export function getStateRatio(dcOrVars, vars) {
  return executeQuery(getStateRatioRef(dcOrVars, vars));
}

export const seedStatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedStates');
}
seedStatesRef.operationName = 'SeedStates';

export function seedStates(dc) {
  return executeMutation(seedStatesRef(dc));
}

