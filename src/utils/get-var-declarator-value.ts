import * as SWC from '@swc/core';

export function getVarDeclaratorValue(variable: SWC.VariableDeclarator | null) {
  if (!variable) return null;
  switch (variable.init.type) {
  case 'StringLiteral':
    return variable.init.value;
  case 'NumericLiteral':
    return variable.init.value;
  case 'NullLiteral':
    return null;
  case 'Identifier':
    return variable.init.value;
  case 'ObjectExpression':
    // todo мб здесь нужно будет осуществлять рекурсивный парсинг свойств объекта
    return variable.init.properties;
    // todo еще не обработаны: массив, символы, NaN
  default:
    return null;
  }
}
