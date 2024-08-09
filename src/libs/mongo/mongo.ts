import mongoose, { Mongoose } from 'mongoose';

class MongoDb {
    private static mongoDbInstance: MongoDb | null;
    private instance: Mongoose | null = null;

    private constructor() {}

    public async initialize() {
        this.instance = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongo connected');
    }

    public static getInstance() {
        if (!this.mongoDbInstance) {
            this.mongoDbInstance = new MongoDb();
        }
        return this.mongoDbInstance;
    }

    public async disconnect() {
        this.instance?.disconnect();
        console.log('Mongo disconnecte');
    }

}

export default MongoDb.getInstance();