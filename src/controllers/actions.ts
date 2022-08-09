import React from "react";
import { indexByBool } from "../services/helperFunctions";
import { Authentication } from "../Types";
import {
  appContextInitialState,
  useAppStateContext,
  useDispatchContext,
} from "./context";
import { Action, State } from "./reducer";
import { cloneDeep } from "lodash";
import axios, { Axios, AxiosError } from "axios";
import backendUrl from "../services/backendUrl";
import errorHandler from "./errorHandler";
import { excelAllowableTypes } from "../common/DragToUpload";
import { Navigate, NavigateFunction } from "react-router-dom";
import { apiRoutes, routes } from "../routes";
import { CodeResponse, CredentialResponse } from "@react-oauth/google";
import { apiCall, setTokenFromResponseHeader } from "./APIUtils";
import { RegisterForm } from "../welcome/Register";
import { ImportAction } from "./importReducer";
import { UploadFileDetails } from "@backend/http/routes/upload/uploadFileStats";
import { DriveFile } from "@backend/http/routes/googleRoute/getDriveFiles";
import { NewToken } from "@backend/http/routes/authentication/generateToken";
import {
  AssignmentResponse,
  CurveMethods,
  CurveOptions,
} from "@backend/services/curveGrades";
import { AssignmentDetails } from "@backend/services/getAssignmentStatistics";
import {
  CourseResponse,
  PostCourseRequest,
} from "@backend/http/routes/courses/postCourse";
import { StudentResponse } from "@backend/http/routes/students/studentsRoute";
import { InitializeResponse } from "@backend/http/routes/initialize/initializeRouter";
import { RosterImportResponse } from "@backend/http/routes/students/bulkUploadStudents";
import { ChangePasswordRequest } from "@backend/http/routes/authentication/changePassword";
import { ImportDriveFileRequest } from "@backend/http/routes/googleRoute/importDriveFile";
import { NewStudentRequest } from "@backend/http/routes/students/postStudent";
import { PutStudentRequest } from "@backend/http/routes/students/putStudent";
import { FileCurveDetails } from "@backend/http/routes/upload/uploadFileCurve";
import { CurveDriveFileRequest } from "@backend/http/routes/googleRoute/curveDriveFile";
import { LoginUserRequest } from "@backend/http/routes/authentication/loginUser";
import { UserRequestRequest } from "../footerComponents/BugRequest";
import {
  driveScope,
  sheetsScope,
} from "../common/buttons/GoogleAdditionalScopesButton";
import { getErrorFactory } from "../errors";

// const load = (dispatch: React.Dispatch<Action>) => dispatch({ type: "loadingContent", payload: null });
// const doneLoading = (dispatch: React.Dispatch<Action>) => dispatch({ type: "doneLoading" , payload: null});

const setInitializingOn = (dispatch: React.Dispatch<Action>) => {
  dispatch({ type: "setInitializing", payload: true });
};

const setInitializingOff = (dispatch: React.Dispatch<Action>) => {
  dispatch({ type: "setInitializing", payload: false });
};

export const clearErrors = (dispatch: React.Dispatch<Action>) =>
  dispatch({ type: "error", payload: { type: "", message: "" } });

export const createCredentialError = (dispatch: React.Dispatch<Action>) => {
  const { name, message } = getErrorFactory("AuthenticationError")(
    "noEmailOrPassword"
  ).errorBody;
  dispatch({ type: "error", payload: { type: name, message: message } });
};

export const createError = (
  dispatch: React.Dispatch<Action>,
  err: AxiosError
) => {
  if (err.response) {
    setTokenFromResponseHeader(err.response, dispatch);

    dispatch({
      type: "error",
      payload: {
        type: "Error!",
        message: err.response.data.message,
      },
    });
  } else {
    dispatch({
      type: "error",
      payload: {
        type: "Unkown error",
        message: "An unknown error occurred.  Please try again.",
      },
    });
  }
};

export const resetImportState = (dispatch: React.Dispatch<ImportAction>) => {
  dispatch({ type: "resetImportState", payload: null });
};

