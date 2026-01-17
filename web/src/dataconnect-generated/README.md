# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListStates*](#liststates)
  - [*GetStateByCode*](#getstatebycode)
  - [*GetStateById*](#getstatebyid)
  - [*GetMyProfile*](#getmyprofile)
  - [*GetMyLicenses*](#getmylicenses)
  - [*GetLicenseWithFPAEligibility*](#getlicensewithfpaeligibility)
  - [*GetMyConversations*](#getmyconversations)
  - [*GetConversationMessages*](#getconversationmessages)
  - [*GetConversationById*](#getconversationbyid)
  - [*CheckContactInfoUnlocked*](#checkcontactinfounlocked)
  - [*SearchPhysicians*](#searchphysicians)
  - [*SearchNPs*](#searchnps)
  - [*GetProviderDirectoryProfile*](#getproviderdirectoryprofile)
  - [*GetMyDirectoryProfile*](#getmydirectoryprofile)
  - [*GetDirectoryMatches*](#getdirectorymatches)
  - [*GetMyAgreements*](#getmyagreements)
  - [*GetAgreementById*](#getagreementbyid)
  - [*GetAgreementSignatures*](#getagreementsignatures)
  - [*CheckBothPartiesSigned*](#checkbothpartiessigned)
  - [*GetChartReviews*](#getchartreviews)
  - [*GetQAMeetings*](#getqameetings)
  - [*GetComplianceStatus*](#getcompliancestatus)
  - [*GetUpcomingQAMeetings*](#getupcomingqameetings)
  - [*GetActiveCPACount*](#getactivecpacount)
  - [*GetStateRatio*](#getstateratio)
  - [*GetMyStateCapacities*](#getmystatecapacities)
  - [*GetPhysicianStateCapacities*](#getphysicianstatecapacities)
  - [*SearchPhysiciansWithStateCapacity*](#searchphysicianswithstatecapacity)
- [**Mutations**](#mutations)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*CreateLicense*](#createlicense)
  - [*UpdateLicenseVerification*](#updatelicenseverification)
  - [*UpdateLicenseFPAStatus*](#updatelicensefpastatus)
  - [*CreateConversation*](#createconversation)
  - [*SendMessage*](#sendmessage)
  - [*MarkMessageAsRead*](#markmessageasread)
  - [*UpdateMessageBlocked*](#updatemessageblocked)
  - [*CreateMessageAuditLog*](#createmessageauditlog)
  - [*CreatePhysicianDirectory*](#createphysiciandirectory)
  - [*CreateNPDirectory*](#createnpdirectory)
  - [*UpdatePhysicianDirectoryProfile*](#updatephysiciandirectoryprofile)
  - [*UpdateNPDirectoryProfile*](#updatenpdirectoryprofile)
  - [*CreateDirectoryMatch*](#createdirectorymatch)
  - [*CreateDirectoryMatchByPhysician*](#createdirectorymatchbyphysician)
  - [*UpdateMatchStatus*](#updatematchstatus)
  - [*CreateCollaborationAgreement*](#createcollaborationagreement)
  - [*SignAgreement*](#signagreement)
  - [*ActivateAgreement*](#activateagreement)
  - [*TerminateAgreement*](#terminateagreement)
  - [*UnlockConversationContactInfo*](#unlockconversationcontactinfo)
  - [*SubmitChartReview*](#submitchartreview)
  - [*ScheduleQAMeeting*](#scheduleqameeting)
  - [*CompleteQAMeeting*](#completeqameeting)
  - [*UpdateChartReviewDocument*](#updatechartreviewdocument)
  - [*CreateMedia*](#createmedia)
  - [*UpsertStateCapacity*](#upsertstatecapacity)
  - [*DeleteStateCapacity*](#deletestatecapacity)
  - [*SeedStates*](#seedstates)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListStates
You can execute the `ListStates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStates(): QueryPromise<ListStatesData, undefined>;

interface ListStatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStatesData, undefined>;
}
export const listStatesRef: ListStatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStates(dc: DataConnect): QueryPromise<ListStatesData, undefined>;

interface ListStatesRef {
  ...
  (dc: DataConnect): QueryRef<ListStatesData, undefined>;
}
export const listStatesRef: ListStatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStatesRef:
```typescript
const name = listStatesRef.operationName;
console.log(name);
```

### Variables
The `ListStates` query has no variables.
### Return Type
Recall that executing the `ListStates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStatesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStatesData {
  states: ({
    id: UUIDString;
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    fpaWithinStateRequired?: boolean | null;
    fpaCmeHoursRequired?: number | null;
    paVerificationRequired: boolean;
    cpaRequired?: boolean | null;
    boardFilingRequired?: boolean | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  } & State_Key)[];
}
```
### Using `ListStates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStates } from '@dataconnect/generated';


// Call the `listStates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStates(dataConnect);

console.log(data.states);

// Or, you can use the `Promise` API.
listStates().then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

### Using `ListStates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStatesRef } from '@dataconnect/generated';


// Call the `listStatesRef()` function to get a reference to the query.
const ref = listStatesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStatesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.states);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

## GetStateByCode
You can execute the `GetStateByCode` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStateByCode(vars: GetStateByCodeVariables): QueryPromise<GetStateByCodeData, GetStateByCodeVariables>;

interface GetStateByCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateByCodeVariables): QueryRef<GetStateByCodeData, GetStateByCodeVariables>;
}
export const getStateByCodeRef: GetStateByCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStateByCode(dc: DataConnect, vars: GetStateByCodeVariables): QueryPromise<GetStateByCodeData, GetStateByCodeVariables>;

interface GetStateByCodeRef {
  ...
  (dc: DataConnect, vars: GetStateByCodeVariables): QueryRef<GetStateByCodeData, GetStateByCodeVariables>;
}
export const getStateByCodeRef: GetStateByCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStateByCodeRef:
```typescript
const name = getStateByCodeRef.operationName;
console.log(name);
```

### Variables
The `GetStateByCode` query requires an argument of type `GetStateByCodeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStateByCodeVariables {
  stateCode: string;
}
```
### Return Type
Recall that executing the `GetStateByCode` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStateByCodeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStateByCodeData {
  states: ({
    id: UUIDString;
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    fpaWithinStateRequired?: boolean | null;
    cpaRequired?: boolean | null;
    physicianNpRatio?: string | null;
    boardFilingRequired?: boolean | null;
    boardPortalUrl?: string | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  } & State_Key)[];
}
```
### Using `GetStateByCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStateByCode, GetStateByCodeVariables } from '@dataconnect/generated';

// The `GetStateByCode` query requires an argument of type `GetStateByCodeVariables`:
const getStateByCodeVars: GetStateByCodeVariables = {
  stateCode: ..., 
};

// Call the `getStateByCode()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStateByCode(getStateByCodeVars);
// Variables can be defined inline as well.
const { data } = await getStateByCode({ stateCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStateByCode(dataConnect, getStateByCodeVars);

console.log(data.states);

// Or, you can use the `Promise` API.
getStateByCode(getStateByCodeVars).then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

### Using `GetStateByCode`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStateByCodeRef, GetStateByCodeVariables } from '@dataconnect/generated';

// The `GetStateByCode` query requires an argument of type `GetStateByCodeVariables`:
const getStateByCodeVars: GetStateByCodeVariables = {
  stateCode: ..., 
};

// Call the `getStateByCodeRef()` function to get a reference to the query.
const ref = getStateByCodeRef(getStateByCodeVars);
// Variables can be defined inline as well.
const ref = getStateByCodeRef({ stateCode: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStateByCodeRef(dataConnect, getStateByCodeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.states);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

## GetStateById
You can execute the `GetStateById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStateById(vars: GetStateByIdVariables): QueryPromise<GetStateByIdData, GetStateByIdVariables>;

interface GetStateByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateByIdVariables): QueryRef<GetStateByIdData, GetStateByIdVariables>;
}
export const getStateByIdRef: GetStateByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStateById(dc: DataConnect, vars: GetStateByIdVariables): QueryPromise<GetStateByIdData, GetStateByIdVariables>;

interface GetStateByIdRef {
  ...
  (dc: DataConnect, vars: GetStateByIdVariables): QueryRef<GetStateByIdData, GetStateByIdVariables>;
}
export const getStateByIdRef: GetStateByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStateByIdRef:
```typescript
const name = getStateByIdRef.operationName;
console.log(name);
```

### Variables
The `GetStateById` query requires an argument of type `GetStateByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStateByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetStateById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStateByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStateByIdData {
  state?: {
    stateCode: string;
    stateName: string;
    fpaAvailable: boolean;
    paVerificationRequired: boolean;
    nursysCompatible: boolean;
    fpaAutomaticWithLicense?: boolean | null;
    fpaRequiresApplication?: boolean | null;
    fpaHoursRequired?: number | null;
    fpaYearsRequired?: number | null;
    cpaRequired?: boolean | null;
    physicianNpRatio?: string | null;
    boardFilingRequired?: boolean | null;
    boardFilingWho?: string | null;
    boardFilingFee?: number | null;
    boardPortalUrl?: string | null;
    licenseVerificationUrl?: string | null;
    complianceNotes?: string | null;
  };
}
```
### Using `GetStateById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStateById, GetStateByIdVariables } from '@dataconnect/generated';

// The `GetStateById` query requires an argument of type `GetStateByIdVariables`:
const getStateByIdVars: GetStateByIdVariables = {
  id: ..., 
};

// Call the `getStateById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStateById(getStateByIdVars);
// Variables can be defined inline as well.
const { data } = await getStateById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStateById(dataConnect, getStateByIdVars);

console.log(data.state);

// Or, you can use the `Promise` API.
getStateById(getStateByIdVars).then((response) => {
  const data = response.data;
  console.log(data.state);
});
```

### Using `GetStateById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStateByIdRef, GetStateByIdVariables } from '@dataconnect/generated';

// The `GetStateById` query requires an argument of type `GetStateByIdVariables`:
const getStateByIdVars: GetStateByIdVariables = {
  id: ..., 
};

// Call the `getStateByIdRef()` function to get a reference to the query.
const ref = getStateByIdRef(getStateByIdVars);
// Variables can be defined inline as well.
const ref = getStateByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStateByIdRef(dataConnect, getStateByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.state);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.state);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyProfile(): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyProfileData {
  user?: {
    email: string;
    displayName?: string | null;
    role?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  };
}
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@dataconnect/generated';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@dataconnect/generated';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetMyLicenses
You can execute the `GetMyLicenses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyLicenses(): QueryPromise<GetMyLicensesData, undefined>;

interface GetMyLicensesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyLicensesData, undefined>;
}
export const getMyLicensesRef: GetMyLicensesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyLicenses(dc: DataConnect): QueryPromise<GetMyLicensesData, undefined>;

interface GetMyLicensesRef {
  ...
  (dc: DataConnect): QueryRef<GetMyLicensesData, undefined>;
}
export const getMyLicensesRef: GetMyLicensesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyLicensesRef:
```typescript
const name = getMyLicensesRef.operationName;
console.log(name);
```

### Variables
The `GetMyLicenses` query has no variables.
### Return Type
Recall that executing the `GetMyLicenses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyLicensesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyLicensesData {
  licenses: ({
    id: UUIDString;
    licenseNumber: string;
    licenseType: string;
    issueDate: DateString;
    expirationDate: DateString;
    verificationStatus: string;
    verificationDate?: TimestampString | null;
    fpaStatus?: string | null;
    rxAuthorityStatus?: string | null;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
      licenseVerificationUrl?: string | null;
    } & State_Key;
  } & License_Key)[];
}
```
### Using `GetMyLicenses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyLicenses } from '@dataconnect/generated';


// Call the `getMyLicenses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyLicenses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyLicenses(dataConnect);

console.log(data.licenses);

// Or, you can use the `Promise` API.
getMyLicenses().then((response) => {
  const data = response.data;
  console.log(data.licenses);
});
```

### Using `GetMyLicenses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyLicensesRef } from '@dataconnect/generated';


// Call the `getMyLicensesRef()` function to get a reference to the query.
const ref = getMyLicensesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyLicensesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.licenses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.licenses);
});
```

## GetLicenseWithFPAEligibility
You can execute the `GetLicenseWithFPAEligibility` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLicenseWithFpaEligibility(vars: GetLicenseWithFpaEligibilityVariables): QueryPromise<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;

interface GetLicenseWithFpaEligibilityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLicenseWithFpaEligibilityVariables): QueryRef<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;
}
export const getLicenseWithFpaEligibilityRef: GetLicenseWithFpaEligibilityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLicenseWithFpaEligibility(dc: DataConnect, vars: GetLicenseWithFpaEligibilityVariables): QueryPromise<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;

interface GetLicenseWithFpaEligibilityRef {
  ...
  (dc: DataConnect, vars: GetLicenseWithFpaEligibilityVariables): QueryRef<GetLicenseWithFpaEligibilityData, GetLicenseWithFpaEligibilityVariables>;
}
export const getLicenseWithFpaEligibilityRef: GetLicenseWithFpaEligibilityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLicenseWithFpaEligibilityRef:
```typescript
const name = getLicenseWithFpaEligibilityRef.operationName;
console.log(name);
```

### Variables
The `GetLicenseWithFPAEligibility` query requires an argument of type `GetLicenseWithFpaEligibilityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLicenseWithFpaEligibilityVariables {
  licenseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLicenseWithFPAEligibility` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLicenseWithFpaEligibilityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLicenseWithFpaEligibilityData {
  license?: {
    id: UUIDString;
    licenseNumber: string;
    licenseType: string;
    issueDate: DateString;
    expirationDate: DateString;
    verificationStatus: string;
    fpaStatus?: string | null;
    fpaApplicationDate?: DateString | null;
    fpaApprovalDate?: DateString | null;
    fpaVerifiedOnPortal?: boolean | null;
    rxAuthorityStatus?: string | null;
    supervisedHoursInState?: number | null;
    supervisedYearsInState?: number | null;
    notes?: string | null;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
      fpaAvailable: boolean;
      fpaAutomaticWithLicense?: boolean | null;
      fpaRequiresApplication?: boolean | null;
      fpaHoursRequired?: number | null;
      fpaYearsRequired?: number | null;
      fpaWithinStateRequired?: boolean | null;
      cpaRequired?: boolean | null;
      physicianNpRatio?: string | null;
      boardFilingRequired?: boolean | null;
      boardPortalUrl?: string | null;
      licenseVerificationUrl?: string | null;
      complianceNotes?: string | null;
    } & State_Key;
  } & License_Key;
}
```
### Using `GetLicenseWithFPAEligibility`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLicenseWithFpaEligibility, GetLicenseWithFpaEligibilityVariables } from '@dataconnect/generated';

// The `GetLicenseWithFPAEligibility` query requires an argument of type `GetLicenseWithFpaEligibilityVariables`:
const getLicenseWithFpaEligibilityVars: GetLicenseWithFpaEligibilityVariables = {
  licenseId: ..., 
};

// Call the `getLicenseWithFpaEligibility()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLicenseWithFpaEligibility(getLicenseWithFpaEligibilityVars);
// Variables can be defined inline as well.
const { data } = await getLicenseWithFpaEligibility({ licenseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLicenseWithFpaEligibility(dataConnect, getLicenseWithFpaEligibilityVars);

console.log(data.license);

// Or, you can use the `Promise` API.
getLicenseWithFpaEligibility(getLicenseWithFpaEligibilityVars).then((response) => {
  const data = response.data;
  console.log(data.license);
});
```

### Using `GetLicenseWithFPAEligibility`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLicenseWithFpaEligibilityRef, GetLicenseWithFpaEligibilityVariables } from '@dataconnect/generated';

// The `GetLicenseWithFPAEligibility` query requires an argument of type `GetLicenseWithFpaEligibilityVariables`:
const getLicenseWithFpaEligibilityVars: GetLicenseWithFpaEligibilityVariables = {
  licenseId: ..., 
};

// Call the `getLicenseWithFpaEligibilityRef()` function to get a reference to the query.
const ref = getLicenseWithFpaEligibilityRef(getLicenseWithFpaEligibilityVars);
// Variables can be defined inline as well.
const ref = getLicenseWithFpaEligibilityRef({ licenseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLicenseWithFpaEligibilityRef(dataConnect, getLicenseWithFpaEligibilityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.license);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.license);
});
```

## GetMyConversations
You can execute the `GetMyConversations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyConversations(): QueryPromise<GetMyConversationsData, undefined>;

interface GetMyConversationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyConversationsData, undefined>;
}
export const getMyConversationsRef: GetMyConversationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyConversations(dc: DataConnect): QueryPromise<GetMyConversationsData, undefined>;

interface GetMyConversationsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyConversationsData, undefined>;
}
export const getMyConversationsRef: GetMyConversationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyConversationsRef:
```typescript
const name = getMyConversationsRef.operationName;
console.log(name);
```

### Variables
The `GetMyConversations` query has no variables.
### Return Type
Recall that executing the `GetMyConversations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyConversationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyConversationsData {
  conversations: ({
    id: UUIDString;
    conversationId: UUIDString;
    status: string;
    contactInfoUnlocked: boolean;
    lastMessageAt?: TimestampString | null;
    unreadCountNp?: number | null;
    unreadCountPhysician?: number | null;
    createdAt: TimestampString;
    npUser: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physicianUser: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        collaborationAgreement?: {
          id: UUIDString;
          status: string;
          isActive: boolean;
        } & CollaborationAgreement_Key;
  } & Conversation_Key)[];
}
```
### Using `GetMyConversations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyConversations } from '@dataconnect/generated';


// Call the `getMyConversations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyConversations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyConversations(dataConnect);

console.log(data.conversations);

// Or, you can use the `Promise` API.
getMyConversations().then((response) => {
  const data = response.data;
  console.log(data.conversations);
});
```

### Using `GetMyConversations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyConversationsRef } from '@dataconnect/generated';


// Call the `getMyConversationsRef()` function to get a reference to the query.
const ref = getMyConversationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyConversationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conversations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conversations);
});
```

## GetConversationMessages
You can execute the `GetConversationMessages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getConversationMessages(vars: GetConversationMessagesVariables): QueryPromise<GetConversationMessagesData, GetConversationMessagesVariables>;

interface GetConversationMessagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConversationMessagesVariables): QueryRef<GetConversationMessagesData, GetConversationMessagesVariables>;
}
export const getConversationMessagesRef: GetConversationMessagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getConversationMessages(dc: DataConnect, vars: GetConversationMessagesVariables): QueryPromise<GetConversationMessagesData, GetConversationMessagesVariables>;

interface GetConversationMessagesRef {
  ...
  (dc: DataConnect, vars: GetConversationMessagesVariables): QueryRef<GetConversationMessagesData, GetConversationMessagesVariables>;
}
export const getConversationMessagesRef: GetConversationMessagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getConversationMessagesRef:
```typescript
const name = getConversationMessagesRef.operationName;
console.log(name);
```

### Variables
The `GetConversationMessages` query requires an argument of type `GetConversationMessagesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetConversationMessagesVariables {
  conversationId: UUIDString;
}
```
### Return Type
Recall that executing the `GetConversationMessages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetConversationMessagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetConversationMessagesData {
  messages: ({
    id: UUIDString;
    messageType: string;
    messageBody?: string | null;
    containsBlockedContent?: boolean | null;
    blockedContentType?: string | null;
    readAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    createdAt: TimestampString;
    sender: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      conversation: {
        id: UUIDString;
        contactInfoUnlocked: boolean;
      } & Conversation_Key;
  } & Message_Key)[];
}
```
### Using `GetConversationMessages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getConversationMessages, GetConversationMessagesVariables } from '@dataconnect/generated';

// The `GetConversationMessages` query requires an argument of type `GetConversationMessagesVariables`:
const getConversationMessagesVars: GetConversationMessagesVariables = {
  conversationId: ..., 
};

// Call the `getConversationMessages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getConversationMessages(getConversationMessagesVars);
// Variables can be defined inline as well.
const { data } = await getConversationMessages({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getConversationMessages(dataConnect, getConversationMessagesVars);

console.log(data.messages);

// Or, you can use the `Promise` API.
getConversationMessages(getConversationMessagesVars).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

### Using `GetConversationMessages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getConversationMessagesRef, GetConversationMessagesVariables } from '@dataconnect/generated';

// The `GetConversationMessages` query requires an argument of type `GetConversationMessagesVariables`:
const getConversationMessagesVars: GetConversationMessagesVariables = {
  conversationId: ..., 
};

// Call the `getConversationMessagesRef()` function to get a reference to the query.
const ref = getConversationMessagesRef(getConversationMessagesVars);
// Variables can be defined inline as well.
const ref = getConversationMessagesRef({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getConversationMessagesRef(dataConnect, getConversationMessagesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.messages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

## GetConversationById
You can execute the `GetConversationById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getConversationById(vars: GetConversationByIdVariables): QueryPromise<GetConversationByIdData, GetConversationByIdVariables>;

interface GetConversationByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConversationByIdVariables): QueryRef<GetConversationByIdData, GetConversationByIdVariables>;
}
export const getConversationByIdRef: GetConversationByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getConversationById(dc: DataConnect, vars: GetConversationByIdVariables): QueryPromise<GetConversationByIdData, GetConversationByIdVariables>;

interface GetConversationByIdRef {
  ...
  (dc: DataConnect, vars: GetConversationByIdVariables): QueryRef<GetConversationByIdData, GetConversationByIdVariables>;
}
export const getConversationByIdRef: GetConversationByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getConversationByIdRef:
```typescript
const name = getConversationByIdRef.operationName;
console.log(name);
```

### Variables
The `GetConversationById` query requires an argument of type `GetConversationByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetConversationByIdVariables {
  conversationId: UUIDString;
}
```
### Return Type
Recall that executing the `GetConversationById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetConversationByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetConversationByIdData {
  conversation?: {
    id: UUIDString;
    conversationId: UUIDString;
    status: string;
    contactInfoUnlocked: boolean;
    lastMessageAt?: TimestampString | null;
    unreadCountNp?: number | null;
    unreadCountPhysician?: number | null;
    createdAt: TimestampString;
    npUser: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physicianUser: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        collaborationAgreement?: {
          id: UUIDString;
          status: string;
          isActive: boolean;
        } & CollaborationAgreement_Key;
  } & Conversation_Key;
}
```
### Using `GetConversationById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getConversationById, GetConversationByIdVariables } from '@dataconnect/generated';

// The `GetConversationById` query requires an argument of type `GetConversationByIdVariables`:
const getConversationByIdVars: GetConversationByIdVariables = {
  conversationId: ..., 
};

// Call the `getConversationById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getConversationById(getConversationByIdVars);
// Variables can be defined inline as well.
const { data } = await getConversationById({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getConversationById(dataConnect, getConversationByIdVars);

console.log(data.conversation);

// Or, you can use the `Promise` API.
getConversationById(getConversationByIdVars).then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

### Using `GetConversationById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getConversationByIdRef, GetConversationByIdVariables } from '@dataconnect/generated';

// The `GetConversationById` query requires an argument of type `GetConversationByIdVariables`:
const getConversationByIdVars: GetConversationByIdVariables = {
  conversationId: ..., 
};

// Call the `getConversationByIdRef()` function to get a reference to the query.
const ref = getConversationByIdRef(getConversationByIdVars);
// Variables can be defined inline as well.
const ref = getConversationByIdRef({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getConversationByIdRef(dataConnect, getConversationByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conversation);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

## CheckContactInfoUnlocked
You can execute the `CheckContactInfoUnlocked` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
checkContactInfoUnlocked(vars: CheckContactInfoUnlockedVariables): QueryPromise<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;

interface CheckContactInfoUnlockedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckContactInfoUnlockedVariables): QueryRef<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;
}
export const checkContactInfoUnlockedRef: CheckContactInfoUnlockedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
checkContactInfoUnlocked(dc: DataConnect, vars: CheckContactInfoUnlockedVariables): QueryPromise<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;

interface CheckContactInfoUnlockedRef {
  ...
  (dc: DataConnect, vars: CheckContactInfoUnlockedVariables): QueryRef<CheckContactInfoUnlockedData, CheckContactInfoUnlockedVariables>;
}
export const checkContactInfoUnlockedRef: CheckContactInfoUnlockedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the checkContactInfoUnlockedRef:
```typescript
const name = checkContactInfoUnlockedRef.operationName;
console.log(name);
```

### Variables
The `CheckContactInfoUnlocked` query requires an argument of type `CheckContactInfoUnlockedVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CheckContactInfoUnlockedVariables {
  conversationId: UUIDString;
}
```
### Return Type
Recall that executing the `CheckContactInfoUnlocked` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CheckContactInfoUnlockedData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CheckContactInfoUnlockedData {
  conversation?: {
    id: UUIDString;
    contactInfoUnlocked: boolean;
    collaborationAgreement?: {
      id: UUIDString;
      status: string;
      isActive: boolean;
    } & CollaborationAgreement_Key;
  } & Conversation_Key;
}
```
### Using `CheckContactInfoUnlocked`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, checkContactInfoUnlocked, CheckContactInfoUnlockedVariables } from '@dataconnect/generated';

// The `CheckContactInfoUnlocked` query requires an argument of type `CheckContactInfoUnlockedVariables`:
const checkContactInfoUnlockedVars: CheckContactInfoUnlockedVariables = {
  conversationId: ..., 
};

// Call the `checkContactInfoUnlocked()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await checkContactInfoUnlocked(checkContactInfoUnlockedVars);
// Variables can be defined inline as well.
const { data } = await checkContactInfoUnlocked({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await checkContactInfoUnlocked(dataConnect, checkContactInfoUnlockedVars);

console.log(data.conversation);

// Or, you can use the `Promise` API.
checkContactInfoUnlocked(checkContactInfoUnlockedVars).then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

### Using `CheckContactInfoUnlocked`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, checkContactInfoUnlockedRef, CheckContactInfoUnlockedVariables } from '@dataconnect/generated';

// The `CheckContactInfoUnlocked` query requires an argument of type `CheckContactInfoUnlockedVariables`:
const checkContactInfoUnlockedVars: CheckContactInfoUnlockedVariables = {
  conversationId: ..., 
};

// Call the `checkContactInfoUnlockedRef()` function to get a reference to the query.
const ref = checkContactInfoUnlockedRef(checkContactInfoUnlockedVars);
// Variables can be defined inline as well.
const ref = checkContactInfoUnlockedRef({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = checkContactInfoUnlockedRef(dataConnect, checkContactInfoUnlockedVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.conversation);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation);
});
```

## SearchPhysicians
You can execute the `SearchPhysicians` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchPhysicians(vars?: SearchPhysiciansVariables): QueryPromise<SearchPhysiciansData, SearchPhysiciansVariables>;

interface SearchPhysiciansRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchPhysiciansVariables): QueryRef<SearchPhysiciansData, SearchPhysiciansVariables>;
}
export const searchPhysiciansRef: SearchPhysiciansRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchPhysicians(dc: DataConnect, vars?: SearchPhysiciansVariables): QueryPromise<SearchPhysiciansData, SearchPhysiciansVariables>;

interface SearchPhysiciansRef {
  ...
  (dc: DataConnect, vars?: SearchPhysiciansVariables): QueryRef<SearchPhysiciansData, SearchPhysiciansVariables>;
}
export const searchPhysiciansRef: SearchPhysiciansRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchPhysiciansRef:
```typescript
const name = searchPhysiciansRef.operationName;
console.log(name);
```

### Variables
The `SearchPhysicians` query has an optional argument of type `SearchPhysiciansVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchPhysiciansVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  availableForNewNPs?: boolean | null;
}
```
### Return Type
Recall that executing the `SearchPhysicians` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchPhysiciansData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchPhysiciansData {
  providerDirectories: ({
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      availableStates: string;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      yearsSupervising?: number | null;
      responseTime?: string | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  })[];
}
```
### Using `SearchPhysicians`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchPhysicians, SearchPhysiciansVariables } from '@dataconnect/generated';

// The `SearchPhysicians` query has an optional argument of type `SearchPhysiciansVariables`:
const searchPhysiciansVars: SearchPhysiciansVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  availableForNewNPs: ..., // optional
};

// Call the `searchPhysicians()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchPhysicians(searchPhysiciansVars);
// Variables can be defined inline as well.
const { data } = await searchPhysicians({ stateCode: ..., specialtyType: ..., availableForNewNPs: ..., });
// Since all variables are optional for this query, you can omit the `SearchPhysiciansVariables` argument.
const { data } = await searchPhysicians();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchPhysicians(dataConnect, searchPhysiciansVars);

console.log(data.providerDirectories);

// Or, you can use the `Promise` API.
searchPhysicians(searchPhysiciansVars).then((response) => {
  const data = response.data;
  console.log(data.providerDirectories);
});
```

### Using `SearchPhysicians`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchPhysiciansRef, SearchPhysiciansVariables } from '@dataconnect/generated';

// The `SearchPhysicians` query has an optional argument of type `SearchPhysiciansVariables`:
const searchPhysiciansVars: SearchPhysiciansVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  availableForNewNPs: ..., // optional
};

// Call the `searchPhysiciansRef()` function to get a reference to the query.
const ref = searchPhysiciansRef(searchPhysiciansVars);
// Variables can be defined inline as well.
const ref = searchPhysiciansRef({ stateCode: ..., specialtyType: ..., availableForNewNPs: ..., });
// Since all variables are optional for this query, you can omit the `SearchPhysiciansVariables` argument.
const ref = searchPhysiciansRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchPhysiciansRef(dataConnect, searchPhysiciansVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerDirectories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectories);
});
```

## SearchNPs
You can execute the `SearchNPs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchNPs(vars?: SearchNPsVariables): QueryPromise<SearchNPsData, SearchNPsVariables>;

interface SearchNPsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchNPsVariables): QueryRef<SearchNPsData, SearchNPsVariables>;
}
export const searchNPsRef: SearchNPsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchNPs(dc: DataConnect, vars?: SearchNPsVariables): QueryPromise<SearchNPsData, SearchNPsVariables>;

interface SearchNPsRef {
  ...
  (dc: DataConnect, vars?: SearchNPsVariables): QueryRef<SearchNPsData, SearchNPsVariables>;
}
export const searchNPsRef: SearchNPsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchNPsRef:
```typescript
const name = searchNPsRef.operationName;
console.log(name);
```

### Variables
The `SearchNPs` query has an optional argument of type `SearchNPsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchNPsVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  needsCPA?: boolean | null;
}
```
### Return Type
Recall that executing the `SearchNPs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchNPsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchNPsData {
  npDirectories: ({
    np: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      seekingStates: string;
      licensedStates: string;
      fpaStates?: string | null;
      cpaNeededStates?: string | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      hoursPerWeekAvailable?: number | null;
      startDateAvailability?: DateString | null;
      yearsExperience?: number | null;
      preferredCompensationModel?: string | null;
      budgetRange?: string | null;
  })[];
}
```
### Using `SearchNPs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchNPs, SearchNPsVariables } from '@dataconnect/generated';

// The `SearchNPs` query has an optional argument of type `SearchNPsVariables`:
const searchNPsVars: SearchNPsVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  needsCPA: ..., // optional
};

// Call the `searchNPs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchNPs(searchNPsVars);
// Variables can be defined inline as well.
const { data } = await searchNPs({ stateCode: ..., specialtyType: ..., needsCPA: ..., });
// Since all variables are optional for this query, you can omit the `SearchNPsVariables` argument.
const { data } = await searchNPs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchNPs(dataConnect, searchNPsVars);

console.log(data.npDirectories);

// Or, you can use the `Promise` API.
searchNPs(searchNPsVars).then((response) => {
  const data = response.data;
  console.log(data.npDirectories);
});
```

### Using `SearchNPs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchNPsRef, SearchNPsVariables } from '@dataconnect/generated';

// The `SearchNPs` query has an optional argument of type `SearchNPsVariables`:
const searchNPsVars: SearchNPsVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  needsCPA: ..., // optional
};

// Call the `searchNPsRef()` function to get a reference to the query.
const ref = searchNPsRef(searchNPsVars);
// Variables can be defined inline as well.
const ref = searchNPsRef({ stateCode: ..., specialtyType: ..., needsCPA: ..., });
// Since all variables are optional for this query, you can omit the `SearchNPsVariables` argument.
const ref = searchNPsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchNPsRef(dataConnect, searchNPsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.npDirectories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.npDirectories);
});
```

## GetProviderDirectoryProfile
You can execute the `GetProviderDirectoryProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProviderDirectoryProfile(vars: GetProviderDirectoryProfileVariables): QueryPromise<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;

interface GetProviderDirectoryProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProviderDirectoryProfileVariables): QueryRef<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;
}
export const getProviderDirectoryProfileRef: GetProviderDirectoryProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProviderDirectoryProfile(dc: DataConnect, vars: GetProviderDirectoryProfileVariables): QueryPromise<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;

interface GetProviderDirectoryProfileRef {
  ...
  (dc: DataConnect, vars: GetProviderDirectoryProfileVariables): QueryRef<GetProviderDirectoryProfileData, GetProviderDirectoryProfileVariables>;
}
export const getProviderDirectoryProfileRef: GetProviderDirectoryProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProviderDirectoryProfileRef:
```typescript
const name = getProviderDirectoryProfileRef.operationName;
console.log(name);
```

### Variables
The `GetProviderDirectoryProfile` query requires an argument of type `GetProviderDirectoryProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProviderDirectoryProfileVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetProviderDirectoryProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProviderDirectoryProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProviderDirectoryProfileData {
  providerDirectory?: {
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      profileVisibility: string;
      availableStates: string;
      preferredStates?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      minimumHoursRequired?: number | null;
      maximumHoursOffered?: number | null;
      responseTime?: string | null;
      preferredContactMethod?: string | null;
      yearsSupervising?: number | null;
      totalNpSupervised?: number | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  };
    npDirectory?: {
      np: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        isActive: boolean;
        profileVisibility: string;
        seekingStates: string;
        licensedStates: string;
        fpaStates?: string | null;
        cpaNeededStates?: string | null;
        hoursPerWeekAvailable?: number | null;
        startDateAvailability?: DateString | null;
        primarySpecialty: string;
        secondarySpecialties?: string | null;
        yearsExperience?: number | null;
        preferredCompensationModel?: string | null;
        budgetRange?: string | null;
    };
}
```
### Using `GetProviderDirectoryProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProviderDirectoryProfile, GetProviderDirectoryProfileVariables } from '@dataconnect/generated';

// The `GetProviderDirectoryProfile` query requires an argument of type `GetProviderDirectoryProfileVariables`:
const getProviderDirectoryProfileVars: GetProviderDirectoryProfileVariables = {
  userId: ..., 
};

// Call the `getProviderDirectoryProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProviderDirectoryProfile(getProviderDirectoryProfileVars);
// Variables can be defined inline as well.
const { data } = await getProviderDirectoryProfile({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProviderDirectoryProfile(dataConnect, getProviderDirectoryProfileVars);

console.log(data.providerDirectory);
console.log(data.npDirectory);

// Or, you can use the `Promise` API.
getProviderDirectoryProfile(getProviderDirectoryProfileVars).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory);
  console.log(data.npDirectory);
});
```

### Using `GetProviderDirectoryProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProviderDirectoryProfileRef, GetProviderDirectoryProfileVariables } from '@dataconnect/generated';

// The `GetProviderDirectoryProfile` query requires an argument of type `GetProviderDirectoryProfileVariables`:
const getProviderDirectoryProfileVars: GetProviderDirectoryProfileVariables = {
  userId: ..., 
};

// Call the `getProviderDirectoryProfileRef()` function to get a reference to the query.
const ref = getProviderDirectoryProfileRef(getProviderDirectoryProfileVars);
// Variables can be defined inline as well.
const ref = getProviderDirectoryProfileRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProviderDirectoryProfileRef(dataConnect, getProviderDirectoryProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerDirectory);
console.log(data.npDirectory);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory);
  console.log(data.npDirectory);
});
```

## GetMyDirectoryProfile
You can execute the `GetMyDirectoryProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyDirectoryProfile(): QueryPromise<GetMyDirectoryProfileData, undefined>;

interface GetMyDirectoryProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyDirectoryProfileData, undefined>;
}
export const getMyDirectoryProfileRef: GetMyDirectoryProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyDirectoryProfile(dc: DataConnect): QueryPromise<GetMyDirectoryProfileData, undefined>;

interface GetMyDirectoryProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyDirectoryProfileData, undefined>;
}
export const getMyDirectoryProfileRef: GetMyDirectoryProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyDirectoryProfileRef:
```typescript
const name = getMyDirectoryProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyDirectoryProfile` query has no variables.
### Return Type
Recall that executing the `GetMyDirectoryProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyDirectoryProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyDirectoryProfileData {
  providerDirectory?: {
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      isActive: boolean;
      profileVisibility: string;
      availableStates: string;
      preferredStates?: string | null;
      notAcceptingStates?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      minimumHoursRequired?: number | null;
      maximumHoursOffered?: number | null;
      responseTime?: string | null;
      preferredContactMethod?: string | null;
      yearsSupervising?: number | null;
      totalNpSupervised?: number | null;
      currentNpTestimonials?: string | null;
      isVerified?: boolean | null;
      isPremiumPhysician?: boolean | null;
      badges?: string | null;
      lastActiveAt?: TimestampString | null;
      createdAt: TimestampString;
  };
    npDirectory?: {
      np: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
        isActive: boolean;
        profileVisibility: string;
        seekingStates: string;
        licensedStates: string;
        fpaStates?: string | null;
        cpaNeededStates?: string | null;
        hoursPerWeekAvailable?: number | null;
        startDateAvailability?: DateString | null;
        primarySpecialty: string;
        secondarySpecialties?: string | null;
        yearsExperience?: number | null;
        totalPatientsSeen?: number | null;
        preferredCompensationModel?: string | null;
        budgetRange?: string | null;
        lastActiveAt?: TimestampString | null;
        createdAt: TimestampString;
    };
}
```
### Using `GetMyDirectoryProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyDirectoryProfile } from '@dataconnect/generated';


// Call the `getMyDirectoryProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyDirectoryProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyDirectoryProfile(dataConnect);

console.log(data.providerDirectory);
console.log(data.npDirectory);

// Or, you can use the `Promise` API.
getMyDirectoryProfile().then((response) => {
  const data = response.data;
  console.log(data.providerDirectory);
  console.log(data.npDirectory);
});
```

### Using `GetMyDirectoryProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyDirectoryProfileRef } from '@dataconnect/generated';


// Call the `getMyDirectoryProfileRef()` function to get a reference to the query.
const ref = getMyDirectoryProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyDirectoryProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerDirectory);
console.log(data.npDirectory);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory);
  console.log(data.npDirectory);
});
```

## GetDirectoryMatches
You can execute the `GetDirectoryMatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getDirectoryMatches(vars: GetDirectoryMatchesVariables): QueryPromise<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;

interface GetDirectoryMatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDirectoryMatchesVariables): QueryRef<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;
}
export const getDirectoryMatchesRef: GetDirectoryMatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDirectoryMatches(dc: DataConnect, vars: GetDirectoryMatchesVariables): QueryPromise<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;

interface GetDirectoryMatchesRef {
  ...
  (dc: DataConnect, vars: GetDirectoryMatchesVariables): QueryRef<GetDirectoryMatchesData, GetDirectoryMatchesVariables>;
}
export const getDirectoryMatchesRef: GetDirectoryMatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDirectoryMatchesRef:
```typescript
const name = getDirectoryMatchesRef.operationName;
console.log(name);
```

### Variables
The `GetDirectoryMatches` query requires an argument of type `GetDirectoryMatchesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDirectoryMatchesVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetDirectoryMatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDirectoryMatchesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDirectoryMatchesData {
  directoryMatches: ({
    id: UUIDString;
    np: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      physician: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
        state: {
          stateCode: string;
          stateName: string;
        };
          status: string;
          initiatedBy: string;
          firstContactAt: TimestampString;
          lastContactAt?: TimestampString | null;
          messageCount?: number | null;
          agreedToCollaborate?: boolean | null;
          agreedAt?: TimestampString | null;
          declinedBy?: string | null;
          declinedAt?: TimestampString | null;
          declineReason?: string | null;
          createdAt: TimestampString;
  } & DirectoryMatch_Key)[];
}
```
### Using `GetDirectoryMatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDirectoryMatches, GetDirectoryMatchesVariables } from '@dataconnect/generated';

// The `GetDirectoryMatches` query requires an argument of type `GetDirectoryMatchesVariables`:
const getDirectoryMatchesVars: GetDirectoryMatchesVariables = {
  userId: ..., 
};

// Call the `getDirectoryMatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDirectoryMatches(getDirectoryMatchesVars);
// Variables can be defined inline as well.
const { data } = await getDirectoryMatches({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDirectoryMatches(dataConnect, getDirectoryMatchesVars);

console.log(data.directoryMatches);

// Or, you can use the `Promise` API.
getDirectoryMatches(getDirectoryMatchesVars).then((response) => {
  const data = response.data;
  console.log(data.directoryMatches);
});
```

### Using `GetDirectoryMatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDirectoryMatchesRef, GetDirectoryMatchesVariables } from '@dataconnect/generated';

// The `GetDirectoryMatches` query requires an argument of type `GetDirectoryMatchesVariables`:
const getDirectoryMatchesVars: GetDirectoryMatchesVariables = {
  userId: ..., 
};

// Call the `getDirectoryMatchesRef()` function to get a reference to the query.
const ref = getDirectoryMatchesRef(getDirectoryMatchesVars);
// Variables can be defined inline as well.
const ref = getDirectoryMatchesRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDirectoryMatchesRef(dataConnect, getDirectoryMatchesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.directoryMatches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.directoryMatches);
});
```

## GetMyAgreements
You can execute the `GetMyAgreements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyAgreements(): QueryPromise<GetMyAgreementsData, undefined>;

interface GetMyAgreementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyAgreementsData, undefined>;
}
export const getMyAgreementsRef: GetMyAgreementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyAgreements(dc: DataConnect): QueryPromise<GetMyAgreementsData, undefined>;

interface GetMyAgreementsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyAgreementsData, undefined>;
}
export const getMyAgreementsRef: GetMyAgreementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyAgreementsRef:
```typescript
const name = getMyAgreementsRef.operationName;
console.log(name);
```

### Variables
The `GetMyAgreements` query has no variables.
### Return Type
Recall that executing the `GetMyAgreements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyAgreementsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyAgreementsData {
  collaborationAgreements: ({
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    boardFilingDate?: DateString | null;
    boardApprovalDate?: DateString | null;
    terminationDate?: DateString | null;
    terminationReason?: string | null;
    docusignUrl?: string | null;
    npLicense: {
      id: UUIDString;
      licenseNumber: string;
      licenseType: string;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        licenseNumber: string;
        licenseType: string;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
          stateCode: string;
          stateName: string;
          cpaRequired?: boolean | null;
          physicianNpRatio?: string | null;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          qaMeetingFrequency?: string | null;
          cpaRenewalFrequency?: string | null;
          boardFilingRequired?: boolean | null;
          complianceNotes?: string | null;
        } & State_Key;
  } & CollaborationAgreement_Key)[];
}
```
### Using `GetMyAgreements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyAgreements } from '@dataconnect/generated';


// Call the `getMyAgreements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyAgreements();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyAgreements(dataConnect);

console.log(data.collaborationAgreements);

// Or, you can use the `Promise` API.
getMyAgreements().then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
});
```

### Using `GetMyAgreements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyAgreementsRef } from '@dataconnect/generated';


// Call the `getMyAgreementsRef()` function to get a reference to the query.
const ref = getMyAgreementsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyAgreementsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
});
```

## GetAgreementById
You can execute the `GetAgreementById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAgreementById(vars: GetAgreementByIdVariables): QueryPromise<GetAgreementByIdData, GetAgreementByIdVariables>;

interface GetAgreementByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAgreementByIdVariables): QueryRef<GetAgreementByIdData, GetAgreementByIdVariables>;
}
export const getAgreementByIdRef: GetAgreementByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAgreementById(dc: DataConnect, vars: GetAgreementByIdVariables): QueryPromise<GetAgreementByIdData, GetAgreementByIdVariables>;

interface GetAgreementByIdRef {
  ...
  (dc: DataConnect, vars: GetAgreementByIdVariables): QueryRef<GetAgreementByIdData, GetAgreementByIdVariables>;
}
export const getAgreementByIdRef: GetAgreementByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAgreementByIdRef:
```typescript
const name = getAgreementByIdRef.operationName;
console.log(name);
```

### Variables
The `GetAgreementById` query requires an argument of type `GetAgreementByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAgreementByIdVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAgreementById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAgreementByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAgreementByIdData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    docusignUrl?: string | null;
    boardFilingDate?: DateString | null;
    boardApprovalDate?: DateString | null;
    terminationDate?: DateString | null;
    terminationReason?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    isBoardReported?: boolean | null;
    boardReportingStatus?: string | null;
    boardReportingInstructions?: string | null;
    terminationResponsibility?: string | null;
    npLicense: {
      id: UUIDString;
      licenseNumber: string;
      licenseType: string;
      issueDate: DateString;
      expirationDate: DateString;
      verificationStatus: string;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        licenseNumber: string;
        licenseType: string;
        issueDate: DateString;
        expirationDate: DateString;
        verificationStatus: string;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
          role?: string | null;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
          stateCode: string;
          stateName: string;
          cpaRequired?: boolean | null;
          physicianNpRatio?: string | null;
          ratioIsFte?: boolean | null;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          chartReviewControlledSubstancesOnly?: boolean | null;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
          boardFilingRequired?: boolean | null;
          boardFilingWho?: string | null;
          boardFilingFee?: number | null;
          boardPortalUrl?: string | null;
          cpaRenewalFrequency?: string | null;
          cpaAutoRenews?: boolean | null;
          complianceNotes?: string | null;
        } & State_Key;
  } & CollaborationAgreement_Key;
}
```
### Using `GetAgreementById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAgreementById, GetAgreementByIdVariables } from '@dataconnect/generated';

// The `GetAgreementById` query requires an argument of type `GetAgreementByIdVariables`:
const getAgreementByIdVars: GetAgreementByIdVariables = {
  agreementId: ..., 
};

// Call the `getAgreementById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAgreementById(getAgreementByIdVars);
// Variables can be defined inline as well.
const { data } = await getAgreementById({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAgreementById(dataConnect, getAgreementByIdVars);

console.log(data.collaborationAgreement);

// Or, you can use the `Promise` API.
getAgreementById(getAgreementByIdVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
});
```

### Using `GetAgreementById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAgreementByIdRef, GetAgreementByIdVariables } from '@dataconnect/generated';

// The `GetAgreementById` query requires an argument of type `GetAgreementByIdVariables`:
const getAgreementByIdVars: GetAgreementByIdVariables = {
  agreementId: ..., 
};

// Call the `getAgreementByIdRef()` function to get a reference to the query.
const ref = getAgreementByIdRef(getAgreementByIdVars);
// Variables can be defined inline as well.
const ref = getAgreementByIdRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAgreementByIdRef(dataConnect, getAgreementByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreement);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
});
```

## GetAgreementSignatures
You can execute the `GetAgreementSignatures` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAgreementSignatures(vars: GetAgreementSignaturesVariables): QueryPromise<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;

interface GetAgreementSignaturesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAgreementSignaturesVariables): QueryRef<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;
}
export const getAgreementSignaturesRef: GetAgreementSignaturesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAgreementSignatures(dc: DataConnect, vars: GetAgreementSignaturesVariables): QueryPromise<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;

interface GetAgreementSignaturesRef {
  ...
  (dc: DataConnect, vars: GetAgreementSignaturesVariables): QueryRef<GetAgreementSignaturesData, GetAgreementSignaturesVariables>;
}
export const getAgreementSignaturesRef: GetAgreementSignaturesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAgreementSignaturesRef:
```typescript
const name = getAgreementSignaturesRef.operationName;
console.log(name);
```

### Variables
The `GetAgreementSignatures` query requires an argument of type `GetAgreementSignaturesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAgreementSignaturesVariables {
  npUserId: string;
  physicianUserId: string;
}
```
### Return Type
Recall that executing the `GetAgreementSignatures` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAgreementSignaturesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAgreementSignaturesData {
  documentSignatures: ({
    signer: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      signedAt: TimestampString;
      signatureMethod: string;
      ipAddress?: string | null;
      createdAt: TimestampString;
  })[];
}
```
### Using `GetAgreementSignatures`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAgreementSignatures, GetAgreementSignaturesVariables } from '@dataconnect/generated';

// The `GetAgreementSignatures` query requires an argument of type `GetAgreementSignaturesVariables`:
const getAgreementSignaturesVars: GetAgreementSignaturesVariables = {
  npUserId: ..., 
  physicianUserId: ..., 
};

// Call the `getAgreementSignatures()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAgreementSignatures(getAgreementSignaturesVars);
// Variables can be defined inline as well.
const { data } = await getAgreementSignatures({ npUserId: ..., physicianUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAgreementSignatures(dataConnect, getAgreementSignaturesVars);

console.log(data.documentSignatures);

// Or, you can use the `Promise` API.
getAgreementSignatures(getAgreementSignaturesVars).then((response) => {
  const data = response.data;
  console.log(data.documentSignatures);
});
```

### Using `GetAgreementSignatures`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAgreementSignaturesRef, GetAgreementSignaturesVariables } from '@dataconnect/generated';

// The `GetAgreementSignatures` query requires an argument of type `GetAgreementSignaturesVariables`:
const getAgreementSignaturesVars: GetAgreementSignaturesVariables = {
  npUserId: ..., 
  physicianUserId: ..., 
};

// Call the `getAgreementSignaturesRef()` function to get a reference to the query.
const ref = getAgreementSignaturesRef(getAgreementSignaturesVars);
// Variables can be defined inline as well.
const ref = getAgreementSignaturesRef({ npUserId: ..., physicianUserId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAgreementSignaturesRef(dataConnect, getAgreementSignaturesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.documentSignatures);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.documentSignatures);
});
```

## CheckBothPartiesSigned
You can execute the `CheckBothPartiesSigned` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
checkBothPartiesSigned(vars: CheckBothPartiesSignedVariables): QueryPromise<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;

interface CheckBothPartiesSignedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckBothPartiesSignedVariables): QueryRef<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;
}
export const checkBothPartiesSignedRef: CheckBothPartiesSignedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
checkBothPartiesSigned(dc: DataConnect, vars: CheckBothPartiesSignedVariables): QueryPromise<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;

interface CheckBothPartiesSignedRef {
  ...
  (dc: DataConnect, vars: CheckBothPartiesSignedVariables): QueryRef<CheckBothPartiesSignedData, CheckBothPartiesSignedVariables>;
}
export const checkBothPartiesSignedRef: CheckBothPartiesSignedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the checkBothPartiesSignedRef:
```typescript
const name = checkBothPartiesSignedRef.operationName;
console.log(name);
```

### Variables
The `CheckBothPartiesSigned` query requires an argument of type `CheckBothPartiesSignedVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CheckBothPartiesSignedVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `CheckBothPartiesSigned` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CheckBothPartiesSignedData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CheckBothPartiesSignedData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    npLicense: {
      user: {
        id: string;
        displayName?: string | null;
      } & User_Key;
    };
      physicianLicense: {
        user: {
          id: string;
          displayName?: string | null;
        } & User_Key;
      };
  } & CollaborationAgreement_Key;
}
```
### Using `CheckBothPartiesSigned`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, checkBothPartiesSigned, CheckBothPartiesSignedVariables } from '@dataconnect/generated';

// The `CheckBothPartiesSigned` query requires an argument of type `CheckBothPartiesSignedVariables`:
const checkBothPartiesSignedVars: CheckBothPartiesSignedVariables = {
  agreementId: ..., 
};

// Call the `checkBothPartiesSigned()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await checkBothPartiesSigned(checkBothPartiesSignedVars);
// Variables can be defined inline as well.
const { data } = await checkBothPartiesSigned({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await checkBothPartiesSigned(dataConnect, checkBothPartiesSignedVars);

console.log(data.collaborationAgreement);

// Or, you can use the `Promise` API.
checkBothPartiesSigned(checkBothPartiesSignedVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
});
```

### Using `CheckBothPartiesSigned`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, checkBothPartiesSignedRef, CheckBothPartiesSignedVariables } from '@dataconnect/generated';

// The `CheckBothPartiesSigned` query requires an argument of type `CheckBothPartiesSignedVariables`:
const checkBothPartiesSignedVars: CheckBothPartiesSignedVariables = {
  agreementId: ..., 
};

// Call the `checkBothPartiesSignedRef()` function to get a reference to the query.
const ref = checkBothPartiesSignedRef(checkBothPartiesSignedVars);
// Variables can be defined inline as well.
const ref = checkBothPartiesSignedRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = checkBothPartiesSignedRef(dataConnect, checkBothPartiesSignedVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreement);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
});
```

## GetChartReviews
You can execute the `GetChartReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getChartReviews(vars: GetChartReviewsVariables): QueryPromise<GetChartReviewsData, GetChartReviewsVariables>;

interface GetChartReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChartReviewsVariables): QueryRef<GetChartReviewsData, GetChartReviewsVariables>;
}
export const getChartReviewsRef: GetChartReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getChartReviews(dc: DataConnect, vars: GetChartReviewsVariables): QueryPromise<GetChartReviewsData, GetChartReviewsVariables>;

interface GetChartReviewsRef {
  ...
  (dc: DataConnect, vars: GetChartReviewsVariables): QueryRef<GetChartReviewsData, GetChartReviewsVariables>;
}
export const getChartReviewsRef: GetChartReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getChartReviewsRef:
```typescript
const name = getChartReviewsRef.operationName;
console.log(name);
```

### Variables
The `GetChartReviews` query requires an argument of type `GetChartReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetChartReviewsVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `GetChartReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetChartReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetChartReviewsData {
  chartReviews: ({
    id: UUIDString;
    reviewDate: DateString;
    isTimely: boolean;
    notes?: string | null;
    chartIdentifier?: string | null;
    reviewPercentage?: number | null;
    isControlledSubstanceChart?: boolean | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    reviewer: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      collaborationAgreement: {
        id: UUIDString;
        status: string;
        state: {
          stateCode: string;
          stateName: string;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          chartReviewControlledSubstancesOnly?: boolean | null;
        };
      } & CollaborationAgreement_Key;
  } & ChartReview_Key)[];
}
```
### Using `GetChartReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getChartReviews, GetChartReviewsVariables } from '@dataconnect/generated';

// The `GetChartReviews` query requires an argument of type `GetChartReviewsVariables`:
const getChartReviewsVars: GetChartReviewsVariables = {
  agreementId: ..., 
};

// Call the `getChartReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getChartReviews(getChartReviewsVars);
// Variables can be defined inline as well.
const { data } = await getChartReviews({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getChartReviews(dataConnect, getChartReviewsVars);

console.log(data.chartReviews);

// Or, you can use the `Promise` API.
getChartReviews(getChartReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.chartReviews);
});
```

### Using `GetChartReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getChartReviewsRef, GetChartReviewsVariables } from '@dataconnect/generated';

// The `GetChartReviews` query requires an argument of type `GetChartReviewsVariables`:
const getChartReviewsVars: GetChartReviewsVariables = {
  agreementId: ..., 
};

// Call the `getChartReviewsRef()` function to get a reference to the query.
const ref = getChartReviewsRef(getChartReviewsVars);
// Variables can be defined inline as well.
const ref = getChartReviewsRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getChartReviewsRef(dataConnect, getChartReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.chartReviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.chartReviews);
});
```

## GetQAMeetings
You can execute the `GetQAMeetings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getQaMeetings(vars: GetQaMeetingsVariables): QueryPromise<GetQaMeetingsData, GetQaMeetingsVariables>;

interface GetQaMeetingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQaMeetingsVariables): QueryRef<GetQaMeetingsData, GetQaMeetingsVariables>;
}
export const getQaMeetingsRef: GetQaMeetingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQaMeetings(dc: DataConnect, vars: GetQaMeetingsVariables): QueryPromise<GetQaMeetingsData, GetQaMeetingsVariables>;

interface GetQaMeetingsRef {
  ...
  (dc: DataConnect, vars: GetQaMeetingsVariables): QueryRef<GetQaMeetingsData, GetQaMeetingsVariables>;
}
export const getQaMeetingsRef: GetQaMeetingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQaMeetingsRef:
```typescript
const name = getQaMeetingsRef.operationName;
console.log(name);
```

### Variables
The `GetQAMeetings` query requires an argument of type `GetQaMeetingsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQaMeetingsVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQAMeetings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQaMeetingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQaMeetingsData {
  qualityAssuranceMeetings: ({
    id: UUIDString;
    meetingDate: TimestampString;
    notes?: string | null;
    meetingDocumentUrl?: string | null;
    meetingType?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    host: {
      id: string;
      displayName?: string | null;
      email: string;
      role?: string | null;
    } & User_Key;
      collaborationAgreement: {
        id: UUIDString;
        status: string;
        state: {
          stateCode: string;
          stateName: string;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
        };
      } & CollaborationAgreement_Key;
  } & QualityAssuranceMeeting_Key)[];
}
```
### Using `GetQAMeetings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQaMeetings, GetQaMeetingsVariables } from '@dataconnect/generated';

// The `GetQAMeetings` query requires an argument of type `GetQaMeetingsVariables`:
const getQaMeetingsVars: GetQaMeetingsVariables = {
  agreementId: ..., 
};

// Call the `getQaMeetings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQaMeetings(getQaMeetingsVars);
// Variables can be defined inline as well.
const { data } = await getQaMeetings({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQaMeetings(dataConnect, getQaMeetingsVars);

console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
getQaMeetings(getQaMeetingsVars).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeetings);
});
```

### Using `GetQAMeetings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQaMeetingsRef, GetQaMeetingsVariables } from '@dataconnect/generated';

// The `GetQAMeetings` query requires an argument of type `GetQaMeetingsVariables`:
const getQaMeetingsVars: GetQaMeetingsVariables = {
  agreementId: ..., 
};

// Call the `getQaMeetingsRef()` function to get a reference to the query.
const ref = getQaMeetingsRef(getQaMeetingsVars);
// Variables can be defined inline as well.
const ref = getQaMeetingsRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQaMeetingsRef(dataConnect, getQaMeetingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeetings);
});
```

## GetComplianceStatus
You can execute the `GetComplianceStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComplianceStatus(vars: GetComplianceStatusVariables): QueryPromise<GetComplianceStatusData, GetComplianceStatusVariables>;

interface GetComplianceStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComplianceStatusVariables): QueryRef<GetComplianceStatusData, GetComplianceStatusVariables>;
}
export const getComplianceStatusRef: GetComplianceStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComplianceStatus(dc: DataConnect, vars: GetComplianceStatusVariables): QueryPromise<GetComplianceStatusData, GetComplianceStatusVariables>;

interface GetComplianceStatusRef {
  ...
  (dc: DataConnect, vars: GetComplianceStatusVariables): QueryRef<GetComplianceStatusData, GetComplianceStatusVariables>;
}
export const getComplianceStatusRef: GetComplianceStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComplianceStatusRef:
```typescript
const name = getComplianceStatusRef.operationName;
console.log(name);
```

### Variables
The `GetComplianceStatus` query requires an argument of type `GetComplianceStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComplianceStatusVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `GetComplianceStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComplianceStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComplianceStatusData {
  collaborationAgreement?: {
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    boardApprovalDate?: DateString | null;
    npLicense: {
      id: UUIDString;
      user: {
        id: string;
        displayName?: string | null;
        email: string;
        role?: string | null;
      } & User_Key;
    } & License_Key;
      physicianLicense: {
        id: UUIDString;
        user: {
          id: string;
          displayName?: string | null;
          email: string;
          role?: string | null;
        } & User_Key;
      } & License_Key;
        state: {
          id: UUIDString;
          stateCode: string;
          stateName: string;
          chartReviewFrequency?: string | null;
          chartReviewPercentage?: number | null;
          chartReviewControlledSubstancesOnly?: boolean | null;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
          cpaRenewalFrequency?: string | null;
          cpaAutoRenews?: boolean | null;
          complianceNotes?: string | null;
        } & State_Key;
  } & CollaborationAgreement_Key;
    chartReviews: ({
      id: UUIDString;
      reviewDate: DateString;
      isTimely: boolean;
      reviewPercentage?: number | null;
      createdAt: TimestampString;
    } & ChartReview_Key)[];
      qualityAssuranceMeetings: ({
        id: UUIDString;
        meetingDate: TimestampString;
        createdAt: TimestampString;
      } & QualityAssuranceMeeting_Key)[];
}
```
### Using `GetComplianceStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComplianceStatus, GetComplianceStatusVariables } from '@dataconnect/generated';

