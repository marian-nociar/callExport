import mongoose from 'mongoose';
const { Schema } = mongoose;

const INTEGRATIONS = ['salesforce', 'hubspot'] as const;
type IntegrationTypes = typeof INTEGRATIONS[number];

const FLOWS = ['flowCallCreated'] as const;
type FlowTypes = typeof FLOWS[number];

const EVENTS = ['call:created'] as const;
type EventTypes = typeof EVENTS[number];

export interface IBody {
    company_id: string,
    event: EventTypes,
    id: number,
    uuid?: string,
};

export interface IIntegration {
    company_id: string,
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
    serviceName: `integration_${IntegrationTypes}_${number}`,
};

const integrationSchema = new Schema<IIntegration>({
  company_id: String,
  flow: String,
  integration_id: Number,
  integration_name: String,
  message: {
    Body: {
        company_id: String,
        event: String,
        id: Number,
        uuid: String,
    }
  },
  body: {
    company_id: String,
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
