import { PluginOption } from 'vite';

type SaltifyPiniaStoresOptions = {
  salt?: string,
  logEnable?: boolean,
}

export const saltifyPiniaStores = (options?: SaltifyPiniaStoresOptions): PluginOption => {
  return {
    name: 'vite-plugin-saltify-pinia-stores',

    buildEnd(error) {
      if (options?.logEnable) {
      }
    },

    transform(src, id) {
    },
  };
};
