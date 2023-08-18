import { BASE_URL } from "~/common/api";
import { setHeaders } from "~/common/headers";
import type { ArticleData, ArticlesDTO, EditArticleData } from "~/models/article";
import { Tab } from "~/models/tab";

export async function getTags(): Promise<string[]> {
  console.log("FETCH", `${BASE_URL}/tags`);
  try {
    const response = await fetch(`${BASE_URL}/tags`, { method: "GET" });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    console.log("FETCH tags resolved");
    const data = await response.json();
    return data.tags;
  } catch (e) {
    throw Error("Error occurred while fetching data");
  }
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

  try {
    const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
      method: "GET",
      headers: setHeaders(),
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    console.log("FETCH articles resolved");
    return await response.json();
  } catch (e) {
    console.log(e);
    throw Error("Error occurred while fetching data");
  }
}

export async function getYourArticles(token?: string, page?: number): Promise<ArticlesDTO> {
  const offset = page ? (page - 1) * 10 : 0;
  const searchParams = new URLSearchParams({
    limit: "10",
    offset: `${offset}`,
  });
  console.log("FETCH", `${BASE_URL}/articles/feed?` + searchParams);
  try {
    const response = await fetch(`${BASE_URL}/articles/feed?` + searchParams, {
      method: "GET",
      headers: setHeaders(token),
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH articles resolved");
    return await response.json();
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
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
  try {
    const response = await fetch(`${BASE_URL}/articles?` + searchParams, {
      method: "GET",
      signal: controller?.signal,
      headers: setHeaders(token),
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH articles resolved");
    return await response.json();
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}

export async function getArticle(slug: string, token?: string, controller?: AbortController): Promise<ArticleData> {
  console.log("FETCH", `${BASE_URL}/articles/${slug}`);
  try {
    const response = await fetch(`${BASE_URL}/articles/${slug}`, {
      method: "GET",
      signal: controller?.signal,
      headers: setHeaders(token),
    });
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    console.log("FETCH article resolved");
    const data = await response.json();
    return data.article;
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
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

export async function deleteArticle(token: string, slug: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}`, {
    method: "DELETE",
    headers: setHeaders(token),
  });
}

export async function favoriteArticle(token: string, slug: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: "POST",
    headers: setHeaders(token),
  });
}

export async function unfavoriteArticle(token: string, slug: string): Promise<Response> {
  return fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: "DELETE",
    headers: setHeaders(token),
  });
}
