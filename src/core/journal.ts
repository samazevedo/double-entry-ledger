// import { type AccountId } from './accounts';
// import { Money } from './money';
// import { type Result, ok, err } from './result';

// export type EntryId = string;

// /** One line of a journal entry: a debit or a credit to a single account. */
// export interface Posting {
//   readonly accountId: AccountId;
//   readonly side: 'debit' | 'credit';
//   /** Always a positive amount; `side` carries the direction. */
//   readonly amount: Money;
// }

// /** A draft entry as supplied by the caller, before validation. */
// export interface JournalEntry {
//   readonly id: EntryId;
//   readonly date: string; // ISO date, e.g. "2026-08-11"
//   readonly description: string;
//   readonly postings: readonly Posting[];
// }

// /**
//  * A PostedEntry is a JournalEntry that has passed `postEntry`: guaranteed
//  * non-empty, positive amounts only, and total debits === total credits.
//  *
//  * The `unique symbol` brand is a private key, so code outside this module can't
//  * construct a PostedEntry by hand — the only way to get one is through
//  * `postEntry`. The ledger accepts *only* PostedEntry values, so an unbalanced
//  * entry can never enter the books. The double-entry invariant is enforced by the
//  * type system, not merely checked at runtime.
//  */
// const postedBrand: unique symbol = Symbol('PostedEntry');

// export interface PostedEntry {
//   readonly [postedBrand]: true;
//   readonly id: EntryId;
//   readonly date: string;
//   readonly description: string;
//   readonly postings: readonly Posting[];
//   /** Equal to total debits and to total credits. */
//   readonly total: Money;
// }

// export type PostEntryError =
//   | { readonly kind: 'no-postings' }
//   | {
//       readonly kind: 'non-positive-amount';
//       readonly accountId: AccountId;
//       readonly amount: Money;
//     }
//   | {
//       readonly kind: 'unbalanced';
//       readonly debits: Money;
//       readonly credits: Money;
//     };

// /**
//  * Validate a draft entry and, if it balances, return a PostedEntry.
//  *
//  * The core rule: the sum of all debit lines must equal the sum of all credit
//  * lines. If it does, the entry is well-formed and may be recorded; otherwise we
//  * return a descriptive error rather than throwing.
//  */
// export const postEntry = (
//   entry: JournalEntry,
// ): Result<PostedEntry, PostEntryError> => {
//   if (entry.postings.length === 0) {
//     return err({ kind: 'no-postings' });
//   }

//   let debits = Money.zero;
//   let credits = Money.zero;

//   for (const posting of entry.postings) {
//     if (!(posting.amount > Money.zero)) {
//       return err({
//         kind: 'non-positive-amount',
//         accountId: posting.accountId,
//         amount: posting.amount,
//       });
//     }
//     if (posting.side === 'debit') {
//       debits = Money.add(debits, posting.amount);
//     } else {
//       credits = Money.add(credits, posting.amount);
//     }
//   }

//   if (!Money.equals(debits, credits)) {
//     return err({ kind: 'unbalanced', debits, credits });
//   }

//   const posted: PostedEntry = {
//     [postedBrand]: true,
//     id: entry.id,
//     date: entry.date,
//     description: entry.description,
//     postings: entry.postings,
//     total: debits,
//   };
//   return ok(posted);
// };
