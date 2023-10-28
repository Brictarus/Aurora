const { resolve } = require('path')

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default {
  root,
  publicDir: "public",
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        admin: resolve(__dirname, 'src/map_editor.html')
      }
    }
  }
}