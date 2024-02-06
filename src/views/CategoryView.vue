<template>
  <div class="bg-white">
    <div class="sm:py-2 xl:mx-auto xl:max-w-7xl xl:px-8">
      <div id="header"
           class="px-6 py-2.5 border-b flex items-center justify-between w-full sm:py-4">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>

        <FilterPopover/>
      </div>

      <div class="mt-8 px-4 flow-root">
        <TransitionRoot
          appear
          :show="!moving"
          enter="transition ease-in-out duration-700 transform" enter-from="scale-0" enter-to="scale-100"
          leave="transition ease-in-out duration-700 transform" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 md:grid-cols-4 ">
            <div
              @click="openItemAddToCartDialog(item)"
              v-for="item in posStore.selectedCategoryItems" :key="item.id"
              class="relative cursor-pointer group h-48 w-full overflow-hidden rounded-md border border-gray-100 shadow-md bg-gray-200 group-hover:opacity-75">
              <img
                :src="item.variants[0].images.length > 0 ? item.variants[0].images[0].url : posStore.productDefaultImage"
                :alt="item.name" class="h-full w-full object-cover object-center"/>
              <span aria-hidden="true"
                    class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-200"/>
              <div
                class="absolute bg-neutral-100/70 w-full bottom-0 py-1 px-2 h-20 text-gray-900 group-hover:bg-neutral-100/40">
                <h3 class="mt-2 font-bold text-sm">{{ item.name }}</h3>
                <div>
                  <p class="mt-1 text-xs">MRF. {{ item.sales_price_with_tax }}</p>
                </div>
              </div>
            </div>
          </div>
        </TransitionRoot>
      </div>

      <div class="mt-4 flow-root">
        <Pagination :numberOfPages="posStore.selectedCategoryLastPage"
                    :total-number-of-records="posStore.selectedCategoryTotalItems"
                    :current-page="posStore.selectedCategoryPage"
                    @pageChange="pageChange"
        />
      </div>
    </div>

    <TransitionRoot as="template" :show="itemDialogOpenState">
      <Dialog as="div" class="relative z-10" @close="closeAddToCartDialog" :initial-focus="initialFocus">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
                             enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                             enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                             leave-from="opacity-100 translate-y-0 sm:scale-100"
                             leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform rounded-lg bg-white px-4 pb-4 pt-5 w-full text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6">
                <div>
                  <div class="mx-auto flex h-40 w-40 items-center rounded-md justify-center bg-green-100">
                    <img
                      :src="selectedItem.variants[0].images.length > 0 ? selectedItem.variants[0].images[0].url : posStore.productDefaultImage"
                      :alt="selectedItem.name" class="h-full w-full object-cover object-center rounded-md"/>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      {{ selectedItem.name }}
                    </DialogTitle>
                    <div class="mt-2 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4 justify-between">
                      <div class="flex flex-col justify-between text-left">
                        <p class="mt-1 text-lg font-medium text-gray-500">MRF. {{ selectedItem.sales_price_with_tax }} /
                          {{ selectedItem.units.base }}</p>
                        <p class="mt-1 text-sm font-medium text-gray-500">Total: MRF.
                          {{ (selectedItem.sales_price_with_tax * selectedQty).toFixed(2) }}</p>
                        <p class="mt-1 text-xs italic text-gray-400">Prices are inclusive of tax when applicable.</p>
                      </div>
                      <div class="text-left">
                        <ComboBox
                          label="Quantity"
                          :items="Array.from({ length: selectedItem.count }, (_, index) => ({ id: index + 1, name: `${index + 1}` }))"
                          @selected="selectedQty = $event.id"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                          :disabled="selectedItem.count < 1"
                          ref="initialFocus"
                          class="inline-flex w-full justify-center rounded-md bg-neutral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 disabled:bg-neutral-200 sm:col-start-2"
                          @click="addToCart(selectedItem)">
                    {{ selectedItem.count < 1 ? 'Out of stock' : 'Add to cart' }}
                  </button>
                  <button type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 "
                          @click="closeAddToCartDialog">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {usePosStore} from "@/stores/posStore.js";
import {useRoute} from "vue-router";
import Pagination from "@/components/pagination.vue";
import {debounce} from "lodash";
import FilterPopover from "@/components/FilterPopover.vue";
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import ComboBox from "@/components/ComboBox.vue";

const moving = ref(false)
const posStore = usePosStore()
const route = useRoute()

const itemDialogOpenState = ref(false)

const selectedItem = ref(null)
const selectedQty = ref(0)
const initialFocus = ref(null)

const openItemAddToCartDialog = (item) => {
  selectedItem.value = item
  selectedQty.value = 1
  itemDialogOpenState.value = true
}

const closeAddToCartDialog = () => {
  itemDialogOpenState.value = false
  selectedQty.value = 1
}

const addToCart = (item) => {
  // 1. get the product details to gather tax associated with it.
  posStore.fetchProductDetails(item.id)
    .then(resp => {
      // 2. prepare the item with the least details needed to be added to cart
      let itemForCart = {}
      itemForCart.variant_id = resp.variants[0].id
      itemForCart.product_id = resp.id
      itemForCart.product_name = resp.name
      itemForCart.product_image = resp.variants[0].images.length > 0 ? resp.variants[0].images[0].url : posStore.productDefaultImage
      itemForCart.unit = resp.units.base
      itemForCart.unit_quantity = selectedQty.value
      itemForCart.quantity = selectedQty.value
      itemForCart.unit_sales_price = resp.sales_price
      itemForCart.total_sales_price = (resp.sales_price * selectedQty.value)
      itemForCart.base_sales_price = resp.sales_price
      itemForCart.total_base_sales_price = (resp.sales_price * selectedQty.value)
      itemForCart.base_tax_amount = resp.sales_price_with_tax
      itemForCart.total_base_tax_amount = (resp.sales_price_with_tax * selectedQty.value)
      itemForCart.taxes = resp.taxes

      // 3. finally add it to cart
      posStore.myCart.push(itemForCart)

      // 4. hide the dialog
      closeAddToCartDialog()
    })


}

const pageChange = (newPage) => {
  moving.value = true
  posStore.selectedCategoryPage = newPage
  posStore.fetchCategories()
    .then(_ => {
      scrollToHeader()
      moving.value = false
    })
}

watch(() => posStore.selectedCategoryItemsFilter, debounce((_) => {
  moving.value = true

  posStore.selectedCategoryPage = 1
  posStore.fetchCategoryItems()
    .then(_ => {
      scrollToHeader()
      moving.value = false
    })
}, 500))

const scrollToHeader = () => {
  let element = document.getElementById("header")
  element.scrollIntoView({behavior: "smooth", block: "start"});
}

onMounted(() => {
  scrollToHeader()
})

onBeforeMount(() => {
  posStore.selectedCategoryId = route.query.id
  posStore.selectedCategoryPage = 1
  posStore.fetchCategoryItems()
})
</script>