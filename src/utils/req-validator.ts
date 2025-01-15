import { NextFunction, Request, Response } from "express";
import { AnySchema } from "joi";

const body =
  (validation: AnySchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = validation.validate(req.body);
      if (error) {
        const message = error.details.map((detail) => detail.message).join("\n");
        res.status(400).json({ message });
        return;
      }
      next();
    };

const queryParams =
  (validation: AnySchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = validation.validate(req.query);
      if (error) {
        const message = error.details.map((detail) => detail.message).join("\n");
        res.status(400).json({ message });
        return;
      }
      next();
    };

const pathParams =
  (validation: AnySchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = validation.validate(req.params);
      if (error) {
        const message = error.details.map((detail) => detail.message).join("\n");
        res.status(400).json({ message });
        return;
      }
      next();
    };

const headers =
  (validation: AnySchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = validation.validate(req.headers);
      if (error) {
        const message = error.details.map((detail) => detail.message).join("\n");
        res.status(400).json({ message });
        return;
      }
      next();
    };

export const validate = { body, queryParams, pathParams, headers };
