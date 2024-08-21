import * as SWC from '@swc/core';

/**
 * Получение всех объявленных переменных внутри файла (пока учитывается только верхний уровень, без вложенности)
 *
 * @todo можно развить возможностью проходить рекурсивно по всему АСТ (по флагу)
 * @param ast
 */
export function getAllVariableDeclarators(ast: SWC.Module) {
  const allVarDeclarations: SWC.VariableDeclarator[] = [];

  ast.body.forEach((x) => {
    if (x.type === 'ExportDeclaration') {
      if (x.declaration.type === 'VariableDeclaration') allVarDeclarations.push(...x.declaration.declarations);
    }
    if (x.type === 'VariableDeclaration') allVarDeclarations.push(...x.declarations);
  });

  return allVarDeclarations;
}
