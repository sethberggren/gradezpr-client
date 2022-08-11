import { getByAriaLabel } from "./formTools";

export const menuButton = () => {
  return getByAriaLabel("Menu Button");
};

export const BASENAME = "gradezpr";

export const appUrl = (url?: string) =>
  url ? `http://localhost:3000/${url}` : `http://localhost:3000`;


