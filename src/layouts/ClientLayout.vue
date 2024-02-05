<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                         enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                         leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-neutral-900/80"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                           enter-from="-translate-x-full" enter-to="translate-x-0"
                           leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                           leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                               enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                               leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 px-6 pb-2 ring-1 ring-white/10">
                <div class="flex flex-col gap-y-4 my-10 items-center justify-center">
                  <img class="h-48 w-48 rounded-full ring-4 ring-neutral-100 bg-neutral-800"
                       src="https://images.unsplash.com/photo-1544502062-f82887f03d1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                       alt=""/>
                  <div class="flex flex-col justify-between items-center text-white gap-2">
                    <span class="text-gray-400 font-light text-sm">{{
                        userStore.user ? userStore.user.name : 'OnBoarding'
                      }}</span>
                    <span class="text-gray-400 font-light text-sm">{{ userStore.userData.phoneNumber }}</span>
                    <button class="font-light hover:text-neutral-200" @click="signOut">
                      <span class="material-symbols-outlined">logout</span>
                    </button>
                  </div>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <RouterLink :to="item.href"
                                      :class="[item.current ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                            <span class="material-symbols-outlined h-6 w-6 shrink-0">{{ item.icon }}</span>
                            {{ item.name }}
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 px-6">
        <div class="flex flex-col gap-y-4 my-10 items-center justify-center">
          <img class="h-48 w-48 rounded-full ring-4 ring-neutral-100 bg-neutral-800"
               src="https://images.unsplash.com/photo-1544502062-f82887f03d1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
               alt=""/>
          <div class="flex flex-col justify-between items-center text-white gap-2">
            <span class="text-gray-400 font-light text-sm">{{
                userStore.user ? userStore.user.name : 'OnBoarding'
              }}</span>
            <span class="text-gray-400 font-light text-sm">{{ userStore.userData.phoneNumber }}</span>
            <button class="font-light hover:text-neutral-200" @click="signOut">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink :to="item.href"
                              :class="[item.current ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                    <span class="material-symbols-outlined h-6 w-6 shrink-0">{{ item.icon }}</span>
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-neutral-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-neutral-400 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-white uppercase">{{ route.name }}</div>
    </div>

    <main class="relative py-4 lg:pl-72">
      <div class=" px-4 sm:px-6 lg:px-8">
        <router-view/>
      </div>

      <div v-if="((posStore.myCart.length > 0) && route.path !== '/cart')" class="fixed right-4 bottom-16">
        <button
          @click="router.push({name: 'cart'})"
          class="z-20 text-white flex flex-col shrink-0 grow-0 justify-around">
          <div class="p-3 rounded-full border-4 border-green-50 bg-green-600 shadow animate-pulse duration-1000">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 p-1.5"
              fill="currentColor"
              viewBox="0 -960 960 960">
              <path
                d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import {useUserStore} from "@/stores/userStore.js";
import {useRoute, useRouter} from "vue-router";
import {usePosStore} from "@/stores/posStore.js";


const sidebarOpen = ref(false)
const userStore = useUserStore()
const posStore = usePosStore()
const route = useRoute()
const router = useRouter()

const navigation = ref([
  {name: 'Store Home', href: '/', icon: 'store', current: true},
  {name: 'My Cart', href: '/cart', icon: 'shopping_cart', current: false}
])

watch(() => route.path, () => {
  let index = navigation.value.findIndex(item => item.href === route.path)
  navigation.value.forEach((item) => {
    item.current = false
  })
  if (index !== -1) {
    navigation.value[index].current = true
  }
})

const signOut = () => {
  userStore.logoutUser()
    .then(_ => router.push({name: 'login'}))
}

onMounted(() => {
  let index = navigation.value.findIndex(item => item.href === route.path)
  navigation.value.forEach((item) => {
    item.current = false
  })
  if (index !== -1) {
    navigation.value[index].current = true
  }
})
</script>