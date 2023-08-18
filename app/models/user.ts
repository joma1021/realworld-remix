export interface UserData {
  username: string;
  email: string;
  bio: string;
  image: string;
  token: string;
}

export interface UserSessionData {
  username: string;
  image: string;
  isLoggedIn: boolean;
}
