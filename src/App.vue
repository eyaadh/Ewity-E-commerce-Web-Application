<template>
  <div>
    <div v-if="route.meta.authenticatedLayout">
      <ClientLayout/>
    </div>
    <div v-if="route.meta.loginLayout">
      <AuthLayout/>
    </div>
  </div>
</template>

<script setup>
import ClientLayout from "@/layouts/ClientLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>