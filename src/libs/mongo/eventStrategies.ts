import { Types } from "mongoose";
import Integration, { IBody, IIntegration, IntegrationTypes } from "../../models/integrationLog";
import { Integrations } from "../mariadb/entities/integration.entity";
import moment from 'moment';
import { Resources } from "../resources";

export interface IEventData {
    id: number;
    companyId: number;
    integrations: {
        id: number;
        name: IntegrationTypes;
    }[];
}
export type BaseEventData = Omit<IEventData, "integrations">;
export interface IHandleEventStrategy {
    process(data: IEventData): Promise<(IIntegration & { _id: Types.ObjectId; })[]>
}

export class CreateEvent implements IHandleEventStrategy {
    async process(data: IEventData): Promise<(IIntegration & { _id: Types.ObjectId; })[]> {
        console.log('Processing eventId: ', data.id);
        const timeStamp = moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss.SSSS');
        const res: (IIntegration & { _id: Types.ObjectId; })[] = [];
        if (data.integrations.length === 0) {
            console.log('No integrations found for entityId: ', data.id);
            return res;
        }
        for (const integration of data.integrations) {
            const body: IBody = {
                company_id: data.companyId,
                event: "call:created", // "call:created", "recording:uploaded"
                id: data.id,
                // model: null,
                integration_id: integration.id,
                // uuid: "8f387a40-8960-4195-ad22-182a9d5de811"
            }
    
            const intgrEventLog = new Integration<IIntegration>({
                company_id: data.companyId,
                flow: 'flowCallCreated', //'flowCallCreated', 'flowRecordingUploaded'
                integration_name: integration.name,
                integration_id: integration.id,
                message: { Body: body },
                body: body,
                entity_id: data.id,
                status: 0,
                status_stages: [{
                    data: 'saved-to-db',
                    datetime: timeStamp
                }],
                error_stages: [],
                created: timeStamp,
                modified: timeStamp,
                serviceName: `integrations-${Resources.getPod(integration.name)}`,
            });

            res.push(await intgrEventLog.save());
        }
        return res;
    }
}

export class UpdateEvent implements IHandleEventStrategy {
    async process(data: IEventData): Promise<(IIntegration & { _id: Types.ObjectId; })[]> {
        // console.log('Update event called');
        return [];
    }
}