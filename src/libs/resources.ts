import { IntegrationTypes } from "../models/integrationLog";

export class Resources {
    private static resources: Record<
        IntegrationTypes | 'general',
        { podsCount: number, counter: number}
    > = {
        general: {
            podsCount: 2,
            counter: 0,
        },
        gorgias: {
            podsCount: 1,
            counter: 0,
        },
        helpscout: {
            podsCount: 1,
            counter: 0,
        },
        hubspot: {
            podsCount: 3,
            counter: 0,
        },
        intercom: {
            podsCount: 2,
            counter: 0,
        },
        pipedrive: {
            podsCount: 2,
            counter: 0,
        },
        salesforce: {
            podsCount: 2,
            counter: 0,
        },
        shopify: {
            podsCount: 1,
            counter: 0,
        },
        tray: {
            podsCount: 1,
            counter: 0,
        },
        zendesk: {
            podsCount: 2,
            counter: 0,
        },
        zoho: {
            podsCount: 2,
            counter: 0,
        },
    }

    public static getPodId(name: IntegrationTypes | 'general'): number {
        let podId: number;
        if (!this.resources[name]) {
            name = 'general';
        }
        podId = this.resources[name].counter % this.resources[name].podsCount;
        this.resources[name].counter++;
        return podId;
    }
}
