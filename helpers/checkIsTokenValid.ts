import { verify } from "jsonwebtoken";

const checkIsTokenValid = (token: string | null | undefined) => {
  if (!token) return false;
  try {
    verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
};

export default checkIsTokenValid;
