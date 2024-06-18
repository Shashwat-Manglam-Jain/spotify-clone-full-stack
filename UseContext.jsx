import React, { createContext, useState } from "react";

// Create the context
const Context = createContext();

// Custom provider component
const UseContextProvider = ({ children }) => {
  const [lib, setLib] = useState([]);

  return (
    <Context.Provider value={{ lib, setLib }}>
      {children}
    </Context.Provider>
  );
};

export { UseContextProvider, Context }; // Export the provider and context
