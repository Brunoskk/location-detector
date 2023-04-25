import Redis from "ioredis";
import { IoRedis } from "../../ts/interfaces/ioredis";
import { RedisUtil } from "../../utils/redis/redisUtils";
import RedisMock from 'ioredis-mock';

// Interface factory
interface SutTypes {
    sut: RedisUtil,
    ioRedisStub: IoRedis
}

const constMocks = {
    prefix: 'client:',
    ttl: 1800000
}

const makeSut = (): SutTypes => {
    class IoRedisStub implements IoRedis {
        getConnection(): Redis {
            return new RedisMock({
                data: {
                    'client:1': "{ clientId: '1', ip: '000.000.000.000' }"
                },
            });
        };
    }

    const ioRedisStub = new IoRedisStub();

    const sut = new RedisUtil(ioRedisStub);

    return { sut, ioRedisStub };
};

describe('RedisUtils', () => {
    describe('getCache Method', () => {
        test('Returns a string that represents an object', async () => {
            const { sut, ioRedisStub } = makeSut();

            expect(sut.getCache(constMocks.prefix + '1')).toBeInstanceOf(Promise<String>);

            await ioRedisStub.getConnection().flushall();
        });
        test('Return undefined case value passed is not exists in redis', async () => {
            const { sut, ioRedisStub } = makeSut();

            expect(sut.getCache(constMocks.prefix + '2')).toBeInstanceOf(Promise<undefined>);

            await ioRedisStub.getConnection().flushall();
        });
    });
    describe('getKeys Method', () => {
        test('Returns a array of string', async () => {
            const { sut, ioRedisStub } = makeSut();

            expect(sut.getKeys(constMocks.prefix + '*')).toBeInstanceOf(Promise<String>);

            await ioRedisStub.getConnection().flushall();
        });
    });
    describe('setCache Method', () => {
        test('Set value without TTL', async () => {
            const { sut, ioRedisStub } = makeSut();

            const data = { clientId: '1', ip: '000.000.000.000' };

            const result = await sut.setCache(constMocks.prefix + '2', JSON.stringify(data));
            expect(typeof result).toBe('string');
            expect(result).toBe('OK');

            await ioRedisStub.getConnection().flushall();
        });

        test('Set value with TTL', async () => {
            const { sut, ioRedisStub } = makeSut();

            const data = { clientId: '1', ip: '000.000.000.000' };

            const result = await sut.setCache(constMocks.prefix + '2', JSON.stringify(data), constMocks.ttl);
            expect(typeof result).toBe('string');
            expect(result).toBe('OK');

            await ioRedisStub.getConnection().flushall();
        });
    });
});