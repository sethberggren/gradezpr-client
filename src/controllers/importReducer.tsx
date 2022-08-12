import { isImportDeclaration } from "typescript";
import { DriveFile } from "@backend/http/routes/googleRoute/getDriveFiles";
import { AssignmentDetails } from "@backend/services/getAssignmentStatistics";
import { DiscriminateUnion } from "../Types";

export type ImportState = {
  importStage: number;
  gDrive: {
    selected: DriveFile;
    searchResults: DriveFile[];
  };
  userHasSelectedFile: boolean;
  fileUpload: { toUpload: File };
  assignmentReturned: AssignmentDetails;
  importedAssignmentCurveString: string;
};

export type ImportAction =
  | { type: "setSearchResults"; payload: DriveFile[] }
  | { type: "setFileToUpload"; payload: File }
  | { type: "setAssignmentReturned"; payload: AssignmentDetails }
  | { type: "setImportedAssignmentCurveString"; payload: string }
  | {
      type: "setImportStage";
      payload: number;
    }
  | { type: "setSelectedSearchResult"; payload: DriveFile }
  | { type: "resetImportState"; payload: null };

type ImportActionTypes = ImportAction["type"];

type ImportReducerFunction = {
  [key in ImportActionTypes]: (
    state: ImportState,
    {
      payload,
    }: { payload: DiscriminateUnion<ImportAction, "type", key>["payload"] }
  ) => ImportState;
};

const importReducerFunctions: ImportReducerFunction = {
  setImportStage: (state: ImportState, { payload }: { payload: number }) => {
    return { ...state, importStage: payload };
  },
  setSearchResults: (
    state: ImportState,
    { payload }: { payload: DriveFile[] }
  ) => {
    state.gDrive.searchResults = payload;
    state.gDrive.selected = {} as DriveFile;

    return state;
  },
  setSelectedSearchResult: (
    state: ImportState,
    { payload }: { payload: DriveFile }
  ) => {
    state.gDrive.selected = payload;

    return { ...state };
  },
  setFileToUpload: (state: ImportState, { payload }: { payload: File }) => {
    state.fileUpload.toUpload = payload;

    return { ...state };
  },
  setAssignmentReturned: (
    state: ImportState,
    { payload }: { payload: AssignmentDetails }
  ) => {
    return { ...state, assignmentReturned: payload };
  },
  setImportedAssignmentCurveString: (
    state: ImportState,
    { payload }: { payload: string }
  ) => {
    return { ...state, importedAssignmentCurveString: payload };
  },
  resetImportState: (state: ImportState, { payload }: { payload: null }) => {

    return {
      importedAssignmentCurveString: "",
      isLoading: false,
      importStage: 1,
      gDrive: {
        selected: {} as DriveFile,
        searchResults: [] as DriveFile[],
      },
      userHasSelectedFile: false,
      fileUpload: { toUpload: {} as File },
      assignmentReturned: {} as AssignmentDetails,
    };
  },
};

export function importReducer(state: ImportState, action: ImportAction) {

    // have to assert action as any due to this issue: 
    // https://stackoverflow.com/questions/56781010/how-to-map-objects-in-a-discriminated-union-to-functions-they-can-be-called-with

    // https://github.com/Microsoft/TypeScript/issues/30581

  return importReducerFunctions[action.type](state, action as any);
}
