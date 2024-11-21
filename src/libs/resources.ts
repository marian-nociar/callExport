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

    private static limitReached: boolean = false;

    public static isLimitReached(): boolean {
        return this.limitReached;
    }

    public static resetLimit(): void {
        for (const key in this.resources) {
            const resource = this.resources[key as IntegrationTypes | 'general'];
            resource.counter = resource.counter % resource.podsCount;
        }
        this.limitReached = false;
    }

    public static getPod(name: IntegrationTypes | 'general'): string {
        let podId: number;
        if (!this.resources[name]) {
            name = 'general';
        }
        podId = this.resources[name].counter % this.resources[name].podsCount;
        this.resources[name].counter++;
        if (this.resources[name].counter / this.resources[name].podsCount >= 200) {
            this.limitReached = true;
        }
        return `${name}-${podId}`;
    }
}
