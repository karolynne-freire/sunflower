import React, { createContext, useContext, useState } from "react";

export type Humor = "feliz" | "triste" | "bravo" | "ansioso" | null;

type HumorContextType = {
  humor: Humor;
  setHumor: (value: Humor) => void;
};

const HumorContext = createContext<HumorContextType>({
  humor: null,
  setHumor: () => {},
});

export const HumorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [humor, setHumor] = useState<Humor>(null);

  return (
    <HumorContext.Provider value={{ humor, setHumor }}>
      {children}
    </HumorContext.Provider>
  );
};

export const useHumor = () => useContext(HumorContext);

