import { Redis } from "ioredis";

/**
 * @interface IoRedis
 * @method getConnection -> Return connection redis
 */

export interface IoRedis {
    getConnection: () => Redis
}