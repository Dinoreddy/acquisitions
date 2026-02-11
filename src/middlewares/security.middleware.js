import aj from "#config/arcjet.js";
import logger from "#config/logger.js";
import { slidingWindow } from "@arcjet/node";

const securityMiddleware = async (req , res , next) =>{
    try {
        const role = req.user?.role || "guest"

        let limit; 
        let message;

        switch (role) {
            case "admin":
                limit = 20;
                message = "Admin rate limit exceeded";
                break;
            case "user":
                limit = 10;
                message = "User rate limit exceeded";
                break;
            default:
                limit = 5;
                message = "Guest rate limit exceeded";
                break;
        }

        const client = aj.withRule(slidingWindow({
            mode : "LIVE",
            interval : "1m",
            max : limit,
            name : `${role}_rate_limit`
        }))

        const decision = await client.protect(req);

        if (decision.isDenied() && decision.reason.isBot()) {
            logger.warn("Bot detected" , {ip : req.ip , userAgent : req.headers["user-agent"]})
            return res.status(403).json({ error : "Forbidden" ,message : "Bot detected"})
        }

         if (decision.isDenied() && decision.reason.isShield()) {
            logger.warn("Shield detected" , {ip : req.ip , userAgent : req.headers["user-agent"]})
            return res.status(403).json({ error : "Forbidden" ,message : "Request blocked by security policy"})
        }

         if (decision.isDenied() && decision.reason.isRateLimit()) {
            logger.warn("Rate limit exceeded" , {ip : req.ip , userAgent : req.headers["user-agent"]})
            return res.status(403).json({ error : "Forbidden" ,message : message})
        }

        next();
    } catch (error) {
        logger.error("arcject middleware error",error)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export default securityMiddleware