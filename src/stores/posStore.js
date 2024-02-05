import {defineStore} from "pinia"
import axios from "axios";
import {useStorage} from "@vueuse/core";

export const usePosStore = defineStore("posStore", {
	state: () => ({
		axiosConfig: {
			method: 'get',
			maxBodyLength: Infinity,
			url: null,
			headers: {
				'Authorization': import.meta.env.VITE_POS_API_KEY
			}
		},
		locationId: 7219,
		apiUrl: import.meta.env.VITE_POS_API_URL,
		categories: null,
		categoryFilter: null,
		categoriesDefaultImage: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		productDefaultImage: 'https://images.unsplash.com/photo-1616429368325-d5d7542b0ec3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		categoriesPage: 1,
		categoriesTotalItems: 1,
		categoriesLastPage: 1,
		selectedCategoryId: null,
		selectedCategoryItems: null,
		selectedCategoryItemsFilter: null,
		selectedCategoryPage: 1,
		selectedCategoryTotalItems: 1,
		selectedCategoryLastPage: 1,
		myCart: useStorage('myCart', [])
	}),
	actions: {
		fetchCategories() {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'GET'
				config.url = `${this.apiUrl}v1/products/categories?page=${this.categoriesPage}`
				if (this.categoryFilter) {
					config.url = `${this.apiUrl}v1/products/categories/tree?q_q=${this.categoryFilter}&page=${this.categoriesPage}`
				}
				axios.request(config)
					.then((response) => {
						this.categories = response.data.pagination.total > 0 ? response.data.data : null
						this.categoriesPage = response.data.pagination.current
						this.categoriesLastPage = response.data.pagination.lastPage
						this.categoriesTotalItems = response.data.pagination.total
						resolve(this.categories)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		fetchCategoryItems() {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'GET'
				config.url = `${this.apiUrl}v1/products/locations/all?q_Category=${this.selectedCategoryId}&page=${this.selectedCategoryPage}`
				if (this.selectedCategoryItemsFilter) {
					config.url = `${this.apiUrl}v1/products/locations/all?q_name=${this.selectedCategoryItemsFilter}&page=${this.selectedCategoryPage}`
				}
				axios.request(config)
					.then((response) => {
						this.selectedCategoryItems = response.data.pagination.total > 0 ? response.data.data : null
						this.selectedCategoryPage = response.data.pagination.current
						this.selectedCategoryTotalItems = response.data.pagination.total
						this.selectedCategoryLastPage = response.data.pagination.lastPage
						resolve(this.selectedCategoryItems)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		fetchProductDetails(itemId) {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'GET'
				config.url = `${this.apiUrl}v1/products/${itemId}`
				axios.request(config)
					.then((response) => {
						resolve(response.data.data)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		createQuotation(customerId) {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'POST'
				config.url = `${this.apiUrl}v1/quotations`

				config.data = {
					"location_id": this.locationId,
					"customer_id": customerId,
				}

				axios.request(config)
					.then((response) => {
						resolve(response.data.data)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		editQuotation(quoteId) {
			return new Promise((resolve, reject) => {
				const config = this.axiosConfig
				config.method = 'POST'
				config.url = `${this.apiUrl}v1/quotations/${quoteId}/lines`

				config.data = {lines: this.myCart}

				axios.request(config)
					.then((response) => {
						resolve(response.data.data)
					})
					.catch((error) => {
						reject(error)
					})
			})
		}
	}

})