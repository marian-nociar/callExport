import "reflect-metadata"
import { DataSource } from "typeorm"
import { Integrations } from "./entities/integration.entity"
import { IntegrationExtInstances } from "./entities/integrationExtInstances.entity"

class Database {
    private static instance: Database;
    public dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
            type: "mariadb",
            host: process.env.MARIADB_HOST,
            port: process.env.MARIADB_PORT,
            username: process.env.MARIADB_USERNAME,
            password: process.env.MARIADB_PASSWORD,
            database: process.env.MARIADB_DATABASE,
            entities: [Integrations, IntegrationExtInstances],
            // synchronize: true,
            logging: false,
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
          Database.instance = new Database();
        }
        return Database.instance;
      }
    
      public async connect(): Promise<DataSource> {
        if (!this.dataSource.isInitialized) {
          await this.dataSource.initialize();
        }
        return this.dataSource!;
      }

      public async disconnect(): Promise<void> {
        if (this.dataSource.isInitialized) {
            this.dataSource.destroy();
        }
      }
    
      public getDataSource(): DataSource {
        if (!this.dataSource.isInitialized) {
          throw new Error('Data Source is not initialized. Call connect() first.');
        }
        return this.dataSource;
      }
}

export default Database.getInstance();
