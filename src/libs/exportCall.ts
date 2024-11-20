import { IEventData, IHandleEventStrategy } from "./mongo/eventStrategies";
import fs from 'fs';

export default class ExportCall {
    private strategy: IHandleEventStrategy;
    private exportCounter = 0;

    constructor(strategy: IHandleEventStrategy) {
        this.strategy = strategy;
    }

    appendIdToFile(id: number, objectId: string, filePath: string = '/Users/mariannociar/Code/TypeScript/callLogCreation/tmp/callRecordingsOut.csv') {
        // Add a newline before appending to ensure each ID is on a new line
        const data = `${id}, ${objectId}\n`;
      
        // Use fs.appendFile to append the data to the file
        fs.appendFile(filePath, data, (err) => {
          if (err) {
            console.error('Failed to append data to file:', err);
          }
        });
      };

    async export(eventData: IEventData[]) {
        for (const event of eventData) {
            const res = await this.strategy.process(event);
            if (res) {
                for (const item of res) {
                    const objectId = item._id.toString();
                    this.appendIdToFile(event.id, objectId);
                    break; // add only single record to output file
                }
            }
            this.exportCounter++;
        }
    }
}