// The `GetComplianceStatus` query requires an argument of type `GetComplianceStatusVariables`:
const getComplianceStatusVars: GetComplianceStatusVariables = {
  agreementId: ..., 
};

// Call the `getComplianceStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComplianceStatus(getComplianceStatusVars);
// Variables can be defined inline as well.
const { data } = await getComplianceStatus({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComplianceStatus(dataConnect, getComplianceStatusVars);

console.log(data.collaborationAgreement);
console.log(data.chartReviews);
console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
getComplianceStatus(getComplianceStatusVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
  console.log(data.chartReviews);
  console.log(data.qualityAssuranceMeetings);
});
```

### Using `GetComplianceStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComplianceStatusRef, GetComplianceStatusVariables } from '@dataconnect/generated';

// The `GetComplianceStatus` query requires an argument of type `GetComplianceStatusVariables`:
const getComplianceStatusVars: GetComplianceStatusVariables = {
  agreementId: ..., 
};

// Call the `getComplianceStatusRef()` function to get a reference to the query.
const ref = getComplianceStatusRef(getComplianceStatusVars);
// Variables can be defined inline as well.
const ref = getComplianceStatusRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComplianceStatusRef(dataConnect, getComplianceStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreement);
console.log(data.chartReviews);
console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement);
  console.log(data.chartReviews);
  console.log(data.qualityAssuranceMeetings);
});
```

## GetUpcomingQAMeetings
You can execute the `GetUpcomingQAMeetings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUpcomingQaMeetings(): QueryPromise<GetUpcomingQaMeetingsData, undefined>;

interface GetUpcomingQaMeetingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUpcomingQaMeetingsData, undefined>;
}
export const getUpcomingQaMeetingsRef: GetUpcomingQaMeetingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUpcomingQaMeetings(dc: DataConnect): QueryPromise<GetUpcomingQaMeetingsData, undefined>;

interface GetUpcomingQaMeetingsRef {
  ...
  (dc: DataConnect): QueryRef<GetUpcomingQaMeetingsData, undefined>;
}
export const getUpcomingQaMeetingsRef: GetUpcomingQaMeetingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUpcomingQaMeetingsRef:
```typescript
const name = getUpcomingQaMeetingsRef.operationName;
console.log(name);
```

### Variables
The `GetUpcomingQAMeetings` query has no variables.
### Return Type
Recall that executing the `GetUpcomingQAMeetings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUpcomingQaMeetingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUpcomingQaMeetingsData {
  collaborationAgreements: ({
    id: UUIDString;
    status: string;
    isActive: boolean;
    createdAt: TimestampString;
    boardApprovalDate?: DateString | null;
    npLicense: {
      user: {
        id: string;
        displayName?: string | null;
        email: string;
      } & User_Key;
    };
      physicianLicense: {
        user: {
          id: string;
          displayName?: string | null;
          email: string;
        } & User_Key;
      };
        state: {
          stateCode: string;
          stateName: string;
          qaMeetingFrequency?: string | null;
          qaMeetingDurationMonths?: number | null;
          complianceNotes?: string | null;
        };
  } & CollaborationAgreement_Key)[];
    qualityAssuranceMeetings: ({
      id: UUIDString;
      meetingDate: TimestampString;
      meetingType?: string | null;
      createdAt: TimestampString;
      collaborationAgreement: {
        id: UUIDString;
      } & CollaborationAgreement_Key;
    } & QualityAssuranceMeeting_Key)[];
}
```
### Using `GetUpcomingQAMeetings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUpcomingQaMeetings } from '@dataconnect/generated';


