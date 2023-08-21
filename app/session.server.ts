import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { UserData, UserSessionData } from "./models/user";

const USERNAME_KEY = "username";
const TOKEN_KEY = "auth-token";
const IMAGE_KEY = "user-image";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET as string],
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserSessionData(request: Request): Promise<UserSessionData> {
  const session = await getSession(request);
  const username = session.get(USERNAME_KEY);
  const image = session.get(IMAGE_KEY);
  if (username) return { username: username, image: image, isLoggedIn: true };
  else {
    return { username: "", image: "", isLoggedIn: false };
  }
}

export async function getToken(request: Request): Promise<UserData["token"] | undefined> {
  const session = await getSession(request);
  const token = session.get(TOKEN_KEY);
  return token;
}

export async function createUserSession({
  request,
  username,
  authToken,
  image,
  redirectTo,
}: {
  request: Request;
  username: string;
  authToken: string;
  image: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USERNAME_KEY, username);
  session.set(TOKEN_KEY, authToken);
  session.set(IMAGE_KEY, image);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24, // 1 day
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
