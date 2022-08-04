import { Modal } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { render, screen } from "@testing-library/react";
import { AppContextProvider } from "../controllers/context";
import { ImportStateContextProvider } from "../controllers/importContext";
import { GOOGLE_CLIENT_ID } from "../envVars";
import "@testing-library/jest-dom/extend-expect";
import { DragToUpload } from "./DragToUpload";

describe("Drag to Upload", () => {

  const fileName = "file.jpg";
  const file = new File([new ArrayBuffer(1)], fileName);
  const verifyFile = jest.fn();

  test("should show 'drag and drop' and 'click to upload' if selected file is null", () => {
    render(
      <DragToUpload
        fileToUpload={null}
        allowableTypes={null}
        verifyFiles={verifyFile}
      />
    );

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();

    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  test("should show the name of the file if file is selected", () => {
    render(
        <DragToUpload
          fileToUpload={file}
          allowableTypes={null}
          verifyFiles={verifyFile}
        />
      );

      expect(screen.getByText(fileName)).toBeInTheDocument();
  });
});
