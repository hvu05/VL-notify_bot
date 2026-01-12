require('dotenv').config()

const axios = require('axios')
const ical = require('node-ical')
const TelegramBot = require('node-telegram-bot-api')

const mmap = require("../helper/course_map_full")
const EscapeMarkdown = require('../helper/EscapeMarkdown')


const getMmapSubject = (category) => {
    if (!category) return 'Chưa xác định'
    const parts = category.split('_')
    const ID = parts[1]
    const Subject = mmap.get(ID)
    return Subject || 'Mã môn chưa xác định'
}
const BOT_TOKEN = process.env.BOT_TOKEN

const findDeadlines = async (CHAT_ID, PATH_ONLINE_ICS) => {
    // console.log('findDeadlines', BOT_TOKEN, CHAT_ID, PATH_ONLINE_ICS)
    const GIO_THONG_BAO_TRUOC = 24 * 5
    // Khởi tạo bot
    if (!BOT_TOKEN) {
        console.error('Vui lòng cung cấp BOT_TOKEN trong file .env')
        process.exit(1)
    }
    const bot = new TelegramBot(BOT_TOKEN)

    if (!PATH_ONLINE_ICS || !CHAT_ID) {
        console.error('Vui lòng kiểm tra lại ICAL_URL và CHAT_ID trong file .env')
        if(CHAT_ID) await bot.sendMessage(CHAT_ID, 'Lỗi: Thiếu ICAL_URL hoặc CHAT_ID.')
        return
    }

    try {
        console.log(`Bắt đầu quét deadline của ${CHAT_ID}`)

        // 1. Tải và Phân tích
        const response = await axios.get(PATH_ONLINE_ICS)
        const data = response.data
        const events = ical.sync.parseICS(data)
        // console.log(events)
        const bayGio = new Date()
        const thoiGianToiHan = new Date()
        thoiGianToiHan.setHours(bayGio.getHours() + GIO_THONG_BAO_TRUOC)

        const deadlinesSapToi = []

        // 2. Lặp qua tất cả các sự kiện
        for (const event of Object.values(events)) {
            if (event.type === 'VEVENT') {
                const thoiGianKetThuc = new Date(event.end)

                // 3. Kiểm tra logic
                if (thoiGianKetThuc > bayGio && thoiGianKetThuc <= thoiGianToiHan) {
                    // Thêm vào mảng thay vì console.log
                    deadlinesSapToi.push({
                        ten: event.summary,
                        thoiGian: thoiGianKetThuc,
                        mon: event.categories || 'Môn học chưa xác định'
                    })
                }
            }
        }

        // 4. Gửi thông báo
        if (deadlinesSapToi.length > 0) {
            console.log(`Phát hiện ${deadlinesSapToi.length} deadline. Đang gửi đến ${CHAT_ID}`)

            deadlinesSapToi.sort((a, b) => a.thoiGian - b.thoiGian);

            let message = `🔔 *Nhắc nhở Deadline của ${EscapeMarkdown(CHAT_ID)} trong (${GIO_THONG_BAO_TRUOC} giờ tới)!*\n\n`

            for (const dl of deadlinesSapToi) {
                message += `🚨 *${EscapeMarkdown(dl.ten)}*\n`
                message += `   - **Môn:** ${EscapeMarkdown(dl.mon)}\n`
                message += `   - **Hạn chót:** ${dl.thoiGian.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n\n`
            }

            // Gửi tin nhắn qua Telegram
            await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' })
            console.log(`Đã gửi thông báo thành công đến ${CHAT_ID}!`)

        } else {
            const msg_congratulations = `Chúc mừng bạn... không có deadline nào trong ${GIO_THONG_BAO_TRUOC} giờ tới!!!`
            await bot.sendMessage(CHAT_ID, msg_congratulations, { parse_mode: 'Markdown' })
        }
        console.log('------------------------------')

    } catch (error) {
        console.error(`Đã xảy ra lỗi trong việc gửi tele với user ${CHAT_ID}:`, error.message)
        try {
            await bot.sendMessage(CHAT_ID, `🆘 **LỖI SCRIPT** 🆘\nScript quét deadline của bạn đã gặp lỗi: \n\n\`${error.message}\`\n\nHãy kiểm tra lại!`);
        } catch (e) {
            console.error('Lỗi khi gửi thông báo lỗi:', e.message)
        }
    }
}

module.exports = {findDeadlines}
