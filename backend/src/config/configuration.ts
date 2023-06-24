import { readdirSync } from "fs";
import * as path from "path";

export default async (): Promise<any> => {
  const ENV = process.env.NODE_ENV || "development";

  const filenames = readdirSync(path.resolve(__dirname, "environment"));

  for (let i = 0; i < filenames.length; i++) {
    const element = filenames[i];
    const regex = new RegExp(`${ENV}.[A-Za-z]+$`);
    const found = regex.test(element);
    if (found) {
      const config = await import(
        path.resolve(__dirname, "environment", element)
      );
      return config.env;
    }
  }
  return {};
};
