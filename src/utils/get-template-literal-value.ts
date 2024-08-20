import * as SWC from '@swc/core';
import { getVarDeclaratorByName } from './get-var-declarator-by-name';
import { getVarDeclaratorValue } from './get-var-declarator-value';

/**
 * Получение итогового значения из литеральной строки
 *
 * @todo не учитывает возможности импорта переменных из других файлов
 * (скорей всего нужно будет переделать в возврат StringLiteral или нового TemplateExpression)
 *
 * @param variable - литеральное выражение
 * @param allVariables - все объявленные переменные внутри файла
 */
export function getTemplateLiteralValue(variable: SWC.Expression, allVariables: SWC.VariableDeclarator[] = []) {
  if (variable.type === 'TemplateLiteral') {
    const templateLiteralParts = [...variable.quasis, ...variable.expressions]
      .sort((a, b) => {
        if ('span' in a && 'span' in b) {
          return a.span.start > b.span.start ? 1 : -1;
        }
        return 0;
      });

    const res = templateLiteralParts.reduce((res, cur) => {
      if (cur.type === 'TemplateElement') {
        res += cur.raw;
      } else if (cur.type === 'Identifier') {
        const curVarDeclarator = getVarDeclaratorByName(allVariables, cur.value);
        res += getVarDeclaratorValue(curVarDeclarator);
      }
      return res;
    }, '');

    return res;
  }
  return null;
}