export async function searchDrive(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  importDispatch: React.Dispatch<ImportAction>,
  query: string
) {
  const requestUrl = `${apiRoutes.getDriveFiles}?fileName=${query}`;

  const foundFiles = await apiCall<DriveFile[]>(
    token,
    dispatch,
    { type: "GET" },
    requestUrl,
    true
  );

  if (foundFiles) {
    importDispatch({ type: "setSearchResults", payload: foundFiles });
  }
}

export function setSelectedSearchResult(
  importDispatch: React.Dispatch<ImportAction>,
  driveFiles: DriveFile[],
  selectedState: boolean[]
) {
  // const driveFile = cloneDeep(indexByBool(driveFiles, selectedState)[0]);

  const driveFile = indexByBool(driveFiles, selectedState)[0];

  importDispatch({
    type: "setSelectedSearchResult",
    payload: { ...driveFile },
  });
}

export function verifyFile(
  dispatch: React.Dispatch<Action>,
  importDispatch: React.Dispatch<ImportAction>,
  files: FileList | null
) {
  const allowableTypes = excelAllowableTypes;

  if (!files) {
    return;
  }

  if (files.length > 1) {
    dispatch({
      type: "error",
      payload: {
        type: "File Upload Error.",
        message: "Please upload only one file.",
      },
    });
    return;
  }

  if (!allowableTypes.includes(files[0].type)) {
    dispatch({
      type: "error",
      payload: {
        type: "File Upload Error.",
        message: "Please upload a .xlsx file.",
      },
    });

    return;
  }

  importDispatch({ type: "setFileToUpload", payload: files[0] });
}

export function setImportStage(
  importDispatch: React.Dispatch<ImportAction>,
  stage: number
) {
  importDispatch({ type: "setImportStage", payload: stage });
}

export async function importFile(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  importDispatch: React.Dispatch<ImportAction>,
  courseName: string,
  driveFile?: DriveFile,
  file?: File
) {
  if (file !== undefined && file.name) {
    const importFileRequest: UploadFileDetails = {
      subject: courseName,
    };
    const fileFormData = new FormData();
    fileFormData.append("file", file, file.name);
    fileFormData.append("body", JSON.stringify(importFileRequest));

    const assignment = await apiCall<AssignmentDetails>(
      token,
      dispatch,
      { type: "POST", payload: fileFormData },
      apiRoutes.uploadFileStats,
      true
    );

    console.log("here's the assignment response");
    console.log(assignment);

    if (assignment) {
      importDispatch({ type: "setAssignmentReturned", payload: assignment });
      importDispatch({ type: "setImportStage", payload: 2 });
      return;
    }
  }

  if (driveFile && file === undefined) {
    const importFileRequest: ImportDriveFileRequest = {
      name: driveFile.name,
      id: driveFile.id,
      course: courseName,
    };
    const assignment = await apiCall<AssignmentDetails>(
      token,
      dispatch,
      {
        type: "POST",
        payload: { name: driveFile.name, id: driveFile.id, course: courseName },
      },
      apiRoutes.importDriveFile,
      true
    );

    if (assignment) {
      importDispatch({ type: "setAssignmentReturned", payload: assignment });
      importDispatch({ type: "setImportStage", payload: 2 });
      return;
    }
  }

  throw new Error(
    "Must pass along either a file or a Google Sheets id to import a file."
  );
}

