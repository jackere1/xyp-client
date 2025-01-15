// Use --env-file option for latest node versions instead of dotenv/config
import "dotenv/config";
import "module-alias/register";

import { logger } from "@utils";
import app from "./app";

app.listen(process.env.PORT, () => {
  logger.info(`Xyp gateway server running on port: ${process.env.PORT}`);
})