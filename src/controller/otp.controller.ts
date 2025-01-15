import { otpService } from "@service";
import { ISendOTP, IVerifyOTP } from "@types";
import { logger, standardizedResponse } from "@utils";
import { Request, Response } from "express";

const sendOtp = async (req: Request, res: Response) => {
  try {
    const payload: ISendOTP = req.body;
    const response = await otpService.sendOtp(payload);
    res.json(standardizedResponse(response, null, 200));
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json(standardizedResponse(null, error.message, 400));
  }
}

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const payload: IVerifyOTP = req.body;
    const response = otpService.verifyOtp(payload);
    res.json(standardizedResponse(response, null, 200));
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json(standardizedResponse(null, error.message, 400));
  }
}

const getServices = async (req: Request, res: Response) => {
  try {
    const response = otpService.listAvailableServices();
    res.json(standardizedResponse(response, null, 200));
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json(standardizedResponse(null, error.message, 400));
  }
}

export const otpController = { sendOtp, verifyOtp, getServices };
