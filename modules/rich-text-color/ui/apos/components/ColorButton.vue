<template>
  <input
    type="color"
    :value="editor.getAttributes('textStyle').color"
    @input="editor.chain().focus().setColor($event.target.value).run()"
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
  }
};
</script>

<style lang="scss" scoped>
</style>

