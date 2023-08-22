import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArticlePreview } from "~/components/article/article-preview";
import DefaultError from "~/components/errors/default-error";
import type { ArticleData } from "~/models/article";
import { getProfileArticles } from "~/services/article-service";
import { getToken } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const url = new URL(request.url);
  const currentPageNumber = Number(url.searchParams.get("page") ?? "1");
  const filter = url.searchParams.get("filter") ?? "my";
  const username = params.username as string;
  const token = await getToken(request);
  const profileArticles = await getProfileArticles(username, filter, token, currentPageNumber);

  return { profileArticles, filter, currentPageNumber };
}

export default function ProfileArticles() {
  const { profileArticles, filter, currentPageNumber } = useLoaderData<typeof loader>();
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-10 offset-md-1">
          <div className="articles-toggle">
            <ul className="nav nav-pills outline-active">
              <li className="nav-item">
                <Link prefetch="intent" className={`nav-link ${filter === "my" ? "active" : ""}`} to="?filter=my">
                  My Articles
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch="intent" className={`nav-link ${filter === "fav" ? "active" : ""}`} to="?filter=fav">
                  Favorited Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            {profileArticles.articles.length == 0 ? (
              <div>No articles are here... yet.</div>
            ) : (
              <ul>
                {(profileArticles.articles as ArticleData[]).map((article) => (
                  <ArticlePreview article={article} key={article.slug} />
                ))}
              </ul>
            )}
          </div>

          <ul className="pagination">
            {Array(Math.ceil(profileArticles.articlesCount / 10))
              .fill(null)
              .map((_, i) => (
                <li className={`page-item  ${i == currentPageNumber - 1 ? "active" : ""}`} key={i}>
                  <Link
                    prefetch="intent"
                    className="page-link"
                    style={{ cursor: "pointer" }}
                    to={`?filter=${filter}&page=${i + 1}`}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
