import axios from "axios";

const informAdmin = (message = 'Order Received') => {
	return new Promise((resolve, reject) => {
		const botToken = import.meta.env.VITE_BOT_TOKEN
		const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
		axios.post(apiUrl, {
			chat_id: import.meta.env.VITE_BOT_ADMIN_CHAT_ID,
			text: message,
			parse_mode: 'Markdown'
		})
			.then(resp => {
				resolve(resp.data)
			})
			.catch(error => {
				reject(error)
			})
	})
}

export {informAdmin}