declare global {
  namespace Express {
    interface Request {
      user?: {
        id: String | undefined;
        name: String | undefined;
        email: String | undefined;
        role: String | undefined | null;
        emailVerified: boolean | undefined;
      };
    }
  }
}
