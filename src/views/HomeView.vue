<template>
  <div class="bg-white">
    <div class="sm:py-2 xl:mx-auto xl:max-w-7xl xl:px-8">
      <div
        class="px-6 py-2.5 border-b flex flex-col text-center w-full space-y-2.5 sm:py-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>

        <div class="flex rounded-md shadow-sm">
          <div class="relative flex-grow focus-within:z-10">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="pointer-events-none h-5 w-5 text-gray-400" aria-hidden="true"/>
            </div>
            <input type="text" name="search" id="search" v-model="posStore.categoryFilter"
                   class="w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:block"
                   placeholder="Search categories..."/>
          </div>
        </div>
      </div>

      <div class="mt-8 flow-root">
        <TransitionRoot
          appear
          :show="!moving"
          enter="transition ease-in-out duration-700 transform" enter-from="scale-0" enter-to="scale-100"
          leave="transition ease-in-out duration-700 transform" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div
            class="px-4 sm:px-6 gap-6 grid grid-cols-2 md:grid-cols-3 xl:gap-x-8 xl:space-x-0 xl:px-0">
            <RouterLink v-for="category in posStore.categories" :key="category.id"
                        :to="{query: {...route.query, ['id']: category.id}, name: 'category'}"
                        class="group relative flex h-40 sm:h-60 flex-col overflow-hidden rounded-lg p-6 hover:outline xl:w-auto">
                <span aria-hidden="true" class="absolute inset-0">
                  <img :src="category.image? category.image.url: posStore.categoriesDefaultImage" :alt="category.name"
                       class="h-full w-full object-cover object-center group-hover:scale-105"/>
                </span>
              <span aria-hidden="true"
                    class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-800 opacity-90 hover:opacity-50"/>
              <span
                class="absolute pl-2.5 pr-1 py-2 rounded-l-2xl right-0 text-right text-xs sm:text-md font-bold text-white bg-neutral-900 shadow">{{
                  category.name
                }} ( {{ category.product_count }} )</span>
            </RouterLink>
          </div>
        </TransitionRoot>
      </div>

      <div class="mt-4 flow-root">
        <Pagination :numberOfPages="posStore.categoriesLastPage"
                    :total-number-of-records="posStore.categoriesTotalItems"
                    :current-page="posStore.categoriesPage"
                    @pageChange="pageChange"
        />
      </div>
    </div>
  </div>

  <SlideOver title="On Boarding" ref="onBoardingSlideOver" @slideOverClosed="resetOnBoardingForm">
    <template #body>
      <h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">This information is essential for reaching out to you and ensuring
        the successful delivery of your orders. Kindly provide the correct details.</p>
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
          <div class="mt-2">
            <input type="tel" name="phone-number" id="phone-number" autocomplete="tel"
                   disabled v-model="onBoardingForm.mobile"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>

        <div class="sm:col-span-3">
          <div class="flex space-x-0.5 items-center">
            <XCircleIcon v-if="validateOnboardingForm$.name.$error" class="h-5 w-5 animate-pulse text-red-400"/>
            <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
          </div>
          <div class="mt-2">
            <input type="text" name="name" id="name" autocomplete="name" v-model="onBoardingForm.name"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>

        <div class="sm:col-span-4">
          <div class="flex space-x-0.5 items-center">
            <XCircleIcon v-if="validateOnboardingForm$.email.$error" class="h-5 w-5 animate-pulse text-red-400"/>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          </div>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" v-model="onBoardingForm.email"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>

        <div class="col-span-full">
          <div class="flex space-x-0.5 items-center">
            <XCircleIcon v-if="validateOnboardingForm$.address.$error" class="h-5 w-5 animate-pulse text-red-400"/>
            <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          </div>
          <div class="mt-2">
            <textarea id="address" name="address" rows="3" autocomplete="address" v-model="onBoardingForm.address"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>

      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit"
                @click="saveOnBoarding"
                class="rounded-md bg-neutral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600">
          Save
        </button>
      </div>
    </template>
  </SlideOver>
</template>

<script setup>
import {TransitionRoot} from "@headlessui/vue";
import {MagnifyingGlassIcon, XCircleIcon} from "@heroicons/vue/20/solid/index.js";
import {useUserStore} from "@/stores/userStore.js";
import {computed, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import SlideOver from "@/components/SlideOver.vue";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {usePosStore} from "@/stores/posStore.js";
import Pagination from "@/components/pagination.vue";
import {debounce} from "lodash";
import {useRoute} from "vue-router";

const userStore = useUserStore()
const posStore = usePosStore()
const moving = ref(false)
const route = useRoute()
const onBoardingSlideOver = ref('onBoardingSlideOver')

const onBoardingForm = reactive({
  mobile: userStore.userData.phoneNumber,
  name: null,
  email: null,
  address: null
})
const validationRulesForOnboardingForm = computed(() => {
  return {
    mobile: {required},
    name: {required},
    email: {required},
    address: {required},
  }
})
const validateOnboardingForm$ = useVuelidate(validationRulesForOnboardingForm, onBoardingForm)

const resetOnBoardingForm = () => {
  onBoardingForm.mobile = userStore.userData.phoneNumber
  onBoardingForm.name = null
  onBoardingForm.email = null
  onBoardingForm.address = null

  validateOnboardingForm$.value.$reset()
}
const saveOnBoarding = () => {
  validateOnboardingForm$.value.$validate()

  userStore.createPOSUser(onBoardingForm)
    .then(_ => {
      onBoardingSlideOver.value.closeSlideOver()
    })
}

watch(() => posStore.categoryFilter, debounce((_) => {
  moving.value = true
  posStore.categoriesPage = 1
  posStore.fetchCategories()
    .then(_ => {
      let element = document.getElementById("search")
      element.scrollIntoView({behavior: "smooth", block: "start"});
      moving.value = false
    })
}, 500))

const pageChange = (newPage) => {
  moving.value = true
  posStore.categoriesPage = newPage
  posStore.fetchCategories()
    .then(_ => {
      let element = document.getElementById("search")
      element.scrollIntoView({behavior: "smooth", block: "start"});
      moving.value = false
    })
}

onMounted(() => {
  userStore.fetchUserDetails()
    .then(u => {
      if (!u) {
        onBoardingSlideOver.value.openSlideOver()
      }
    })
})

onBeforeMount(() => {
  posStore.categoriesPage = 1
  posStore.fetchCategories()
})
</script>
