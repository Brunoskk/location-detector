/**
 * @interface IipStackUtil
 * @method getLocation -> Returns object with the location of the passed ip
 */
export interface IipStackUtil {
   public async getLocation: (ip: string) => Promise<IipStackUtil.Result>,
}

type ResultIpStack = {
   ip: string,
   type: string,
   continent_code: string,
   continent_name: string,
   country_code: string,
   country_name: string,
   region_code: string,
   region_name: string,
   city: string,
   zip: string,
   latitude: number,
   longitude: number,
   location: {
       geoname_id: number,
       capital: string,
       languages: [Object],
       country_flag: string,
       country_flag_emoji: string,
       country_flag_emoji_unicode: string,
       calling_code: string,
       is_eu: boolean
   },
   status: number
}

namespace IipStackUtil {
   export type Result = ResultIpStack;
}