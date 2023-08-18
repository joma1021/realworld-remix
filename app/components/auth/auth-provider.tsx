import React from "react";
import type { PropsWithChildren } from "react";
import type { UserSessionData } from "~/models/user";

export const UserContext = React.createContext({ username: "", image: "", isLoggedIn: false });

export function AuthProvider({ children, userSession }: PropsWithChildren<{ userSession: UserSessionData }>) {
  return <UserContext.Provider value={userSession}>{children}</UserContext.Provider>;
}
