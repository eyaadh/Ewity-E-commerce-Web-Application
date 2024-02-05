import {defineStore} from "pinia"
import {signOut, onAuthStateChanged} from "firebase/auth";
import {auth} from "@/utils/firebaseConfig"
import axios from "axios";

export const useUserStore = defineStore("userStore", {
	state: () => ({
		userData: null,
		user: null,
		loadingSession: false,
		axiosConfig: {
			method: 'get',
			maxBodyLength: Infinity,
			url: null,
			headers: {
				'Authorization': import.meta.env.VITE_POS_API_KEY
			}
		}
	}),
	actions: {
		async logoutUser() {
			return new Promise(async (resolve, reject) => {
				try {
					await signOut(auth)
					this.userData = null
					resolve(true)
				} catch (error) {
					reject(error)
				}
			})
		},
		fetchUserDetails() {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.url = `https://cros-proxy.eyaadh.workers.dev/?apiUrl=https://api.ewitypos.com/v1/customers?q_q=${this.userData.phoneNumber}`
				axios.request(config)
					.then((response) => {
						this.user = response.data.pagination.total > 0 ? response.data.data[0] : null
						resolve(this.user)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		createPOSUser(data) {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'POST'
				config.url = 'https://cros-proxy.eyaadh.workers.dev/?apiUrl=https://api.ewitypos.com/v1/customers'
				config.data = data

				axios.request(config)
					.then((response) => {
						this.user = response.data.data
						resolve(this.user)
					})
					.catch((error) => {
						reject(error)
					});
			})
		},
		currentUser() {
			return new Promise((resolve, reject) => {
				onAuthStateChanged(auth, (user) => {
					if (user) {
						this.userData = user
					} else {
						this.userData = null
					}
					resolve(user)
				}, (e) => reject(e))
			})
		},

	}
})