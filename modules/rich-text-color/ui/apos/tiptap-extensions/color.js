// imports the tiptap extension from node_modules
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
export default (options) => {
  // gets options added in each area
  const perAreaConfig = options.colors || {};
  // gets options added at project level to the widget `modules/@apostrophecms/rich-text-widget/index.js`
  const globalConfig = self.apos.modules['@apostrophecms/rich-text-widget'].aposColorConfig || {};
  const configuration = Object.assign({}, globalConfig, perAreaConfig);
  // instantiates the extension with our options
  return Color.configure(configuration);
};
