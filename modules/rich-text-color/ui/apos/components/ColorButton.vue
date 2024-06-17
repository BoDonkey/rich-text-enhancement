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
      <div
        v-if="editor"
        class="text-color-component"
      >
        <div class="custom-input-object">
          <div class="custom-input-wrapper">
            {# Add picker component here? #}
          </div>
        </div>
        <footer class="apos-cc-toolbar__footer">
          <AposButton
            type="primary"
            label="apostrophe:close"
            :modifiers="['small', 'margin-micro']"
            @click="close"
          />
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, defineComponent, computed } from 'vue';
import AposButton from 'apostrophe/modules/@apostrophecms/ui/ui/apos/components/AposButton.vue';
import AposInputColor from 'apostrophe/modules/@apostrophecms/schema/ui/apos/components/AposInputColor.vue';

export default defineComponent({
  name: 'ColorButton',
  components: {
    AposButton,
    AposInputColor
  },
  props: {
    generation: {
      type: Number,
      required: false,
      default() {
        return null;
      }
    },
    tool: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Object,
      default() {
        return {};
      }
    },
    editor: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const localColorValue = ref('#000000');
    const active = ref(false);
    const buttonActive = ref(false);
    const hasSelection = ref(false);

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
        console.log('take action');
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
      active,
      buttonActive,
      hasSelection,
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
