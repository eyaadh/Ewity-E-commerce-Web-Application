<template>
  <Popover id="search" class="relative">
    <PopoverButton
      @click="posStore.filterPopoverState = !posStore.filterPopoverState"
      class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
      <span class="material-symbols-outlined">tune</span>
    </PopoverButton>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <div v-if="posStore.filterPopoverState">
        <PopoverPanel static
                      class="absolute -left-32 sm:-left-44 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div
            class="w-screen max-w-md flex-auto overflow-hidden rounded-md bg-gray-50 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">

            <div class="p-4">
              <div class="flex border-b pb-1 justify-between">
                <h3 class="text-sm font-semibold leading-6 text-gray-900">Filter Options</h3>

                <button type="button"
                        class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                        @click="posStore.filterPopoverState = !posStore.filterPopoverState">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                </button>
              </div>
              <div class="mt-2 sm:grid sm:grid-cols-3 gap-4">
                <div class="col-span-2">
                  <label for="search" class="block text-sm font-medium leading-6 text-gray-900">Search Query</label>
                  <div class="mt-2 relative flex-grow focus-within:z-10">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon class="pointer-events-none h-5 w-5 text-gray-400" aria-hidden="true"/>
                    </div>
                    <input type="text" name="search" id="search" v-model="posStore.categoryFilter"
                           v-if="posStore.filterType === 'Category'"
                           class="w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:block"
                           placeholder="Search category..."/>
                    <input type="text" name="search" id="search" v-model="posStore.selectedCategoryItemsFilter"
                           v-if="posStore.filterType === 'Product'"
                           class="w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:block"
                           placeholder="Search product..."/>
                  </div>
                </div>

                <div class="mt-2 sm:mt-0">
                  <label for="filter-type" class="block text-sm font-medium leading-6 text-gray-900">FilterBy</label>
                  <select id="filter-type" name="filter-type" v-model="posStore.filterType"
                          class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-neutral-600 sm:text-sm sm:leading-6">
                    <option>Category</option>
                    <option>Product</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </div>
    </transition>
  </Popover>
</template>

<script setup>
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/vue";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/vue/20/solid/index.js";
import {usePosStore} from "@/stores/posStore.js";
import {watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const posStore = usePosStore()
const router = useRouter()
const route = useRoute()

watch(() => posStore.filterType, (newValue) => {
  if (newValue === 'Category' && route.path.name !== 'home') {
    router.push({name: 'home'})
  } else if (newValue === 'Product' && route.path.name !== 'cat') {
    router.push({name: 'category'})
  }
})
</script>