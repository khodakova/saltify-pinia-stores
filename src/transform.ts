import * as SWC from '@swc/core';
import {
  makeBinaryExpression, makeIdentifier, makeStringLiteral, makeVariableDeclaration, parseBundleAst
} from './utils/common.ts';
import { getAllVariableDeclarators } from './utils/get-all-variable-declarators.ts';
import { getVarDeclaratorByName } from './utils/get-var-declarator-by-name.ts';
import { getTemplateLiteralValue } from './utils/get-template-literal-value.ts';

const defineStoreRegex = /defineStore/;
const nodeModulesRegex = /node_modules/;

export function transform(src: string, id: string, uniqueVal: string) {
  const processedFiles: string[] = [];
  if (!nodeModulesRegex.test(id) && defineStoreRegex.test(src)) {
    let newCode = '';
    const ast = parseBundleAst(src);
    const fileName = id.match(/([^/]+$)/)?.[0];

    const topLevelStmts = ast.body;
    let cnt = 0;

    /** Флаг наличия в импортах defineStore из pinia */
    const hasDefineStore = ast.body
      .some((node) => node.type === 'ImportDeclaration'
        && node.source.value === 'pinia'
        && node.specifiers.some((n) => n.local.value === 'defineStore'));

    if (hasDefineStore) {
      const allVarDeclarations = getAllVariableDeclarators(ast);

      allVarDeclarations.forEach((ad) => {
        const caller = ad.init;

        // для всех переменных, объявленных с помощью выражения defineStore, создаем новое имя стора
        if (caller.type === 'CallExpression' && caller.callee.type === 'Identifier' && caller.callee.value === 'defineStore') {
          const storeIdArg = caller.arguments[0];
          const newStoreIdVarName = `STORE_NAME_${cnt}`;
          cnt++;
          let currentStoreIdVarValue: SWC.Expression;

          // если в качестве названия стора передана переменная
          if (storeIdArg.expression.type === 'Identifier') {
            const currentStoreIdVarName = storeIdArg.expression.value;
            const currentStoreIdVar = getVarDeclaratorByName(allVarDeclarations, currentStoreIdVarName);

            currentStoreIdVarValue = makeStringLiteral(
              currentStoreIdVar.init.type === 'StringLiteral'
                ? currentStoreIdVar.init.value
                : '',
            );
          } else if (storeIdArg.expression.type === 'StringLiteral') {
            // если в качестве названия стора передана строка

            currentStoreIdVarValue = makeStringLiteral(storeIdArg.expression.value);
          } else if (storeIdArg.expression.type === 'TemplateLiteral') {
            // если в качестве названия стора передана шаблонная строка

            const templateLiteralValue = getTemplateLiteralValue(storeIdArg.expression, allVarDeclarations);
            currentStoreIdVarValue = makeStringLiteral(templateLiteralValue);
          }

          // создаем переменную с новым storeId
          const storeNameVariable = makeVariableDeclaration(
            newStoreIdVarName,
            makeBinaryExpression({
              left: makeStringLiteral(`${uniqueVal}:`),
              right: currentStoreIdVarValue,
              operator: '+',
            }),
          );
          topLevelStmts.unshift(storeNameVariable);

          // внедряем в качестве storeId созданную выше переменную с "посоленным" значением
          storeIdArg.expression = makeIdentifier(newStoreIdVarName);

          ast.body = topLevelStmts;
        }

        const { code } = SWC.printSync(ast);
        newCode = code;

        processedFiles.push(fileName)
      });

      return newCode;
    }
  }

  return processedFiles;
}
