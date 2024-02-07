<template>
  <div ref="container" class="flex gap-4 items-center">
    <input v-for="n in length" :key="n"
           @keyup="(e) => handleEnter(e, n-1)"
           v-model="otpArray[n-1]" type="number" maxlength="1" class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"/>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue"

const otpProps = defineProps({
  length: {
    type: Number,
    default: 4
  }
})

const otpArray = ref([])

const container = ref()

const otpEmit = defineEmits(['entered'])

const handleEnter = (e, i) => {
  const children = container.value.children
  const keypressed = e.key


  if (i > 0 && (keypressed === 'Backspace' || keypressed === 'Delete')) {
    otpArray.value[i] = null
    setTimeout(() => {
      children[i - 1].focus()
    }, 100)
  } else {
    const matched = keypressed.match(/^[0-9]$/)
    if (!matched) {
      otpArray.value[i] = null
      return
    } else if (i < otpProps.length - 1) {
      setTimeout(() => {
        children[i + 1].focus()
      }, 100)
    }
    checkOTP()
  }
}

const checkOTP = () => {
  const children = container.value.children

  let flag = true

  for (let i = 0; i < otpProps.length - 1; i++) {
    if (otpArray.value[i] == null) {
      children[i].classList.add('border-red-500')
      flag = false
    } else {
      children[i].classList.remove('border-red-500')
    }
  }

  if (flag)
    otpEmit('entered', otpArray.value.join(''))

}

onMounted(() => {
  for (let i = 0; i < otpProps.length; i++) {
    otpArray.value[i] = null
  }
})




</script>