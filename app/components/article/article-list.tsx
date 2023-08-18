import { Link } from "@remix-run/react";
import type { ArticleData, ArticlesDTO } from "~/models/article";
import { ArticlePreview } from "./article-preview";

export function ArticleList({
  articles,
  currentPageNumber,
  activeTag,
}: {
  articles: ArticlesDTO;
  currentPageNumber: number;
  activeTag: string;
}) {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          <li className="nav-item">
            <Link className={`nav-link `} to="">
              Your Feed
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${activeTag == "" ? "active" : ""}`} to="/">
              Global Feed
            </Link>
          </li>

          {activeTag != "" && (
            <li className="nav-item">
              <Link className={"nav-link active"} to={`/?tag=${activeTag}`}>
                #{activeTag}
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
                to={`/?tag=${activeTag}&page=${i + 1}`}
              >
                {i + 1}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
