import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import { useContext, type PropsWithChildren } from "react";
import { getGlobalArticles, getTags } from "~/services/article-service";
import TagNavbar from "~/components/tag/tag-navbar";
import { ArticleList } from "~/components/article/article-list";
import { getToken } from "~/session.server";
import { UserContext } from "~/components/auth/auth-provider";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const token = await getToken(request);
  const currentPage = url.searchParams.get("page") ?? "1";
  const activeTag = url.searchParams.get("tag") ?? "";
  const currentPageNumber = Number(currentPage);
  const [articles, tags] = await Promise.all([
    getGlobalArticles(activeTag, Number(currentPageNumber), token),
    getTags(),
  ]);
  return { articles, tags, currentPageNumber, activeTag };
}

function ArticleOverview() {
  const { articles, tags, currentPageNumber, activeTag } = useLoaderData<typeof loader>();

  return (
    <div className="row">
      <ArticleList articles={articles} currentPageNumber={currentPageNumber} activeTag={activeTag} />
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
