import { Form, useNavigation } from "@remix-run/react";

export default function DeleteButton() {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className="btn btn-sm btn-outline-danger"
        type="submit"
        name="action"
        value="DELETE"
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-trash-a"></i> Delete Article
      </button>
    </Form>
  );
}
