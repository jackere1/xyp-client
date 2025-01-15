import { otpController } from "@controller";
import { validate } from "@utils";
import { Router } from "express";
import Joi from "joi";

const routes = Router();

routes.post(
  "/send",
  validate.body(
    Joi.object({
      nationalId: Joi.string()
        .regex(/^[\u0400-\u04FF]{2}\d{8}$/)
        .required(),
    })
  ),
  otpController.sendOtp
);

routes.post(
  "/verify",
  validate.body(
    Joi.object({
      nationalId: Joi.string()
        .regex(/^[\u0400-\u04FF]{2}\d{8}$/)
        .required(),
      otp: Joi.number().max(999999).required(),
      signData: Joi.object({
        timestamp: Joi.number().required(),
        base64Signature: Joi.string().required(),
      }).required(),
    })
  ),
  otpController.verifyOtp
);

routes.get("/", otpController.getServices);

export { routes as otpRoutes };
