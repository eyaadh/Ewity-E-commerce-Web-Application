<template>
    <nav class="flex items-center justify-between border-t border-gray-200 bg-white py-3"
         aria-label="Pagination">
        <div class="hidden sm:block">
            <p class="text-sm text-gray-700">
                Page
                {{ ' ' }}
                <span class="font-medium">{{ currentPage }}</span>
                {{ ' ' }}
                of
                {{ ' ' }}
                <span class="font-medium">{{ numberOfPages }}</span>
                {{ ' Pages ' }}
                for
                {{ ' ' }}
                <span class="font-medium">{{ totalNumberOfRecords }}</span>
                {{ ' ' }}
                Records
            </p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end">
            <button @click="onPrevPage"
                        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
                Previous
            </button>
            <button @click="onNextPage"
                        class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
                Next
            </button>
        </div>
    </nav>
</template>

<script setup>

import {ref} from "vue";

const emits = defineEmits(['pageChange'])
const props = defineProps({
  currentPage: Number,
  numberOfPages: Number,
  totalNumberOfRecords: Number,
})

const currentPage = ref(props.currentPage)

const onNextPage = () => {
  if (currentPage.value === props.numberOfPages) {
    currentPage.value = props.numberOfPages
  } else {
    currentPage.value = currentPage.value + 1
  }
  emits('pageChange', currentPage.value)
}

const onPrevPage = () => {
  if (currentPage.value === 1) {
    currentPage.value = 1
  } else {
    currentPage.value = currentPage.value - 1
  }
  emits('pageChange', currentPage.value)
}

</script>