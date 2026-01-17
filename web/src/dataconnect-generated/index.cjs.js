const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'cpa-app-9c58f-2-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const upsertUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
upsertUserProfileRef.operationName = 'UpsertUserProfile';
exports.upsertUserProfileRef = upsertUserProfileRef;

exports.upsertUserProfile = function upsertUserProfile(dcOrVars, vars) {
  return executeMutation(upsertUserProfileRef(dcOrVars, vars));
};

const createLicenseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLicense', inputVars);
}
createLicenseRef.operationName = 'CreateLicense';
exports.createLicenseRef = createLicenseRef;

exports.createLicense = function createLicense(dcOrVars, vars) {
  return executeMutation(createLicenseRef(dcOrVars, vars));
};

const updateLicenseVerificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLicenseVerification', inputVars);
}
updateLicenseVerificationRef.operationName = 'UpdateLicenseVerification';
exports.updateLicenseVerificationRef = updateLicenseVerificationRef;

exports.updateLicenseVerification = function updateLicenseVerification(dcOrVars, vars) {
  return executeMutation(updateLicenseVerificationRef(dcOrVars, vars));
};

const updateLicenseFpaStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLicenseFPAStatus', inputVars);
}
updateLicenseFpaStatusRef.operationName = 'UpdateLicenseFPAStatus';
exports.updateLicenseFpaStatusRef = updateLicenseFpaStatusRef;

exports.updateLicenseFpaStatus = function updateLicenseFpaStatus(dcOrVars, vars) {
  return executeMutation(updateLicenseFpaStatusRef(dcOrVars, vars));
};

const createConversationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateConversation', inputVars);
}
createConversationRef.operationName = 'CreateConversation';
exports.createConversationRef = createConversationRef;

exports.createConversation = function createConversation(dcOrVars, vars) {
  return executeMutation(createConversationRef(dcOrVars, vars));
};

const sendMessageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SendMessage', inputVars);
}
sendMessageRef.operationName = 'SendMessage';
exports.sendMessageRef = sendMessageRef;

exports.sendMessage = function sendMessage(dcOrVars, vars) {
  return executeMutation(sendMessageRef(dcOrVars, vars));
};

const markMessageAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkMessageAsRead', inputVars);
}
markMessageAsReadRef.operationName = 'MarkMessageAsRead';
exports.markMessageAsReadRef = markMessageAsReadRef;

exports.markMessageAsRead = function markMessageAsRead(dcOrVars, vars) {
  return executeMutation(markMessageAsReadRef(dcOrVars, vars));
};

const updateMessageBlockedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMessageBlocked', inputVars);
}
updateMessageBlockedRef.operationName = 'UpdateMessageBlocked';
exports.updateMessageBlockedRef = updateMessageBlockedRef;

exports.updateMessageBlocked = function updateMessageBlocked(dcOrVars, vars) {
  return executeMutation(updateMessageBlockedRef(dcOrVars, vars));
};

const createMessageAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMessageAuditLog', inputVars);
}
createMessageAuditLogRef.operationName = 'CreateMessageAuditLog';
exports.createMessageAuditLogRef = createMessageAuditLogRef;

exports.createMessageAuditLog = function createMessageAuditLog(dcOrVars, vars) {
  return executeMutation(createMessageAuditLogRef(dcOrVars, vars));
};

const createPhysicianDirectoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePhysicianDirectory', inputVars);
}
createPhysicianDirectoryRef.operationName = 'CreatePhysicianDirectory';
exports.createPhysicianDirectoryRef = createPhysicianDirectoryRef;

exports.createPhysicianDirectory = function createPhysicianDirectory(dcOrVars, vars) {
  return executeMutation(createPhysicianDirectoryRef(dcOrVars, vars));
};

const createNpDirectoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNPDirectory', inputVars);
}
createNpDirectoryRef.operationName = 'CreateNPDirectory';
exports.createNpDirectoryRef = createNpDirectoryRef;

exports.createNpDirectory = function createNpDirectory(dcOrVars, vars) {
  return executeMutation(createNpDirectoryRef(dcOrVars, vars));
};

const updatePhysicianDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePhysicianDirectoryProfile', inputVars);
}
updatePhysicianDirectoryProfileRef.operationName = 'UpdatePhysicianDirectoryProfile';
exports.updatePhysicianDirectoryProfileRef = updatePhysicianDirectoryProfileRef;

exports.updatePhysicianDirectoryProfile = function updatePhysicianDirectoryProfile(dcOrVars, vars) {
  return executeMutation(updatePhysicianDirectoryProfileRef(dcOrVars, vars));
};

const updateNpDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateNPDirectoryProfile', inputVars);
}
updateNpDirectoryProfileRef.operationName = 'UpdateNPDirectoryProfile';
exports.updateNpDirectoryProfileRef = updateNpDirectoryProfileRef;

exports.updateNpDirectoryProfile = function updateNpDirectoryProfile(dcOrVars, vars) {
  return executeMutation(updateNpDirectoryProfileRef(dcOrVars, vars));
};

const createDirectoryMatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDirectoryMatch', inputVars);
}
createDirectoryMatchRef.operationName = 'CreateDirectoryMatch';
exports.createDirectoryMatchRef = createDirectoryMatchRef;

exports.createDirectoryMatch = function createDirectoryMatch(dcOrVars, vars) {
  return executeMutation(createDirectoryMatchRef(dcOrVars, vars));
};

const createDirectoryMatchByPhysicianRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDirectoryMatchByPhysician', inputVars);
}
createDirectoryMatchByPhysicianRef.operationName = 'CreateDirectoryMatchByPhysician';
exports.createDirectoryMatchByPhysicianRef = createDirectoryMatchByPhysicianRef;

exports.createDirectoryMatchByPhysician = function createDirectoryMatchByPhysician(dcOrVars, vars) {
  return executeMutation(createDirectoryMatchByPhysicianRef(dcOrVars, vars));
};

const updateMatchStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMatchStatus', inputVars);
}
updateMatchStatusRef.operationName = 'UpdateMatchStatus';
exports.updateMatchStatusRef = updateMatchStatusRef;

exports.updateMatchStatus = function updateMatchStatus(dcOrVars, vars) {
  return executeMutation(updateMatchStatusRef(dcOrVars, vars));
};

const createCollaborationAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCollaborationAgreement', inputVars);
}
createCollaborationAgreementRef.operationName = 'CreateCollaborationAgreement';
exports.createCollaborationAgreementRef = createCollaborationAgreementRef;

exports.createCollaborationAgreement = function createCollaborationAgreement(dcOrVars, vars) {
  return executeMutation(createCollaborationAgreementRef(dcOrVars, vars));
};

const signAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SignAgreement', inputVars);
}
signAgreementRef.operationName = 'SignAgreement';
exports.signAgreementRef = signAgreementRef;

exports.signAgreement = function signAgreement(dcOrVars, vars) {
  return executeMutation(signAgreementRef(dcOrVars, vars));
};

const activateAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActivateAgreement', inputVars);
}
activateAgreementRef.operationName = 'ActivateAgreement';
exports.activateAgreementRef = activateAgreementRef;

exports.activateAgreement = function activateAgreement(dcOrVars, vars) {
  return executeMutation(activateAgreementRef(dcOrVars, vars));
};

const terminateAgreementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TerminateAgreement', inputVars);
}
terminateAgreementRef.operationName = 'TerminateAgreement';
exports.terminateAgreementRef = terminateAgreementRef;

exports.terminateAgreement = function terminateAgreement(dcOrVars, vars) {
  return executeMutation(terminateAgreementRef(dcOrVars, vars));
};

const unlockConversationContactInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UnlockConversationContactInfo', inputVars);
}
unlockConversationContactInfoRef.operationName = 'UnlockConversationContactInfo';
exports.unlockConversationContactInfoRef = unlockConversationContactInfoRef;

exports.unlockConversationContactInfo = function unlockConversationContactInfo(dcOrVars, vars) {
  return executeMutation(unlockConversationContactInfoRef(dcOrVars, vars));
};

const submitChartReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitChartReview', inputVars);
}
submitChartReviewRef.operationName = 'SubmitChartReview';
exports.submitChartReviewRef = submitChartReviewRef;

exports.submitChartReview = function submitChartReview(dcOrVars, vars) {
  return executeMutation(submitChartReviewRef(dcOrVars, vars));
};

const scheduleQaMeetingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ScheduleQAMeeting', inputVars);
}
scheduleQaMeetingRef.operationName = 'ScheduleQAMeeting';
exports.scheduleQaMeetingRef = scheduleQaMeetingRef;

exports.scheduleQaMeeting = function scheduleQaMeeting(dcOrVars, vars) {
  return executeMutation(scheduleQaMeetingRef(dcOrVars, vars));
};

const completeQaMeetingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteQAMeeting', inputVars);
}
completeQaMeetingRef.operationName = 'CompleteQAMeeting';
exports.completeQaMeetingRef = completeQaMeetingRef;

exports.completeQaMeeting = function completeQaMeeting(dcOrVars, vars) {
  return executeMutation(completeQaMeetingRef(dcOrVars, vars));
};

const updateChartReviewDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateChartReviewDocument', inputVars);
}
updateChartReviewDocumentRef.operationName = 'UpdateChartReviewDocument';
exports.updateChartReviewDocumentRef = updateChartReviewDocumentRef;

exports.updateChartReviewDocument = function updateChartReviewDocument(dcOrVars, vars) {
  return executeMutation(updateChartReviewDocumentRef(dcOrVars, vars));
};

const createMediaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMedia', inputVars);
}
createMediaRef.operationName = 'CreateMedia';
exports.createMediaRef = createMediaRef;

exports.createMedia = function createMedia(dcOrVars, vars) {
  return executeMutation(createMediaRef(dcOrVars, vars));
};

const upsertStateCapacityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStateCapacity', inputVars);
}
upsertStateCapacityRef.operationName = 'UpsertStateCapacity';
exports.upsertStateCapacityRef = upsertStateCapacityRef;

exports.upsertStateCapacity = function upsertStateCapacity(dcOrVars, vars) {
  return executeMutation(upsertStateCapacityRef(dcOrVars, vars));
};

const deleteStateCapacityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStateCapacity', inputVars);
}
deleteStateCapacityRef.operationName = 'DeleteStateCapacity';
exports.deleteStateCapacityRef = deleteStateCapacityRef;

exports.deleteStateCapacity = function deleteStateCapacity(dcOrVars, vars) {
  return executeMutation(deleteStateCapacityRef(dcOrVars, vars));
};

const listStatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStates');
}
listStatesRef.operationName = 'ListStates';
exports.listStatesRef = listStatesRef;

exports.listStates = function listStates(dc) {
  return executeQuery(listStatesRef(dc));
};

const getStateByCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateByCode', inputVars);
}
getStateByCodeRef.operationName = 'GetStateByCode';
exports.getStateByCodeRef = getStateByCodeRef;

exports.getStateByCode = function getStateByCode(dcOrVars, vars) {
  return executeQuery(getStateByCodeRef(dcOrVars, vars));
};

const getStateByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateById', inputVars);
}
getStateByIdRef.operationName = 'GetStateById';
exports.getStateByIdRef = getStateByIdRef;

exports.getStateById = function getStateById(dcOrVars, vars) {
  return executeQuery(getStateByIdRef(dcOrVars, vars));
};

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dc) {
  return executeQuery(getMyProfileRef(dc));
};

const getMyLicensesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyLicenses');
}
getMyLicensesRef.operationName = 'GetMyLicenses';
exports.getMyLicensesRef = getMyLicensesRef;

exports.getMyLicenses = function getMyLicenses(dc) {
  return executeQuery(getMyLicensesRef(dc));
};

const getLicenseWithFpaEligibilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLicenseWithFPAEligibility', inputVars);
}
getLicenseWithFpaEligibilityRef.operationName = 'GetLicenseWithFPAEligibility';
exports.getLicenseWithFpaEligibilityRef = getLicenseWithFpaEligibilityRef;

exports.getLicenseWithFpaEligibility = function getLicenseWithFpaEligibility(dcOrVars, vars) {
  return executeQuery(getLicenseWithFpaEligibilityRef(dcOrVars, vars));
};

const getMyConversationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyConversations');
}
getMyConversationsRef.operationName = 'GetMyConversations';
exports.getMyConversationsRef = getMyConversationsRef;

