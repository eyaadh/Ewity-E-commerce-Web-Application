<template>
  <div class="bg-white">
    <div class="sm:py-2 xl:mx-auto xl:max-w-7xl xl:px-8">
      <div class="px-6 pt-2.5 -mb-2">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">My Cart</h1>
      </div>
      <div class="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section v-if="posStore.myCart.length > 0" aria-labelledby="cart-heading" class="lg:col-span-7">
          <ul role="list" class="divide-y divide-gray-200 border-b border-t border-gray-200">
            <li v-for="(product, pIdx) in posStore.myCart" :key="product.id" class="flex py-6">
              <div class="flex-shrink-0">
                <img :src="product.product_image" :alt="product.product_name"
                     class="h-24 w-24 object-cover object-center border rounded-xl"/>
              </div>

              <div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div class="relative ">
                  <div class="flex flex-col justify-between gap-4">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">{{ product.product_name }}</h3>
                      <span class="mt-2 text-sm leading-5 text-gray-900">QTY: {{ product.quantity }}</span>
                    </div>
                    <div>
                      <p class="text-sm leading-5 text-gray-400">Unit Price: MRF. {{
                          product.base_tax_amount.toFixed(2)
                        }}</p>
                      <p class="text-sm leading-5 text-gray-400">Total: MRF. {{
                          product.total_base_tax_amount.toFixed(2)
                        }}</p>
                    </div>


                    <div class="mt-4 sm:mt-0 sm:pr-9">
                      <div class="absolute right-0 top-0">
                        <button
                          @click="removeFromCart(pIdx)"
                          type="button" class="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                          <span class="sr-only">Remove</span>
                          <XMarkIcon class="h-5 w-5" aria-hidden="true"/>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <div v-else class="lg:col-span-7">
          <div
            class="relative block w-full rounded-lg border border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mx-auto h-12 w-12 text-gray-400"
              fill="currentColor"
              viewBox="0 -960 960 960">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            <span class="mt-2 block text-sm font-semibold text-gray-400 italic">Your Cart is Empty</span>
          </div>
        </div>

        <!-- Order summary -->
        <section aria-labelledby="summary-heading"
                 class="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <h2 id="summary-heading" class="text-lg font-medium text-gray-900">Order summary</h2>
          <p class="mt-2 text-xs italic text-gray-400">The provided summary includes both plastic bag and GST taxes for
            items that are subject to these specific taxations.</p>
          <dl class="mt-6 space-y-4">
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-600">Subtotal</dt>
              <dd class="text-sm font-medium text-gray-900">MRF. {{ subTotal }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-600">Tax</dt>
              <dd class="text-sm font-medium text-gray-900">MRF. {{ tax }}</dd>
            </div>
            <div class="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt class="text-base font-medium text-gray-900">Order total</dt>
              <dd class="text-base font-medium text-gray-900">MRF. {{ orderTotal }}</dd>
            </div>
          </dl>

          <div class="mt-6">
            <button
              :disabled="posStore.myCart.length < 1"
              @click="placeOrder"
              class="w-full rounded-md border border-transparent bg-neutral-600 disabled:bg-neutral-200 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              Place Order
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Dialog ref="notificationDialog" @dialogClosed="closeNotificationDialog">
    <template #asideIcon>
      <div v-if="notificationProperties.notificationStatus"
           class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
        <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true"/>
      </div>

      <div v-else class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true"/>
      </div>
    </template>
    <template #title>
      <h3 class="text-base font-semibold leading-6 text-gray-900">Order Successfully Requested</h3>
    </template>
    <template #body>
      <p class="text-sm text-gray-500">{{ notificationProperties.notificationMessage }}</p>
    </template>
    <template #footer>
      <button type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="closeNotificationDialog">
        Close
      </button>
    </template>
  </Dialog>
</template>

<script setup>
import {XMarkIcon} from '@heroicons/vue/20/solid'
import {usePosStore} from "@/stores/posStore.js";
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import Dialog from "@/components/Dialog.vue";
import {CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/vue/24/outline/index.js";
import {useRouter} from "vue-router";
import {informAdmin} from "@/utils/telegramMessaging.js";

const posStore = usePosStore()
const userStore = useUserStore()
const router = useRouter()
const notificationDialog = ref(null)
const notificationProperties = reactive({
  notificationStatus: true,
  notificationMessage: ''
})

const placeOrder = () => {
  // check if the user has completed if not show a dialog
  // explaining the same, and do not proceed to placing the order
  if (!userStore.user) {
    notificationProperties.notificationStatus = false
    notificationProperties.notificationMessage = 'Regrettably, we are unable to proceed with your order as the onboarding process remains incomplete. Upon closing this dialogue, you will be redirected to the onboarding page. Please ensure that you update the necessary details. Once the onboarding is complete, you can return to the cart and proceed to place the order. Rest assured, the items in your cart will be retained.'
    notificationDialog.value.openDialog()
    return
  }

  // 1. placing the order is a two-step process
  // 2. it creates the quote and collect the quote ID
  posStore.createQuotation(userStore.user.id)
    .then(resp => {
      console.log(resp)
      // 3. edit the quotation and add the items in my cart as lines
      const quoteId = resp.id
      posStore.editQuotation(quoteId)
        .then(resp => {
          // 4. when finally all that is done empty my cart,
          // inform the store admin and show the
          // order acknowledgment
          posStore.myCart = []

          informAdmin(`🚨 We've received a *new online order*,\nand I've generated a quotation with the reference number: ${resp.number}.`)

          notificationProperties.notificationStatus = true
          notificationProperties.notificationMessage = 'Your order has been received, and the store has been informed. A representative will contact you to verify the delivery address and the items in your order. We appreciate your business and understanding.'
          notificationDialog.value.openDialog()
        })
    })
}

const closeNotificationDialog = () => {
  // reset the notification dialog and close it
  notificationProperties.notificationStatus = true
  notificationProperties.notificationMessage = ''
  notificationDialog.value.closeDialog()

  // finally redirect to home
  router.push({name: 'home'})
}

const subTotal = computed(() => {
  let total = 0
  posStore.myCart.forEach(i => {
    total = total + i.total_base_sales_price
  })
  return total.toFixed(2)
})

const tax = computed(() => {
  let taxTotal = 0
  posStore.myCart.forEach(i => {
    taxTotal = taxTotal + (i.total_base_tax_amount - i.total_base_sales_price)
  })
  return taxTotal.toFixed(2)
})

const orderTotal = computed(() => {
  let total = 0
  posStore.myCart.forEach(i => {
    total = total + i.total_base_tax_amount
  })
  return total.toFixed(2)
})

const removeFromCart = (index) => {
  posStore.myCart.splice(index, 1)
}

onBeforeMount(() => {
  if (!userStore.user) {
    userStore.fetchUserDetails()
  }
})
</script>