import * as SWC from '@swc/core';

/**
 * Получить переменную по названию
 * @param allVarDeclarations
 * @param varName
 */
export function getVarDeclaratorByName(allVarDeclarations: SWC.VariableDeclarator[], varName: string) {
  const foundedVariable = allVarDeclarations
    .find((x) => {
      if (x.id.type === 'Identifier') {
        return x.id.value === varName;
      }
      return false;
    });
  return foundedVariable || null;
}
