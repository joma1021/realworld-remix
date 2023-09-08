import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { validateInput } from "~/common/helpers";
import DefaultError from "~/components/errors/default-error";
import FormError from "~/components/errors/form-error";
import type { EditArticleData } from "~/models/article";
import { getArticle, updateArticle } from "~/services/article-service";
import { getToken } from "~/session.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Conduit - Editor" }];
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await getToken(request);
  const slug = params.slug as string;
  return await getArticle(slug, token);
};

export const action = async ({ request, params }: ActionArgs) => {
  const slug = params.slug as string;
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const body = formData.get("body");
  const tags = formData.get("tags") as string;
  const tagList = tags.split(",");

  if (!validateInput(title)) {
    return json({ errors: { "": ["title can't be blank"] } }, { status: 400 });
  }
  if (!validateInput(description)) {
    return json({ errors: { "": ["description can't be blank"] } }, { status: 400 });
  }
  if (!validateInput(body)) {
    return json({ errors: { "": ["body can't be blank"] } }, { status: 400 });
  }

  const editArticle: EditArticleData = {
    title: title as string,
    description: description as string,
    body: body as string,
    tagList: tagList,
  };
  const token = await getToken(request);
  const response = await updateArticle(slug, editArticle, token);
  const data = await response.json();

  if (!response.ok) {
    return json({ errors: data.errors }, { status: 400 });
  } else {
    return redirect(`/article/${data.article.slug}`);
  }
};

export default function ArticleEditor() {
  const article = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [tagListState, setTagListState] = useState<string[]>(article.tagList);

  function removeTag(tag: string): void {
    const newTagList = tagListState.filter((t) => t != tag);
    setTagListState(newTagList);
  }

  function updateTags(event: any): void {
    const tags = event.target.value;
    setTagListState(tags.split(","));
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {actionData?.errors && <FormError errors={actionData.errors} />}

            <Form method="post">
              <fieldset>
                <fieldset className="form-group">
                  <input type="text" className="form-control form-control-lg" name="title" placeholder="Article Title" defaultValue={article.title} />
                </fieldset>
                <fieldset className="form-group">
                  <input type="text" className="form-control" name="description" placeholder="What's this article about?" defaultValue={article.description} />
                </fieldset>
                <fieldset className="form-group">
                  <textarea className="form-control" name="body" rows={8} placeholder="Write your article (in markdown)" defaultValue={article.body}></textarea>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    name="tags"
                    placeholder="Enter tags"
                    defaultValue={tagListState}
                    onChange={updateTags}
                  />
                  <div className="tag-list">
                    {tagListState.map((tag) => (
                      <span className="tag-default tag-pill" key={tag}>
                        <i className="ion-close-round" onClick={() => removeTag(tag)}></i> {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button className="btn btn-lg pull-xs-right btn-primary" type="submit" disabled={navigation.state === "submitting"}>
                  Publish Article
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <DefaultError />;
}
