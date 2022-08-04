/// <reference types="react-scripts" />
import {User} from "@backend/models/User"

// needed for imports of types from the backend...

declare global {
    namespace Express {
      export interface Request {
        user: User;
      }
    }
  }