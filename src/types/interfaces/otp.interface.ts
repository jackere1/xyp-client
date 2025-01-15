export interface ISendOTP {
  nationalId: string;
}

export interface IVerifyOTP {
  nationalId: string;
  otp: number;
  signData: {
    timestamp: number
    base64Signature: string
  }
}