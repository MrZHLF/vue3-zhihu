<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <textarea 
      v-else 
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"></textarea>
    <span class="invalid-feedback" v-if="inputRef.error">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue';
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[];
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String, //自定义v-model 从父组件传递过来
    tag:{
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup(props,context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: '',
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed  = props.rules.every(rule =>{
          let passed = true;
          inputRef.message = rule.message;
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '') 
              break;
            case 'email':
              passed = emailReg.test(inputRef.val)
              break;
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break;
            default:
              break;
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() =>{
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
    }
  },
})
</script>

<style scoped></style>
