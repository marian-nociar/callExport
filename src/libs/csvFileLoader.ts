import { promises as fs, createReadStream, ReadStream, WriteStream } from 'node:fs';
import { Parser } from 'csv-parse';
import { BaseEventData } from './mongo/eventStrategies';

class CsvFileLoader {
    private fileHandle: fs.FileHandle | null = null;
    private readStream: ReadStream | null = null;
    // private writeStream: WriteStream | null = null;

    async openFile(path: string, flags: string = 'r') {
        try {
            this.fileHandle = await fs.open(path);
        } catch (err) {
            console.error('Failed to open file!', (err as Error).message)
        }
    }    

    async closeFile(): Promise<void> {
        if (this.fileHandle !== null) {
          await this.fileHandle.close();
          this.fileHandle = null;
        }
        if (this.readStream !== null) {
          this.readStream.close();
          this.readStream = null;
        }
        // if (this.writeStream !== null) {
        //     this.writeStream.end();
        //     this.writeStream.close();
        //     this.writeStream = null;
        // }
    }

    async *getExportData(bulkSize: number) {
        // console.log('BULKSIZE: ', bulkSize);
        if (!this.fileHandle) {
            throw new Error('Failed to open the file');
        }

        let eventData: BaseEventData[] = [];

        this.readStream = this.fileHandle.createReadStream({
            encoding: 'utf8',
            highWaterMark: 1024
        })

        const parser = new Parser({
            delimiter: ',',
            columns: true,
            cast: (value, context) => {
                if (context.header) {
                  return value; // Do not cast header values
                }
                if (context.column === 'id' || context.column === 'sqsMessage.Body.id' || context.column === 'sqsMessage.Body.company_id') {
                  return Number(value); // Convert the 'id' column to a number
                }
                return value;
            },
        });

        this.readStream.pipe(parser);

        for await (const chunk of parser) {
            // console.log(chunk);
            // yield chunk;
            eventData.push({ id: chunk['sqsMessage.Body.id'], companyId: chunk['sqsMessage.Body.company_id'] });
            // aggregate ids to defined bulk size and return them
            if (eventData.length >= bulkSize) {
                const toReturn = eventData.slice(0, bulkSize);
                eventData = [];
                yield toReturn
            }
        }
        yield eventData;

        parser.end();
    }
}

export default CsvFileLoader;
