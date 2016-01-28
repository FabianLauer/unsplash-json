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
	- **authentication (OAuth)**
	- client side caching (to avoid request overhead)
	- browser support?

### Implemented/Yet To Implement API Capabilities

 ☑ = implemented

 ☐ = not or only partially implemented

-- = n/a

|                    | public        | read_user     | write_user    | read_photos   | write_photos  | write_likes   |
|--------------------|---------------|---------------|---------------|---------------|---------------|---------------|
| **Current User**   | --            | ☐ get profile | ☐ update prof.| --            | --            | --            |
|                    | --            | --            | --            | --            | --            | --            |
| **Users**          | ☐ get profile | --            | --            | --            | --            | --            |
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

