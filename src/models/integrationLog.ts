import mongoose from 'mongoose';
const { Schema } = mongoose;

const INTEGRATIONS = ['gorgias', 'helpscout', 'hubspot', 'intercom', 'pipedrive', 'salesforce', 'shopify', 'tray', 'zendesk', 'zoho'] as const;
export type IntegrationTypes = typeof INTEGRATIONS[number];

const FLOWS = ['flowCallCreated', 'flowRecordingUploaded'] as const;
type FlowTypes = typeof FLOWS[number];

const EVENTS = ['call:created', 'recording:uploaded'] as const;
type EventTypes = typeof EVENTS[number];

export interface IBody {
    company_id: number,
    event: EventTypes,
    id: number,
    uuid?: string,
    integration_id?: number | null,
};

export interface IIntegration {
    company_id: number,
    flow: FlowTypes,
    integration_id: number,
    integration_name: IntegrationTypes,
    message: { Body: IBody },
    body: IBody,
    entity_id: number,
    status: number,
    status_stages: [{
        data: string,
        datetime: string,
    }],
    error_stages: string[],
    created: string,
    modified: string,
    serviceName: string,
};

const integrationSchema = new Schema<IIntegration>({
  company_id: Number,
  flow: String,
  integration_id: Number,
  integration_name: String,
  message: {
    Body: {
        company_id: Number,
        event: String,
        id: Number,
        uuid: String,
    }
  },
  body: {
    company_id: Number,
    event: String,
    id: Number,
    uuid: String,
  },
  entity_id: Number,
  status: Number,
  status_stages: [{
    _id: false,
    data: String,
    datetime: String,
  }],
  error_stages: [],
  created: String,
  modified: String,
  serviceName: String,
});

const Integration = mongoose.model<IIntegration>('integration_event_logs', integrationSchema);

export default Integration;
