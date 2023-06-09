<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useField } from 'vee-validate'
import { onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  rules: {
    type: Array,
    default: [],
  },
  label: String,
  iconRight: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
})

const { value, errorMessage } = useField(
  `${props.label?.toLowerCase()}Value`,
  validateField,
)

onMounted(() => {
  if (props.modelValue) {
    value.value = props.modelValue
  }
})

function validateField(value: any) {
  const errorMessages: string[] = []

  props.rules.forEach((rule: any) => {
    const result = rule(value)
    if (result !== true) {
      errorMessages.push(result)
    }
  })

  if (errorMessages.length) {
    return errorMessages[0]
  }

  return true
}
</script>

<template>
  <span class="p-float-label p-input-icon-right">
    <i v-if="iconRight" :class="`pi ${iconRight}`" />
    <InputText
      id="input"
      v-model="value"
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      class="w-full"
      :autocomplete="autocomplete"
      :class="{ 'p-invalid': errorMessage }"
      aria-describedby="text-error"
    />
    <label for="input" class="input-label">{{ label }}</label>
  </span>
  <small class="p-error mb-2" id="text-error">{{
    errorMessage || '&nbsp;'
  }}</small>
</template>

<style scoped lang="scss">
@import '@/styles/baseInput.scss';
</style>
