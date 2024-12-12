import React, { createContext, useState, useContext } from "react";

interface UserContextType {
  user: { id: string; name: string; role: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; role: string } | null>
  >;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
