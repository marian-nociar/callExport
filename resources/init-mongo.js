db = db.getSiblingDB('integrations');
db.createUser({ user: 'cloudtalk', pwd: 'password', roles: [{ role: 'readWrite', db: 'integrations' }, { role: 'readWrite', db: 'companies' }] });
db.createCollection('integration_event_logs', { capped: false });