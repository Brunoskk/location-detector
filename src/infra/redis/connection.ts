import { Redis } from "ioredis";
import { IoRedis } from "src/ts/interfaces/ioredis";

export class IORedis implements IoRedis {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
        });

        this.eventEmitter(this.redis);
    }

    public getConnection(): Redis {
        return this.redis;
    }
    
    private eventEmitter(conn: Redis): void {
        conn.on('connect', () => console.info(`Connection on redis in: ${process.env.REDIS_HOST} is opened!`));
        conn.on('ready', () => console.info(`Connection on redis in: ${process.env.REDIS_HOST} is ready!`));
        conn.on('end', () => console.info(`Connection on redis in: ${process.env.REDIS_HOST} is end!`));
        conn.on('error', (err: any) => console.error(`Connection on redis in: ${process.env.REDIS_HOST} genereted error: ${err}`));
    }
}