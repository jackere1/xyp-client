import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { standardizedResponse } from "./response";

const jwtAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header required');
    }
    const [strategy, token] = authHeader.split(' ');
    if (strategy !== 'Bearer') {
      throw new Error('Invalid auth strategy');
    }
    JWT.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error: any) {
    res.status(401).json(standardizedResponse(null, error.message, 401));
  }
}

const basicAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header required');
    }
    const [strategy, token] = authHeader.split(' ');
    if (strategy !== 'Basic') {
      throw new Error('Invalid auth strategy');
    }
    const credentials = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = credentials.split(":");
    if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) { 
      next();
      return;
    }
    throw new Error("Invalid basic auth")
  } catch (error: any) {
    res.status(401).json(standardizedResponse(null, error.message, 401));
  }
}

export { jwtAuthHandler, basicAuthHandler };