// Call the `getUpcomingQaMeetings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUpcomingQaMeetings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUpcomingQaMeetings(dataConnect);

console.log(data.collaborationAgreements);
console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
getUpcomingQaMeetings().then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
  console.log(data.qualityAssuranceMeetings);
});
```

### Using `GetUpcomingQAMeetings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUpcomingQaMeetingsRef } from '@dataconnect/generated';


// Call the `getUpcomingQaMeetingsRef()` function to get a reference to the query.
const ref = getUpcomingQaMeetingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUpcomingQaMeetingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreements);
console.log(data.qualityAssuranceMeetings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
  console.log(data.qualityAssuranceMeetings);
});
```

## GetActiveCPACount
You can execute the `GetActiveCPACount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getActiveCpaCount(vars: GetActiveCpaCountVariables): QueryPromise<GetActiveCpaCountData, GetActiveCpaCountVariables>;

interface GetActiveCpaCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveCpaCountVariables): QueryRef<GetActiveCpaCountData, GetActiveCpaCountVariables>;
}
export const getActiveCpaCountRef: GetActiveCpaCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveCpaCount(dc: DataConnect, vars: GetActiveCpaCountVariables): QueryPromise<GetActiveCpaCountData, GetActiveCpaCountVariables>;

interface GetActiveCpaCountRef {
  ...
  (dc: DataConnect, vars: GetActiveCpaCountVariables): QueryRef<GetActiveCpaCountData, GetActiveCpaCountVariables>;
}
export const getActiveCpaCountRef: GetActiveCpaCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveCpaCountRef:
```typescript
const name = getActiveCpaCountRef.operationName;
console.log(name);
```

### Variables
The `GetActiveCPACount` query requires an argument of type `GetActiveCpaCountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveCpaCountVariables {
  physicianId: string;
  stateCode: string;
}
```
### Return Type
Recall that executing the `GetActiveCPACount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveCpaCountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetActiveCpaCountData {
  collaborationAgreements: ({
    id: UUIDString;
  } & CollaborationAgreement_Key)[];
}
```
### Using `GetActiveCPACount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveCpaCount, GetActiveCpaCountVariables } from '@dataconnect/generated';

// The `GetActiveCPACount` query requires an argument of type `GetActiveCpaCountVariables`:
const getActiveCpaCountVars: GetActiveCpaCountVariables = {
  physicianId: ..., 
  stateCode: ..., 
};

// Call the `getActiveCpaCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveCpaCount(getActiveCpaCountVars);
// Variables can be defined inline as well.
const { data } = await getActiveCpaCount({ physicianId: ..., stateCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveCpaCount(dataConnect, getActiveCpaCountVars);

console.log(data.collaborationAgreements);

// Or, you can use the `Promise` API.
getActiveCpaCount(getActiveCpaCountVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
});
```

### Using `GetActiveCPACount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveCpaCountRef, GetActiveCpaCountVariables } from '@dataconnect/generated';

// The `GetActiveCPACount` query requires an argument of type `GetActiveCpaCountVariables`:
const getActiveCpaCountVars: GetActiveCpaCountVariables = {
  physicianId: ..., 
  stateCode: ..., 
};

// Call the `getActiveCpaCountRef()` function to get a reference to the query.
const ref = getActiveCpaCountRef(getActiveCpaCountVars);
// Variables can be defined inline as well.
const ref = getActiveCpaCountRef({ physicianId: ..., stateCode: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveCpaCountRef(dataConnect, getActiveCpaCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collaborationAgreements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreements);
});
```

## GetStateRatio
You can execute the `GetStateRatio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStateRatio(vars: GetStateRatioVariables): QueryPromise<GetStateRatioData, GetStateRatioVariables>;

interface GetStateRatioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStateRatioVariables): QueryRef<GetStateRatioData, GetStateRatioVariables>;
}
export const getStateRatioRef: GetStateRatioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStateRatio(dc: DataConnect, vars: GetStateRatioVariables): QueryPromise<GetStateRatioData, GetStateRatioVariables>;

interface GetStateRatioRef {
  ...
  (dc: DataConnect, vars: GetStateRatioVariables): QueryRef<GetStateRatioData, GetStateRatioVariables>;
}
export const getStateRatioRef: GetStateRatioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStateRatioRef:
```typescript
const name = getStateRatioRef.operationName;
console.log(name);
```

### Variables
The `GetStateRatio` query requires an argument of type `GetStateRatioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStateRatioVariables {
  stateCode: string;
}
```
### Return Type
Recall that executing the `GetStateRatio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStateRatioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStateRatioData {
  states: ({
    physicianNpRatio?: string | null;
    hasRatioLimit: boolean;
    ratioNote?: string | null;
  })[];
}
```
### Using `GetStateRatio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStateRatio, GetStateRatioVariables } from '@dataconnect/generated';

// The `GetStateRatio` query requires an argument of type `GetStateRatioVariables`:
const getStateRatioVars: GetStateRatioVariables = {
  stateCode: ..., 
};

// Call the `getStateRatio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStateRatio(getStateRatioVars);
// Variables can be defined inline as well.
const { data } = await getStateRatio({ stateCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStateRatio(dataConnect, getStateRatioVars);

console.log(data.states);

// Or, you can use the `Promise` API.
getStateRatio(getStateRatioVars).then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

### Using `GetStateRatio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStateRatioRef, GetStateRatioVariables } from '@dataconnect/generated';

// The `GetStateRatio` query requires an argument of type `GetStateRatioVariables`:
const getStateRatioVars: GetStateRatioVariables = {
  stateCode: ..., 
};

// Call the `getStateRatioRef()` function to get a reference to the query.
const ref = getStateRatioRef(getStateRatioVars);
// Variables can be defined inline as well.
const ref = getStateRatioRef({ stateCode: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStateRatioRef(dataConnect, getStateRatioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.states);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.states);
});
```

## GetMyStateCapacities
You can execute the `GetMyStateCapacities` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyStateCapacities(): QueryPromise<GetMyStateCapacitiesData, undefined>;

interface GetMyStateCapacitiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyStateCapacitiesData, undefined>;
}
export const getMyStateCapacitiesRef: GetMyStateCapacitiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyStateCapacities(dc: DataConnect): QueryPromise<GetMyStateCapacitiesData, undefined>;

interface GetMyStateCapacitiesRef {
  ...
  (dc: DataConnect): QueryRef<GetMyStateCapacitiesData, undefined>;
}
export const getMyStateCapacitiesRef: GetMyStateCapacitiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyStateCapacitiesRef:
```typescript
const name = getMyStateCapacitiesRef.operationName;
console.log(name);
```

### Variables
The `GetMyStateCapacities` query has no variables.
### Return Type
Recall that executing the `GetMyStateCapacities` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyStateCapacitiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyStateCapacitiesData {
  providerStateCapacities: ({
    id: UUIDString;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
    } & State_Key;
      maxNpCapacity: number;
      currentNpCount: number;
      isAccepting: boolean;
      notes?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
  } & ProviderStateCapacity_Key)[];
}
```
### Using `GetMyStateCapacities`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyStateCapacities } from '@dataconnect/generated';


// Call the `getMyStateCapacities()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyStateCapacities();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyStateCapacities(dataConnect);

console.log(data.providerStateCapacities);

// Or, you can use the `Promise` API.
getMyStateCapacities().then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacities);
});
```

### Using `GetMyStateCapacities`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyStateCapacitiesRef } from '@dataconnect/generated';


// Call the `getMyStateCapacitiesRef()` function to get a reference to the query.
const ref = getMyStateCapacitiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyStateCapacitiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerStateCapacities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacities);
});
```

## GetPhysicianStateCapacities
You can execute the `GetPhysicianStateCapacities` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPhysicianStateCapacities(vars: GetPhysicianStateCapacitiesVariables): QueryPromise<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;

interface GetPhysicianStateCapacitiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPhysicianStateCapacitiesVariables): QueryRef<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;
}
export const getPhysicianStateCapacitiesRef: GetPhysicianStateCapacitiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPhysicianStateCapacities(dc: DataConnect, vars: GetPhysicianStateCapacitiesVariables): QueryPromise<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;

interface GetPhysicianStateCapacitiesRef {
  ...
  (dc: DataConnect, vars: GetPhysicianStateCapacitiesVariables): QueryRef<GetPhysicianStateCapacitiesData, GetPhysicianStateCapacitiesVariables>;
}
export const getPhysicianStateCapacitiesRef: GetPhysicianStateCapacitiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPhysicianStateCapacitiesRef:
```typescript
const name = getPhysicianStateCapacitiesRef.operationName;
console.log(name);
```

### Variables
The `GetPhysicianStateCapacities` query requires an argument of type `GetPhysicianStateCapacitiesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPhysicianStateCapacitiesVariables {
  physicianId: string;
}
```
### Return Type
Recall that executing the `GetPhysicianStateCapacities` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPhysicianStateCapacitiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPhysicianStateCapacitiesData {
  providerStateCapacities: ({
    id: UUIDString;
    state: {
      id: UUIDString;
      stateCode: string;
      stateName: string;
    } & State_Key;
      maxNpCapacity: number;
      currentNpCount: number;
      isAccepting: boolean;
      notes?: string | null;
  } & ProviderStateCapacity_Key)[];
}
```
### Using `GetPhysicianStateCapacities`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPhysicianStateCapacities, GetPhysicianStateCapacitiesVariables } from '@dataconnect/generated';

// The `GetPhysicianStateCapacities` query requires an argument of type `GetPhysicianStateCapacitiesVariables`:
const getPhysicianStateCapacitiesVars: GetPhysicianStateCapacitiesVariables = {
  physicianId: ..., 
};

// Call the `getPhysicianStateCapacities()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPhysicianStateCapacities(getPhysicianStateCapacitiesVars);
// Variables can be defined inline as well.
const { data } = await getPhysicianStateCapacities({ physicianId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPhysicianStateCapacities(dataConnect, getPhysicianStateCapacitiesVars);

console.log(data.providerStateCapacities);

// Or, you can use the `Promise` API.
getPhysicianStateCapacities(getPhysicianStateCapacitiesVars).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacities);
});
```

### Using `GetPhysicianStateCapacities`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPhysicianStateCapacitiesRef, GetPhysicianStateCapacitiesVariables } from '@dataconnect/generated';

// The `GetPhysicianStateCapacities` query requires an argument of type `GetPhysicianStateCapacitiesVariables`:
const getPhysicianStateCapacitiesVars: GetPhysicianStateCapacitiesVariables = {
  physicianId: ..., 
};

// Call the `getPhysicianStateCapacitiesRef()` function to get a reference to the query.
const ref = getPhysicianStateCapacitiesRef(getPhysicianStateCapacitiesVars);
// Variables can be defined inline as well.
const ref = getPhysicianStateCapacitiesRef({ physicianId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPhysicianStateCapacitiesRef(dataConnect, getPhysicianStateCapacitiesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerStateCapacities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacities);
});
```

## SearchPhysiciansWithStateCapacity
You can execute the `SearchPhysiciansWithStateCapacity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchPhysiciansWithStateCapacity(vars?: SearchPhysiciansWithStateCapacityVariables): QueryPromise<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;

interface SearchPhysiciansWithStateCapacityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchPhysiciansWithStateCapacityVariables): QueryRef<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;
}
export const searchPhysiciansWithStateCapacityRef: SearchPhysiciansWithStateCapacityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchPhysiciansWithStateCapacity(dc: DataConnect, vars?: SearchPhysiciansWithStateCapacityVariables): QueryPromise<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;

interface SearchPhysiciansWithStateCapacityRef {
  ...
  (dc: DataConnect, vars?: SearchPhysiciansWithStateCapacityVariables): QueryRef<SearchPhysiciansWithStateCapacityData, SearchPhysiciansWithStateCapacityVariables>;
}
export const searchPhysiciansWithStateCapacityRef: SearchPhysiciansWithStateCapacityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchPhysiciansWithStateCapacityRef:
```typescript
const name = searchPhysiciansWithStateCapacityRef.operationName;
console.log(name);
```

### Variables
The `SearchPhysiciansWithStateCapacity` query has an optional argument of type `SearchPhysiciansWithStateCapacityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchPhysiciansWithStateCapacityVariables {
  stateCode?: string | null;
  specialtyType?: string | null;
  availableForNewNPs?: boolean | null;
}
```
### Return Type
Recall that executing the `SearchPhysiciansWithStateCapacity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchPhysiciansWithStateCapacityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchPhysiciansWithStateCapacityData {
  providerDirectories: ({
    physician: {
      id: string;
      displayName?: string | null;
      email: string;
    } & User_Key;
      isActive: boolean;
      availableStates: string;
      primarySpecialty: string;
      secondarySpecialties?: string | null;
      totalNpCapacity?: number | null;
      currentNpCount?: number | null;
      availableSpots?: number | null;
      supervisionModel: string;
      hourlyRate?: number | null;
      revenueSharePercentage?: number | null;
      yearsSupervising?: number | null;
      responseTime?: string | null;
      badges?: string | null;
      isPremiumPhysician?: boolean | null;
  })[];
}
```
### Using `SearchPhysiciansWithStateCapacity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchPhysiciansWithStateCapacity, SearchPhysiciansWithStateCapacityVariables } from '@dataconnect/generated';

// The `SearchPhysiciansWithStateCapacity` query has an optional argument of type `SearchPhysiciansWithStateCapacityVariables`:
const searchPhysiciansWithStateCapacityVars: SearchPhysiciansWithStateCapacityVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  availableForNewNPs: ..., // optional
};

// Call the `searchPhysiciansWithStateCapacity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchPhysiciansWithStateCapacity(searchPhysiciansWithStateCapacityVars);
// Variables can be defined inline as well.
const { data } = await searchPhysiciansWithStateCapacity({ stateCode: ..., specialtyType: ..., availableForNewNPs: ..., });
// Since all variables are optional for this query, you can omit the `SearchPhysiciansWithStateCapacityVariables` argument.
const { data } = await searchPhysiciansWithStateCapacity();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchPhysiciansWithStateCapacity(dataConnect, searchPhysiciansWithStateCapacityVars);

console.log(data.providerDirectories);

// Or, you can use the `Promise` API.
searchPhysiciansWithStateCapacity(searchPhysiciansWithStateCapacityVars).then((response) => {
  const data = response.data;
  console.log(data.providerDirectories);
});
```

### Using `SearchPhysiciansWithStateCapacity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchPhysiciansWithStateCapacityRef, SearchPhysiciansWithStateCapacityVariables } from '@dataconnect/generated';

// The `SearchPhysiciansWithStateCapacity` query has an optional argument of type `SearchPhysiciansWithStateCapacityVariables`:
const searchPhysiciansWithStateCapacityVars: SearchPhysiciansWithStateCapacityVariables = {
  stateCode: ..., // optional
  specialtyType: ..., // optional
  availableForNewNPs: ..., // optional
};

