import { PluginOption } from 'vite';
import { cyanBright, dim } from 'colorette';
import { generateUid } from './utils/common.ts';
import { transformCode } from './transform-code.ts';

type SaltifyPiniaStoresOptions = {
  salt?: string,
  logEnable?: boolean,
}

export const saltifyPiniaStores = (options?: SaltifyPiniaStoresOptions): PluginOption => {
  const uniqueVal = generateUid();
  const processedFiles = new Set();

  return {
    name: 'vite-plugin-saltify-pinia-stores',

    buildEnd(error) {
      console.log(error)

      if (options?.logEnable) {
        const processedFilesNames = Array.from(processedFiles).join('\n');
        console.log(cyanBright(`\nSalt "${uniqueVal}" is added into the store names in the following files:`));
        console.log(dim(processedFilesNames), '\n');
      }
    },

    transform(src, id) {
      const fileName = id.match(/([^/]+$)/)?.[0];

      const [_, isTransformed] = transformCode(src, id, uniqueVal);

      if (isTransformed) processedFiles.add(fileName)
    },
  };
};

