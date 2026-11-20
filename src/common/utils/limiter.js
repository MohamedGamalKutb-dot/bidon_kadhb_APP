import  {rateLimit, ipKeyGenerator } from "express-rate-limit";
import axios from 'axios';
import geoip from 'geoip-lite';
import { successResponse } from "./response.utils.js";
import { client } from "../../DB/redis.connection.js";


// async function fromWhere(ip) {
//   try {
//     const response = await axios.get(`https://ipapi.co/${ip}/json`);
//     console.log({response});
    
//     return response.data
//   } catch (error) {
//     console.log(error);
    
//   }
  
// }

function fromWhere(ip) {
  try {
  
    
    return geoip.lookup(ip)
  } catch (error) {
    console.log(error);
    
  }
  
}


export const denerateLimiter = ({
    ttl=15,
    message="Too Many Request" ,
    status=429,
    legacyHeaders= true,
    standardHeaders= 'draft-8', 
    skipSuccessfulRequests,
    skipFailedRequests,
    limit =1000
})=>{
return  rateLimit({
  windowMs: ttl * 60 * 1000, // 15 minutes
  limit: async function (req) {
    const data = await fromWhere(req.ip)    
    return data?.country == "EG" ? limit: 0 
  }, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  skipSuccessfulRequests,
  skipFailedRequests,
  legacyHeaders, // Disable the `X-RateLimit-*` headers.
  // ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.


  handler:function(req,res,next){
    return successResponse({res,message , status})
  },
  keyGenerator:function(req){
    const ip =ipKeyGenerator(req.ip, 52)
    
    return `${ip}::${req.path}`
  },
  store: {
    async incr(key, cb) {
        // called by keyGenerator
        try {
            const count = await client.incr(key);

            if (count === 1) {
                await client.expire(key,ttl * 60); // 1 min TTL
            }

            cb(null, count);
        } catch (err) {
            cb(err);
        }
    },

    async decrement(key) {
        // called by skipFailedRequests: true,
        // skipSuccessfulRequests: true
        if (await client.exists(key)) {
            await client.decr(key);
        }

    },
},
})

}