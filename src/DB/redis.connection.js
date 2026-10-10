import { createClient } from "redis"
import { REDIS_URL } from "../config.js";

export const client = createClient({
  url: REDIS_URL
});

export async function connectRedis(params) {
    try {
        await client.connect()
        console.log("Redis connected stablish successfully");
        
    } catch (error) {
        console.log("Fail to stablish Redis successfully");

    }
    
}