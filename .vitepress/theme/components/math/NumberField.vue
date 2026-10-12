<script setup lang="ts">
import { computed, useId } from 'vue'
const props = defineProps<{ modelValue: number | string; label: string; error?: string; min?: number; max?: number; integer?: boolean; hint?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number | string] }>()
const id = useId()
const canStep = computed(() => typeof props.modelValue === 'number' && Number.isFinite(props.modelValue) && !props.error)
function step(direction: number) {
  if (!canStep.value) return
  emit('update:modelValue', Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, Number(props.modelValue) + direction)))
}
function update(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value === '' || !Number.isFinite(input.valueAsNumber) ? '' : input.valueAsNumber)
}
</script>

<template>
  <div class="math-lab__field">
    <label :for="id">{{ label }}</label>
    <div :class="{ 'math-lab__stepper': integer, 'math-lab__stepper--invalid': error }">
      <button v-if="integer" type="button" :aria-label="`减少${label}`" :disabled="!canStep || (min !== undefined && Number(modelValue) <= min)" @click="step(-1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>
      </button>
      <input :id="id" :value="modelValue" type="number" :min="min" :max="max" :step="integer ? 1 : 'any'"
        :aria-invalid="!!error" :aria-describedby="`${id}-help`" @input="update">
      <button v-if="integer" type="button" :aria-label="`增加${label}`" :disabled="!canStep || (max !== undefined && Number(modelValue) >= max)" @click="step(1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10" /></svg>
      </button>
    </div>
    <span :id="`${id}-help`" class="math-lab__help" :class="{ 'math-lab__error': error }">{{ error || hint }}</span>
  </div>
</template>
