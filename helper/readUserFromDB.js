const User = require('../models/user')

const readUserFromDB = async (user) => {
    
    try{
        const result = await User.find({isActive: true})
        if(result){
            const simplified = []

            result.forEach((user)=>{
                simplified.push({
                    chat_id: user.chatId,
                    ical_url: user.lmsUrl,
                })
            })
            return simplified
        }
        else{
            return null
        }
    }
    catch(error){
        console.log('error at readUserFromDB', error)
        return null
    }
}

module.exports = {readUserFromDB}