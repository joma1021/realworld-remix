import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useLocation, useRouteError } from "@remix-run/react";
import type { PropsWithChildren } from "react";
import { ArticlePreview } from "~/components/article/article-preview";
import { getGlobalArticles, getTags } from "~/components/services/article-service";
import type { ArticleData } from "~/models/article";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") ?? "1";
  const activeTag = url.searchParams.get("tag") ?? "";
  const currentPageNumber = Number(currentPage);
  const [articles, tags] = await Promise.all([getGlobalArticles(activeTag, Number(currentPageNumber)), getTags()]);
  return { articles, tags, currentPageNumber, activeTag };
}

function ArticleOverview() {
  const { articles, tags, currentPageNumber, activeTag } = useLoaderData<typeof loader>();

  return (
    <div className="row">
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <a className="nav-link" href="">
                Your Feed
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="">
                Global Feed
              </a>
            </li>
          </ul>
        </div>

        <div>
          {articles.articles.length == 0 ? (
            <div>No articles are here... yet.</div>
          ) : (
            <ul>
              {(articles.articles as ArticleData[]).map((article) => (
                <ArticlePreview article={article} key={article.slug} />
              ))}
            </ul>
          )}
        </div>

        <ul className="pagination">
          {Array(Math.ceil(articles.articlesCount / 10))
            .fill(null)
            .map((_, i) => (
              <li className={`page-item  ${i == currentPageNumber - 1 ? "active" : ""}`} key={i}>
                <Link
                  prefetch="intent"
                  className="page-link"
                  style={{ cursor: "pointer" }}
                  to={`/?tag=${activeTag}&page=${i + 1}`}
                >
                  {i + 1}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="col-md-3">
        <div className="sidebar">
          <p>Popular Tags</p>

          <div className="tag-list">
            {tags.map((tag) => (
              <Link
                prefetch="intent"
                className="tag-pill tag-default"
                style={{ cursor: "pointer" }}
                key={tag}
                to={`/?tag=${tag}&page=${1}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Index({ children }: PropsWithChildren) {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Index>
      <ArticleOverview />
    </Index>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { pathname, search } = useLocation();

  if (isRouteErrorResponse(error)) {
    return (
      <Index>
        <div>
          Error: {error.status} {error.statusText}
        </div>
      </Index>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <Index>
      <div>Error: {errorMessage}</div>
      <Link to={pathname + search}>{"Please retry"}</Link>
    </Index>
  );
}
