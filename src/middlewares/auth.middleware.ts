import { NextFunction, Request, Response } from "express";
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  TUTOR = "TUTOR",
}

const middleware = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
  };
};
