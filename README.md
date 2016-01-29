# TypeScript/JavaScript Unsplash API Wrapper
A TypeScript/JavaScript client for the [Unsplash API](https://unsplash.com/documentation).

- [Official documentation](https://unsplash.com/documentation)
- [PHP API](https://github.com/CrewLabs/Unsplash-PHP)
- [Ruby API](https://github.com/CrewLabs/unsplash_rb)



## Status Quo

**So far, only actions with public access level are supported.**

- Supported runtime environments:
	- node.js
- To Do's:
	- resolve user references (e.g. in photo info and curated batch info)
	- client side caching (to avoid request overhead)
	- fix this: pagination parameters and their default values violate DRY
	- browser support?
	- **authentication (OAuth)**

### Implemented/Yet To Implement API Capabilities

 ☑ = implemented

 ☐ = not or only partially implemented

-- = n/a

|                    | public        | read_user     | write_user    | read_photos   | write_photos  | write_likes   |
|--------------------|---------------|---------------|---------------|---------------|---------------|---------------|
| **Current User**   | --            | ☐ get profile | ☐ update prof.| --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Users**          | ☑ get profile | --            | --            | --            | --            | --            |
|                    | ☑ get photos  | --            | --            | --            | --            | --            |
|                    | ☐ get liked   | --            | --            | --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Photos**         | ☑ list        | --            | --            | --            | ☐ upload      | ☐ unlike      |
|                    | ☑ search      | --            | --            | --            | --            | --            |
|                    | ☐ get one     | --            | --            | --            | --            | --            |
|                    | ☐ get random  | --            | --            | --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Categories**     | ☑ list all    | --            | --            | --            | --            | --            |
|                    | ☑ get one     | --            | --            | --            | --            | --            |
|                    | ☑ get photos  | --            | --            | --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Curated Batches**| ☐ list all    | --            | --            | --            | --            | --            |
|                    | ☐ get one     | --            | --            | --            | --            | --            |
|                    | ☐ get photos  | --            | --            | --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Stats**          | ☑ total       | --            | --            | --            | --            | --            |



## Usage

**HINT: Refer to the API docs for detailed type and method info.**

### Public Access

To access public features (such as all the things you can see on the [Unsplash website](unsplash.com) when not logged in), there's no need for a callback URL or secret key — the application key is enough:

```typescript
import * as api from './api';
// create a new api client object:
const myApiClient = new api.Client({ applicationId: 'YOUR_APPLICATION_ID', callbackUrl: undefined, secret: undefined });
```

### Rate Limits

Unsplash imposes rate limits on their API users that reset hourly (see [here](https://unsplash.com/documentation#rate-limiting)). To find out how many requests you have left at any given time, simply do:

```typescript
myApiClient.getRemainingHourlyRateLimit();
```

To find out how many requests you can sent in total, do:

```typescript
myApiClient.getHourlyRateLimit();
```

Note that the client object only learns about these limits **after** the first request has completed.

### Users, Photos, Categories and Batches

This api wrapper provides classes for all major entity types of the unsplash API, namely `User`, `Photo`, `Category` and `CuratedBatch` (curated batches are WIP). These classes provide static methods called `load*(...)` that load an entity by its typical identifier (such as a user name or photo id) and return an instance of its respective class that holds the requested data, for example:

```typescript
const user = await api.User.loadByUsername(myApiClient, 'crew');
```

Some classes, such as the `Category` class, also provide static methods to load multiple instances at once, for example:

```typescript
const categories = await api.Category.loadAll(myApiClient);
```

The request shown here will load all categories available on Unsplash and return an array of `Category` instances. To load photos from a category, do this:

```typescript
const categories = await api.Category.loadAll(myApiClient);
const myCategory = categories[0];
// load the first page with 10 photos on it:
const photoPage = await myCategory.loadPhotoPage(1, 10);
```

To learn more about pagination, have a look at the original [Unsplash API docs](https://unsplash.com/documentation#pagination).