// Call the `searchPhysiciansWithStateCapacityRef()` function to get a reference to the query.
const ref = searchPhysiciansWithStateCapacityRef(searchPhysiciansWithStateCapacityVars);
// Variables can be defined inline as well.
const ref = searchPhysiciansWithStateCapacityRef({ stateCode: ..., specialtyType: ..., availableForNewNPs: ..., });
// Since all variables are optional for this query, you can omit the `SearchPhysiciansWithStateCapacityVariables` argument.
const ref = searchPhysiciansWithStateCapacityRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchPhysiciansWithStateCapacityRef(dataConnect, searchPhysiciansWithStateCapacityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providerDirectories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectories);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUserProfile(vars?: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserProfile(dc: DataConnect, vars?: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  (dc: DataConnect, vars?: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserProfileRef:
```typescript
const name = upsertUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserProfile` mutation has an optional argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserProfileVariables {
  displayName?: string | null;
  role?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation has an optional argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., // optional
  role: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ displayName: ..., role: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertUserProfileVariables` argument.
const { data } = await upsertUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@dataconnect/generated';

// The `UpsertUserProfile` mutation has an optional argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., // optional
  role: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ displayName: ..., role: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertUserProfileVariables` argument.
const ref = upsertUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateLicense
You can execute the `CreateLicense` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createLicense(vars: CreateLicenseVariables): MutationPromise<CreateLicenseData, CreateLicenseVariables>;

interface CreateLicenseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLicenseVariables): MutationRef<CreateLicenseData, CreateLicenseVariables>;
}
export const createLicenseRef: CreateLicenseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLicense(dc: DataConnect, vars: CreateLicenseVariables): MutationPromise<CreateLicenseData, CreateLicenseVariables>;

interface CreateLicenseRef {
  ...
  (dc: DataConnect, vars: CreateLicenseVariables): MutationRef<CreateLicenseData, CreateLicenseVariables>;
}
export const createLicenseRef: CreateLicenseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLicenseRef:
```typescript
const name = createLicenseRef.operationName;
console.log(name);
```

### Variables
The `CreateLicense` mutation requires an argument of type `CreateLicenseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLicenseVariables {
  stateId: UUIDString;
  licenseNumber: string;
  licenseType: string;
  issueDate: DateString;
  expirationDate: DateString;
  verificationStatus: string;
  supervisedHoursInState?: number | null;
  supervisedYearsInState?: number | null;
}
```
### Return Type
Recall that executing the `CreateLicense` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLicenseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLicenseData {
  license_insert: License_Key;
}
```
### Using `CreateLicense`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLicense, CreateLicenseVariables } from '@dataconnect/generated';

// The `CreateLicense` mutation requires an argument of type `CreateLicenseVariables`:
const createLicenseVars: CreateLicenseVariables = {
  stateId: ..., 
  licenseNumber: ..., 
  licenseType: ..., 
  issueDate: ..., 
  expirationDate: ..., 
  verificationStatus: ..., 
  supervisedHoursInState: ..., // optional
  supervisedYearsInState: ..., // optional
};

// Call the `createLicense()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLicense(createLicenseVars);
// Variables can be defined inline as well.
const { data } = await createLicense({ stateId: ..., licenseNumber: ..., licenseType: ..., issueDate: ..., expirationDate: ..., verificationStatus: ..., supervisedHoursInState: ..., supervisedYearsInState: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLicense(dataConnect, createLicenseVars);

console.log(data.license_insert);

// Or, you can use the `Promise` API.
createLicense(createLicenseVars).then((response) => {
  const data = response.data;
  console.log(data.license_insert);
});
```

### Using `CreateLicense`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLicenseRef, CreateLicenseVariables } from '@dataconnect/generated';

// The `CreateLicense` mutation requires an argument of type `CreateLicenseVariables`:
const createLicenseVars: CreateLicenseVariables = {
  stateId: ..., 
  licenseNumber: ..., 
  licenseType: ..., 
  issueDate: ..., 
  expirationDate: ..., 
  verificationStatus: ..., 
  supervisedHoursInState: ..., // optional
  supervisedYearsInState: ..., // optional
};

// Call the `createLicenseRef()` function to get a reference to the mutation.
const ref = createLicenseRef(createLicenseVars);
// Variables can be defined inline as well.
const ref = createLicenseRef({ stateId: ..., licenseNumber: ..., licenseType: ..., issueDate: ..., expirationDate: ..., verificationStatus: ..., supervisedHoursInState: ..., supervisedYearsInState: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLicenseRef(dataConnect, createLicenseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.license_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.license_insert);
});
```

## UpdateLicenseVerification
You can execute the `UpdateLicenseVerification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateLicenseVerification(vars: UpdateLicenseVerificationVariables): MutationPromise<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;

interface UpdateLicenseVerificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLicenseVerificationVariables): MutationRef<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;
}
export const updateLicenseVerificationRef: UpdateLicenseVerificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLicenseVerification(dc: DataConnect, vars: UpdateLicenseVerificationVariables): MutationPromise<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;

interface UpdateLicenseVerificationRef {
  ...
  (dc: DataConnect, vars: UpdateLicenseVerificationVariables): MutationRef<UpdateLicenseVerificationData, UpdateLicenseVerificationVariables>;
}
export const updateLicenseVerificationRef: UpdateLicenseVerificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLicenseVerificationRef:
```typescript
const name = updateLicenseVerificationRef.operationName;
console.log(name);
```

### Variables
The `UpdateLicenseVerification` mutation requires an argument of type `UpdateLicenseVerificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLicenseVerificationVariables {
  licenseId: UUIDString;
  verificationStatus: string;
  verificationMethod?: string | null;
}
```
### Return Type
Recall that executing the `UpdateLicenseVerification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLicenseVerificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLicenseVerificationData {
  license_update?: License_Key | null;
}
```
### Using `UpdateLicenseVerification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLicenseVerification, UpdateLicenseVerificationVariables } from '@dataconnect/generated';

// The `UpdateLicenseVerification` mutation requires an argument of type `UpdateLicenseVerificationVariables`:
const updateLicenseVerificationVars: UpdateLicenseVerificationVariables = {
  licenseId: ..., 
  verificationStatus: ..., 
  verificationMethod: ..., // optional
};

// Call the `updateLicenseVerification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLicenseVerification(updateLicenseVerificationVars);
// Variables can be defined inline as well.
const { data } = await updateLicenseVerification({ licenseId: ..., verificationStatus: ..., verificationMethod: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLicenseVerification(dataConnect, updateLicenseVerificationVars);

console.log(data.license_update);

// Or, you can use the `Promise` API.
updateLicenseVerification(updateLicenseVerificationVars).then((response) => {
  const data = response.data;
  console.log(data.license_update);
});
```

### Using `UpdateLicenseVerification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLicenseVerificationRef, UpdateLicenseVerificationVariables } from '@dataconnect/generated';

// The `UpdateLicenseVerification` mutation requires an argument of type `UpdateLicenseVerificationVariables`:
const updateLicenseVerificationVars: UpdateLicenseVerificationVariables = {
  licenseId: ..., 
  verificationStatus: ..., 
  verificationMethod: ..., // optional
};

// Call the `updateLicenseVerificationRef()` function to get a reference to the mutation.
const ref = updateLicenseVerificationRef(updateLicenseVerificationVars);
// Variables can be defined inline as well.
const ref = updateLicenseVerificationRef({ licenseId: ..., verificationStatus: ..., verificationMethod: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLicenseVerificationRef(dataConnect, updateLicenseVerificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.license_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.license_update);
});
```

## UpdateLicenseFPAStatus
You can execute the `UpdateLicenseFPAStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateLicenseFpaStatus(vars: UpdateLicenseFpaStatusVariables): MutationPromise<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;

interface UpdateLicenseFpaStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLicenseFpaStatusVariables): MutationRef<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;
}
export const updateLicenseFpaStatusRef: UpdateLicenseFpaStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLicenseFpaStatus(dc: DataConnect, vars: UpdateLicenseFpaStatusVariables): MutationPromise<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;

interface UpdateLicenseFpaStatusRef {
  ...
  (dc: DataConnect, vars: UpdateLicenseFpaStatusVariables): MutationRef<UpdateLicenseFpaStatusData, UpdateLicenseFpaStatusVariables>;
}
export const updateLicenseFpaStatusRef: UpdateLicenseFpaStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLicenseFpaStatusRef:
```typescript
const name = updateLicenseFpaStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateLicenseFPAStatus` mutation requires an argument of type `UpdateLicenseFpaStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLicenseFpaStatusVariables {
  licenseId: UUIDString;
  fpaStatus: string;
  fpaEligibilityDate?: DateString | null;
  supervisedHoursInState?: number | null;
  supervisedYearsInState?: number | null;
}
```
### Return Type
Recall that executing the `UpdateLicenseFPAStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLicenseFpaStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLicenseFpaStatusData {
  license_update?: License_Key | null;
}
```
### Using `UpdateLicenseFPAStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLicenseFpaStatus, UpdateLicenseFpaStatusVariables } from '@dataconnect/generated';

// The `UpdateLicenseFPAStatus` mutation requires an argument of type `UpdateLicenseFpaStatusVariables`:
const updateLicenseFpaStatusVars: UpdateLicenseFpaStatusVariables = {
  licenseId: ..., 
  fpaStatus: ..., 
  fpaEligibilityDate: ..., // optional
  supervisedHoursInState: ..., // optional
  supervisedYearsInState: ..., // optional
};

// Call the `updateLicenseFpaStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLicenseFpaStatus(updateLicenseFpaStatusVars);
// Variables can be defined inline as well.
const { data } = await updateLicenseFpaStatus({ licenseId: ..., fpaStatus: ..., fpaEligibilityDate: ..., supervisedHoursInState: ..., supervisedYearsInState: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLicenseFpaStatus(dataConnect, updateLicenseFpaStatusVars);

console.log(data.license_update);

// Or, you can use the `Promise` API.
updateLicenseFpaStatus(updateLicenseFpaStatusVars).then((response) => {
  const data = response.data;
  console.log(data.license_update);
});
```

### Using `UpdateLicenseFPAStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLicenseFpaStatusRef, UpdateLicenseFpaStatusVariables } from '@dataconnect/generated';

// The `UpdateLicenseFPAStatus` mutation requires an argument of type `UpdateLicenseFpaStatusVariables`:
const updateLicenseFpaStatusVars: UpdateLicenseFpaStatusVariables = {
  licenseId: ..., 
  fpaStatus: ..., 
  fpaEligibilityDate: ..., // optional
  supervisedHoursInState: ..., // optional
  supervisedYearsInState: ..., // optional
};

// Call the `updateLicenseFpaStatusRef()` function to get a reference to the mutation.
const ref = updateLicenseFpaStatusRef(updateLicenseFpaStatusVars);
// Variables can be defined inline as well.
const ref = updateLicenseFpaStatusRef({ licenseId: ..., fpaStatus: ..., fpaEligibilityDate: ..., supervisedHoursInState: ..., supervisedYearsInState: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLicenseFpaStatusRef(dataConnect, updateLicenseFpaStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.license_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.license_update);
});
```

## CreateConversation
You can execute the `CreateConversation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createConversation(vars: CreateConversationVariables): MutationPromise<CreateConversationData, CreateConversationVariables>;

interface CreateConversationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConversationVariables): MutationRef<CreateConversationData, CreateConversationVariables>;
}
export const createConversationRef: CreateConversationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createConversation(dc: DataConnect, vars: CreateConversationVariables): MutationPromise<CreateConversationData, CreateConversationVariables>;

interface CreateConversationRef {
  ...
  (dc: DataConnect, vars: CreateConversationVariables): MutationRef<CreateConversationData, CreateConversationVariables>;
}
export const createConversationRef: CreateConversationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createConversationRef:
```typescript
const name = createConversationRef.operationName;
console.log(name);
```

### Variables
The `CreateConversation` mutation requires an argument of type `CreateConversationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateConversationVariables {
  participantUserId: string;
  agreementId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateConversation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateConversationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateConversationData {
  conversation_insert: Conversation_Key;
}
```
### Using `CreateConversation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createConversation, CreateConversationVariables } from '@dataconnect/generated';

// The `CreateConversation` mutation requires an argument of type `CreateConversationVariables`:
const createConversationVars: CreateConversationVariables = {
  participantUserId: ..., 
  agreementId: ..., // optional
};

// Call the `createConversation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createConversation(createConversationVars);
// Variables can be defined inline as well.
const { data } = await createConversation({ participantUserId: ..., agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createConversation(dataConnect, createConversationVars);

console.log(data.conversation_insert);

// Or, you can use the `Promise` API.
createConversation(createConversationVars).then((response) => {
  const data = response.data;
  console.log(data.conversation_insert);
});
```

### Using `CreateConversation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createConversationRef, CreateConversationVariables } from '@dataconnect/generated';

// The `CreateConversation` mutation requires an argument of type `CreateConversationVariables`:
const createConversationVars: CreateConversationVariables = {
  participantUserId: ..., 
  agreementId: ..., // optional
};

// Call the `createConversationRef()` function to get a reference to the mutation.
const ref = createConversationRef(createConversationVars);
// Variables can be defined inline as well.
const ref = createConversationRef({ participantUserId: ..., agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createConversationRef(dataConnect, createConversationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conversation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation_insert);
});
```

## SendMessage
You can execute the `SendMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the sendMessageRef:
```typescript
const name = sendMessageRef.operationName;
console.log(name);
```

### Variables
The `SendMessage` mutation requires an argument of type `SendMessageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SendMessageVariables {
  conversationId: UUIDString;
  messageBody: string;
}
```
### Return Type
Recall that executing the `SendMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SendMessageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SendMessageData {
  message_insert: Message_Key;
}
```
### Using `SendMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, sendMessage, SendMessageVariables } from '@dataconnect/generated';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  conversationId: ..., 
  messageBody: ..., 
};

// Call the `sendMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await sendMessage(sendMessageVars);
// Variables can be defined inline as well.
const { data } = await sendMessage({ conversationId: ..., messageBody: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await sendMessage(dataConnect, sendMessageVars);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
sendMessage(sendMessageVars).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

### Using `SendMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, sendMessageRef, SendMessageVariables } from '@dataconnect/generated';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  conversationId: ..., 
  messageBody: ..., 
};

// Call the `sendMessageRef()` function to get a reference to the mutation.
const ref = sendMessageRef(sendMessageVars);
// Variables can be defined inline as well.
const ref = sendMessageRef({ conversationId: ..., messageBody: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = sendMessageRef(dataConnect, sendMessageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

## MarkMessageAsRead
You can execute the `MarkMessageAsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markMessageAsRead(vars: MarkMessageAsReadVariables): MutationPromise<MarkMessageAsReadData, MarkMessageAsReadVariables>;

interface MarkMessageAsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkMessageAsReadVariables): MutationRef<MarkMessageAsReadData, MarkMessageAsReadVariables>;
}
export const markMessageAsReadRef: MarkMessageAsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markMessageAsRead(dc: DataConnect, vars: MarkMessageAsReadVariables): MutationPromise<MarkMessageAsReadData, MarkMessageAsReadVariables>;

interface MarkMessageAsReadRef {
  ...
  (dc: DataConnect, vars: MarkMessageAsReadVariables): MutationRef<MarkMessageAsReadData, MarkMessageAsReadVariables>;
}
export const markMessageAsReadRef: MarkMessageAsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markMessageAsReadRef:
```typescript
const name = markMessageAsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkMessageAsRead` mutation requires an argument of type `MarkMessageAsReadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkMessageAsReadVariables {
  messageId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkMessageAsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkMessageAsReadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkMessageAsReadData {
  message_update?: Message_Key | null;
}
```
### Using `MarkMessageAsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markMessageAsRead, MarkMessageAsReadVariables } from '@dataconnect/generated';

// The `MarkMessageAsRead` mutation requires an argument of type `MarkMessageAsReadVariables`:
const markMessageAsReadVars: MarkMessageAsReadVariables = {
  messageId: ..., 
};

// Call the `markMessageAsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markMessageAsRead(markMessageAsReadVars);
// Variables can be defined inline as well.
const { data } = await markMessageAsRead({ messageId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markMessageAsRead(dataConnect, markMessageAsReadVars);

console.log(data.message_update);

// Or, you can use the `Promise` API.
markMessageAsRead(markMessageAsReadVars).then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

### Using `MarkMessageAsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markMessageAsReadRef, MarkMessageAsReadVariables } from '@dataconnect/generated';

// The `MarkMessageAsRead` mutation requires an argument of type `MarkMessageAsReadVariables`:
const markMessageAsReadVars: MarkMessageAsReadVariables = {
  messageId: ..., 
};

// Call the `markMessageAsReadRef()` function to get a reference to the mutation.
const ref = markMessageAsReadRef(markMessageAsReadVars);
// Variables can be defined inline as well.
const ref = markMessageAsReadRef({ messageId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markMessageAsReadRef(dataConnect, markMessageAsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

## UpdateMessageBlocked
You can execute the `UpdateMessageBlocked` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMessageBlocked(vars: UpdateMessageBlockedVariables): MutationPromise<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;

interface UpdateMessageBlockedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMessageBlockedVariables): MutationRef<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;
}
export const updateMessageBlockedRef: UpdateMessageBlockedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMessageBlocked(dc: DataConnect, vars: UpdateMessageBlockedVariables): MutationPromise<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;

interface UpdateMessageBlockedRef {
  ...
  (dc: DataConnect, vars: UpdateMessageBlockedVariables): MutationRef<UpdateMessageBlockedData, UpdateMessageBlockedVariables>;
}
export const updateMessageBlockedRef: UpdateMessageBlockedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMessageBlockedRef:
```typescript
const name = updateMessageBlockedRef.operationName;
console.log(name);
```

### Variables
The `UpdateMessageBlocked` mutation requires an argument of type `UpdateMessageBlockedVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMessageBlockedVariables {
  messageId: UUIDString;
  originalBody: string;
  blockedContentType: string;
}
```
### Return Type
Recall that executing the `UpdateMessageBlocked` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMessageBlockedData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMessageBlockedData {
  message_update?: Message_Key | null;
}
```
### Using `UpdateMessageBlocked`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMessageBlocked, UpdateMessageBlockedVariables } from '@dataconnect/generated';

// The `UpdateMessageBlocked` mutation requires an argument of type `UpdateMessageBlockedVariables`:
const updateMessageBlockedVars: UpdateMessageBlockedVariables = {
  messageId: ..., 
  originalBody: ..., 
  blockedContentType: ..., 
};

// Call the `updateMessageBlocked()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMessageBlocked(updateMessageBlockedVars);
// Variables can be defined inline as well.
const { data } = await updateMessageBlocked({ messageId: ..., originalBody: ..., blockedContentType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMessageBlocked(dataConnect, updateMessageBlockedVars);

console.log(data.message_update);

// Or, you can use the `Promise` API.
updateMessageBlocked(updateMessageBlockedVars).then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

### Using `UpdateMessageBlocked`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMessageBlockedRef, UpdateMessageBlockedVariables } from '@dataconnect/generated';

// The `UpdateMessageBlocked` mutation requires an argument of type `UpdateMessageBlockedVariables`:
const updateMessageBlockedVars: UpdateMessageBlockedVariables = {
  messageId: ..., 
  originalBody: ..., 
  blockedContentType: ..., 
};

// Call the `updateMessageBlockedRef()` function to get a reference to the mutation.
const ref = updateMessageBlockedRef(updateMessageBlockedVars);
// Variables can be defined inline as well.
const ref = updateMessageBlockedRef({ messageId: ..., originalBody: ..., blockedContentType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMessageBlockedRef(dataConnect, updateMessageBlockedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_update);
});
```

## CreateMessageAuditLog
You can execute the `CreateMessageAuditLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMessageAuditLog(vars: CreateMessageAuditLogVariables): MutationPromise<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;

interface CreateMessageAuditLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMessageAuditLogVariables): MutationRef<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;
}
export const createMessageAuditLogRef: CreateMessageAuditLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMessageAuditLog(dc: DataConnect, vars: CreateMessageAuditLogVariables): MutationPromise<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;

interface CreateMessageAuditLogRef {
  ...
  (dc: DataConnect, vars: CreateMessageAuditLogVariables): MutationRef<CreateMessageAuditLogData, CreateMessageAuditLogVariables>;
}
export const createMessageAuditLogRef: CreateMessageAuditLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMessageAuditLogRef:
```typescript
const name = createMessageAuditLogRef.operationName;
console.log(name);
```

### Variables
The `CreateMessageAuditLog` mutation requires an argument of type `CreateMessageAuditLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMessageAuditLogVariables {
  conversationId: UUIDString;
  actionType: string;
  userId: string;
  actionDetails: string;
}
```
### Return Type
Recall that executing the `CreateMessageAuditLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMessageAuditLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMessageAuditLogData {
  messageAuditLog_insert: MessageAuditLog_Key;
}
```
### Using `CreateMessageAuditLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMessageAuditLog, CreateMessageAuditLogVariables } from '@dataconnect/generated';

// The `CreateMessageAuditLog` mutation requires an argument of type `CreateMessageAuditLogVariables`:
const createMessageAuditLogVars: CreateMessageAuditLogVariables = {
  conversationId: ..., 
  actionType: ..., 
  userId: ..., 
  actionDetails: ..., 
};

// Call the `createMessageAuditLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMessageAuditLog(createMessageAuditLogVars);
// Variables can be defined inline as well.
const { data } = await createMessageAuditLog({ conversationId: ..., actionType: ..., userId: ..., actionDetails: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMessageAuditLog(dataConnect, createMessageAuditLogVars);

console.log(data.messageAuditLog_insert);

// Or, you can use the `Promise` API.
createMessageAuditLog(createMessageAuditLogVars).then((response) => {
  const data = response.data;
  console.log(data.messageAuditLog_insert);
});
```

### Using `CreateMessageAuditLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMessageAuditLogRef, CreateMessageAuditLogVariables } from '@dataconnect/generated';

// The `CreateMessageAuditLog` mutation requires an argument of type `CreateMessageAuditLogVariables`:
const createMessageAuditLogVars: CreateMessageAuditLogVariables = {
  conversationId: ..., 
  actionType: ..., 
  userId: ..., 
  actionDetails: ..., 
};

// Call the `createMessageAuditLogRef()` function to get a reference to the mutation.
const ref = createMessageAuditLogRef(createMessageAuditLogVars);
// Variables can be defined inline as well.
const ref = createMessageAuditLogRef({ conversationId: ..., actionType: ..., userId: ..., actionDetails: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMessageAuditLogRef(dataConnect, createMessageAuditLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.messageAuditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.messageAuditLog_insert);
});
```

## CreatePhysicianDirectory
You can execute the `CreatePhysicianDirectory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPhysicianDirectory(vars: CreatePhysicianDirectoryVariables): MutationPromise<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;

interface CreatePhysicianDirectoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePhysicianDirectoryVariables): MutationRef<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;
}
export const createPhysicianDirectoryRef: CreatePhysicianDirectoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPhysicianDirectory(dc: DataConnect, vars: CreatePhysicianDirectoryVariables): MutationPromise<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;

interface CreatePhysicianDirectoryRef {
  ...
  (dc: DataConnect, vars: CreatePhysicianDirectoryVariables): MutationRef<CreatePhysicianDirectoryData, CreatePhysicianDirectoryVariables>;
}
export const createPhysicianDirectoryRef: CreatePhysicianDirectoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPhysicianDirectoryRef:
```typescript
const name = createPhysicianDirectoryRef.operationName;
console.log(name);
```

### Variables
The `CreatePhysicianDirectory` mutation requires an argument of type `CreatePhysicianDirectoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePhysicianDirectoryVariables {
  availableStates: string;
  specialtyType: string;
  maxNPs: number;
  currentNPCount: number;
  availableForNewNPs: boolean;
  supervisionModel: string;
}
```
### Return Type
Recall that executing the `CreatePhysicianDirectory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePhysicianDirectoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePhysicianDirectoryData {
  providerDirectory_insert: ProviderDirectory_Key;
}
```
### Using `CreatePhysicianDirectory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPhysicianDirectory, CreatePhysicianDirectoryVariables } from '@dataconnect/generated';

// The `CreatePhysicianDirectory` mutation requires an argument of type `CreatePhysicianDirectoryVariables`:
const createPhysicianDirectoryVars: CreatePhysicianDirectoryVariables = {
  availableStates: ..., 
  specialtyType: ..., 
  maxNPs: ..., 
  currentNPCount: ..., 
  availableForNewNPs: ..., 
  supervisionModel: ..., 
};

// Call the `createPhysicianDirectory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPhysicianDirectory(createPhysicianDirectoryVars);
// Variables can be defined inline as well.
const { data } = await createPhysicianDirectory({ availableStates: ..., specialtyType: ..., maxNPs: ..., currentNPCount: ..., availableForNewNPs: ..., supervisionModel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPhysicianDirectory(dataConnect, createPhysicianDirectoryVars);

console.log(data.providerDirectory_insert);

// Or, you can use the `Promise` API.
createPhysicianDirectory(createPhysicianDirectoryVars).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory_insert);
});
```

### Using `CreatePhysicianDirectory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPhysicianDirectoryRef, CreatePhysicianDirectoryVariables } from '@dataconnect/generated';

// The `CreatePhysicianDirectory` mutation requires an argument of type `CreatePhysicianDirectoryVariables`:
const createPhysicianDirectoryVars: CreatePhysicianDirectoryVariables = {
  availableStates: ..., 
  specialtyType: ..., 
  maxNPs: ..., 
  currentNPCount: ..., 
  availableForNewNPs: ..., 
  supervisionModel: ..., 
};

// Call the `createPhysicianDirectoryRef()` function to get a reference to the mutation.
const ref = createPhysicianDirectoryRef(createPhysicianDirectoryVars);
// Variables can be defined inline as well.
const ref = createPhysicianDirectoryRef({ availableStates: ..., specialtyType: ..., maxNPs: ..., currentNPCount: ..., availableForNewNPs: ..., supervisionModel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPhysicianDirectoryRef(dataConnect, createPhysicianDirectoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.providerDirectory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory_insert);
});
```

## CreateNPDirectory
You can execute the `CreateNPDirectory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNpDirectory(vars: CreateNpDirectoryVariables): MutationPromise<CreateNpDirectoryData, CreateNpDirectoryVariables>;

interface CreateNpDirectoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNpDirectoryVariables): MutationRef<CreateNpDirectoryData, CreateNpDirectoryVariables>;
}
export const createNpDirectoryRef: CreateNpDirectoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNpDirectory(dc: DataConnect, vars: CreateNpDirectoryVariables): MutationPromise<CreateNpDirectoryData, CreateNpDirectoryVariables>;

interface CreateNpDirectoryRef {
  ...
  (dc: DataConnect, vars: CreateNpDirectoryVariables): MutationRef<CreateNpDirectoryData, CreateNpDirectoryVariables>;
}
export const createNpDirectoryRef: CreateNpDirectoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNpDirectoryRef:
```typescript
const name = createNpDirectoryRef.operationName;
console.log(name);
```

### Variables
The `CreateNPDirectory` mutation requires an argument of type `CreateNpDirectoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNpDirectoryVariables {
  seekingStates: string;
  licensedStates: string;
  specialtyType: string;
  needsCPA: boolean;
  cpaNeededStates?: string | null;
}
```
### Return Type
Recall that executing the `CreateNPDirectory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNpDirectoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNpDirectoryData {
  npDirectory_insert: NpDirectory_Key;
}
```
### Using `CreateNPDirectory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNpDirectory, CreateNpDirectoryVariables } from '@dataconnect/generated';

// The `CreateNPDirectory` mutation requires an argument of type `CreateNpDirectoryVariables`:
const createNpDirectoryVars: CreateNpDirectoryVariables = {
  seekingStates: ..., 
  licensedStates: ..., 
  specialtyType: ..., 
  needsCPA: ..., 
  cpaNeededStates: ..., // optional
};

// Call the `createNpDirectory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNpDirectory(createNpDirectoryVars);
// Variables can be defined inline as well.
const { data } = await createNpDirectory({ seekingStates: ..., licensedStates: ..., specialtyType: ..., needsCPA: ..., cpaNeededStates: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNpDirectory(dataConnect, createNpDirectoryVars);

console.log(data.npDirectory_insert);

// Or, you can use the `Promise` API.
createNpDirectory(createNpDirectoryVars).then((response) => {
  const data = response.data;
  console.log(data.npDirectory_insert);
});
```

### Using `CreateNPDirectory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNpDirectoryRef, CreateNpDirectoryVariables } from '@dataconnect/generated';

// The `CreateNPDirectory` mutation requires an argument of type `CreateNpDirectoryVariables`:
const createNpDirectoryVars: CreateNpDirectoryVariables = {
  seekingStates: ..., 
  licensedStates: ..., 
  specialtyType: ..., 
  needsCPA: ..., 
  cpaNeededStates: ..., // optional
};

// Call the `createNpDirectoryRef()` function to get a reference to the mutation.
const ref = createNpDirectoryRef(createNpDirectoryVars);
// Variables can be defined inline as well.
const ref = createNpDirectoryRef({ seekingStates: ..., licensedStates: ..., specialtyType: ..., needsCPA: ..., cpaNeededStates: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNpDirectoryRef(dataConnect, createNpDirectoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.npDirectory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.npDirectory_insert);
});
```

## UpdatePhysicianDirectoryProfile
You can execute the `UpdatePhysicianDirectoryProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePhysicianDirectoryProfile(vars?: UpdatePhysicianDirectoryProfileVariables): MutationPromise<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;

interface UpdatePhysicianDirectoryProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePhysicianDirectoryProfileVariables): MutationRef<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;
}
export const updatePhysicianDirectoryProfileRef: UpdatePhysicianDirectoryProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePhysicianDirectoryProfile(dc: DataConnect, vars?: UpdatePhysicianDirectoryProfileVariables): MutationPromise<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;

interface UpdatePhysicianDirectoryProfileRef {
  ...
  (dc: DataConnect, vars?: UpdatePhysicianDirectoryProfileVariables): MutationRef<UpdatePhysicianDirectoryProfileData, UpdatePhysicianDirectoryProfileVariables>;
}
export const updatePhysicianDirectoryProfileRef: UpdatePhysicianDirectoryProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePhysicianDirectoryProfileRef:
```typescript
const name = updatePhysicianDirectoryProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdatePhysicianDirectoryProfile` mutation has an optional argument of type `UpdatePhysicianDirectoryProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePhysicianDirectoryProfileVariables {
  availableForNewNPs?: boolean | null;
  maxNPs?: number | null;
  availableSpots?: number | null;
  currentNpCount?: number | null;
  isActive?: boolean | null;
  profileVisibility?: string | null;
  availableStates?: string | null;
  primarySpecialty?: string | null;
  supervisionModel?: string | null;
  hourlyRate?: number | null;
  revenueSharePercentage?: number | null;
}
```
### Return Type
Recall that executing the `UpdatePhysicianDirectoryProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePhysicianDirectoryProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePhysicianDirectoryProfileData {
  providerDirectory_update?: ProviderDirectory_Key | null;
}
```
### Using `UpdatePhysicianDirectoryProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePhysicianDirectoryProfile, UpdatePhysicianDirectoryProfileVariables } from '@dataconnect/generated';

// The `UpdatePhysicianDirectoryProfile` mutation has an optional argument of type `UpdatePhysicianDirectoryProfileVariables`:
const updatePhysicianDirectoryProfileVars: UpdatePhysicianDirectoryProfileVariables = {
  availableForNewNPs: ..., // optional
  maxNPs: ..., // optional
  availableSpots: ..., // optional
  currentNpCount: ..., // optional
  isActive: ..., // optional
  profileVisibility: ..., // optional
  availableStates: ..., // optional
  primarySpecialty: ..., // optional
  supervisionModel: ..., // optional
  hourlyRate: ..., // optional
  revenueSharePercentage: ..., // optional
};

// Call the `updatePhysicianDirectoryProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePhysicianDirectoryProfile(updatePhysicianDirectoryProfileVars);
// Variables can be defined inline as well.
const { data } = await updatePhysicianDirectoryProfile({ availableForNewNPs: ..., maxNPs: ..., availableSpots: ..., currentNpCount: ..., isActive: ..., profileVisibility: ..., availableStates: ..., primarySpecialty: ..., supervisionModel: ..., hourlyRate: ..., revenueSharePercentage: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePhysicianDirectoryProfileVariables` argument.
const { data } = await updatePhysicianDirectoryProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePhysicianDirectoryProfile(dataConnect, updatePhysicianDirectoryProfileVars);

console.log(data.providerDirectory_update);

// Or, you can use the `Promise` API.
updatePhysicianDirectoryProfile(updatePhysicianDirectoryProfileVars).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory_update);
});
```

### Using `UpdatePhysicianDirectoryProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePhysicianDirectoryProfileRef, UpdatePhysicianDirectoryProfileVariables } from '@dataconnect/generated';

// The `UpdatePhysicianDirectoryProfile` mutation has an optional argument of type `UpdatePhysicianDirectoryProfileVariables`:
const updatePhysicianDirectoryProfileVars: UpdatePhysicianDirectoryProfileVariables = {
  availableForNewNPs: ..., // optional
  maxNPs: ..., // optional
  availableSpots: ..., // optional
  currentNpCount: ..., // optional
  isActive: ..., // optional
  profileVisibility: ..., // optional
  availableStates: ..., // optional
  primarySpecialty: ..., // optional
  supervisionModel: ..., // optional
  hourlyRate: ..., // optional
  revenueSharePercentage: ..., // optional
};

// Call the `updatePhysicianDirectoryProfileRef()` function to get a reference to the mutation.
const ref = updatePhysicianDirectoryProfileRef(updatePhysicianDirectoryProfileVars);
// Variables can be defined inline as well.
const ref = updatePhysicianDirectoryProfileRef({ availableForNewNPs: ..., maxNPs: ..., availableSpots: ..., currentNpCount: ..., isActive: ..., profileVisibility: ..., availableStates: ..., primarySpecialty: ..., supervisionModel: ..., hourlyRate: ..., revenueSharePercentage: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePhysicianDirectoryProfileVariables` argument.
const ref = updatePhysicianDirectoryProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePhysicianDirectoryProfileRef(dataConnect, updatePhysicianDirectoryProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.providerDirectory_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.providerDirectory_update);
});
```

## UpdateNPDirectoryProfile
You can execute the `UpdateNPDirectoryProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateNpDirectoryProfile(vars?: UpdateNpDirectoryProfileVariables): MutationPromise<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;

interface UpdateNpDirectoryProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateNpDirectoryProfileVariables): MutationRef<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;
}
export const updateNpDirectoryProfileRef: UpdateNpDirectoryProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateNpDirectoryProfile(dc: DataConnect, vars?: UpdateNpDirectoryProfileVariables): MutationPromise<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;

interface UpdateNpDirectoryProfileRef {
  ...
  (dc: DataConnect, vars?: UpdateNpDirectoryProfileVariables): MutationRef<UpdateNpDirectoryProfileData, UpdateNpDirectoryProfileVariables>;
}
export const updateNpDirectoryProfileRef: UpdateNpDirectoryProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateNpDirectoryProfileRef:
```typescript
const name = updateNpDirectoryProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateNPDirectoryProfile` mutation has an optional argument of type `UpdateNpDirectoryProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateNpDirectoryProfileVariables {
  isActive?: boolean | null;
  profileVisibility?: string | null;
  seekingStates?: string | null;
  licensedStates?: string | null;
  cpaNeededStates?: string | null;
  primarySpecialty?: string | null;
  hoursPerWeekAvailable?: number | null;
  preferredCompensationModel?: string | null;
}
```
### Return Type
Recall that executing the `UpdateNPDirectoryProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateNpDirectoryProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateNpDirectoryProfileData {
  npDirectory_update?: NpDirectory_Key | null;
}
```
### Using `UpdateNPDirectoryProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateNpDirectoryProfile, UpdateNpDirectoryProfileVariables } from '@dataconnect/generated';

// The `UpdateNPDirectoryProfile` mutation has an optional argument of type `UpdateNpDirectoryProfileVariables`:
const updateNpDirectoryProfileVars: UpdateNpDirectoryProfileVariables = {
  isActive: ..., // optional
  profileVisibility: ..., // optional
  seekingStates: ..., // optional
  licensedStates: ..., // optional
  cpaNeededStates: ..., // optional
  primarySpecialty: ..., // optional
  hoursPerWeekAvailable: ..., // optional
  preferredCompensationModel: ..., // optional
};

// Call the `updateNpDirectoryProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateNpDirectoryProfile(updateNpDirectoryProfileVars);
// Variables can be defined inline as well.
const { data } = await updateNpDirectoryProfile({ isActive: ..., profileVisibility: ..., seekingStates: ..., licensedStates: ..., cpaNeededStates: ..., primarySpecialty: ..., hoursPerWeekAvailable: ..., preferredCompensationModel: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateNpDirectoryProfileVariables` argument.
const { data } = await updateNpDirectoryProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateNpDirectoryProfile(dataConnect, updateNpDirectoryProfileVars);

console.log(data.npDirectory_update);

// Or, you can use the `Promise` API.
updateNpDirectoryProfile(updateNpDirectoryProfileVars).then((response) => {
  const data = response.data;
  console.log(data.npDirectory_update);
});
```

### Using `UpdateNPDirectoryProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateNpDirectoryProfileRef, UpdateNpDirectoryProfileVariables } from '@dataconnect/generated';

// The `UpdateNPDirectoryProfile` mutation has an optional argument of type `UpdateNpDirectoryProfileVariables`:
const updateNpDirectoryProfileVars: UpdateNpDirectoryProfileVariables = {
  isActive: ..., // optional
  profileVisibility: ..., // optional
  seekingStates: ..., // optional
  licensedStates: ..., // optional
  cpaNeededStates: ..., // optional
  primarySpecialty: ..., // optional
  hoursPerWeekAvailable: ..., // optional
  preferredCompensationModel: ..., // optional
};

// Call the `updateNpDirectoryProfileRef()` function to get a reference to the mutation.
const ref = updateNpDirectoryProfileRef(updateNpDirectoryProfileVars);
// Variables can be defined inline as well.
const ref = updateNpDirectoryProfileRef({ isActive: ..., profileVisibility: ..., seekingStates: ..., licensedStates: ..., cpaNeededStates: ..., primarySpecialty: ..., hoursPerWeekAvailable: ..., preferredCompensationModel: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateNpDirectoryProfileVariables` argument.
const ref = updateNpDirectoryProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateNpDirectoryProfileRef(dataConnect, updateNpDirectoryProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.npDirectory_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.npDirectory_update);
});
```

## CreateDirectoryMatch
You can execute the `CreateDirectoryMatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDirectoryMatch(vars: CreateDirectoryMatchVariables): MutationPromise<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;

interface CreateDirectoryMatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDirectoryMatchVariables): MutationRef<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;
}
export const createDirectoryMatchRef: CreateDirectoryMatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDirectoryMatch(dc: DataConnect, vars: CreateDirectoryMatchVariables): MutationPromise<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;

interface CreateDirectoryMatchRef {
  ...
  (dc: DataConnect, vars: CreateDirectoryMatchVariables): MutationRef<CreateDirectoryMatchData, CreateDirectoryMatchVariables>;
}
export const createDirectoryMatchRef: CreateDirectoryMatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDirectoryMatchRef:
```typescript
const name = createDirectoryMatchRef.operationName;
console.log(name);
```

### Variables
The `CreateDirectoryMatch` mutation requires an argument of type `CreateDirectoryMatchVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDirectoryMatchVariables {
  targetPhysicianId: string;
  stateId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateDirectoryMatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDirectoryMatchData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDirectoryMatchData {
  directoryMatch_insert: DirectoryMatch_Key;
}
```
### Using `CreateDirectoryMatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDirectoryMatch, CreateDirectoryMatchVariables } from '@dataconnect/generated';

// The `CreateDirectoryMatch` mutation requires an argument of type `CreateDirectoryMatchVariables`:
const createDirectoryMatchVars: CreateDirectoryMatchVariables = {
  targetPhysicianId: ..., 
  stateId: ..., 
};

// Call the `createDirectoryMatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDirectoryMatch(createDirectoryMatchVars);
// Variables can be defined inline as well.
const { data } = await createDirectoryMatch({ targetPhysicianId: ..., stateId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDirectoryMatch(dataConnect, createDirectoryMatchVars);

console.log(data.directoryMatch_insert);

// Or, you can use the `Promise` API.
createDirectoryMatch(createDirectoryMatchVars).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_insert);
});
```

### Using `CreateDirectoryMatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDirectoryMatchRef, CreateDirectoryMatchVariables } from '@dataconnect/generated';

// The `CreateDirectoryMatch` mutation requires an argument of type `CreateDirectoryMatchVariables`:
const createDirectoryMatchVars: CreateDirectoryMatchVariables = {
  targetPhysicianId: ..., 
  stateId: ..., 
};

// Call the `createDirectoryMatchRef()` function to get a reference to the mutation.
const ref = createDirectoryMatchRef(createDirectoryMatchVars);
// Variables can be defined inline as well.
const ref = createDirectoryMatchRef({ targetPhysicianId: ..., stateId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDirectoryMatchRef(dataConnect, createDirectoryMatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.directoryMatch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_insert);
});
```

## CreateDirectoryMatchByPhysician
You can execute the `CreateDirectoryMatchByPhysician` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDirectoryMatchByPhysician(vars: CreateDirectoryMatchByPhysicianVariables): MutationPromise<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;

interface CreateDirectoryMatchByPhysicianRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDirectoryMatchByPhysicianVariables): MutationRef<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;
}
export const createDirectoryMatchByPhysicianRef: CreateDirectoryMatchByPhysicianRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDirectoryMatchByPhysician(dc: DataConnect, vars: CreateDirectoryMatchByPhysicianVariables): MutationPromise<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;

interface CreateDirectoryMatchByPhysicianRef {
  ...
  (dc: DataConnect, vars: CreateDirectoryMatchByPhysicianVariables): MutationRef<CreateDirectoryMatchByPhysicianData, CreateDirectoryMatchByPhysicianVariables>;
}
export const createDirectoryMatchByPhysicianRef: CreateDirectoryMatchByPhysicianRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDirectoryMatchByPhysicianRef:
```typescript
const name = createDirectoryMatchByPhysicianRef.operationName;
console.log(name);
```

### Variables
The `CreateDirectoryMatchByPhysician` mutation requires an argument of type `CreateDirectoryMatchByPhysicianVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDirectoryMatchByPhysicianVariables {
  targetNpId: string;
  stateId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateDirectoryMatchByPhysician` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDirectoryMatchByPhysicianData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDirectoryMatchByPhysicianData {
  directoryMatch_insert: DirectoryMatch_Key;
}
```
### Using `CreateDirectoryMatchByPhysician`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDirectoryMatchByPhysician, CreateDirectoryMatchByPhysicianVariables } from '@dataconnect/generated';

// The `CreateDirectoryMatchByPhysician` mutation requires an argument of type `CreateDirectoryMatchByPhysicianVariables`:
const createDirectoryMatchByPhysicianVars: CreateDirectoryMatchByPhysicianVariables = {
  targetNpId: ..., 
  stateId: ..., 
};

// Call the `createDirectoryMatchByPhysician()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDirectoryMatchByPhysician(createDirectoryMatchByPhysicianVars);
// Variables can be defined inline as well.
const { data } = await createDirectoryMatchByPhysician({ targetNpId: ..., stateId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDirectoryMatchByPhysician(dataConnect, createDirectoryMatchByPhysicianVars);

console.log(data.directoryMatch_insert);

// Or, you can use the `Promise` API.
createDirectoryMatchByPhysician(createDirectoryMatchByPhysicianVars).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_insert);
});
```

### Using `CreateDirectoryMatchByPhysician`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDirectoryMatchByPhysicianRef, CreateDirectoryMatchByPhysicianVariables } from '@dataconnect/generated';

// The `CreateDirectoryMatchByPhysician` mutation requires an argument of type `CreateDirectoryMatchByPhysicianVariables`:
const createDirectoryMatchByPhysicianVars: CreateDirectoryMatchByPhysicianVariables = {
  targetNpId: ..., 
  stateId: ..., 
};

// Call the `createDirectoryMatchByPhysicianRef()` function to get a reference to the mutation.
const ref = createDirectoryMatchByPhysicianRef(createDirectoryMatchByPhysicianVars);
// Variables can be defined inline as well.
const ref = createDirectoryMatchByPhysicianRef({ targetNpId: ..., stateId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDirectoryMatchByPhysicianRef(dataConnect, createDirectoryMatchByPhysicianVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.directoryMatch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_insert);
});
```

## UpdateMatchStatus
You can execute the `UpdateMatchStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMatchStatus(vars: UpdateMatchStatusVariables): MutationPromise<UpdateMatchStatusData, UpdateMatchStatusVariables>;

interface UpdateMatchStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMatchStatusVariables): MutationRef<UpdateMatchStatusData, UpdateMatchStatusVariables>;
}
export const updateMatchStatusRef: UpdateMatchStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMatchStatus(dc: DataConnect, vars: UpdateMatchStatusVariables): MutationPromise<UpdateMatchStatusData, UpdateMatchStatusVariables>;

interface UpdateMatchStatusRef {
  ...
  (dc: DataConnect, vars: UpdateMatchStatusVariables): MutationRef<UpdateMatchStatusData, UpdateMatchStatusVariables>;
}
export const updateMatchStatusRef: UpdateMatchStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMatchStatusRef:
```typescript
const name = updateMatchStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateMatchStatus` mutation requires an argument of type `UpdateMatchStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMatchStatusVariables {
  matchId: UUIDString;
  status: string;
  declinedBy?: string | null;
  declineReason?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMatchStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMatchStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMatchStatusData {
  directoryMatch_update?: DirectoryMatch_Key | null;
}
```
### Using `UpdateMatchStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMatchStatus, UpdateMatchStatusVariables } from '@dataconnect/generated';

// The `UpdateMatchStatus` mutation requires an argument of type `UpdateMatchStatusVariables`:
const updateMatchStatusVars: UpdateMatchStatusVariables = {
  matchId: ..., 
  status: ..., 
  declinedBy: ..., // optional
  declineReason: ..., // optional
};

// Call the `updateMatchStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMatchStatus(updateMatchStatusVars);
// Variables can be defined inline as well.
const { data } = await updateMatchStatus({ matchId: ..., status: ..., declinedBy: ..., declineReason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMatchStatus(dataConnect, updateMatchStatusVars);

console.log(data.directoryMatch_update);

// Or, you can use the `Promise` API.
updateMatchStatus(updateMatchStatusVars).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_update);
});
```

### Using `UpdateMatchStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMatchStatusRef, UpdateMatchStatusVariables } from '@dataconnect/generated';

// The `UpdateMatchStatus` mutation requires an argument of type `UpdateMatchStatusVariables`:
const updateMatchStatusVars: UpdateMatchStatusVariables = {
  matchId: ..., 
  status: ..., 
  declinedBy: ..., // optional
  declineReason: ..., // optional
};

// Call the `updateMatchStatusRef()` function to get a reference to the mutation.
const ref = updateMatchStatusRef(updateMatchStatusVars);
// Variables can be defined inline as well.
const ref = updateMatchStatusRef({ matchId: ..., status: ..., declinedBy: ..., declineReason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMatchStatusRef(dataConnect, updateMatchStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.directoryMatch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.directoryMatch_update);
});
```

## CreateCollaborationAgreement
You can execute the `CreateCollaborationAgreement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCollaborationAgreement(vars: CreateCollaborationAgreementVariables): MutationPromise<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;

interface CreateCollaborationAgreementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCollaborationAgreementVariables): MutationRef<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;
}
export const createCollaborationAgreementRef: CreateCollaborationAgreementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCollaborationAgreement(dc: DataConnect, vars: CreateCollaborationAgreementVariables): MutationPromise<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;

interface CreateCollaborationAgreementRef {
  ...
  (dc: DataConnect, vars: CreateCollaborationAgreementVariables): MutationRef<CreateCollaborationAgreementData, CreateCollaborationAgreementVariables>;
}
export const createCollaborationAgreementRef: CreateCollaborationAgreementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCollaborationAgreementRef:
```typescript
const name = createCollaborationAgreementRef.operationName;
console.log(name);
```

### Variables
The `CreateCollaborationAgreement` mutation requires an argument of type `CreateCollaborationAgreementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCollaborationAgreementVariables {
  npLicenseId: UUIDString;
  physicianLicenseId: UUIDString;
  stateId: UUIDString;
  docusignUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateCollaborationAgreement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCollaborationAgreementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCollaborationAgreementData {
  collaborationAgreement_insert: CollaborationAgreement_Key;
}
```
### Using `CreateCollaborationAgreement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCollaborationAgreement, CreateCollaborationAgreementVariables } from '@dataconnect/generated';

// The `CreateCollaborationAgreement` mutation requires an argument of type `CreateCollaborationAgreementVariables`:
const createCollaborationAgreementVars: CreateCollaborationAgreementVariables = {
  npLicenseId: ..., 
  physicianLicenseId: ..., 
  stateId: ..., 
  docusignUrl: ..., // optional
};

// Call the `createCollaborationAgreement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCollaborationAgreement(createCollaborationAgreementVars);
// Variables can be defined inline as well.
const { data } = await createCollaborationAgreement({ npLicenseId: ..., physicianLicenseId: ..., stateId: ..., docusignUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCollaborationAgreement(dataConnect, createCollaborationAgreementVars);

console.log(data.collaborationAgreement_insert);

// Or, you can use the `Promise` API.
createCollaborationAgreement(createCollaborationAgreementVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_insert);
});
```

### Using `CreateCollaborationAgreement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCollaborationAgreementRef, CreateCollaborationAgreementVariables } from '@dataconnect/generated';

// The `CreateCollaborationAgreement` mutation requires an argument of type `CreateCollaborationAgreementVariables`:
const createCollaborationAgreementVars: CreateCollaborationAgreementVariables = {
  npLicenseId: ..., 
  physicianLicenseId: ..., 
  stateId: ..., 
  docusignUrl: ..., // optional
};

// Call the `createCollaborationAgreementRef()` function to get a reference to the mutation.
const ref = createCollaborationAgreementRef(createCollaborationAgreementVars);
// Variables can be defined inline as well.
const ref = createCollaborationAgreementRef({ npLicenseId: ..., physicianLicenseId: ..., stateId: ..., docusignUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCollaborationAgreementRef(dataConnect, createCollaborationAgreementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.collaborationAgreement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_insert);
});
```

## SignAgreement
You can execute the `SignAgreement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
signAgreement(vars: SignAgreementVariables): MutationPromise<SignAgreementData, SignAgreementVariables>;

interface SignAgreementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SignAgreementVariables): MutationRef<SignAgreementData, SignAgreementVariables>;
}
export const signAgreementRef: SignAgreementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
signAgreement(dc: DataConnect, vars: SignAgreementVariables): MutationPromise<SignAgreementData, SignAgreementVariables>;

