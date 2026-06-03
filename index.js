import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { bootStrap } from './src/bootStrap.js'
import * as scheduleJob from './src/utils/schedule.js'
import { connectRedis } from './config/redis.js'

dotenv.config({ path: path.resolve('./config/.env') })
const app = express()
const port = 5000
await connectRedis();

scheduleJob.schedulePendingUSers
scheduleJob.scheduleDeletedUSers
scheduleJob.scheduleCoupon

bootStrap(app, express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))