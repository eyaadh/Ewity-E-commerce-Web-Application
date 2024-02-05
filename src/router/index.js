import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from "@/stores/userStore.js";

const requireAuth = async (to, from, next) => {
	const userStore = useUserStore()
	userStore.loadingSession = true
	const user = await userStore.currentUser()
	if (!user) {
		await next("/login")
	} else {
		await next()
	}

	userStore.loadingSession = false
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
			path: '/',
			name: 'home',
			component: () => import('@/views/HomeView.vue'),
			beforeEnter: requireAuth,
			meta: {
				authenticatedLayout: true,
				requiresAuth: true,
				public: false
			}
		},
		{
			path: '/cat',
			name: 'category',
			component: () => import('@/views/CategoryView.vue'),
			beforeEnter: requireAuth,
			meta: {
				authenticatedLayout: true,
				requiresAuth: true,
				public: false
			}
		},
		{
			path: '/cart',
			name: 'cart',
			component: () => import('@/views/MyCartView.vue'),
			beforeEnter: requireAuth,
			meta: {
				authenticatedLayout: true,
				requiresAuth: true,
				public: false
			}
		},
    {
			path: '/login',
			name: 'login',
			component: () => import('@/views/LoginView.vue'),
			meta: {
				authenticatedLayout: false,
				requiresAuth: false,
				loginLayout: true,
				public: true
			}
		}
  ]
})
