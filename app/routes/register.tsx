import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { data, Form, Link, useActionData, useNavigation } from "react-router";
import { validateInput } from "~/common/helpers";
import FormError from "~/components/errors/form-error";
import type { RegisterCredentials } from "~/models/auth";
import { register } from "~/services/auth-service";
import { createUserSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "Conduit - Register" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const username = formData.get("username")?.toString() ?? "";

  if (!validateInput(email)) {
    return data({ errors: { "": ["email can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(password)) {
    return data({ errors: { "": ["password can't be blank"] } }, { status: 400 });
  }

  if (!validateInput(username)) {
    return data({ errors: { "": ["username can't be blank"] } }, { status: 400 });
  }
  const credentials: RegisterCredentials = {
    username: username,
    email: email,
    password: password,
  };

  const response = await register(credentials);
  const payload = await response.json();

  if (!response.ok) {
    return data({ errors: payload.errors }, { status: 400 });
  } else {
    return createUserSession({
      request: request,
      username: payload.user.username,
      authToken: payload.user.token,
      image: payload.user.image,
      redirectTo: "/",
    });
  }
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign un</h1>
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
                <input className="form-control form-control-lg" name="password" type="password" placeholder="Password" />
              </fieldset>
              <button type="submit" className="btn btn-lg btn-primary pull-xs-right" disabled={navigation.state === "submitting"}>
                Sign up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
