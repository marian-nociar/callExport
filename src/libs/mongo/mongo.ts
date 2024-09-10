import mongoose, { Mongoose, createConnection, Connection } from 'mongoose';

class MongoDb {
    private static instance: MongoDb;
    private mongoose: Mongoose | undefined;

    public async connect(): Promise<Mongoose> {
        if (!this.mongoose) {
            this.mongoose = await mongoose.connect(process.env.MONGODB_URI);
            console.log('Mongo connected');
        }
        return this.mongoose;
    }

    public static getInstance(): MongoDb {
        if (!MongoDb.instance) {
            MongoDb.instance = new MongoDb();
        }
        return MongoDb.instance;
    }

    public async disconnect() {
        this.mongoose?.disconnect();
        console.log('Mongo disconnecte');
    }

}

export default MongoDb.getInstance();