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
      <div v-if="editor" class="text-color-component">
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
import { ref, watch, defineComponent, computed } from 'vue';
import AposInputMixin from 'apostrophe/modules/@apostrophecms/schema/ui/apos/mixins/AposInputMixin';
import AposInputWrapper from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposInputWrapper.vue';
import AposSchema from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposSchema.vue';

export default defineComponent({
  name: 'ColorButton',
  components: {
    AposInputWrapper,
    AposSchema
  },
  mixins: [ AposInputMixin ],
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
    },
    generation: {
      type: Number,
      required: false,
      default() {
        return null;
      }
    },
    modelValue: {
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
    // const field = ref({});
    // const effectiveError = ref(null);
    // const uid = ref(null);
    // const modifiers = ref([]);
    const colorSchema = [
      {
        name: 'color',
        label: 'Color',
        type: 'color',
        required: true,
        def: '#000000'
      }
    ];
    // const triggerValidation = ref(false);
    // const generation = ref(0);
    // const formModifiers = ref([]);

    watch(() => props.editor, (newEditor) => {
      if (hasSelection.value) {
        const newColor = newEditor.getAttributes('textStyle').color;
        if (newColor !== localColorValue.value) {
          localColorValue.value = newColor || '#000000';
        }
      }
    }, { deep: true, immediate: true });

    const handleColorChange = (color) => {
      console.log('handleColorChange', command(), color);
      props.editor.chain().focus()[command()](color).run();
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
    const computedColor = computed(() => {
      return props.editor.isActive('textStyle') ? convertToHex(props.editor.getAttributes('textStyle').color) : '#000000';
    });

    const convertToHex = (color) => {
      const rgbPattern = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
      const match = color.match(rgbPattern);

      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
      }

      return color.toUpperCase();
    };

    return {
      localColorValue,
      colorSchemaInput,
      active,
      buttonActive,
      hasSelection,
      colorSchema,
      handleColorChange,
      command,
      takeAction,
      close,
      computedColor,
      convertToHex
    };
  }
});
</script>

<style lang="scss" scoped></style>
