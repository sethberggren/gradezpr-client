

export const routes = {
  login: "/login",
  register: "/register",
  linkAccounts: "/link-accounts",
  import: "/import",
  account: "/settings/account",
  students: "/settings/students",
  courses: "/settings/courses",
  timeout: "/timeout",
  about: "/about",
  featureRequest: "/request",
  logout: "/logout",
  extension: "/extension",
  successfulDelete: "/settings/account-delete",
  credentialError: "/auth-error",
  requestComplete: "/requestComplete"
} as const;

export const apiRoutes = {
  loginWithGoogle: "/auth/login/google",
  grantAdditionalScopes: "/auth/google/scopes",
  initialize: "/gradeupdater/initialize",
  deleteUser: "/auth/delete",
  login: "/auth/login",
  register: "/auth/register",
  changePassword: "/auth/password-change",
  students: "/gradeupdater/students",
  bulkUploadStudents: "/gradeupdater/students/bulk",
  courses: "/gradeupdater/courses",
  uploadFileStats: "/gradeupdater/upload",
  uploadFileCurve: "/gradeupdater/upload/curve",
  assignments: "/gradeupdater/assignments",
  linkWithGoogle: "/auth/register/google-link",
  registerWithGoogle: "/auth/register/google",
  getDriveFiles: "/drive/files",
  importDriveFile: "/drive/import",
  curveDriveFile: "/drive/curve",
  userRequest: "/userRequest"
} as const;
