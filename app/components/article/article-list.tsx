import { Link } from "@remix-run/react";
import type { ArticleData, ArticlesDTO } from "~/models/article";
import { ArticlePreview } from "./article-preview";
import { UserContext } from "../auth/auth-provider";
import { useContext } from "react";

export function ArticleList({
  articles,
  currentPageNumber,
  filter,
}: {
  articles: ArticlesDTO;
  currentPageNumber: number;
  filter: string;
}) {
  const userSession = useContext(UserContext);
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          {userSession.isLoggedIn && (
            <li className="nav-item">
              <Link prefetch="intent" className={`nav-link ${filter == "your" ? "active" : ""}`} to="?filter=your">
                Your Feed
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link prefetch="intent" className={`nav-link ${filter === "global" ? "active" : ""}`} to="?filter=global">
              Global Feed
            </Link>
          </li>

          {filter != "global" && filter != "your" && (
            <li className="nav-item">
              <Link prefetch="intent" className={"nav-link active"} to={`?tag=${filter}`}>
                #{filter}
              </Link>
            </li>
          )}
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
                to={`?filter=${filter}&page=${i + 1}`}
              >
                {i + 1}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
