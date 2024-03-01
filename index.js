module.exports = {
  bundle: {
    directory: 'modules',
    modules: [ 'rich-text-color', 'rich-text-font' ]
  },
  init(self) {
    console.log('👋 from the rich text widget enhancement!');
  }
};
