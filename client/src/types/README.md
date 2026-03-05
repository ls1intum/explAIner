# About Types

> **Server = single source of truth for all types**

Have a look here: `server/src/domain/schemas/`. Here you will find the definition of all schemas used anywhere in ExplAIner (base schemas, DTO schemas, LLM-Parser schemas). 

> **But what is** `client/src/types/domain` **then?** 

Good question! It defines all client types, but with a simply re-export of this `client/src/types/generated/api.types.ts`, which again is auto-generated based on the API documentation using `openapi-typescript`. And the API documentation is based on the server schemas as mentioned above => single source of truth. 

> **Here is how it works, explained step by step:** 
1. Define / Change schemas here `server/src/domain/schemas/` (single source of truth)

2. If schema changes are relevant for the client, the DTO schemas will have to be changed on the server, which will reflect in the API documentation (every API endpoint must define 2 DTOs - one request DTO and 1 response DTO).

3. If the API documentation changed, you need to re-generated the `client/src/types/generated/api.types.ts` file:
```bash
cd client/
npm run generate:api-types
```
For this to work, the server must be running.
Run after any change to server DTO schemas. 
Do never edit `api.types.ts` by hand.

4. You now have access to the defined / changed types in the client. Optional: To simplify their usage, add a re-export here if you like: `client/src/types/domain`


# Additional Infos
> **For additional infos, refer to the official [ExplAIner WIKI ](https://github.com/martin-stierlen/ExplAIner/wiki)!**

Owlbert even created a sub-section in the **Contributor Guide**, which will guide you step by step through the workflow of how to add / change / ... schemas! 🦉 Simply **[click here](https://github.com/martin-stierlen/ExplAIner/wiki/4.2%20-%20How-To-Work-with-Types-and-Schemas)**! :)
