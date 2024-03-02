<template>
  <input type="color" :value="localColorValue" class="apos-rich-text-editor__control" :label="tool.label"
    :icon-only="!!tool.icon" :icon="tool.icon || false" :icon-size="tool.iconSize || 16"
    :modifiers="['no-border', 'no-motion']" :tooltip="{
    content: tool.label,
    placement: 'top',
    delay: 650
  }" @input="handleColorChange($event.target.value)">
</template>

<script>

export default {
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
  data() {
    return {
      localColorValue: '#000000'
    };
  },
  watch: {
    // Use a function to watch the editor's textStyle color
    editor: {
      handler() {
        const newColor = this.editor.getAttributes('textStyle').color;
        if (newColor !== this.localColorValue) {
          this.localColorValue = newColor || '#000000';
        }
      },
      deep: true, // This is important to watch for nested changes
      immediate: true // This ensures the watcher is triggered on component mount
    }
  },
  methods: {
    command() {
      // This will return the command associated with the tool or the name as a fallback
      return this.tool.command || this.name;
    },
    handleColorChange($event) {
      console.log('handleColorChange', this.command(), $event);
      this.editor.chain().focus()[this.command()]($event).run();
    }
  }
};
</script>

<style lang="scss" scoped></style>
