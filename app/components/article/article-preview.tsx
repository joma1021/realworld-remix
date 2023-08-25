import { Link } from "@remix-run/react";
import type { ArticleData } from "~/models/article";
import { FavoriteButtonSmall } from "../buttons/favorite-button";

export function ArticlePreview({ article }: { article: ArticleData }) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}/articles`}>
          <img src={`${article.author.image}`} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}/articles`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{article.createdAt}</span>
        </div>
        <FavoriteButtonSmall favorite={article.favorited} favoritesCount={article.favoritesCount} slug={article.slug} />
      </div>
      <Link to={`/article/${article.slug}/comments`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
