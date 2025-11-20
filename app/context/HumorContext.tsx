import React, { createContext, useContext, useState } from "react";

type Humor = "feliz" | "triste" | "bravo" | null;

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
  const [humor, setHumor] = useState<Humor>("bravo"); // padrão inicial

  return (
    <HumorContext.Provider value={{ humor, setHumor }}>
      {children}
    </HumorContext.Provider>
  );
};

export const useHumor = () => useContext(HumorContext);
