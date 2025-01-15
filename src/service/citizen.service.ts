import { digitalSign, logger } from "@utils";
import { createClientAsync } from "soap";
import util from "util";

const xypServiceWSDL = "https://xyp.gov.mn/citizen-1.3.1/ws?WSDL";

const getCitizenInfo = async (
  nationalId: string,
  serviceName: string = "WS100202_getPropertyList"
) => {
  // const signData = payload.signData;
  const signData = digitalSign(
    process.env.XYP_KEY_PATH!,
    process.env.XYP_TOKEN!
  );

  // Required arguments listed here: https://developer.xyp.gov.mn/web/service-list
  const args = {
    regnum: payload.nationalId,

    // For version >= 1.5.0 you need additional auth data included in the request
    // otp: payload.otp,
    // auth: {
    //   citizen: {
    //     civilId: '',
    //     regnum: payload.nationalId,
    //     fingerprint: '',
    //     otp: payload.otp,
    //     authType: 1 // 1-OTP, 2-Тоон гарын үсэг, 3-Хурууны хээ
    //   },
    //   operator: {
    //     regnum: '',
    //     fingerprint: ''
    //   }
    // },

    // For date
    // date: "2025-01-01"
  };

  const soapClient = await createClientAsync(xypServiceWSDL, {
    endpoint: xypServiceWSDL,
  });
  soapClient.addHttpHeader("accessToken", process.env.XYP_TOKEN);
  soapClient.addHttpHeader("timeStamp", String(signData.timestamp));
  soapClient.addHttpHeader("signature", signData.base64Signature);

  const soapServiceOperation = util.promisify(
    soapClient[serviceName].bind(soapClient)
  );

  const result = await soapServiceOperation({ request: args });

  if (result.return.resultCode !== 0) {
    throw new Error(result.return.resultMessage);
  }
  return result.return.response.listData;
};

export const childrenService = { getCitizenInfo };
