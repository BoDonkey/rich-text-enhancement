module.exports = {
  improve: '@apostrophecms/rich-text-widget',
  options: {
    colors: {}
  },
  extendMethods(self) {
    return {
      // We need to extend this method so that our configuration data is available
      getBrowserData(_super, req) {
        const initialData = _super(req);
        const finalTools = {
          ...initialData.tools,
          colorButton: {
            component: 'ColorButton',
            label: 'Color',
            command: 'setColor'
          }
        };

      // Also adds in the configuration options
        const finalData = {
          ...initialData,
          tools: finalTools,
          aposColorConfig: self.options.colors
        };
        return finalData;
      },
      optionsToSanitizeHtml(_super, options) {
        const superResult = _super(options);
        if (!superResult.allowedStyles['*']) {
          superResult.allowedStyles['*'] = {};
        }
        superResult.allowedStyles['*'].color = [ /^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/ ];
        if (!superResult.allowedAttributes['*']) {
          superResult.allowedAttributes['*'] = {};
        }
        if (!superResult.allowedAttributes['*'].includes('class')) {
          superResult.allowedAttributes['*'].push('class');
        }
        return superResult;
      }
    };
  }
};
