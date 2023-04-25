import { Redis } from "ioredis";
import { IoRedis } from "src/ts/interfaces/ioredis";
import { IRedisUtil } from "src/ts/interfaces/redisUtil";

export class RedisUtil implements IRedisUtil {
    private ioredis: IoRedis;
    private client: Redis;
    constructor(ioredis: IoRedis) {
        this.ioredis = ioredis;

        this.client = this.ioredis.getConnection();
    }

    public async getCache(keyName: string): Promise<string | undefined> {
        try {
            if (typeof keyName === 'string') {
                const value = await this.client.get(keyName);

                if (value)
                    return value;
            }
        } catch (error) {
            throw new Error('getCache fail in process key(s): ' + error);
        }
    };

    public async getKeys(prefix: string): Promise<string[]> {
        try {
            return await this.client.keys(prefix);
        } catch (error) {
            throw new Error('getKeys fail in return key(s): ' + error);
        }
    };

    public async setCache(keyName: string, values: string | number | Buffer, exs?: number | undefined): Promise<string> {
        try {
            if (exs)
                return await this.client.set(keyName, values, 'EX', exs);

            return await this.client.set(keyName, values);
        } catch (error) {
            throw new Error('setCache fail in register data: ' + error);
        }
    };
};