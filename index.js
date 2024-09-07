import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { bootStrap } from './src/bootStrap.js'
import * as scheduleJob from './src/utils/schedule.js'

dotenv.config({ path: path.resolve('./config/.env') })
const app = express()
const port = 5000
scheduleJob.schedulePendingUSers
scheduleJob.scheduleDeletedUSers
scheduleJob.scheduleCoupon
bootStrap(app, express)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))