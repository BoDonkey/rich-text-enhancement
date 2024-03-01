<template>
  <div class="apos-tiptap-select">
    <format-text-icon
      :size="16"
      class="apos-tiptap-select__type-icon" fill-color="currentColor" />
    <select
      v-apos-tooltip="{
        content: 'Fonts',
        placement: 'top',
        delay: 650
      }"
      :value="active"
      :style="getSelectWidth"
      class="apos-tiptap-control apos-tiptap-control--select"
      @change="setFont"
    >
      <option
        value="0"
        disabled
      >
        Font
      </option>
      <option
        v-for="(font, i) in options.fonts"
        :key="font.label"
        :value="font.value"
      >
        {{ font.label }}
      </option>
    </select>
    <chevron-down-icon
      :size="11"
      class="apos-tiptap-select__icon"
      fill-color="currentColor"
    />
  </div>
</template>

<script>

export default {
  name: 'FontSelect',
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
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    active() {
      const fonts = this.options.fonts || [];
      for (let i = 0; (i < fonts.length); i++) {
        const font = fonts[i];
        if (this.editor.isActive({ fontFamily: font.value })) {
          return font.value;
        }
      }
      return 0;
    },
    moduleOptions() {
      return window.apos.modules['@apostrophecms/rich-text-widget'];
    },
    getSelectWidth() {
      // Find the active font object based on the active value.
      const activeFont = this.options.fonts.find(font => font.value === this.active);
      // If an active font is found, calculate its label's width.
      if (activeFont) {
        return `width:${activeFont.label.length * 6.5}px`;
      }
      // If no active font is found, set a default width.
      return 'width:100px'; // Adjust the default width as needed.
    },
  },
  methods: {
    setFont($event) {
      // Find the font object whose value matches the selected option's value.
      const font = this.options.fonts.find(f => f.value === $event.target.value);

      // Ensure the font object exists before attempting to use it.
      if (font) {
        this.editor.commands.focus();
        this.editor.commands.setFontFamily(font.value || {});
      } else {
        console.error('Selected font not found in options:', $event.target.value);
      }
    }

  }
};
</script>

<style lang="scss" scoped>
// If another select el is needed for the rich-text toolbar these styles should be made global
.apos-tiptap-control--select {
  @include apos-button-reset();
  @include apos-transition();
  height: 100%;
  padding: 0 10px;
  font-size: var(--a-type-smaller);

  &:focus,
  &:active {
    outline: none;
  }
}

.apos-tiptap-select {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 4px;
  color: var(--a-base-1);
  border-radius: var(--a-border-radius);
  transition: all 0.5s ease;

  &:hover {
    color: var(--a-text-primary);
    background-color: var(--a-base-9);
  }
}

.apos-tiptap-select__type-icon {
  padding-top: 2px;
}
</style>
