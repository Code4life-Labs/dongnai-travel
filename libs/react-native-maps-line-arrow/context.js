import { createContext } from "react";

const headingContext = createContext(0);

export default headingContext;

export const HeadingProvider = headingContext.Provider;