export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