interface SignAgreementRef {
  ...
  (dc: DataConnect, vars: SignAgreementVariables): MutationRef<SignAgreementData, SignAgreementVariables>;
}
export const signAgreementRef: SignAgreementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the signAgreementRef:
```typescript
const name = signAgreementRef.operationName;
console.log(name);
```

### Variables
The `SignAgreement` mutation requires an argument of type `SignAgreementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SignAgreementVariables {
  agreementId: UUIDString;
  mediaId: UUIDString;
  signatureMethod: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}
```
### Return Type
Recall that executing the `SignAgreement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SignAgreementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SignAgreementData {
  documentSignature_upsert: DocumentSignature_Key;
}
```
### Using `SignAgreement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, signAgreement, SignAgreementVariables } from '@dataconnect/generated';

// The `SignAgreement` mutation requires an argument of type `SignAgreementVariables`:
const signAgreementVars: SignAgreementVariables = {
  agreementId: ..., 
  mediaId: ..., 
  signatureMethod: ..., 
  ipAddress: ..., // optional
  userAgent: ..., // optional
};

// Call the `signAgreement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await signAgreement(signAgreementVars);
// Variables can be defined inline as well.
const { data } = await signAgreement({ agreementId: ..., mediaId: ..., signatureMethod: ..., ipAddress: ..., userAgent: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await signAgreement(dataConnect, signAgreementVars);

console.log(data.documentSignature_upsert);

// Or, you can use the `Promise` API.
signAgreement(signAgreementVars).then((response) => {
  const data = response.data;
  console.log(data.documentSignature_upsert);
});
```

### Using `SignAgreement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, signAgreementRef, SignAgreementVariables } from '@dataconnect/generated';

// The `SignAgreement` mutation requires an argument of type `SignAgreementVariables`:
const signAgreementVars: SignAgreementVariables = {
  agreementId: ..., 
  mediaId: ..., 
  signatureMethod: ..., 
  ipAddress: ..., // optional
  userAgent: ..., // optional
};

// Call the `signAgreementRef()` function to get a reference to the mutation.
const ref = signAgreementRef(signAgreementVars);
// Variables can be defined inline as well.
const ref = signAgreementRef({ agreementId: ..., mediaId: ..., signatureMethod: ..., ipAddress: ..., userAgent: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = signAgreementRef(dataConnect, signAgreementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.documentSignature_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.documentSignature_upsert);
});
```

## ActivateAgreement
You can execute the `ActivateAgreement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
activateAgreement(vars: ActivateAgreementVariables): MutationPromise<ActivateAgreementData, ActivateAgreementVariables>;

interface ActivateAgreementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActivateAgreementVariables): MutationRef<ActivateAgreementData, ActivateAgreementVariables>;
}
export const activateAgreementRef: ActivateAgreementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
activateAgreement(dc: DataConnect, vars: ActivateAgreementVariables): MutationPromise<ActivateAgreementData, ActivateAgreementVariables>;

