import { Checkbox, Link } from "@chakra-ui/react";
import {
  FullScreenForm,
  FullScreenFormHeading,
  FullScreenFormStack,
} from "../common/FullScreenForm";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import ActionButton from "../common/buttons/ActionButton";
import useBoolean from "../hooks/useBoolean";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function () {
  const [hasAgreed, { toggle }] = useBoolean(false);

  const navigate = useNavigate();

  return (
    <FullScreenForm>
      <FullScreenFormHeading>
        Before you continue, please agree to the terms of the{" "}
        <Link to={routes.privacyPolicy}>privacy policy</Link>.
      </FullScreenFormHeading>

      <FullScreenFormStack>
        <Checkbox onChange={() => toggle()}>
          Yes, I agree to the terms of the privacy policy.
        </Checkbox>

        <ActionButton
          actionType="primary"
          isDisabled={!hasAgreed}
          onClick={() => navigate(routes.import)}
        >
          Continue{" "}
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "1rem" }} />
        </ActionButton>
      </FullScreenFormStack>
    </FullScreenForm>
  );
}
