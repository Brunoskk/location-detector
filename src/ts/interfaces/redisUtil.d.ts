import { Redis } from "ioredis";

/**
 * @interface IRedisUtil
 * @method setCache -> Insert data in redis database
 * @method getKeys  -> Return all keys of prefix passed
 * @method getCache -> Return data of all keys passed
 */
export interface IRedisUtil {
    setCache: (keyName: string, values: string | number | Buffer, exs?: number) => Promise<string>,
    getKeys: (prefix: string) => Promise<string[]>,
    getCache: (keyName: string) => Promise<string | string[] | undefined> 
}