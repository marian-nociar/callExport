import { Integrations } from "./mariadb/entities/integration.entity";
import { IHandleEventStrategy } from "./mongo/eventStrategies";
import fs from 'fs';

export default class ExportCall {
    private strategy: IHandleEventStrategy;
    private integrationRow: any;
    private exportCounter = 0;

    constructor(strategy: IHandleEventStrategy, integrationRow: Integrations) {
        this.strategy = strategy;
        this.integrationRow = integrationRow;
    }

    appendIdToFile(id: number, objectId: string, filePath: string = '/Users/mariannociar/Code/TypeScript/callLogCreation/tmp/output2.csv') {
        // Add a newline before appending to ensure each ID is on a new line
        const data = `${id}, ${objectId}\n`;
      
        // Use fs.appendFile to append the data to the file
        fs.appendFile(filePath, data, (err) => {
          if (err) {
            console.error('Failed to append data to file:', err);
          }
        });
      };

    async export(callIds: number[]) {
        for (const callId of callIds) {
            const res = await this.strategy.process(this.integrationRow, callId, 1);
            if (res) {
                const objectId = res._id.toString();
                // console.log(objectId);
                this.appendIdToFile(callId, objectId);
            }
            this.exportCounter++;
        }
    }
}