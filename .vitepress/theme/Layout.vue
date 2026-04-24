<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useEmbedMode } from './composables/useEmbedMode'

const { Layout } = DefaultTheme
const { isEmbedded } = useEmbedMode()
</script>

<template>
  <Layout />
</template>
