import { Types } from "mongoose";
import Integration, { IBody, IIntegration } from "../../models/integrationLog";
import { Integrations } from "../mariadb/entities/integration.entity";
import moment from 'moment';

export interface IHandleEventStrategy {
    process(integrationRow: Integrations, callId: number, serviceId: number): Promise<IIntegration & { _id: Types.ObjectId; } | null>
}

export class CreateEvent implements IHandleEventStrategy {
    async process(integrationRow: Integrations, callId: number, serviceId: number): Promise<IIntegration & { _id: Types.ObjectId; } | null> {
        // console.log('Create event called');
        const timeStamp = moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss.SSSS');
        const body: IBody = {
            company_id: integrationRow.companyId.toString(),
            event: "call:created",
            id: callId,
            // model: null,
            // integration_id: null,
            // uuid: "8f387a40-8960-4195-ad22-182a9d5de811"
        }

        const intgrEventLog = new Integration<IIntegration>({
            company_id: integrationRow.companyId.toString(),
            flow: 'flowCallCreated',
            integration_name: integrationRow.name,
            integration_id: integrationRow.id,
            message: { Body: body },
            body: body,
            entity_id: callId,
            status: 0,
            status_stages: [{
                data: 'saved-to-db',
                datetime: timeStamp
            }],
            error_stages: [],
            created: timeStamp,
            modified: timeStamp,
            serviceName: `integrations-${integrationRow.name}-${serviceId}`
        });

        const res = await intgrEventLog.save();
        return res;
    }
}

export class UpdateEvent implements IHandleEventStrategy {
    async process(integrationRow: Integrations, callId: number, serviceId: number): Promise<IIntegration & { _id: Types.ObjectId; } | null> {
        // console.log('Update event called');
        return null;
    }
}