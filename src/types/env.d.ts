export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      MARIADB_HOST: string;
      MARIADB_DATABASE: string;
      MARIADB_PORT: number;
      MARIADB_USERNAME: string;
      MARIADB_PASSWORD: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
