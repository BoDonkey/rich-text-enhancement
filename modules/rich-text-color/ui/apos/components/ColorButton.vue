<template>
  <input
    type="color"
    :value="editor.getAttributes('textStyle').color"
    class="apos-rich-text-editor__control"
    :class="{ 'apos-is-active': active }"
    :label="tool.label"
    :icon-only="!!tool.icon"
    :icon="tool.icon || false"
    :icon-size="tool.iconSize || 16"
    :modifiers="['no-border', 'no-motion']"
    :tooltip="{
      content: tool.label,
      placement: 'top',
      delay: 650
    }"
    @input="handleColorChange"
  >
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
  computed: {
    active() {
      // The parameters passed to isActive are unpredictable.
      // If they do not follow the pattern isActive(NAME, OPTIONS)
      // they should include their own helper
      if (this.tool.isActive) {
        return this.editor.isActive(this.tool.isActive);
      } else {
        return this.editor.isActive(this.name, this.tool.commandParameters || {});
      }
    }
  },
  methods: {
    command() {
      // This will return the command associated with the tool or the name as a fallback
      return this.tool.command || this.name;
    },
    handleColorChange(value) {
      console.log('handleColorChange', this.command(), value);
      this.editor.chain().focus()[this.command()](value).run();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

