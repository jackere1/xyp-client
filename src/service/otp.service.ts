import { ISendOTP, IVerifyOTP } from "@types";
import { digitalSign, logger } from "@utils";
import { createClient, createClientAsync } from "soap";
import util from "util";

const registrationWSDL = "https://xyp.gov.mn/meta-1.5.0/ws?WSDL";
const verifyWSDL = "https://xyp.gov.mn/meta-1.5.0/ws?WSDL";


// For version >= 1.5.0 you need citizen's auth data
const sendOtp = async (payload: ISendOTP) => {
  const signData = digitalSign(
    process.env.XYP_KEY_PATH!,
    process.env.XYP_TOKEN!
  );
  const args = {
    regnum: payload.nationalId,
    // Include which services you are going to use in next 15 minutes using single OTP from citizen
    jsonWSList: JSON.stringify([
      { ws: "WS100202_getPropertyList" },
      { ws: "WS100511_getEmployerInfo" },
    ]),
    isSms: 1,
    isApp: 0,
    isEmail: 0,
    isKiosk: 0,
    phoneNum: 0,
  };

  const soapClient = await createClientAsync(registrationWSDL, {
    endpoint: registrationWSDL,
  });

  soapClient.addHttpHeader("accessToken", process.env.XYP_TOKEN);
  soapClient.addHttpHeader("timestamp", String(signData.timestamp));
  soapClient.addHttpHeader("signature", signData.base64Signature);

  const registerOtpOps = util.promisify(
    soapClient.WS100008_registerOTPRequest.bind(soapClient)
  );

  const result = await registerOtpOps({ request: args });
  logger.info("registerOTP", result);

  if (result.return.resultCode !== 0) {
    throw new Error(result.return.resultMessage);
  }
  return signData;
};

// In case added the code for testing
// Soap client without binding the available services
const verifyOtp = (payload: IVerifyOTP) => {
  const signData = payload.signData;
  const args = {
    request: {
      regnum: payload.nationalId,
      otp: payload.otp,
      isSms: 1,
      isApp: 0,
      isEmail: 0,
      isKiosk: 0,
    },
  };

  createClient(verifyWSDL, { endpoint: verifyWSDL }, (error, client) => {
    if (error) {
      logger.error(`Connection error: ${error}`);
      throw error;
    }

    client.addHttpHeader("accessToken", process.env.XYP_TOKEN);
    client.addHttpHeader("timestamp", String(signData.timestamp));
    client.addHttpHeader("signature", signData.base64Signature);

    client.WS100009_checkOtp(args, (err: any, result: any) => {
      if (err) {
        logger.error(`Service error: ${err}`);
        throw err;
      }
      logger.info(result);
      //TODO: throw exception based on resultCode
    });
  });
};

const listAvailableServices = async (WSDL: string = registrationWSDL) => {
  const soapClient = await createClientAsync(WSDL, {
    endpoint: WSDL,
  });

  const keys = Object.keys(soapClient);
  return keys.filter(
    (key) =>
      key.startsWith("WS") || key.startsWith("FS") || key.startsWith("GS")
  );
};

export const otpService = { sendOtp, verifyOtp, listAvailableServices };
