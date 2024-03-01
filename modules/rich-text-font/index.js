module.exports = {
  improve: '@apostrophecms/rich-text-widget',
  options: {
    fonts: []
  },
  extendMethods(self) {
    return {
      // We need to extend this method so that our configuration data is available
      getBrowserData(_super, req) {
        const initialData = _super(req);
        const finalTools = {
          ...initialData.tools,
          fontSelector: {
            component: 'FontSelect',
            label: 'Font',
            command: 'setFontFamily'
          }
        };

      // Also adds in the configuration options
        const finalData = {
          ...initialData,
          tools: finalTools,
          aposFontsConfig: self.options.fonts
        };
        return finalData;
      },
      optionsToSanitizeHtml(_super, options) {
        const superResult = _super(options);
        if (!superResult.allowedStyles['*']) {
          superResult.allowedStyles['*'] = {};
        }
        superResult.allowedStyles['*']['font-family'] = [ /.+/ ];
        return superResult;
      }
    };
  }
};
