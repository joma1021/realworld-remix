import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { validateInput } from "~/common/helpers";
import FormError from "~/components/errors/form-error";
import type { RegisterCredentials } from "~/models/auth";
import { register } from "~/services/auth-service";
import { createUserSession } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  if (!validateInput(email)) {
    return json({ errors: { [""]: ["email can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(password)) {
    return json({ errors: { [""]: ["password can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(username)) {
    return json({ errors: { [""]: ["password can't be blank"] } }, { status: 400 });
  }
  const credentials: RegisterCredentials = {
    username: username as string,
    email: email as string,
    password: password as string,
  };

  const response = await register(credentials);
  const data = await response.json();

  if (!response.ok) {
    return json({ errors: data.errors }, { status: 400 });
  } else {
    return createUserSession({
      request: request,
      username: data.user.username,
      authToken: data.user.token,
      image: data.user.image,
      redirectTo: "/",
    });
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            {actionData?.errors && <FormError errors={actionData.errors} />}

            <Form method="post">
              <fieldset className="form-group">
                <input className="form-control form-control-lg" name="username" type="text" placeholder="Username" />
              </fieldset>
              <fieldset className="form-group">
                <input className="form-control form-control-lg" name="email" type="email" placeholder="Email" />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
                Sign Up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}