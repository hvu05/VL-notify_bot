const mongoose = require('mongoose')
const User = require('../models/user')
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
})

async function run() {
  await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  await User.updateMany({ username: { $exists: false } }, { $set: { username: null } })
  await User.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } })
  console.log('Migration done')
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })