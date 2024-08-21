import * as SWC from '@swc/core';
import { makeBinaryExpression, makeStringLiteral, parseBundleAst } from './utils/common.ts';
import { getAllVariableDeclarators } from './utils/get-all-variable-declarators.ts';

const defineStoreRegex = /defineStore/;
const nodeModulesRegex = /node_modules/;

export function transformCode(src: string, id: string, uniqueVal: string): [string, boolean] {
  let newCode = '';
  let transformed = false;

  if (!nodeModulesRegex.test(id) && defineStoreRegex.test(src)) {

    const ast = parseBundleAst(src);
    // const fileName = id.match(/([^/]+$)/)?.[0];

    /** If code has defineStore from pinia */
    const hasDefineStore = ast.body
      .some((node) => node.type === 'ImportDeclaration'
        && node.source.value === 'pinia'
        && node.specifiers.some((n) => n.local.value === 'defineStore'));

    if (hasDefineStore) {
      const allVarDeclarations = getAllVariableDeclarators(ast);

      allVarDeclarations.forEach((ad) => {
        const caller = ad.init;

        // creating new stores names
        if (caller.type === 'CallExpression' && caller.callee.type === 'Identifier' && caller.callee.value === 'defineStore') {
          const storeIdArg = caller.arguments[0];

          storeIdArg.expression = makeBinaryExpression({
            left: makeStringLiteral(`${uniqueVal}:`),
            right: JSON.parse(JSON.stringify(storeIdArg.expression)),
            operator: '+',
          })
        }

        const { code } = SWC.printSync(ast);
        newCode = code;

        transformed = true;
      });

    }
  }

  return [newCode, transformed];
}
