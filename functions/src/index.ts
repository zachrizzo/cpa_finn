import { setGlobalOptions } from "firebase-functions";

// Set global options for cost control (max 10 containers per function)
setGlobalOptions({ maxInstances: 10 });

// FPA Calculator Function
export { calculateFPAEligibility } from './fpa-calculator';

// Message filtering functions for HIPAA compliance
export { filterMessageContent, scanMessagesForContactInfo } from './message-filter';

// Capacity tracker functions
export { checkPhysicianCapacity, updatePhysicianCapacity } from './capacity-tracker';

// CPA generator function
export { generateCPADocument } from './cpa-generator';
