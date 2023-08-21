import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext, type PropsWithChildren } from "react";
import { getGlobalArticles, getTags, getYourArticles } from "~/services/article-service";
import TagNavbar from "~/components/tag/tag-navbar";
import { ArticleList } from "~/components/article/article-list";
import { getToken, getUserSessionData } from "~/session.server";
import { UserContext } from "~/components/auth/auth-provider";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const userSession = await getUserSessionData(request);
  const currentPage = url.searchParams.get("page") ?? "1";
  const filter = url.searchParams.get("filter") ?? (userSession.isLoggedIn ? "your" : "global");
  const currentPageNumber = Number(currentPage);

  switch (filter) {
    case "your": {
      const token = await getToken(request);
      const [articles, tags] = await Promise.all([getYourArticles(token, Number(currentPageNumber)), getTags()]);
      return { articles, tags, currentPageNumber, filter };
    }

    case "global": {
      const [articles, tags] = await Promise.all([getGlobalArticles(Number(currentPageNumber)), getTags()]);
      return { articles, tags, currentPageNumber, filter };
    }

    default: {
      const [articles, tags] = await Promise.all([getGlobalArticles(Number(currentPageNumber), filter), getTags()]);
      return { articles, tags, currentPageNumber, filter };
    }
  }
}

function ArticleOverview() {
  const { articles, tags, currentPageNumber, filter } = useLoaderData<typeof loader>();

  return (
    <div className="row">
      <ArticleList articles={articles} currentPageNumber={currentPageNumber} filter={filter} />
      <TagNavbar tags={tags} />
    </div>
  );
}

function HomeLayout({ children }: PropsWithChildren) {
  const userSession = useContext(UserContext);
  return (
    <div className="home-page">
      {!userSession.isLoggedIn && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}
      <div className="container page">{children}</div>
    </div>
  );
}

export default function Home() {
  return (
    <HomeLayout>
      <ArticleOverview />
    </HomeLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { pathname, search } = useLocation();

  if (isRouteErrorResponse(error)) {
    return (
      <HomeLayout>
        <div>
          Error: {error.status} {error.statusText}
          <Link to={pathname + search}>{"Please retry"}</Link>
        </div>
      </HomeLayout>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <HomeLayout>
      <div>Error: {errorMessage}</div>
      <Link to={pathname + search}>{"Please retry"}</Link>
    </HomeLayout>
  );
}
