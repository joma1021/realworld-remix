import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { getGlobalArticles, getTags, getYourArticles } from "~/services/article-service";
import TagNavbar from "~/components/tag/tag-navbar";
import { ArticleList } from "~/components/article/article-list";
import { getToken, getUserSessionData } from "~/session.server";
import { UserContext } from "~/components/auth/auth-provider";
import DefaultError from "~/components/errors/default-error";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderArgs) {
  const token = await getToken(request);
  const url = new URL(request.url);
  const userSession = await getUserSessionData(request);
  const currentPage = url.searchParams.get("page") ?? "1";
  const filter = url.searchParams.get("filter") ?? (userSession.isLoggedIn ? "your" : "global");
  const currentPageNumber = Number(currentPage);

  switch (filter) {
    case "your": {
      const [articles, tags] = await Promise.all([getYourArticles(token, Number(currentPageNumber)), getTags()]);
      return { articles, tags, currentPageNumber, filter };
    }

    case "global": {
      const [articles, tags] = await Promise.all([getGlobalArticles(token, Number(currentPageNumber)), getTags()]);
      return { articles, tags, currentPageNumber, filter };
    }

    default: {
      const [articles, tags] = await Promise.all([
        getGlobalArticles(token, Number(currentPageNumber), filter),
        getTags(),
      ]);
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

export default function Home() {
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
      <div className="container page">
        <ArticleOverview />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
