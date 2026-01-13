require('dotenv').config()

// import for DB
const connectDB = require('./config/db')
const mongoose = require('mongoose')

const {readUserFromDB} = require("./helper/readUserFromDB");
const {findDeadlines} = require("./helper/findDeadlines");


const run = async () => {
    try {
        await connectDB()
        
        const data_db = await readUserFromDB()
        // console.log('Data: ', data_db)
        let count_num_user = 0
        data_db.forEach(user => {
            const { chat_id, ical_url} = user

            // call func helper
            findDeadlines(chat_id, ical_url)
            count_num_user++
        })
        console.log('SENT', count_num_user, "USER!!!")

    }
    catch(err){
        console.error('Error at index.js:', err)
    }
    finally {
        await mongoose.disconnect()
        console.log('MongoDB disconnected')
    }
}

run()