import { FormLabel, Input } from "@chakra-ui/react";
import { ObjectTyped } from "object-typed";
import { StringOnlyFormData } from "../hooks/useForm";

const genReactKey = (id: string, labelOrInput: "label" | "input") =>
  `${id}-${labelOrInput}`;

const inputType = (key: string | number | symbol) => {
  if (key === "password" || key === "confirmedPassword") {
    return "password";
  } else if (key === "email") {
    return "email";
  } else {
    return "text";
  }
};

export default function RegisterFormDisplay<
  K extends StringOnlyFormData
>(props: {
  formState: K;
  updateFormState: (
    field: keyof K,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  formFieldLabels: { [key in keyof K]: string };
}) {
  const { formState, updateFormState, formFieldLabels } = props;

  const formDisplay = ObjectTyped.keys(formState).map((key) => {
    const id = `register-${String(key)}`;

    return (
      <>
        <FormLabel htmlFor={id} key={genReactKey(id, "label")}>
          {formFieldLabels[key]}
        </FormLabel>

        <Input
          type={inputType(key)}
          marginBottom="1rem"
          id={id}
          key={genReactKey(id, "input")}
          value={formState[key]}
          onChange={(e) => updateFormState(key, e)}
        />
      </>
    );
  });

  return <>{formDisplay}</>;
}
