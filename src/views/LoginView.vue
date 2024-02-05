<template>
  <div class="flex min-h-full h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <span class="material-symbols-outlined text-8xl text-gray-500">barcode</span>
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to continue</h2>
    </div>

    <TransitionRoot
      :show="isError"
      enter="transition ease-in-out duration-700 transform" enter-from="translate-x-full" enter-to="translate-x-0"
    >
      <div class="rounded-xl max-w-sm mx-auto bg-white p-4 mt-4 outline outline-gray-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true"/>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Sign in error:</h3>
            <p class="mt-2 text-sm text-red-700 list-disc pl-5 capitalize">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </TransitionRoot>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
          <div class="mt-2">
            <input id="mobile" name="mobile" type="tel" autocomplete="tel" required="" placeholder="+9609912324"
                   :disabled="verificationCodeEntry" v-model="phoneNumber"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 disabled:text-gray-400"/>
          </div>
        </div>

        <TransitionRoot
          :show="verificationCodeEntry"
          enter="transition ease-in-out duration-700 transform" enter-from="translate-x-full" enter-to="translate-x-0"
        >
          <div class="z-10">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Verification Code</label>
            <div class="mt-2">
              <input id="password" name="password" type="password" autocomplete="current-password" required=""
                     v-model="verificationCode"
                     class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
            </div>
          </div>
        </TransitionRoot>


        <div>
          <button type="submit"
                  @click.prevent="prepareSignIn"
                  id="sign-in-button"
                  class="flex w-full justify-center rounded-md bg-neutral-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600">
            {{ verificationCodeEntry ? 'Sign in' : 'Send Verification Code' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {TransitionRoot} from '@headlessui/vue'
import {auth} from "@/utils/firebaseConfig.js";
import {RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useRouter} from "vue-router";
import {XCircleIcon} from '@heroicons/vue/20/solid'


const verificationCodeEntry = ref(false)
const phoneNumber = ref(null)
const verificationCode = ref(null)
const userStore = useUserStore()
const router = useRouter()
const isError = ref(false)
const errorMessage = ref(null)

const prepareSignIn = () => {
  if (verificationCodeEntry.value) {
    confirmationResult.confirm(verificationCode.value)
      .then((result) => {
        userStore.userData = result.user
        router.push({name: 'home'})
      }).catch((error) => {
      console.error(error)
      errorMessage.value = error.code.split('/')[1].trim()
      isError.value = true
    });
  } else {
    signInWithPhoneNumber(auth, phoneNumber.value, window.recaptchaVerifier)
      .then((confirmationResult) => {
        verificationCodeEntry.value = true
        window.confirmationResult = confirmationResult;
      }).catch((error) => {
      console.log(error.code);
      errorMessage.value = error.code.split('/')[1].trim()
      isError.value = true
    });
  }
}

onMounted(() => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
    'size': 'invisible',
    'callback': (_) => {
      //
    },
    'error-callback': (error) => {
      console.log(error);
    }
  })
})
</script>