<script setup lang="ts">
import { useId } from 'vue'
defineProps<{ modelValue: number | string; label: string; error?: string; min?: number; max?: number; integer?: boolean; hint?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number | string] }>()
const id = useId()
function update(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value === '' || !Number.isFinite(input.valueAsNumber) ? '' : input.valueAsNumber)
}
</script>

<template>
  <div class="math-lab__field">
    <label :for="id">{{ label }}</label>
    <input :id="id" :value="modelValue" type="number" :min="min" :max="max" :step="integer ? 1 : 'any'"
      :aria-invalid="!!error" :aria-describedby="`${id}-help`" @input="update">
    <span :id="`${id}-help`" class="math-lab__help" :class="{ 'math-lab__error': error }">{{ error || hint }}</span>
  </div>
</template>