interface ActivateAgreementRef {
  ...
  (dc: DataConnect, vars: ActivateAgreementVariables): MutationRef<ActivateAgreementData, ActivateAgreementVariables>;
}
export const activateAgreementRef: ActivateAgreementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the activateAgreementRef:
```typescript
const name = activateAgreementRef.operationName;
console.log(name);
```

### Variables
The `ActivateAgreement` mutation requires an argument of type `ActivateAgreementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActivateAgreementVariables {
  agreementId: UUIDString;
}
```
### Return Type
Recall that executing the `ActivateAgreement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActivateAgreementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActivateAgreementData {
  collaborationAgreement_update?: CollaborationAgreement_Key | null;
}
```
### Using `ActivateAgreement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, activateAgreement, ActivateAgreementVariables } from '@dataconnect/generated';

// The `ActivateAgreement` mutation requires an argument of type `ActivateAgreementVariables`:
const activateAgreementVars: ActivateAgreementVariables = {
  agreementId: ..., 
};

// Call the `activateAgreement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await activateAgreement(activateAgreementVars);
// Variables can be defined inline as well.
const { data } = await activateAgreement({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await activateAgreement(dataConnect, activateAgreementVars);

console.log(data.collaborationAgreement_update);

// Or, you can use the `Promise` API.
activateAgreement(activateAgreementVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_update);
});
```

### Using `ActivateAgreement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, activateAgreementRef, ActivateAgreementVariables } from '@dataconnect/generated';

// The `ActivateAgreement` mutation requires an argument of type `ActivateAgreementVariables`:
const activateAgreementVars: ActivateAgreementVariables = {
  agreementId: ..., 
};

// Call the `activateAgreementRef()` function to get a reference to the mutation.
const ref = activateAgreementRef(activateAgreementVars);
// Variables can be defined inline as well.
const ref = activateAgreementRef({ agreementId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = activateAgreementRef(dataConnect, activateAgreementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.collaborationAgreement_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_update);
});
```

## TerminateAgreement
You can execute the `TerminateAgreement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
terminateAgreement(vars: TerminateAgreementVariables): MutationPromise<TerminateAgreementData, TerminateAgreementVariables>;

interface TerminateAgreementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TerminateAgreementVariables): MutationRef<TerminateAgreementData, TerminateAgreementVariables>;
}
export const terminateAgreementRef: TerminateAgreementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
terminateAgreement(dc: DataConnect, vars: TerminateAgreementVariables): MutationPromise<TerminateAgreementData, TerminateAgreementVariables>;

interface TerminateAgreementRef {
  ...
  (dc: DataConnect, vars: TerminateAgreementVariables): MutationRef<TerminateAgreementData, TerminateAgreementVariables>;
}
export const terminateAgreementRef: TerminateAgreementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the terminateAgreementRef:
```typescript
const name = terminateAgreementRef.operationName;
console.log(name);
```

### Variables
The `TerminateAgreement` mutation requires an argument of type `TerminateAgreementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TerminateAgreementVariables {
  agreementId: UUIDString;
  terminationReason: string;
  terminationResponsibility?: string | null;
}
```
### Return Type
Recall that executing the `TerminateAgreement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TerminateAgreementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TerminateAgreementData {
  collaborationAgreement_update?: CollaborationAgreement_Key | null;
}
```
### Using `TerminateAgreement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, terminateAgreement, TerminateAgreementVariables } from '@dataconnect/generated';

// The `TerminateAgreement` mutation requires an argument of type `TerminateAgreementVariables`:
const terminateAgreementVars: TerminateAgreementVariables = {
  agreementId: ..., 
  terminationReason: ..., 
  terminationResponsibility: ..., // optional
};

// Call the `terminateAgreement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await terminateAgreement(terminateAgreementVars);
// Variables can be defined inline as well.
const { data } = await terminateAgreement({ agreementId: ..., terminationReason: ..., terminationResponsibility: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await terminateAgreement(dataConnect, terminateAgreementVars);

console.log(data.collaborationAgreement_update);

// Or, you can use the `Promise` API.
terminateAgreement(terminateAgreementVars).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_update);
});
```

### Using `TerminateAgreement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, terminateAgreementRef, TerminateAgreementVariables } from '@dataconnect/generated';

// The `TerminateAgreement` mutation requires an argument of type `TerminateAgreementVariables`:
const terminateAgreementVars: TerminateAgreementVariables = {
  agreementId: ..., 
  terminationReason: ..., 
  terminationResponsibility: ..., // optional
};

// Call the `terminateAgreementRef()` function to get a reference to the mutation.
const ref = terminateAgreementRef(terminateAgreementVars);
// Variables can be defined inline as well.
const ref = terminateAgreementRef({ agreementId: ..., terminationReason: ..., terminationResponsibility: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = terminateAgreementRef(dataConnect, terminateAgreementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.collaborationAgreement_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.collaborationAgreement_update);
});
```

## UnlockConversationContactInfo
You can execute the `UnlockConversationContactInfo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
unlockConversationContactInfo(vars: UnlockConversationContactInfoVariables): MutationPromise<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;

interface UnlockConversationContactInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UnlockConversationContactInfoVariables): MutationRef<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;
}
export const unlockConversationContactInfoRef: UnlockConversationContactInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
unlockConversationContactInfo(dc: DataConnect, vars: UnlockConversationContactInfoVariables): MutationPromise<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;

interface UnlockConversationContactInfoRef {
  ...
  (dc: DataConnect, vars: UnlockConversationContactInfoVariables): MutationRef<UnlockConversationContactInfoData, UnlockConversationContactInfoVariables>;
}
export const unlockConversationContactInfoRef: UnlockConversationContactInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the unlockConversationContactInfoRef:
```typescript
const name = unlockConversationContactInfoRef.operationName;
console.log(name);
```

### Variables
The `UnlockConversationContactInfo` mutation requires an argument of type `UnlockConversationContactInfoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UnlockConversationContactInfoVariables {
  conversationId: UUIDString;
}
```
### Return Type
Recall that executing the `UnlockConversationContactInfo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UnlockConversationContactInfoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UnlockConversationContactInfoData {
  conversation_update?: Conversation_Key | null;
}
```
### Using `UnlockConversationContactInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, unlockConversationContactInfo, UnlockConversationContactInfoVariables } from '@dataconnect/generated';

// The `UnlockConversationContactInfo` mutation requires an argument of type `UnlockConversationContactInfoVariables`:
const unlockConversationContactInfoVars: UnlockConversationContactInfoVariables = {
  conversationId: ..., 
};

// Call the `unlockConversationContactInfo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await unlockConversationContactInfo(unlockConversationContactInfoVars);
// Variables can be defined inline as well.
const { data } = await unlockConversationContactInfo({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await unlockConversationContactInfo(dataConnect, unlockConversationContactInfoVars);

console.log(data.conversation_update);

// Or, you can use the `Promise` API.
unlockConversationContactInfo(unlockConversationContactInfoVars).then((response) => {
  const data = response.data;
  console.log(data.conversation_update);
});
```

### Using `UnlockConversationContactInfo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, unlockConversationContactInfoRef, UnlockConversationContactInfoVariables } from '@dataconnect/generated';

// The `UnlockConversationContactInfo` mutation requires an argument of type `UnlockConversationContactInfoVariables`:
const unlockConversationContactInfoVars: UnlockConversationContactInfoVariables = {
  conversationId: ..., 
};

// Call the `unlockConversationContactInfoRef()` function to get a reference to the mutation.
const ref = unlockConversationContactInfoRef(unlockConversationContactInfoVars);
// Variables can be defined inline as well.
const ref = unlockConversationContactInfoRef({ conversationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = unlockConversationContactInfoRef(dataConnect, unlockConversationContactInfoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.conversation_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.conversation_update);
});
```

## SubmitChartReview
You can execute the `SubmitChartReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
submitChartReview(vars: SubmitChartReviewVariables): MutationPromise<SubmitChartReviewData, SubmitChartReviewVariables>;

interface SubmitChartReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitChartReviewVariables): MutationRef<SubmitChartReviewData, SubmitChartReviewVariables>;
}
export const submitChartReviewRef: SubmitChartReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
submitChartReview(dc: DataConnect, vars: SubmitChartReviewVariables): MutationPromise<SubmitChartReviewData, SubmitChartReviewVariables>;

interface SubmitChartReviewRef {
  ...
  (dc: DataConnect, vars: SubmitChartReviewVariables): MutationRef<SubmitChartReviewData, SubmitChartReviewVariables>;
}
export const submitChartReviewRef: SubmitChartReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the submitChartReviewRef:
```typescript
const name = submitChartReviewRef.operationName;
console.log(name);
```

### Variables
The `SubmitChartReview` mutation requires an argument of type `SubmitChartReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SubmitChartReviewVariables {
  agreementId: UUIDString;
  reviewDate: DateString;
  isTimely: boolean;
  chartIdentifier?: string | null;
  notes?: string | null;
  reviewPercentage?: number | null;
  isControlledSubstanceChart?: boolean | null;
}
```
### Return Type
Recall that executing the `SubmitChartReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SubmitChartReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SubmitChartReviewData {
  chartReview_insert: ChartReview_Key;
}
```
### Using `SubmitChartReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, submitChartReview, SubmitChartReviewVariables } from '@dataconnect/generated';

// The `SubmitChartReview` mutation requires an argument of type `SubmitChartReviewVariables`:
const submitChartReviewVars: SubmitChartReviewVariables = {
  agreementId: ..., 
  reviewDate: ..., 
  isTimely: ..., 
  chartIdentifier: ..., // optional
  notes: ..., // optional
  reviewPercentage: ..., // optional
  isControlledSubstanceChart: ..., // optional
};

// Call the `submitChartReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await submitChartReview(submitChartReviewVars);
// Variables can be defined inline as well.
const { data } = await submitChartReview({ agreementId: ..., reviewDate: ..., isTimely: ..., chartIdentifier: ..., notes: ..., reviewPercentage: ..., isControlledSubstanceChart: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await submitChartReview(dataConnect, submitChartReviewVars);

console.log(data.chartReview_insert);

// Or, you can use the `Promise` API.
submitChartReview(submitChartReviewVars).then((response) => {
  const data = response.data;
  console.log(data.chartReview_insert);
});
```

### Using `SubmitChartReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, submitChartReviewRef, SubmitChartReviewVariables } from '@dataconnect/generated';

// The `SubmitChartReview` mutation requires an argument of type `SubmitChartReviewVariables`:
const submitChartReviewVars: SubmitChartReviewVariables = {
  agreementId: ..., 
  reviewDate: ..., 
  isTimely: ..., 
  chartIdentifier: ..., // optional
  notes: ..., // optional
  reviewPercentage: ..., // optional
  isControlledSubstanceChart: ..., // optional
};

// Call the `submitChartReviewRef()` function to get a reference to the mutation.
const ref = submitChartReviewRef(submitChartReviewVars);
// Variables can be defined inline as well.
const ref = submitChartReviewRef({ agreementId: ..., reviewDate: ..., isTimely: ..., chartIdentifier: ..., notes: ..., reviewPercentage: ..., isControlledSubstanceChart: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = submitChartReviewRef(dataConnect, submitChartReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.chartReview_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.chartReview_insert);
});
```

## ScheduleQAMeeting
You can execute the `ScheduleQAMeeting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
scheduleQaMeeting(vars: ScheduleQaMeetingVariables): MutationPromise<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;

interface ScheduleQaMeetingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ScheduleQaMeetingVariables): MutationRef<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;
}
export const scheduleQaMeetingRef: ScheduleQaMeetingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
scheduleQaMeeting(dc: DataConnect, vars: ScheduleQaMeetingVariables): MutationPromise<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;

