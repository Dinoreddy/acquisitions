import 'dotenv/config';
import {neon, neonConfig} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL)

if (process.env.NODE_ENV === 'development') {
    neonConfig.fetchEndpoint = 'http://neon-local:5432/sql'
    neonConfig.useSecureWebSocket = false
    neonConfig.poolQueryViaFetch = true
}

const db = drizzle(sql)

export {
    db,
    sql
}