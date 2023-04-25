import { KStream } from "kafka-streams";

/**
 * @interface IKafkaStreamsUtil
 * @method getKStream -> return instance connection kafks streaming
 * @method stremingLocation  -> process data streming for get location
 * @method startStream -> Return data of all keys passed
 */
export interface IKafkaStreamsUtil {
    getKStream: (topic: string) => KStream,
    stremingLocation: (kstream: KStream) => Promise<void>,
    startStream: (kstream: KStream) =>  Promise<void> 
}