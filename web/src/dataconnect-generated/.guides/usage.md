# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserProfile, createLicense, updateLicenseVerification, updateLicenseFpaStatus, createConversation, sendMessage, markMessageAsRead, updateMessageBlocked, createMessageAuditLog, createPhysicianDirectory } from '@dataconnect/generated';


// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation CreateLicense:  For variables, look at type CreateLicenseVars in ../index.d.ts
const { data } = await CreateLicense(dataConnect, createLicenseVars);

// Operation UpdateLicenseVerification:  For variables, look at type UpdateLicenseVerificationVars in ../index.d.ts
const { data } = await UpdateLicenseVerification(dataConnect, updateLicenseVerificationVars);

// Operation UpdateLicenseFPAStatus:  For variables, look at type UpdateLicenseFpaStatusVars in ../index.d.ts
const { data } = await UpdateLicenseFpaStatus(dataConnect, updateLicenseFpaStatusVars);

// Operation CreateConversation:  For variables, look at type CreateConversationVars in ../index.d.ts
const { data } = await CreateConversation(dataConnect, createConversationVars);

// Operation SendMessage:  For variables, look at type SendMessageVars in ../index.d.ts
const { data } = await SendMessage(dataConnect, sendMessageVars);

// Operation MarkMessageAsRead:  For variables, look at type MarkMessageAsReadVars in ../index.d.ts
const { data } = await MarkMessageAsRead(dataConnect, markMessageAsReadVars);

// Operation UpdateMessageBlocked:  For variables, look at type UpdateMessageBlockedVars in ../index.d.ts
const { data } = await UpdateMessageBlocked(dataConnect, updateMessageBlockedVars);

// Operation CreateMessageAuditLog:  For variables, look at type CreateMessageAuditLogVars in ../index.d.ts
const { data } = await CreateMessageAuditLog(dataConnect, createMessageAuditLogVars);

// Operation CreatePhysicianDirectory:  For variables, look at type CreatePhysicianDirectoryVars in ../index.d.ts
const { data } = await CreatePhysicianDirectory(dataConnect, createPhysicianDirectoryVars);


```