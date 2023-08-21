import { BASE_URL } from "~/common/api";
import { setHeaders } from "~/common/headers";
import type { ArticleData, ArticlesDTO, EditArticleData } from "~/models/article";
import { Tab } from "~/models/tab";

export async function getTags(): Promise<string[]> {
  console.log("FETCH", `${BASE_URL}/tags`);

  const response = await fetch(`${BASE_URL}/tags`, { method: "GET" });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  console.log("FETCH tags resolved");
  const data = await response.json();
  return data.tags;
}
export async function getGlobalArticles(page?: number, tag?: string): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 10 : 0;
  const searchParams = tag
    ? new URLSearchParams({
        limit: "10",
        offset: `${offset}`,
        tag: tag,
      })
    : new URLSearchParams({
        limit: "10",
        offset: `${offset}`,
      });
  console.log("FETCH", `${BASE_URL}/articles?` + searchParams);

  const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
    method: "GET",
    headers: setHeaders(),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  console.log("FETCH articles resolved");
  return await response.json();
}

export async function getYourArticles(token?: string, page?: number): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 10 : 0;
  const searchParams = new URLSearchParams({
    limit: "10",
    offset: `${offset}`,
  });
  console.log("FETCH", `${BASE_URL}/articles/feed?` + searchParams);

  const response = await fetch(`${BASE_URL}/articles/feed?` + searchParams, {
    method: "GET",
    headers: setHeaders(token),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  console.log("FETCH articles resolved");
  return await response.json();
}

export async function getProfileArticles(
  username: string,
  tab: Tab,
  token: string,
  controller?: AbortController,
  page?: number
): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 5 : 0;

  const searchParams =
    tab == Tab.FavArticles
      ? new URLSearchParams({
          limit: "5",
          offset: `${offset}`,
          favorited: username,
        })
      : new URLSearchParams({
          limit: "5",
          offset: `${offset}`,
          author: username,
        });

  console.log("FETCH", `${BASE_URL}/articles?` + searchParams);

  const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
    method: "GET",
    signal: controller?.signal,
    headers: setHeaders(token),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  console.log("FETCH articles resolved");
  return await response.json();
}

export async function getArticle(slug: string, token?: string): Promise<ArticleData> {
  console.log("FETCH", `${BASE_URL}/articles/${slug}`);

  const response = await fetch(`${BASE_URL}/articles/${slug}`, {
    method: "GET",
    headers: setHeaders(token),
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  console.log("FETCH article resolved");
  const data = await response.json();
  return data.article;
}

export async function createArticle(token: string, article: EditArticleData): Promise<Response> {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: setHeaders(token),
    body: JSON.stringify({ article }),
  });
}

export async function updateArticle(token: string, slug: string, article: EditArticleData): Promise<Response> {
  return await fetch(`${BASE_URL}/articles/${slug}`, {
    method: "PUT",
    headers: setHeaders(token),
    body: JSON.stringify({ article }),
  });
}

export async function deleteArticle(slug: string, token?: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}`, {
    method: "DELETE",
    headers: setHeaders(token),
  });
}

export async function favoriteArticle(slug: string, token?: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: "POST",
    headers: setHeaders(token),
  });
}

export async function unfavoriteArticle(slug: string, token?: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: "DELETE",
    headers: setHeaders(token),
  });
}
