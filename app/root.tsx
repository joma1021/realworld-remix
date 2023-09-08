import styles from "~/styles/global.css";
import { redirect, type LinksFunction, type LoaderArgs } from "@vercel/remix";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { Layout } from "./components/layout/layout";
import { getUserSessionData } from "./session.server";
import { AuthProvider } from "./components/auth/auth-provider";

export const links: LinksFunction = () => [...[{ rel: "stylesheet", href: styles }]];
export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const userSessionData = await getUserSessionData(request);

  if (!userSessionData.isLoggedIn) {
    if (url.pathname === "/settings") throw redirect("/register");
    if (url.pathname === "/editor") throw redirect("/register");
    if (url.pathname.includes("/editor/")) throw redirect("/register");
  }

  return userSessionData;
};

export default function App() {
  const sessionData = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <link
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider userSession={sessionData}>
          <Layout>
            <Outlet />
          </Layout>
        </AuthProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
