// /**
//  * The five fundamental account types and their "normal balance" — the side
//  * (debit or credit) on which a positive balance for that account naturally sits.
//  *
//  * This is the bedrock rule of double-entry bookkeeping:
//  *   - Assets and Expenses increase with debits          -> normal balance: debit
//  *   - Liabilities, Equity, and Revenue increase with credits -> normal balance: credit
//  *
//  * Everything downstream — balances, the trial balance, the statements — is
//  * derived from this single mapping, so it lives in exactly one place.
//  */

// export type AccountType =
//   | 'asset'
//   | 'liability'
//   | 'equity'
//   | 'revenue'
//   | 'expense';

// export type NormalBalance = 'debit' | 'credit';

// /** Plain string alias, kept unbranded so the chart can use literal ids ergonomically. */
// export type AccountId = string;

// export interface Account {
//   readonly id: AccountId;
//   readonly name: string;
//   readonly type: AccountType;
// }

// /**
//  * Exhaustiveness helper. If a new AccountType is ever added and a switch below
//  * forgets to handle it, `assertNever` turns that into a *compile* error (the
//  * argument would no longer be `never`), not a runtime surprise.
//  */
// export const assertNever = (value: never): never => {
//   throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
// };

// export const normalBalance = (type: AccountType): NormalBalance => {
//   switch (type) {
//     case 'asset':
//     case 'expense':
//       return 'debit';
//     case 'liability':
//     case 'equity':
//     case 'revenue':
//       return 'credit';
//     default:
//       return assertNever(type);
//   }
// };
