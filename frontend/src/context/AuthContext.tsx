import React, { createContext, useContext, useState, ReactNode } from "react";

type Pessoa = {
  IDPESSOAFIS: number;
  NOMEPESSOA: string;
  CPFPESSOA: string;
};

type AuthContextType = {
  pessoa: Pessoa | null;
  setPessoa: (pessoa: Pessoa | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  pessoa: null,
  setPessoa: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);

  return (
    <AuthContext.Provider value={{ pessoa, setPessoa }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