interface ScheduleQaMeetingRef {
  ...
  (dc: DataConnect, vars: ScheduleQaMeetingVariables): MutationRef<ScheduleQaMeetingData, ScheduleQaMeetingVariables>;
}
export const scheduleQaMeetingRef: ScheduleQaMeetingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the scheduleQaMeetingRef:
```typescript
const name = scheduleQaMeetingRef.operationName;
console.log(name);
```

### Variables
The `ScheduleQAMeeting` mutation requires an argument of type `ScheduleQaMeetingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ScheduleQaMeetingVariables {
  agreementId: UUIDString;
  meetingDate: TimestampString;
  meetingType?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `ScheduleQAMeeting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ScheduleQaMeetingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ScheduleQaMeetingData {
  qualityAssuranceMeeting_insert: QualityAssuranceMeeting_Key;
}
```
### Using `ScheduleQAMeeting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, scheduleQaMeeting, ScheduleQaMeetingVariables } from '@dataconnect/generated';

// The `ScheduleQAMeeting` mutation requires an argument of type `ScheduleQaMeetingVariables`:
const scheduleQaMeetingVars: ScheduleQaMeetingVariables = {
  agreementId: ..., 
  meetingDate: ..., 
  meetingType: ..., // optional
  notes: ..., // optional
};

// Call the `scheduleQaMeeting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await scheduleQaMeeting(scheduleQaMeetingVars);
// Variables can be defined inline as well.
const { data } = await scheduleQaMeeting({ agreementId: ..., meetingDate: ..., meetingType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await scheduleQaMeeting(dataConnect, scheduleQaMeetingVars);

console.log(data.qualityAssuranceMeeting_insert);

// Or, you can use the `Promise` API.
scheduleQaMeeting(scheduleQaMeetingVars).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeeting_insert);
});
```

### Using `ScheduleQAMeeting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, scheduleQaMeetingRef, ScheduleQaMeetingVariables } from '@dataconnect/generated';

// The `ScheduleQAMeeting` mutation requires an argument of type `ScheduleQaMeetingVariables`:
const scheduleQaMeetingVars: ScheduleQaMeetingVariables = {
  agreementId: ..., 
  meetingDate: ..., 
  meetingType: ..., // optional
  notes: ..., // optional
};

// Call the `scheduleQaMeetingRef()` function to get a reference to the mutation.
const ref = scheduleQaMeetingRef(scheduleQaMeetingVars);
// Variables can be defined inline as well.
const ref = scheduleQaMeetingRef({ agreementId: ..., meetingDate: ..., meetingType: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = scheduleQaMeetingRef(dataConnect, scheduleQaMeetingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.qualityAssuranceMeeting_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeeting_insert);
});
```

## CompleteQAMeeting
You can execute the `CompleteQAMeeting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
completeQaMeeting(vars: CompleteQaMeetingVariables): MutationPromise<CompleteQaMeetingData, CompleteQaMeetingVariables>;

interface CompleteQaMeetingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteQaMeetingVariables): MutationRef<CompleteQaMeetingData, CompleteQaMeetingVariables>;
}
export const completeQaMeetingRef: CompleteQaMeetingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeQaMeeting(dc: DataConnect, vars: CompleteQaMeetingVariables): MutationPromise<CompleteQaMeetingData, CompleteQaMeetingVariables>;

interface CompleteQaMeetingRef {
  ...
  (dc: DataConnect, vars: CompleteQaMeetingVariables): MutationRef<CompleteQaMeetingData, CompleteQaMeetingVariables>;
}
export const completeQaMeetingRef: CompleteQaMeetingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeQaMeetingRef:
```typescript
const name = completeQaMeetingRef.operationName;
console.log(name);
```

### Variables
The `CompleteQAMeeting` mutation requires an argument of type `CompleteQaMeetingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteQaMeetingVariables {
  meetingId: UUIDString;
  notes?: string | null;
  meetingDocumentUrl?: string | null;
}
```
### Return Type
Recall that executing the `CompleteQAMeeting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteQaMeetingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteQaMeetingData {
  qualityAssuranceMeeting_update?: QualityAssuranceMeeting_Key | null;
}
```
### Using `CompleteQAMeeting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeQaMeeting, CompleteQaMeetingVariables } from '@dataconnect/generated';

// The `CompleteQAMeeting` mutation requires an argument of type `CompleteQaMeetingVariables`:
const completeQaMeetingVars: CompleteQaMeetingVariables = {
  meetingId: ..., 
  notes: ..., // optional
  meetingDocumentUrl: ..., // optional
};

// Call the `completeQaMeeting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeQaMeeting(completeQaMeetingVars);
// Variables can be defined inline as well.
const { data } = await completeQaMeeting({ meetingId: ..., notes: ..., meetingDocumentUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeQaMeeting(dataConnect, completeQaMeetingVars);

console.log(data.qualityAssuranceMeeting_update);

// Or, you can use the `Promise` API.
completeQaMeeting(completeQaMeetingVars).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeeting_update);
});
```

### Using `CompleteQAMeeting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeQaMeetingRef, CompleteQaMeetingVariables } from '@dataconnect/generated';

// The `CompleteQAMeeting` mutation requires an argument of type `CompleteQaMeetingVariables`:
const completeQaMeetingVars: CompleteQaMeetingVariables = {
  meetingId: ..., 
  notes: ..., // optional
  meetingDocumentUrl: ..., // optional
};

// Call the `completeQaMeetingRef()` function to get a reference to the mutation.
const ref = completeQaMeetingRef(completeQaMeetingVars);
// Variables can be defined inline as well.
const ref = completeQaMeetingRef({ meetingId: ..., notes: ..., meetingDocumentUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeQaMeetingRef(dataConnect, completeQaMeetingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.qualityAssuranceMeeting_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.qualityAssuranceMeeting_update);
});
```

## UpdateChartReviewDocument
You can execute the `UpdateChartReviewDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateChartReviewDocument(vars: UpdateChartReviewDocumentVariables): MutationPromise<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;

interface UpdateChartReviewDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateChartReviewDocumentVariables): MutationRef<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;
}
export const updateChartReviewDocumentRef: UpdateChartReviewDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateChartReviewDocument(dc: DataConnect, vars: UpdateChartReviewDocumentVariables): MutationPromise<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;

interface UpdateChartReviewDocumentRef {
  ...
  (dc: DataConnect, vars: UpdateChartReviewDocumentVariables): MutationRef<UpdateChartReviewDocumentData, UpdateChartReviewDocumentVariables>;
}
export const updateChartReviewDocumentRef: UpdateChartReviewDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateChartReviewDocumentRef:
```typescript
const name = updateChartReviewDocumentRef.operationName;
console.log(name);
```

### Variables
The `UpdateChartReviewDocument` mutation requires an argument of type `UpdateChartReviewDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateChartReviewDocumentVariables {
  reviewId: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateChartReviewDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateChartReviewDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateChartReviewDocumentData {
  chartReview_update?: ChartReview_Key | null;
}
```
### Using `UpdateChartReviewDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateChartReviewDocument, UpdateChartReviewDocumentVariables } from '@dataconnect/generated';

// The `UpdateChartReviewDocument` mutation requires an argument of type `UpdateChartReviewDocumentVariables`:
const updateChartReviewDocumentVars: UpdateChartReviewDocumentVariables = {
  reviewId: ..., 
  notes: ..., // optional
};

// Call the `updateChartReviewDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateChartReviewDocument(updateChartReviewDocumentVars);
// Variables can be defined inline as well.
const { data } = await updateChartReviewDocument({ reviewId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateChartReviewDocument(dataConnect, updateChartReviewDocumentVars);

console.log(data.chartReview_update);

// Or, you can use the `Promise` API.
updateChartReviewDocument(updateChartReviewDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.chartReview_update);
});
```

### Using `UpdateChartReviewDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateChartReviewDocumentRef, UpdateChartReviewDocumentVariables } from '@dataconnect/generated';

// The `UpdateChartReviewDocument` mutation requires an argument of type `UpdateChartReviewDocumentVariables`:
const updateChartReviewDocumentVars: UpdateChartReviewDocumentVariables = {
  reviewId: ..., 
  notes: ..., // optional
};

// Call the `updateChartReviewDocumentRef()` function to get a reference to the mutation.
const ref = updateChartReviewDocumentRef(updateChartReviewDocumentVars);
// Variables can be defined inline as well.
const ref = updateChartReviewDocumentRef({ reviewId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateChartReviewDocumentRef(dataConnect, updateChartReviewDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.chartReview_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.chartReview_update);
});
```

## CreateMedia
You can execute the `CreateMedia` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMedia(vars: CreateMediaVariables): MutationPromise<CreateMediaData, CreateMediaVariables>;

interface CreateMediaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMediaVariables): MutationRef<CreateMediaData, CreateMediaVariables>;
}
export const createMediaRef: CreateMediaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMedia(dc: DataConnect, vars: CreateMediaVariables): MutationPromise<CreateMediaData, CreateMediaVariables>;

interface CreateMediaRef {
  ...
  (dc: DataConnect, vars: CreateMediaVariables): MutationRef<CreateMediaData, CreateMediaVariables>;
}
export const createMediaRef: CreateMediaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMediaRef:
```typescript
const name = createMediaRef.operationName;
console.log(name);
```

### Variables
The `CreateMedia` mutation requires an argument of type `CreateMediaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMediaVariables {
  mediaId: string;
  mediaType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  containsPhi: boolean;
}
```
### Return Type
Recall that executing the `CreateMedia` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMediaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMediaData {
  media_insert: Media_Key;
}
```
### Using `CreateMedia`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMedia, CreateMediaVariables } from '@dataconnect/generated';

// The `CreateMedia` mutation requires an argument of type `CreateMediaVariables`:
const createMediaVars: CreateMediaVariables = {
  mediaId: ..., 
  mediaType: ..., 
  fileName: ..., 
  fileUrl: ..., 
  fileSize: ..., 
  mimeType: ..., 
  containsPhi: ..., 
};

// Call the `createMedia()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMedia(createMediaVars);
// Variables can be defined inline as well.
const { data } = await createMedia({ mediaId: ..., mediaType: ..., fileName: ..., fileUrl: ..., fileSize: ..., mimeType: ..., containsPhi: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMedia(dataConnect, createMediaVars);

console.log(data.media_insert);

// Or, you can use the `Promise` API.
createMedia(createMediaVars).then((response) => {
  const data = response.data;
  console.log(data.media_insert);
});
```

### Using `CreateMedia`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMediaRef, CreateMediaVariables } from '@dataconnect/generated';

// The `CreateMedia` mutation requires an argument of type `CreateMediaVariables`:
const createMediaVars: CreateMediaVariables = {
  mediaId: ..., 
  mediaType: ..., 
  fileName: ..., 
  fileUrl: ..., 
  fileSize: ..., 
  mimeType: ..., 
  containsPhi: ..., 
};

// Call the `createMediaRef()` function to get a reference to the mutation.
const ref = createMediaRef(createMediaVars);
// Variables can be defined inline as well.
const ref = createMediaRef({ mediaId: ..., mediaType: ..., fileName: ..., fileUrl: ..., fileSize: ..., mimeType: ..., containsPhi: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMediaRef(dataConnect, createMediaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.media_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.media_insert);
});
```

## UpsertStateCapacity
You can execute the `UpsertStateCapacity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertStateCapacity(vars: UpsertStateCapacityVariables): MutationPromise<UpsertStateCapacityData, UpsertStateCapacityVariables>;

interface UpsertStateCapacityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStateCapacityVariables): MutationRef<UpsertStateCapacityData, UpsertStateCapacityVariables>;
}
export const upsertStateCapacityRef: UpsertStateCapacityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertStateCapacity(dc: DataConnect, vars: UpsertStateCapacityVariables): MutationPromise<UpsertStateCapacityData, UpsertStateCapacityVariables>;

interface UpsertStateCapacityRef {
  ...
  (dc: DataConnect, vars: UpsertStateCapacityVariables): MutationRef<UpsertStateCapacityData, UpsertStateCapacityVariables>;
}
export const upsertStateCapacityRef: UpsertStateCapacityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertStateCapacityRef:
```typescript
const name = upsertStateCapacityRef.operationName;
console.log(name);
```

### Variables
The `UpsertStateCapacity` mutation requires an argument of type `UpsertStateCapacityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertStateCapacityVariables {
  stateId: UUIDString;
  maxNpCapacity: number;
  currentNpCount: number;
  isAccepting: boolean;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpsertStateCapacity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertStateCapacityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertStateCapacityData {
  providerStateCapacity_upsert: ProviderStateCapacity_Key;
}
```
### Using `UpsertStateCapacity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertStateCapacity, UpsertStateCapacityVariables } from '@dataconnect/generated';

// The `UpsertStateCapacity` mutation requires an argument of type `UpsertStateCapacityVariables`:
const upsertStateCapacityVars: UpsertStateCapacityVariables = {
  stateId: ..., 
  maxNpCapacity: ..., 
  currentNpCount: ..., 
  isAccepting: ..., 
  notes: ..., // optional
};

// Call the `upsertStateCapacity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertStateCapacity(upsertStateCapacityVars);
// Variables can be defined inline as well.
const { data } = await upsertStateCapacity({ stateId: ..., maxNpCapacity: ..., currentNpCount: ..., isAccepting: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertStateCapacity(dataConnect, upsertStateCapacityVars);

console.log(data.providerStateCapacity_upsert);

// Or, you can use the `Promise` API.
upsertStateCapacity(upsertStateCapacityVars).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacity_upsert);
});
```

### Using `UpsertStateCapacity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertStateCapacityRef, UpsertStateCapacityVariables } from '@dataconnect/generated';

// The `UpsertStateCapacity` mutation requires an argument of type `UpsertStateCapacityVariables`:
const upsertStateCapacityVars: UpsertStateCapacityVariables = {
  stateId: ..., 
  maxNpCapacity: ..., 
  currentNpCount: ..., 
  isAccepting: ..., 
  notes: ..., // optional
};

// Call the `upsertStateCapacityRef()` function to get a reference to the mutation.
const ref = upsertStateCapacityRef(upsertStateCapacityVars);
// Variables can be defined inline as well.
const ref = upsertStateCapacityRef({ stateId: ..., maxNpCapacity: ..., currentNpCount: ..., isAccepting: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertStateCapacityRef(dataConnect, upsertStateCapacityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.providerStateCapacity_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacity_upsert);
});
```

## DeleteStateCapacity
You can execute the `DeleteStateCapacity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteStateCapacity(vars: DeleteStateCapacityVariables): MutationPromise<DeleteStateCapacityData, DeleteStateCapacityVariables>;

interface DeleteStateCapacityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStateCapacityVariables): MutationRef<DeleteStateCapacityData, DeleteStateCapacityVariables>;
}
export const deleteStateCapacityRef: DeleteStateCapacityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStateCapacity(dc: DataConnect, vars: DeleteStateCapacityVariables): MutationPromise<DeleteStateCapacityData, DeleteStateCapacityVariables>;

interface DeleteStateCapacityRef {
  ...
  (dc: DataConnect, vars: DeleteStateCapacityVariables): MutationRef<DeleteStateCapacityData, DeleteStateCapacityVariables>;
}
export const deleteStateCapacityRef: DeleteStateCapacityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStateCapacityRef:
```typescript
const name = deleteStateCapacityRef.operationName;
console.log(name);
```

### Variables
The `DeleteStateCapacity` mutation requires an argument of type `DeleteStateCapacityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStateCapacityVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStateCapacity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStateCapacityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStateCapacityData {
  providerStateCapacity_delete?: ProviderStateCapacity_Key | null;
}
```
### Using `DeleteStateCapacity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStateCapacity, DeleteStateCapacityVariables } from '@dataconnect/generated';

// The `DeleteStateCapacity` mutation requires an argument of type `DeleteStateCapacityVariables`:
const deleteStateCapacityVars: DeleteStateCapacityVariables = {
  id: ..., 
};

// Call the `deleteStateCapacity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStateCapacity(deleteStateCapacityVars);
// Variables can be defined inline as well.
const { data } = await deleteStateCapacity({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStateCapacity(dataConnect, deleteStateCapacityVars);

console.log(data.providerStateCapacity_delete);

// Or, you can use the `Promise` API.
deleteStateCapacity(deleteStateCapacityVars).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacity_delete);
});
```

### Using `DeleteStateCapacity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStateCapacityRef, DeleteStateCapacityVariables } from '@dataconnect/generated';

// The `DeleteStateCapacity` mutation requires an argument of type `DeleteStateCapacityVariables`:
const deleteStateCapacityVars: DeleteStateCapacityVariables = {
  id: ..., 
};

// Call the `deleteStateCapacityRef()` function to get a reference to the mutation.
const ref = deleteStateCapacityRef(deleteStateCapacityVars);
// Variables can be defined inline as well.
const ref = deleteStateCapacityRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStateCapacityRef(dataConnect, deleteStateCapacityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.providerStateCapacity_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.providerStateCapacity_delete);
});
```

## SeedStates
You can execute the `SeedStates` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
seedStates(): MutationPromise<SeedStatesData, undefined>;

interface SeedStatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedStatesData, undefined>;
}
export const seedStatesRef: SeedStatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedStates(dc: DataConnect): MutationPromise<SeedStatesData, undefined>;

interface SeedStatesRef {
  ...
  (dc: DataConnect): MutationRef<SeedStatesData, undefined>;
}
export const seedStatesRef: SeedStatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedStatesRef:
```typescript
const name = seedStatesRef.operationName;
console.log(name);
```

### Variables
The `SeedStates` mutation has no variables.
### Return Type
Recall that executing the `SeedStates` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedStatesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedStatesData {
  ak: State_Key;
  dc: State_Key;
  nh: State_Key;
  or: State_Key;
  ri: State_Key;
  ut: State_Key;
  wy: State_Key;
  ct: State_Key;
  il: State_Key;
  ma: State_Key;
  mi: State_Key;
  nj: State_Key;
  vt: State_Key;
  wi: State_Key;
  tx: State_Key;
  ca: State_Key;
}
```
### Using `SeedStates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedStates } from '@dataconnect/generated';


// Call the `seedStates()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedStates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedStates(dataConnect);

console.log(data.ak);
console.log(data.dc);
console.log(data.nh);
console.log(data.or);
console.log(data.ri);
console.log(data.ut);
console.log(data.wy);
console.log(data.ct);
console.log(data.il);
console.log(data.ma);
console.log(data.mi);
console.log(data.nj);
console.log(data.vt);
console.log(data.wi);
console.log(data.tx);
console.log(data.ca);

// Or, you can use the `Promise` API.
seedStates().then((response) => {
  const data = response.data;
  console.log(data.ak);
  console.log(data.dc);
  console.log(data.nh);
  console.log(data.or);
  console.log(data.ri);
  console.log(data.ut);
  console.log(data.wy);
  console.log(data.ct);
  console.log(data.il);
  console.log(data.ma);
  console.log(data.mi);
  console.log(data.nj);
  console.log(data.vt);
  console.log(data.wi);
  console.log(data.tx);
  console.log(data.ca);
});
```

### Using `SeedStates`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedStatesRef } from '@dataconnect/generated';


// Call the `seedStatesRef()` function to get a reference to the mutation.
const ref = seedStatesRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedStatesRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ak);
console.log(data.dc);
console.log(data.nh);
console.log(data.or);
console.log(data.ri);
console.log(data.ut);
console.log(data.wy);
console.log(data.ct);
console.log(data.il);
console.log(data.ma);
console.log(data.mi);
console.log(data.nj);
console.log(data.vt);
console.log(data.wi);
console.log(data.tx);
console.log(data.ca);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ak);
  console.log(data.dc);
  console.log(data.nh);
  console.log(data.or);
  console.log(data.ri);
  console.log(data.ut);
  console.log(data.wy);
  console.log(data.ct);
  console.log(data.il);
  console.log(data.ma);
  console.log(data.mi);
  console.log(data.nj);
  console.log(data.vt);
  console.log(data.wi);
  console.log(data.tx);
  console.log(data.ca);
});
```

