import type { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  message: string = "success"
) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number = 500,
  error: string
) => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};
