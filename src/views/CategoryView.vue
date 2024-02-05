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
          <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div v-for="item in posStore.selectedCategoryItems" :key="item.id"
                 class="group flex flex-col justify-between outline p-4 rounded-2xl">
              <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  :src="item.variants[0].images.length > 0 ? item.variants[0].images[0].url : posStore.productDefaultImage"
                  :alt="item.name"
                  class="h-full w-full object-cover object-center group-hover:opacity-75"/>
              </div>
              <h3 class="mt-4 text-sm text-gray-700">{{ item.name }}</h3>
              <p class="mt-1 text-lg font-medium text-gray-900">MRF. {{ item.sales_price_with_tax }}</p>
              <p class="mt-1 text-xs italic text-gray-400">Prices are inclusive of tax when applicable.</p>

              <div class="mt-6 flex gap-2">
                <button
                  @click="addToCart(item)"
                  :disabled="item.count < 1"
                  class="w-full rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 disabled:text-gray-400 disabled:hover:bg-gray-100 hover:bg-gray-200 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-600">
                  <span class="flex sm:flex-col w-full justify-center items-center gap-2">
                    <span class="material-symbols-outlined sm:mb-2">shopping_bag</span>
                    <span>{{ item.count < 1 ? 'Out of stock' : 'Add to bag' }}</span>
                  </span>
                </button>
                <div class="flex flex-col justify-between items-end border p-2 rounded-md">
                  <label for="location" class="block text-sm font-medium leading-6 text-gray-900">QTY</label>
                  <select :disabled="item.count < 1" :id="`qty-${item.id}`"
                          class="mt-4 block w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6">
                    <template v-for="i in item.count">
                      <option :value="i">{{ i }}</option>
                    </template>
                  </select>
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
  </div>
</template>

<script setup>
import {TransitionRoot} from "@headlessui/vue";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {usePosStore} from "@/stores/posStore.js";
import {useRoute} from "vue-router";
import Pagination from "@/components/pagination.vue";
import {debounce} from "lodash";
import FilterPopover from "@/components/FilterPopover.vue";

const moving = ref(false)
const posStore = usePosStore()
const route = useRoute()

const addToCart = (item) => {
  // 1. get the quantity that has been selected for the item
  const qty = document.getElementById(`qty-${item.id}`).value
  // 2. get the product details to gather tax associated with it.
  posStore.fetchProductDetails(item.id)
    .then(resp => {
      // 3. prepare the item with the least details needed to be added to cart
      let itemForCart = {}
      itemForCart.variant_id = resp.variants[0].id
      itemForCart.product_id = resp.id
      itemForCart.product_name = resp.name
      itemForCart.product_image = resp.variants[0].images.length > 0 ? resp.variants[0].images[0].url : posStore.productDefaultImage
      itemForCart.unit = resp.units.base
      itemForCart.unit_quantity = qty
      itemForCart.quantity = qty
      itemForCart.unit_sales_price = resp.sales_price
      itemForCart.total_sales_price = (resp.sales_price * qty)
      itemForCart.base_sales_price = resp.sales_price
      itemForCart.total_base_sales_price = (resp.sales_price * qty)
      itemForCart.base_tax_amount = resp.sales_price_with_tax
      itemForCart.total_base_tax_amount = (resp.sales_price_with_tax * qty)
      itemForCart.taxes = resp.taxes

      // 4. finally add it to cart
      posStore.myCart.push(itemForCart)
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