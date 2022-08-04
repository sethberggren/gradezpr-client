import { API_URL } from "../envVars";

export default function backendUrl(route: string) {
  const apiUrl = API_URL;
  
  return `${apiUrl}${route}`;
}