exports.getMyConversations = function getMyConversations(dc) {
  return executeQuery(getMyConversationsRef(dc));
};

const getConversationMessagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetConversationMessages', inputVars);
}
getConversationMessagesRef.operationName = 'GetConversationMessages';
exports.getConversationMessagesRef = getConversationMessagesRef;

exports.getConversationMessages = function getConversationMessages(dcOrVars, vars) {
  return executeQuery(getConversationMessagesRef(dcOrVars, vars));
};

const getConversationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetConversationById', inputVars);
}
getConversationByIdRef.operationName = 'GetConversationById';
exports.getConversationByIdRef = getConversationByIdRef;

exports.getConversationById = function getConversationById(dcOrVars, vars) {
  return executeQuery(getConversationByIdRef(dcOrVars, vars));
};

const checkContactInfoUnlockedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CheckContactInfoUnlocked', inputVars);
}
checkContactInfoUnlockedRef.operationName = 'CheckContactInfoUnlocked';
exports.checkContactInfoUnlockedRef = checkContactInfoUnlockedRef;

exports.checkContactInfoUnlocked = function checkContactInfoUnlocked(dcOrVars, vars) {
  return executeQuery(checkContactInfoUnlockedRef(dcOrVars, vars));
};

const searchPhysiciansRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPhysicians', inputVars);
}
searchPhysiciansRef.operationName = 'SearchPhysicians';
exports.searchPhysiciansRef = searchPhysiciansRef;

exports.searchPhysicians = function searchPhysicians(dcOrVars, vars) {
  return executeQuery(searchPhysiciansRef(dcOrVars, vars));
};

const searchNPsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchNPs', inputVars);
}
searchNPsRef.operationName = 'SearchNPs';
exports.searchNPsRef = searchNPsRef;

exports.searchNPs = function searchNPs(dcOrVars, vars) {
  return executeQuery(searchNPsRef(dcOrVars, vars));
};

const getProviderDirectoryProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProviderDirectoryProfile', inputVars);
}
getProviderDirectoryProfileRef.operationName = 'GetProviderDirectoryProfile';
exports.getProviderDirectoryProfileRef = getProviderDirectoryProfileRef;

exports.getProviderDirectoryProfile = function getProviderDirectoryProfile(dcOrVars, vars) {
  return executeQuery(getProviderDirectoryProfileRef(dcOrVars, vars));
};

const getMyDirectoryProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyDirectoryProfile');
}
getMyDirectoryProfileRef.operationName = 'GetMyDirectoryProfile';
exports.getMyDirectoryProfileRef = getMyDirectoryProfileRef;

exports.getMyDirectoryProfile = function getMyDirectoryProfile(dc) {
  return executeQuery(getMyDirectoryProfileRef(dc));
};

const getDirectoryMatchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDirectoryMatches', inputVars);
}
getDirectoryMatchesRef.operationName = 'GetDirectoryMatches';
exports.getDirectoryMatchesRef = getDirectoryMatchesRef;

exports.getDirectoryMatches = function getDirectoryMatches(dcOrVars, vars) {
  return executeQuery(getDirectoryMatchesRef(dcOrVars, vars));
};

const getMyAgreementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyAgreements');
}
getMyAgreementsRef.operationName = 'GetMyAgreements';
exports.getMyAgreementsRef = getMyAgreementsRef;

exports.getMyAgreements = function getMyAgreements(dc) {
  return executeQuery(getMyAgreementsRef(dc));
};

const getAgreementByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAgreementById', inputVars);
}
getAgreementByIdRef.operationName = 'GetAgreementById';
exports.getAgreementByIdRef = getAgreementByIdRef;

exports.getAgreementById = function getAgreementById(dcOrVars, vars) {
  return executeQuery(getAgreementByIdRef(dcOrVars, vars));
};

const getAgreementSignaturesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAgreementSignatures', inputVars);
}
getAgreementSignaturesRef.operationName = 'GetAgreementSignatures';
exports.getAgreementSignaturesRef = getAgreementSignaturesRef;

exports.getAgreementSignatures = function getAgreementSignatures(dcOrVars, vars) {
  return executeQuery(getAgreementSignaturesRef(dcOrVars, vars));
};

const checkBothPartiesSignedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CheckBothPartiesSigned', inputVars);
}
checkBothPartiesSignedRef.operationName = 'CheckBothPartiesSigned';
exports.checkBothPartiesSignedRef = checkBothPartiesSignedRef;

exports.checkBothPartiesSigned = function checkBothPartiesSigned(dcOrVars, vars) {
  return executeQuery(checkBothPartiesSignedRef(dcOrVars, vars));
};

const getChartReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetChartReviews', inputVars);
}
getChartReviewsRef.operationName = 'GetChartReviews';
exports.getChartReviewsRef = getChartReviewsRef;

exports.getChartReviews = function getChartReviews(dcOrVars, vars) {
  return executeQuery(getChartReviewsRef(dcOrVars, vars));
};

const getQaMeetingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQAMeetings', inputVars);
}
getQaMeetingsRef.operationName = 'GetQAMeetings';
exports.getQaMeetingsRef = getQaMeetingsRef;

exports.getQaMeetings = function getQaMeetings(dcOrVars, vars) {
  return executeQuery(getQaMeetingsRef(dcOrVars, vars));
};

const getComplianceStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComplianceStatus', inputVars);
}
getComplianceStatusRef.operationName = 'GetComplianceStatus';
exports.getComplianceStatusRef = getComplianceStatusRef;

exports.getComplianceStatus = function getComplianceStatus(dcOrVars, vars) {
  return executeQuery(getComplianceStatusRef(dcOrVars, vars));
};

const getUpcomingQaMeetingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUpcomingQAMeetings');
}
getUpcomingQaMeetingsRef.operationName = 'GetUpcomingQAMeetings';
exports.getUpcomingQaMeetingsRef = getUpcomingQaMeetingsRef;

exports.getUpcomingQaMeetings = function getUpcomingQaMeetings(dc) {
  return executeQuery(getUpcomingQaMeetingsRef(dc));
};

const getActiveCpaCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveCPACount', inputVars);
}
getActiveCpaCountRef.operationName = 'GetActiveCPACount';
exports.getActiveCpaCountRef = getActiveCpaCountRef;

exports.getActiveCpaCount = function getActiveCpaCount(dcOrVars, vars) {
  return executeQuery(getActiveCpaCountRef(dcOrVars, vars));
};

const getStateRatioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStateRatio', inputVars);
}
getStateRatioRef.operationName = 'GetStateRatio';
exports.getStateRatioRef = getStateRatioRef;

exports.getStateRatio = function getStateRatio(dcOrVars, vars) {
  return executeQuery(getStateRatioRef(dcOrVars, vars));
};

const getMyStateCapacitiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyStateCapacities');
}
getMyStateCapacitiesRef.operationName = 'GetMyStateCapacities';
exports.getMyStateCapacitiesRef = getMyStateCapacitiesRef;

exports.getMyStateCapacities = function getMyStateCapacities(dc) {
  return executeQuery(getMyStateCapacitiesRef(dc));
};

const getPhysicianStateCapacitiesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPhysicianStateCapacities', inputVars);
}
getPhysicianStateCapacitiesRef.operationName = 'GetPhysicianStateCapacities';
exports.getPhysicianStateCapacitiesRef = getPhysicianStateCapacitiesRef;

exports.getPhysicianStateCapacities = function getPhysicianStateCapacities(dcOrVars, vars) {
  return executeQuery(getPhysicianStateCapacitiesRef(dcOrVars, vars));
};

const searchPhysiciansWithStateCapacityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPhysiciansWithStateCapacity', inputVars);
}
searchPhysiciansWithStateCapacityRef.operationName = 'SearchPhysiciansWithStateCapacity';
exports.searchPhysiciansWithStateCapacityRef = searchPhysiciansWithStateCapacityRef;

exports.searchPhysiciansWithStateCapacity = function searchPhysiciansWithStateCapacity(dcOrVars, vars) {
  return executeQuery(searchPhysiciansWithStateCapacityRef(dcOrVars, vars));
};

const seedStatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedStates');
}
seedStatesRef.operationName = 'SeedStates';
exports.seedStatesRef = seedStatesRef;

exports.seedStates = function seedStates(dc) {
  return executeMutation(seedStatesRef(dc));
};