export async function curveGrades(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  importDispatch: React.Dispatch<ImportAction>,
  assignmentDetails: AssignmentDetails,
  userAssignments: AssignmentResponse[],
  method: CurveMethods,
  options: CurveOptions,
  driveFile?: DriveFile,
  file?: File
) {
  // const optionsAsNums = {
  //   min: parseFloat(options.min),
  //   max: parseFloat(options.max),
  //   mean: parseFloat(options.mean),
  //   std: parseFloat(options.std),
  // };

  if (file !== undefined && file.name) {
    // to-do: refactor so this uses options as strings, instead of options as numbers.
    console.log("Curving local file.");
    const fileFormData = new FormData();
    fileFormData.append("file", file, file.name);

    const fileCurveRequest: FileCurveDetails = {
      assignmentDetails: assignmentDetails,
      curveMethod: method,
      curveOptions: options,
    };

    fileFormData.append("body", JSON.stringify(fileCurveRequest));

    const importedAssignment = await apiCall<AssignmentResponse>(
      token,
      dispatch,
      { type: "POST", payload: fileFormData },
      apiRoutes.uploadFileCurve,
      true
    );

    if (importedAssignment) {
      importDispatch({
        type: "setImportedAssignmentCurveString",
        payload: importedAssignment.allGradesString,
      });

      // this seems inefficient - when you dispatch the setUserAssignments, it re-renders the page beneath the modal
      // which triggers a repaint of the userAssignments component, which blocks the copy button from being copied.
      dispatch({
        type: "setUserAssignments",
        payload: [...userAssignments, importedAssignment],
      });
      return;
    }
  }

  if (driveFile) {
    const requestPayload: CurveDriveFileRequest = {
      assignmentDetails: assignmentDetails,
      curveMethod: method,
      curveOptions: options,
    };

    // to-do:  refactor so this uses options as numbers, instead of options as strings.
    const importedAssignment = await apiCall<AssignmentResponse>(
      token,
      dispatch,
      { type: "POST", payload: driveFile },
      apiRoutes.curveDriveFile,
      true
    );

    if (importedAssignment) {
      importDispatch({
        type: "setImportedAssignmentCurveString",
        payload: importedAssignment.allGradesString,
      });

      dispatch({
        type: "setUserAssignments",
        payload: [...userAssignments, importedAssignment],
      });
      return;
    }
  }

  throw new Error("No drive file or local file passed through!");
}

// export async function copyGrades(token: NewToken, assignmentId: number) {
//   const response = await getGradeString(token, assignmentId);

//   return response;
// }

export async function intialize(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>
) {
  setInitializingOn(dispatch);

  const appContextInitialState = {
    email: "",
    error: { type: "", message: "" },
    userCourses: [] as CourseResponse[],
    userStudents: [] as StudentResponse[],
    userAssignments: [] as AssignmentResponse[],
    initializing: false,
    initialized: true,
    userGoogleRequiredScopes: false,
    windowWidth: window.innerWidth,
    authenticated: true,
  } as Omit<State, "token">;

  // this initial state is what is getting send to the server with the blank tokens...
  // how do i make it such that the inital state does not automatically refresh the token?

  const initalizeResponse = await apiCall<InitializeResponse>(
    token,
    dispatch,
    { type: "GET" },
    apiRoutes.initialize,
    true
  );

  if (initalizeResponse) {
    const { courses, students, assignments, userInformation } =
      initalizeResponse;

    appContextInitialState.userCourses = courses;
    appContextInitialState.userStudents = students;
    appContextInitialState.userAssignments = assignments;

    appContextInitialState.userGoogleRequiredScopes =
      userInformation.userGoogleRequiredScopes;
    appContextInitialState.email = userInformation.email;

    dispatch({ type: "initialize", payload: { ...appContextInitialState } });
    setInitializingOff(dispatch);
  } else {
    setInitializingOff(dispatch);
    createCredentialError(dispatch);
  }
}

export async function addNewCourse(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentCourses: CourseResponse[],
  newCourse: string
) {
  const requestPayload: PostCourseRequest = { subject: newCourse };

  const received = await apiCall<CourseResponse>(
    token,
    dispatch,
    { type: "POST", payload: requestPayload },
    apiRoutes.courses,
    true
  );

  if (received) {
    dispatch({
      type: "setUserCourses",
      payload: [...currentCourses, received],
    });
  }
}

export async function deleteCourse(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentCourses: CourseResponse[],
  courseIdToDelete: number
) {
  const courseToRemoveIndex = currentCourses.findIndex(
    (val) => val.id === courseIdToDelete
  );

  currentCourses.splice(courseToRemoveIndex, 1);

  dispatch({ type: "setUserCourses", payload: [...currentCourses] });

  const requestUrl = `${apiRoutes.courses}?id=${courseIdToDelete}`;

  await apiCall(token, dispatch, { type: "DELETE" }, requestUrl);
}

