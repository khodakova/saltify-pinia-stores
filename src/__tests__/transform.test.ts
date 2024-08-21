import { expect, test } from 'vitest';
import { transform } from '../transform.ts';


const mocks = [{
  label: 'withExport',
  code: `import { defineStore } from 'pinia';
  export const useStore = defineStore('test', () => {})`,
  value: '\'test\''
},
{
  label: 'without export',
  code: `import { defineStore } from 'pinia';
    const useStore = defineStore('test', () => {})`,
  value: '\'test\''
},
{
  label: 'string literal',
  code: `import { defineStore } from 'pinia';
    const useStore = defineStore('test', () => {})`,
  value: '\'test\''
},
{
  label: 'variable',
  code: `import { defineStore } from 'pinia';
    const storeName = 'test';
    const useStore = defineStore(storeName, () => {})`,
  value: 'storeName'
},
{
  label: 'template string',
  code: `import { defineStore } from 'pinia';
    const storeName = 'test';
    const useStore = defineStore(\`$\{storeName}-something\`, () => {})`,
  value: '`${storeName}-something`'
},
{
  label: 'env variables',
  code: `import { defineStore } from 'pinia';
    const storeName = 'test';
    const useStore = defineStore(\`$\{import.meta.env.VITE_ANY}$\{storeName}\`, () => {})`,
  value: '`${import.meta.env.VITE_ANY}${storeName}`'
}
]

const uniqueVal = Number(new Date()).toString()

test.each(mocks)('$label -> correct', ({ code, value }) => {
  const [result] = transform(code, '', uniqueVal);

  const storeName = result.match(/defineStore\((.*),/)?.[1]?.replaceAll(' ', '')

  expect(storeName).toBe(`"${uniqueVal}:"+${value}`)
})

