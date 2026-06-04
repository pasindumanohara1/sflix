import { createContext, useContext, useState, type ReactNode } from 'react';

interface LoginContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const LoginContext = createContext<LoginContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function LoginProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LoginContext.Provider value={{ isOpen, open, close }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  return useContext(LoginContext);
}
