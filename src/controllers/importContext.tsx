import React, { createContext, useContext, useReducer } from "react";
import { DriveFile } from "@backend/http/routes/googleRoute/getDriveFiles";
import { AssignmentDetails } from "@backend/services/getAssignmentStatistics";
import { ImportAction, importReducer, ImportState } from "./importReducer";

export const importInitialState: ImportState = {
  importStage: 1,
  gDrive: {
    selected: {} as DriveFile,
    searchResults: [] as DriveFile[],
  },
  userHasSelectedFile: false,
  fileUpload: { toUpload: {} as File },
  assignmentReturned: {} as AssignmentDetails,
  importedAssignmentCurveString: "",
};

const ImportStateContext = createContext<ImportState>(importInitialState);
const ImportDispatchContext = createContext<React.Dispatch<ImportAction>>(
  {} as React.Dispatch<ImportAction>
);

export const useImportStateContext = () => useContext(ImportStateContext);
export const useImportStateDispatch = () => useContext(ImportDispatchContext);

export function ImportStateContextProvider(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  const [importState, importDispatch] = useReducer(
    importReducer,
    importInitialState
  );

  return (
    <ImportStateContext.Provider value={importState}>
      <ImportDispatchContext.Provider value={importDispatch}>
        {children}
      </ImportDispatchContext.Provider>
    </ImportStateContext.Provider>
  );
}
