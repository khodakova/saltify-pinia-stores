import * as SWC from '@swc/core';

export function parseBundleAst(code: string) {
  return SWC.parseSync(code, {
    syntax: 'ecmascript',
    target: 'es2022',
  });
}

function span(): SWC.Span {
  return { start: 0, end: 0, ctxt: 0 };
}

export function makeStringLiteral(value: string): SWC.StringLiteral {
  return {
    type: 'StringLiteral',
    span: span(),
    value,
  };
}

export function makeBinaryExpression(opts: {
  left: SWC.Expression,
  right: SWC.Expression,
  operator: SWC.BinaryOperator,
}): SWC.BinaryExpression {
  return {
    type: 'BinaryExpression',
    span: span(),
    left: opts.left,
    right: opts.right,
    operator: opts.operator,
  };
}

export const generateUid = ():string => Date.now().toString(36) + Math.random().toString(36).substring(2);

export function getUniqueId(salt?: string) {
  return salt ?? generateUid().slice(-4);
}
