<template>
  <div class="apos-color-control">
    <AposButton
      type="rich-text"
      :class="{ 'apos-is-active': buttonActive }" :label="tool.label"
      :modifiers="['no-border', 'no-motion']"
      :tooltip="{
        content: tool.label,
        placement: 'top',
        delay: 650
      }"
      @click="click"
    />
    <div
      v-if="active"
      v-click-outside-element="close"
      class="apos-popover apos-color-control__dialog"
      x-placement="bottom"
      :class="{
        'apos-is-triggered': active,
        'apos-has-selection': hasSelection
      }"
    >
      <AposContextMenuDialog menu-placement="bottom-start">
        <div v-if="editor" class="text-color-component">
          <Picker v-bind="pickerOptions" :model-value="pickerValue" @update:model-value="update" />
        </div>
        <footer class="apos-color-control__footer">
          <AposButton type="primary" label="apostrophe:close" :modifiers="['small', 'margin-micro']" @click="close" />
        </footer>
      </AposContextMenuDialog>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import AposButton from 'apostrophe/modules/@apostrophecms/ui/ui/apos/components/AposButton.vue';
import { Sketch as Picker } from '@ckpack/vue-color';
import tinycolor from 'tinycolor2';

export default {
  name: 'ColorButton',
  components: {
    AposButton,
    Picker
  },
  props: {
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

    // React to changes in the editor to update the local color
    watch(() => props.editor, (newEditor) => {
      const newColor = newEditor.getAttributes('textStyle').color;
      console.log('newColor', newColor);
      localColorValue.value = newColor || '#000000';
    }, { deep: true, immediate: true });

    const close = () => {
      active.value = false;
    };

    const handleColorChange = (color) => {
      props.editor.chain().focus().setMark('textStyle', { color: color.hex }).run();
    };

    // Convert CSS color format to Hex
    const convertToHex = (color) => {
      return tinycolor(color).toHexString();
    };

    const buttonActive = computed(() => {
      const currentColor = props.editor.getAttributes('textStyle').color;
      return tinycolor(currentColor).toHexString().toUpperCase() === localColorValue.value.toUpperCase();
    });

    return {
      localColorValue,
      active,
      buttonActive,
      close,
      handleColorChange,
      convertToHex
    };
  },
  computed: {
    pickerOptions() {
      return {
        presetColors: [
          '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
          '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
          '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
        ],
        disableAlpha: false
      };
    },
    hasSelection() {
      const { state } = this.editor;
      const { selection } = this.editor.state;
      const { from, to } = selection;
      const text = state.doc.textBetween(from, to, '');
      return text !== '';
    },
    pickerValue() {
      return this.next || '';
    }
  },
  methods: {
    update(color) {
      this.localColorValue.value = color.hex; // Update local state with new color
      this.handleColorChange(color); // Update editor's text color
    },
    click() {
      if (this.hasSelection) {
        this.active = !this.active;
        this.populateFields();
        this.evaluateConditions();
      }
    },
    populateFields() {
      console.log('populateFields');
    }
  }
};
</script>

<style lang="scss" scoped>
  .apos-color-control {
    position: relative;
    display: inline-block;
  }

  .apos-color-control__dialog {
    z-index: $z-index-modal;
    position: absolute;
    top: calc(100% + 5px);
    left: -15px;
    opacity: 0;
    pointer-events: none;
  }

  .apos-context-menu__dialog {
    width: 500px;
  }

  .apos-color-control__dialog.apos-is-triggered.apos-has-selection {
    opacity: 1;
    pointer-events: auto;
  }

  .apos-is-active {
    background-color: var(--a-base-7);
  }

  .apos-color-control__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  // .apos-color-control__footer .apos-button__wrapper {
  //   margin-left: 7.5px;
  // }

</style>
