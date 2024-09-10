import dotenv from 'dotenv';
dotenv.config();

import commander, { program } from 'commander';

import path from 'path';
import "reflect-metadata"

import CsvFileLoader from './libs/csvFileLoader';

import mongodbInstance from './libs/mongo/mongo';

import sqlDbInstance from './libs/mariadb';
import { Integrations } from './libs/mariadb/entities/integration.entity';
import { CreateEvent, IHandleEventStrategy, UpdateEvent } from './libs/mongo/eventStrategies';
import ExportCall from './libs/exportCall';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => console.log('Error: ', err));

function myParseInt(value: string) {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new commander.InvalidArgumentError('Not a number.');
    }
    return parsedValue;
  }

async function main() {
    program
        .option('-n, --new', 'Create a new event instead of modifying original')
        .requiredOption('-f, --file <path>', 'Select csv file with calls for re-export')
        // .option('-e, --event <ids>', 'Comma separated list of IDs')
        .requiredOption('-i, --integration <id>', 'Id of the integration where the call will be exported')
        .option('-ch, --chunkSize [number]', 'size of the integrationIds chunk for re-export', myParseInt, 2)

    program.parse(process.argv);

    const options = program.opts();

    console.log(options.chunkSize);

    // if (options.event && options.new) {
    //     throw new Error('Invalid options combination. The --new with --event isn\' compatible');
    // }

    // establish db connections
    const mongoose = await mongodbInstance.connect();
    const dataSource = await sqlDbInstance.connect();

    let strategy: IHandleEventStrategy = options.new
        ? new CreateEvent()
        : new UpdateEvent();

    // check if integration id is correct
    const integrationRow = await dataSource.getRepository(Integrations).findOne({
        where: {id: options.integration},
        relations: ['integrationExtInstance'],
    });

    if (!integrationRow || ![2,3].includes(integrationRow.status)) {
        throw new Error('Integration doesn\'t exist or is inactive!')
    }

    // console.log(integrationRow);

    const exportCall = new ExportCall(strategy, integrationRow);


    // TODO: check integrationRow by id

    // const file = path.resolve(__dirname, '../tmp/exp.csv');

    let chunkCounter = 0;
    const fl = new CsvFileLoader();
    await fl.openFile(options.file);
    for await (const ids of fl.getCallIds(options.chunkSize)) {
        chunkCounter++;
        console.log('Received chunk:', chunkCounter);

        // console.log(ids);
        await exportCall.export(ids);
        // wait 2 minutes to process bulk events
        await sleep(2 * 60 * 1000);

        console.log('Processed chunk:', chunkCounter);
    }

    await fl.closeFile();

    await mongodbInstance.disconnect();
    await sqlDbInstance.disconnect();

    console.log('end');
}