export async function uploadRoster(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  rosterFileToUpload: File
) {
  const rosterFormData = new FormData();
  rosterFormData.append("file", rosterFileToUpload, rosterFileToUpload.name);

  const importResponse = await apiCall<RosterImportResponse>(
    token,
    dispatch,
    { type: "POST", payload: rosterFormData },
    apiRoutes.bulkUploadStudents,
    true
  );

  if (importResponse?.students) {
    dispatch({ type: "setUserStudents", payload: importResponse.students });
  }

  return importResponse;
}

export async function deleteStudent(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentStudents: StudentResponse[],
  studentId?: number
) {
  if (!studentId) {
    dispatch({ type: "setUserStudents", payload: [] as StudentResponse[] });
    await apiCall(token, dispatch, { type: "DELETE" }, apiRoutes.students);
    return;
  }

  const studentToDeleteIndex = currentStudents.findIndex(
    (stu) => stu.id === studentId
  );

  currentStudents.splice(studentToDeleteIndex, 1);

  dispatch({ type: "setUserStudents", payload: [...currentStudents] });

  const requestUrl = `${apiRoutes.students}?id=${studentId}`;

  await apiCall(token, dispatch, { type: "DELETE" }, requestUrl);
}

export async function createStudent(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentStudents: StudentResponse[],
  studentToCreate: StudentResponse
) {
  const requestPayload: NewStudentRequest = { student: studentToCreate };

  const dbStudent = await apiCall<StudentResponse>(
    token,
    dispatch,
    { type: "POST", payload: requestPayload },
    apiRoutes.students,
    true
  );

  if (dbStudent) {
    dispatch({
      type: "setUserStudents",
      payload: [...currentStudents, dbStudent],
    });
  }
}

export async function editStudent(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentStudents: StudentResponse[],
  studentToEdit: StudentResponse
) {
  const requestPayload: PutStudentRequest = { student: studentToEdit };
  const received = await apiCall<StudentResponse>(
    token,
    dispatch,
    { type: "PUT", payload: requestPayload },
    apiRoutes.students,
    true
  );

  if (received) {
    const studentToEditIndex = currentStudents.findIndex(
      (stu) => stu.id === studentToEdit.id
    );

    currentStudents[studentToEditIndex] = received;

    dispatch({ type: "setUserStudents", payload: [...currentStudents] });
  }
}

export async function deleteAssignment(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  currentAssignments: AssignmentResponse[],
  assigmentId: number
) {
  const deleteIndex = currentAssignments.findIndex(
    (assignment) => assignment.id === assigmentId
  );

  currentAssignments.splice(deleteIndex, 1);

  dispatch({ type: "setUserAssignments", payload: [...currentAssignments] });

  const requestUrl = `${apiRoutes.assignments}?assignmentId=${assigmentId}`;

  await apiCall(token, dispatch, { type: "DELETE" }, requestUrl);
}

export async function changePassword(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  passwordDetails: ChangePasswordRequest
) {
  await apiCall(
    token,
    dispatch,
    { type: "PATCH", payload: passwordDetails },
    apiRoutes.changePassword
  );

  return;
}

export function updateWindowWidth(dispatch: React.Dispatch<Action>) {
  const width = window.innerWidth;

  dispatch({ type: "setWindowWidth", payload: width });
}

export async function loginUser(
  email: string,
  password: string,
  setIncorrectPasswordTrue: () => void,
  setAuthenticatedTrue: () => void,
  dispatch: React.Dispatch<Action>,
  navigate: NavigateFunction
) {
  const requestPayload: LoginUserRequest = {
    email: email,
    password: password,
  };

  try {
    // to-do:  create types for received stuff.
    const response = (await (
      await axios.post(backendUrl(apiRoutes.login), requestPayload)
    ).data) as NewToken;

    if (response) {
      setTokenAndRedirect(response, dispatch, setAuthenticatedTrue, navigate);
    } else {
      setIncorrectPasswordTrue();
      dispatch({ type: "setToken", payload: null });
    }
  } catch (err) {
    console.log(err);
    setIncorrectPasswordTrue();
    dispatch({ type: "setToken", payload: null });
  }
}

