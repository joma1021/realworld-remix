interface FormErrorProps {
  errors: { [key: string]: string[] };
}

export default function FormError(props: FormErrorProps) {
  return (
    <ul className="error-messages">
      {Object.entries(props.errors).map(([field, fieldErrors]) =>
        fieldErrors.map((fieldError) => (
          <li key={field + fieldError}>
            {field} {fieldError}
          </li>
        ))
      )}
    </ul>
  );
}
