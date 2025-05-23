import type { Request, Response } from "express";
import { errorResponse } from "../utils/responses.js";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err);
  errorResponse(res, 500, err.message);
};
