import { KStream, KafkaStreams } from "kafka-streams";
import { Prefixs } from "../../ts/enums/redis.enum.ts";
import { IipStackUtil } from "../../ts/interfaces/ipstack";
import { IKafkaStreamsUtil } from "../../ts/interfaces/kafkaStreams";
import { IRedisUtil } from "../../ts/interfaces/redisUtil";

export class KafkaStreamsUtil implements IKafkaStreamsUtil {
    private kafkaStreams: KafkaStreams;
    private redisUtil: IRedisUtil;
    private ipstackUtil: IipStackUtil;

    constructor(kafkaStreams: KafkaStreams, redisUtil: IRedisUtil, ipstackUtil: IipStackUtil) {
        this.kafkaStreams = kafkaStreams;
        this.redisUtil = redisUtil;
        this.ipstackUtil = ipstackUtil;
    }

    public getKStream(topic: string): KStream {
        return this.kafkaStreams.getKStream(topic);
    };

    public async stremingLocation(kstream: KStream): Promise<void> {
        kstream.mapJSONConvenience()
            .asyncMap(async (msg) => {
                const keys = (await this.redisUtil.getKeys(Prefixs.Client + '*')).map(key => {
                    const [, id] = key.split(':');
                    if (id)
                        return id;
                })

                if (typeof msg?.value === 'object' && Object.keys(msg?.value).length) {
                    const { value } = msg;

                    if (!keys.find(key => Number(key) === Number(value?.clientId))) {

                        const location = await this.ipstackUtil.getLocation(value?.ip);

                        const result = {
                            ...value,
                            ip: location.ip,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            country: location.continent_name,
                            region: location.region_name,
                            city: location.city
                        }

                        this.redisUtil.setCache(Prefixs.Client + value?.clientId, JSON.stringify(result), Number(process.env.TTL_REDIS));

                        return JSON.stringify(result);
                    }
                    return;
                }
            })
            .filter((msg) => msg && Object.keys(msg).length)
            .to(process.env.OUTPUT_TOPIC);
    };

    public async startStream(kstream: KStream): Promise<void> {
        await kstream.start(
            () => console.log(`stream started, as kafka consumer is ready in kafka Topic: ${process.env.INPUT_TOPIC}.`),
            (error) => console.log("streamed return error: " + error));
    };
}