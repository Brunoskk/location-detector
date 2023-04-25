import { IipStackUtil, ResultIpStack } from "../../ts/interfaces/ipstack";
import { IKafkaStreamsUtil } from "../../ts/interfaces/kafkaStreams";
import { IRedisUtil } from "../../ts/interfaces/redisUtil";
import { KafkaStreamsUtil } from '../../utils/kafka/kafkaStreamsUtils';
import { config } from '../../infra/kafka/config';
import { KStream, KafkaStreams, KafkaStreamsConfig } from "kafka-streams";
import * as dotenv from 'dotenv';

// Interface factory
interface SutTypes {
    sut: IKafkaStreamsUtil,
    ioRedisUtilStub: IRedisUtil,
    ipStackUtilStub: IipStackUtil;
}

const constMocks = {
    prefix: 'client:',
    ttl: 1800,
    result: {
        "ip": "000.000.000.000",
        "type": "ipv4",
        "continent_code": "SA",
        "continent_name": "South America",
        "country_code": "BR",
        "country_name": "Brazil",
        "region_code": "SP",
        "region_name": "São Paulo",
        "city": "Franca",
        "zip": "33110-000",
        "latitude": -19.783519744873047,
        "longitude": -43.91719055175781,
        "location": {
            "geoname_id": 3463011,
            "capital": "Brasília",
            "languages": [
                {
                    "code": "pt",
                    "name": "Portuguese",
                    "native": "Português"
                }
            ],
            "country_flag": "https://assets.ipstack.com/flags/br.svg",
            "country_flag_emoji": "🇧🇷",
            "country_flag_emoji_unicode": "U+1F1E7 U+1F1F7",
            "calling_code": "55",
            "is_eu": false
        }
    },
    data: {
        ip: '000.000.000.000',
        token: '42a6631435a35e7fe5617fd57c55913b'
    }
}

const makeSut = (): SutTypes => {
    class IoRedisUtilStub implements IRedisUtil {
        setCache(): Promise<string> {
            return new Promise(() => 'Cache Registed!');
        };

        getKeys(): Promise<string[]> {
            return new Promise(() => ["1"]);
        };

        getCache(): Promise<string | string[] | undefined> {
            return new Promise(() => {
                return "'client:1': '{ 'clientId': '1', 'ip': '000.000.000.000' }"
            });
        };
    }

    class IpStackUtilStub implements IipStackUtil {
        public getLocation(ip: string): Promise<ResultIpStack> {
            return new Promise(() => constMocks.result);
        };
    };

    const ioRedisUtilStub = new IoRedisUtilStub();

    const ipStackUtilStub = new IpStackUtilStub();

    const sut = new KafkaStreamsUtil(new KafkaStreams(config as KafkaStreamsConfig), ioRedisUtilStub, ipStackUtilStub);

    return { sut, ioRedisUtilStub, ipStackUtilStub };
};


beforeAll(() => {
    dotenv.config();
});

describe('KafkaStreamsUtil', () => {
    describe('getKStream Method', () => {
        test('Returns a instance of KStream', async () => {
            const { sut } = makeSut();

            expect(sut.getKStream(String(process.env.INPUT_TOPIC))).toBeInstanceOf(KStream);
        });
    });

    describe('startStream Method', () => {
        test('Start Stream', async () => {
            const { sut } = makeSut();

            const stream = sut.getKStream(String(process.env.INPUT_TOPIC));

            const spy = jest.spyOn(sut, 'startStream').mockResolvedValue();

            await sut.startStream(stream);

            expect(spy).toHaveBeenCalled();

            await stream.close();
        });
    });
});