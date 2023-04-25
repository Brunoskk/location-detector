import * as dotenv from 'dotenv';
import { KafkaStreams, KafkaStreamsConfig } from 'kafka-streams';
import { RedisUtil } from './utils/redis/redisUtils.js';
import { config } from './infra/kafka/config.js';
import { IpStackUtil } from './utils/ipstack/ipstackUtils.js';
import { IORedis } from './infra/redis/connection.js';
import { KafkaStreamsUtil } from './utils/kafka/kafkaStreamsUtils.js';


function bootstrap(): void {
    /**
     * Set config dotenv lib
     */
    dotenv.config();

    /**
     * Create connection on redis
     */
    const ioredisConn = new IORedis();

    /**
     * Connect in kafka
     */
    const factory = new KafkaStreams(config as KafkaStreamsConfig);

    /**
     * Utils
     */
    const redisUtil = new RedisUtil(ioredisConn);
    const ipstackUtil = new IpStackUtil();
    const kafkaStreamsUtil = new KafkaStreamsUtil(factory, redisUtil, ipstackUtil);

    /**
     * Start streming in topic passed
     */
    (async () => {
        /**
         * Get Topic
         */
        const kstream = kafkaStreamsUtil.getKStream(String(process.env.INPUT_TOPIC));

        /**
         * Define streming process
         */
        await kafkaStreamsUtil.stremingLocation(kstream);

        /**
         * Start Striming
         */
        await kafkaStreamsUtil.startStream(kstream);
    })();
}

bootstrap();