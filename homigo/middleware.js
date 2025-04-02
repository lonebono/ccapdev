//Import Relavent Modules
export { default } from "next-auth/middleware";

//configures the middleware to apply only to the /dashboard route, ensuring that only authenticated users can access it
export const config = { matcher: ["/dashboard"] };