import { StreamOptions } from "morgan";
import { LoggerOptions, createLogger, format, transports } from "winston";

const options: LoggerOptions = {
  transports: [new transports.Console(), new transports.File({ filename: "xyp.log" })],
  format: format.combine(
    format.label({
      label: "Xyp",
    }),
    format.timestamp({
      format: "YYYY/MM/DD HH:mm:ss",
    }),
    format.colorize({
      level: true,
      message: true,
    }),
    format.printf(({ level, message, label, timestamp }) => {
      let logMessage = `${timestamp} [${label}] ${level} : ${message || ""}`;
      if (typeof message !== "string") {
        logMessage += `${JSON.stringify(message, null, 10)}`;
      }
      return logMessage;
    })
  ),
  defaultMeta: {
    service: "xyp",
  },
  silent: false,
};

const logger = createLogger(options);

const defaultInfo = logger.info;
const defaultError = logger.error;
const defaultWarn = logger.warn;
const defaultDebug = logger.debug;

logger.info = (...args: any[]) =>
  defaultInfo(
    args
      .map((arg) =>
        typeof arg !== "string" ? JSON.stringify(arg, null, 10) : arg
      )
      .join(" ")
  );

logger.error = (...args: any[]) =>
  defaultError(
    args
      .map((arg) =>
        typeof arg !== "string" ? JSON.stringify(arg, null, 10) : arg
      )
      .join(" ")
  );

logger.warn = (...args: any[]) =>
  defaultWarn(
    args
      .map((arg) =>
        typeof arg !== "string" ? JSON.stringify(arg, null, 10) : arg
      )
      .join(" ")
  );

logger.debug = (...args: any[]) =>
  defaultDebug(
    args
      .map((arg) =>
        typeof arg !== "string" ? JSON.stringify(arg, null, 10) : arg
      )
      .join(" ")
  );

const winstonStream: StreamOptions = {
  write: (message) => {
    logger.info(message.trim());
  }
}
export { logger, winstonStream };
