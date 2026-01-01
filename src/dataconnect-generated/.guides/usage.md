# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserProfile, createLicense, updateLicenseVerification, listStates, getStateById, getMyProfile, listLicenses } from '@dataconnect/generated';


// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation CreateLicense:  For variables, look at type CreateLicenseVars in ../index.d.ts
const { data } = await CreateLicense(dataConnect, createLicenseVars);

// Operation UpdateLicenseVerification:  For variables, look at type UpdateLicenseVerificationVars in ../index.d.ts
const { data } = await UpdateLicenseVerification(dataConnect, updateLicenseVerificationVars);

// Operation ListStates: 
const { data } = await ListStates(dataConnect);

// Operation GetStateById:  For variables, look at type GetStateByIdVars in ../index.d.ts
const { data } = await GetStateById(dataConnect, getStateByIdVars);

// Operation GetMyProfile: 
const { data } = await GetMyProfile(dataConnect);

// Operation ListLicenses: 
const { data } = await ListLicenses(dataConnect);


```