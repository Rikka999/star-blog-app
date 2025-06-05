<template>
  <UserProfile :userId="Number(route.params.id)" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserProfile from '@/components/UserProfile.vue';

const route = useRoute();
</script>
