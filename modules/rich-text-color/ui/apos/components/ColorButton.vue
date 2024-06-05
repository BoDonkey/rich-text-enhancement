<template>
  <div class="apos-cc-toolbar">
    <AposButton
      type="rich-text"
      :class="{ 'apos-is-active': buttonActive }"
      :label="tool.label"
      :modifiers="['no-border', 'no-motion']"
      @click="takeAction"
    />
    <div
      v-if="active"
      v-click-outside-element="close"
      class="apos-popover apos-cc-toolbar__dialog"
      x-placement="bottom"
      :class="{
        'apos-is-triggered': active,
        'apos-has-selection': hasSelection
      }"
    >
      <div class="text-color-component" v-if="editor">
        <AposInputWrapper
          :field="field"
          :error="effectiveError"
          :uid="uid"
          :modifiers="modifiers"
        >
          <template #body>
            <div class="custom-input-object">
              <div class="custom-input-wrapper">
                <AposSchema
                  v-model="colorSchemaInput"
                  :schema="colorSchema"
                  :trigger-validation="triggerValidation"
                  :generation="generation"
                  @input="handleColorChange"
                />
              </div>
            </div>
          </template>
        </AposInputWrapper>
        <footer class="apos-cc-toolbar__footer">
          <AposButton
            type="primary"
            label="apostrophe:close"
            :modifiers="formModifiers"
            @click="close"
          />
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from 'vue';
import { useClickOutside } from '@vueuse/core';

export default defineComponent({
  name: 'ColorButton',
  props: {
    name: {
      type: String,
      required: true
    },
    editor: {
      type: Object,
      required: true
    },
    tool: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const localColorValue = ref('#000000');
    const colorSchemaInput = ref({});
    const active = ref(false);
    const buttonActive = ref(false);
    const hasSelection = ref(false);
    const field = ref({});
    const effectiveError = ref(null);
    const uid = ref(null);
    const modifiers = ref([]);
    const colorSchema = ref([
      {
        name: 'color',
        label: 'Color',
        type: 'color',
        required: true,
        def: '#000000'
      }
    ]);
    const triggerValidation = ref(false);
    const generation = ref(0);
    const formModifiers = ref([]);

    watch(() => props.editor, (newEditor) => {
      const newColor = newEditor.getAttributes('textStyle').color;
      if (newColor !== localColorValue.value) {
        localColorValue.value = newColor || '#000000';
      }
    }, {
      deep: true,
      immediate: true
    });

    const handleColorChange = ($event) => {
      console.log('handleColorChange', command(), $event);
      props.editor.chain().focus()[command()]($event).run();
    };

    const command = () => {
      return props.tool.command || props.name;
    };

    const takeAction = () => {
      active.value = !active.value;
      if (active.value) {
        populateFields();
      }
    };

    const close = () => {
      active.value = false;
    };

    useClickOutside(close);

    return {
      localColorValue,
      colorSchemaInput,
      active,
      buttonActive,
      hasSelection,
      field,
      effectiveError,
      uid,
      modifiers,
      colorSchema,
      triggerValidation,
      generation,
      formModifiers,
      handleColorChange,
      command,
      takeAction,
      close
    };
  }
});
</script>

<style lang="scss" scoped></style>
