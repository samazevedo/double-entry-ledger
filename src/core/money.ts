// import { type Result, ok, err } from './result';

// /**
//  * Money is stored as an integer number of minor units (cents, for a 2-decimal
//  * currency like USD). We never represent amounts as floating-point decimals.
//  *
//  * Why: 0.1 + 0.2 !== 0.3 in IEEE-754 floats. For money that's a correctness bug,
//  * not a rounding nuisance — an accountant reviewing this would flag float math
//  * immediately. Integer cents make addition and subtraction exact.
//  *
//  * The `unique symbol` brand makes Money a distinct type from `number`, so you
//  * can't accidentally pass a raw number where Money is expected, and you can't use
//  * `+`/`-` directly — you go through the operations below, which keep everything
//  * in integer cents. The brand exists only in the type; a Money value is, at
//  * runtime, just a number.
//  */
// declare const moneyBrand: unique symbol;
// export type Money = number & { readonly [moneyBrand]: 'Money' };

// /** Minor units per major unit: 100 cents = 1 dollar. */
// const MINOR_UNITS_PER_MAJOR = 100;

// export type MoneyParseError =
//   | { readonly kind: 'malformed'; readonly input: string }
//   | { readonly kind: 'too-many-decimals'; readonly input: string }
//   | { readonly kind: 'out-of-range'; readonly input: string };

// const brand = (cents: number): Money => cents as Money;

// /** Construct Money from an integer number of minor units (cents). */
// const fromMinorUnits = (cents: number): Money => {
//   if (!Number.isInteger(cents)) {
//     throw new Error(`Money must be an integer number of cents, got ${cents}`);
//   }
//   if (!Number.isSafeInteger(cents)) {
//     throw new Error(`Money amount ${cents} is outside the safe integer range`);
//   }
//   return brand(cents);
// };

// /**
//  * Parse a human-entered decimal string like "1234.56" or "-40" into Money.
//  * Returns a Result because this is a boundary: the input comes from outside the
//  * system (a form, a file) and may be malformed. Accepts an optional leading
//  * minus, digits, and up to two decimal places.
//  */
// const fromDecimalString = (input: string): Result<Money, MoneyParseError> => {
//   const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(input.trim());
//   if (match === null) {
//     return err({ kind: 'malformed', input });
//   }
//   // Defaults eliminate `undefined` under noUncheckedIndexedAccess; the regex
//   // guarantees the whole-number group is present when `match` is non-null.
//   const [, sign = '', whole = '', fraction = ''] = match;
//   if (fraction.length > 2) {
//     return err({ kind: 'too-many-decimals', input });
//   }
//   const cents =
//     Number(whole) * MINOR_UNITS_PER_MAJOR + Number(fraction.padEnd(2, '0'));
//   if (!Number.isSafeInteger(cents)) {
//     return err({ kind: 'out-of-range', input });
//   }
//   return ok(brand(sign === '-' ? -cents : cents));
// };

// /** Format Money as a decimal string: 123456 cents -> "1234.56". */
// const toDecimalString = (money: Money): string => {
//   const negative = money < 0;
//   const magnitude = Math.abs(money);
//   const whole = Math.floor(magnitude / MINOR_UNITS_PER_MAJOR);
//   const fraction = magnitude % MINOR_UNITS_PER_MAJOR;
//   const body = `${whole}.${String(fraction).padStart(2, '0')}`;
//   return negative ? `-${body}` : body;
// };

// const add = (a: Money, b: Money): Money => fromMinorUnits(a + b);
// const subtract = (a: Money, b: Money): Money => fromMinorUnits(a - b);
// const negate = (a: Money): Money => brand(-a);
// const sum = (amounts: readonly Money[]): Money =>
//   amounts.reduce<Money>((total, amount) => add(total, amount), brand(0));

// const isZero = (a: Money): boolean => a === 0;
// const isNegative = (a: Money): boolean => a < 0;
// const equals = (a: Money, b: Money): boolean => a === b;
// /** -1 if a < b, 0 if equal, 1 if a > b. */
// const compare = (a: Money, b: Money): number => (a < b ? -1 : a > b ? 1 : 0);
// const abs = (a: Money): Money => brand(Math.abs(a));

// /**
//  * The Money API. Exported as a value with the same name as the type — in TS a
//  * type and a value can share a name — so `Money` works in both positions:
//  *   const total: Money = Money.add(a, b);
//  */
// export const Money = {
//   zero: brand(0),
//   fromMinorUnits,
//   fromDecimalString,
//   toDecimalString,
//   add,
//   subtract,
//   negate,
//   sum,
//   isZero,
//   isNegative,
//   equals,
//   compare,
//   abs,
// } as const;