export async function loginUserWithGoogle(
  credentialResponse: CredentialResponse,
  dispatch: React.Dispatch<Action>,
  setAuthenticatedTrue: () => void,
  navigate: NavigateFunction
) {
  try {
    const response = (
      await axios.post(
        backendUrl(apiRoutes.loginWithGoogle),
        credentialResponse
      )
    ).data as NewToken;

    // if repsonse has a payload, the payload is the token
    if (response) {
      setTokenAndRedirect(response, dispatch, setAuthenticatedTrue, navigate);
    } else {
      dispatch({ type: "setToken", payload: null });
    }
  } catch (err) {
    console.log(err);
    dispatch({ type: "setToken", payload: null });
  }
}

export async function registerUserApi(registerForm: RegisterForm) {
  const res = await axios.post(backendUrl(apiRoutes.register), registerForm);

  return res.data as NewToken;
}

export async function registerGoogleUserApi(
  credentialResponse: CredentialResponse
) {
  const res = await axios.post(
    backendUrl(apiRoutes.registerWithGoogle),
    credentialResponse
  );

  return res.data as NewToken;
}

export function setTokenAndRedirect(
  token: NewToken,
  dispatch: React.Dispatch<Action>,
  setAuthenticatedTrue: () => void,
  navigate: NavigateFunction
) {
  dispatch({ type: "setToken", payload: token });
  setAuthenticatedTrue();

  navigate(routes.import);
}

export function logout(dispatch: React.Dispatch<Action>) {
  const resetContextState = appContextInitialState;
  resetContextState.token = null;
  resetContextState.authenticated = false;
  resetContextState.initialized = false;

  dispatch({ type: "logout", payload: resetContextState });
}

export async function deleteUser(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>
) {
  const deleteUrl = apiRoutes.deleteUser;
  await apiCall(token, dispatch, { type: "DELETE" }, deleteUrl);
  dispatch({ type: "setAuthenticated", payload: false });
}

export async function postUserRequest(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  userRequestRequest: UserRequestRequest
) {
  await apiCall(
    token,
    dispatch,
    { type: "POST", payload: userRequestRequest },
    apiRoutes.userRequest
  );
}

export async function grantAdditionalScopes(
  token: NewToken | null,
  dispatch: React.Dispatch<Action>,
  codeResponse: CodeResponse
) {
  if (
    codeResponse.scope.includes(driveScope) &&
    codeResponse.scope.includes(sheetsScope)
  ) {
    await apiCall(
      token,
      dispatch,
      { type: "POST", payload: codeResponse },
      apiRoutes.grantAdditionalScopes
    );
    dispatch({ type: "setUserGoogleRequiredScopes", payload: true });
  } else {
    const { name, message } =
      getErrorFactory("GoogleError")("noScopes").errorBody;
    dispatch({ type: "error", payload: { type: name, message: message } });
  }
}


export type ResetPasswordStatus = "OK" | "noEmailOrPassword" | "userDoesNotExist";

export async function resetPassword(payload: {
  email: string;
}): Promise<ResetPasswordStatus> {
  const getErrors = getErrorFactory("AuthenticationError");

  let toReturn : ResetPasswordStatus = "OK";

  try {
    const response = await axios.post(backendUrl(apiRoutes.forgotPassword), payload);

    if (response.data.status !== "OK") {
      toReturn = "noEmailOrPassword"
    }

  } catch (error: any) {
    let axiosErr: AxiosError = error;

    if (axiosErr.response?.data) {
      const errorMessage = axiosErr.response.data.message;

      if (errorMessage === getErrors("userDoesNotExist").errorBody.message) {
        toReturn = "userDoesNotExist";
      } else {
       toReturn = "noEmailOrPassword";
      }
    } else {
      toReturn = "noEmailOrPassword";
    }
  }

  return toReturn;
}
