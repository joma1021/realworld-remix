import { Form, useNavigation } from "@remix-run/react";

export default function EditButton() {
  const navigation = useNavigation();
  return (
    <Form style={{ display: "inline-block" }} method="post" preventScrollReset={true}>
      <button
        className="btn btn-sm btn-outline-secondary"
        type="submit"
        name="action"
        value="EDIT"
        disabled={navigation.state === "submitting"}
      >
        <i className="ion-edit"></i> Edit Article
      </button>
    </Form>
  );
}
