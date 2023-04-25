import axios, { AxiosResponse } from "axios";
import { IipStackUtil } from "src/ts/interfaces/ipstack";

export class IpStackUtil implements IipStackUtil {
    public async getLocation(ip: string): Promise<IipStackUtil.Result> {
        try {
            const { data, status }: AxiosResponse = await axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.TOKEN_IPSTACK}`);

            return { ...data, status };
        } catch (error: any) {
            console.error('IpStackUtil Error: ' + error);
            throw new Error(error);
        }
    }
};