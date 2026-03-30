import React, { createContext, useContext, useState } from "react";

export type Humor = "feliz" | "triste" | "bravo" | "ansioso" | "calmo" | "calculando" | "inicio" | null;

type HumorContextType = {
  humor: Humor;
  setHumor: (value: Humor) => void;
};

const HumorContext = createContext<HumorContextType>({
  humor: "inicio", 
  setHumor: () => {},
});

export const HumorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [humor, setHumor] = useState<Humor>("inicio");

  return (
    <HumorContext.Provider value={{ humor, setHumor }}>
      {children}
    </HumorContext.Provider>
  );
};

export const useHumor = () => useContext(HumorContext);