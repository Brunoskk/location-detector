import { IpStackUtil } from '../../utils/ipstack/ipstackUtils';
import { ResultIpStack } from '../../ts/interfaces/ipstack';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as dotenv from 'dotenv';


// Interface factory
interface SutTypes {
    sut: IpStackUtil,
}

const constMock = {
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
    const sut = new IpStackUtil();

    return { sut };
};

beforeAll(() => {
    dotenv.config();
});

describe('IpStackUtil', () => {
    describe('getLocation', () => {
        it('Return object content data location', async () => {
            const { sut } = makeSut();
            const axiosMock = new MockAdapter(axios);

            axiosMock.onGet(`http://api.ipstack.com/${constMock.data.ip}?access_key=${constMock.data.token}`).reply(200, constMock.result);

            const result: ResultIpStack = await sut.getLocation(constMock.data.ip);
            
            expect(result.status).toBe(200);
        });

        it('Return error on axios', async () => {
            const { sut } = makeSut();
            const axiosMock = new MockAdapter(axios);

            axiosMock.onGet(`http://api.ipstack.com/${constMock.data.ip}?access_key=${constMock.data.token}`).networkErrorOnce();

            expect(async () => await sut.getLocation(constMock.data.ip)).rejects.toThrowError('Network Error');
        });
    });
});