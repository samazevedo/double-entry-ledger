// import { type Account, type AccountType } from './accounts';
// import { Money } from './money';
// import { balanceOf, type LedgerState } from './ledger';

// export interface LineItem {
//   readonly account: Account;
//   readonly amount: Money;
// }

// /** All accounts of a given type, paired with their (normal-direction) balance. */
// const lineItemsOfType = (
//   state: LedgerState,
//   type: AccountType,
// ): readonly LineItem[] => {
//   const items: LineItem[] = [];
//   for (const account of state.accounts.values()) {
//     if (account.type !== type) continue;
//     items.push({ account, amount: balanceOf(state, account.id) });
//   }
//   return items;
// };

// const totalOf = (items: readonly LineItem[]): Money =>
//   Money.sum(items.map((item) => item.amount));

// // ---------------------------------------------------------------------------
// // Income statement
// // ---------------------------------------------------------------------------

// export interface IncomeStatement {
//   readonly revenues: readonly LineItem[];
//   readonly totalRevenue: Money;
//   readonly expenses: readonly LineItem[];
//   readonly totalExpenses: Money;
//   readonly netIncome: Money;
// }

// /**
//  * Net income = total revenue − total expenses over the period the current ledger
//  * represents. (This model uses cumulative balances; filtering entries by a date
//  * range to get a true "period" statement is a natural next extension.)
//  */
// export const incomeStatement = (state: LedgerState): IncomeStatement => {
//   const revenues = lineItemsOfType(state, 'revenue');
//   const expenses = lineItemsOfType(state, 'expense');
//   const totalRevenue = totalOf(revenues);
//   const totalExpenses = totalOf(expenses);
//   return {
//     revenues,
//     totalRevenue,
//     expenses,
//     totalExpenses,
//     netIncome: Money.subtract(totalRevenue, totalExpenses),
//   };
// };

// // ---------------------------------------------------------------------------
// // Balance sheet
// // ---------------------------------------------------------------------------

// export interface BalanceSheet {
//   readonly assets: readonly LineItem[];
//   readonly totalAssets: Money;
//   readonly liabilities: readonly LineItem[];
//   readonly totalLiabilities: Money;
//   readonly equity: readonly LineItem[];
//   /** Current-period net income, not yet closed into equity accounts. */
//   readonly netIncome: Money;
//   /** Recorded equity balances plus the unclosed net income. */
//   readonly totalEquity: Money;
//   /** True when totalAssets === totalLiabilities + totalEquity. */
//   readonly balanced: boolean;
// }

// /**
//  * Assets = Liabilities + Equity, the accounting equation.
//  *
//  * The subtlety: until closing entries move net income into retained earnings,
//  * revenue and expense balances aren't reflected in any equity account. So the
//  * balance sheet must fold the current-period net income into equity for the
//  * equation to hold — that's why totalEquity = recorded equity + netIncome.
//  */
// export const balanceSheet = (state: LedgerState): BalanceSheet => {
//   const assets = lineItemsOfType(state, 'asset');
//   const liabilities = lineItemsOfType(state, 'liability');
//   const equity = lineItemsOfType(state, 'equity');

//   const totalAssets = totalOf(assets);
//   const totalLiabilities = totalOf(liabilities);
//   const { netIncome } = incomeStatement(state);
//   const totalEquity = Money.add(totalOf(equity), netIncome);

//   return {
//     assets,
//     totalAssets,
//     liabilities,
//     totalLiabilities,
//     equity,
//     netIncome,
//     totalEquity,
//     balanced: Money.equals(
//       totalAssets,
//       Money.add(totalLiabilities, totalEquity),
//     ),
//   };
// };

// // ---------------------------------------------------------------------------
// // Cash flow statement  —  GUIDED SKELETON (your part to implement)
// // ---------------------------------------------------------------------------

// /**
//  * This is intentionally unfinished — it's the pedagogical core of the project.
//  * The types and the reconciliation checksum are wired; the three section
//  * subtotals are yours to derive.
//  *
//  * The identity that must hold once you're done:
//  *
//  *     operating + investing + financing
//  *       === netChangeInCash
//  *       === endingCash − beginningCash
//  *
//  * `reconciles` compares those two ways of computing the change in cash, so the
//  * moment your three subtotals are correct it flips to true. With the placeholder
//  * zeros below it will read false as soon as any real cash movement exists — that
//  * false is your "not done yet" signal.
//  */
// export interface CashFlowStatement {
//   readonly operating: Money;
//   readonly investing: Money;
//   readonly financing: Money;
//   readonly netChangeInCash: Money;
//   readonly beginningCash: Money;
//   readonly endingCash: Money;
//   readonly reconciles: boolean;
// }

// /** Account ids you designate as "cash" (e.g. Cash, Bank). */
// export type CashAccounts = ReadonlySet<Account['id']>;

// export const cashFlowStatement = (
//   state: LedgerState,
//   cashAccounts: CashAccounts,
//   beginningCash: Money = Money.zero,
// ): CashFlowStatement => {
//   // Ending cash = the summed balances of the designated cash accounts right now.
//   let endingCash = Money.zero;
//   for (const id of cashAccounts) {
//     endingCash = Money.add(endingCash, balanceOf(state, id));
//   }

//   // TODO(you): classify each cash-affecting posting into one of three buckets
//   // and sum its cash effect.
//   //
//   //   operating — cash from the core business: cash paired with revenue,
//   //               expense, and working-capital (receivable/payable/inventory)
//   //               accounts.
//   //   investing — cash paired with buying or selling long-lived assets
//   //               (equipment, property, investments).
//   //   financing — cash paired with owners' capital, dividends/draws, and
//   //               borrowing or repaying debt.
//   //
//   // Direct-method hint: walk each entry; for every posting that hits a cash
//   // account, the *other* line(s) in that same entry tell you which bucket the
//   // movement belongs to. The signed cash effect is +amount for a debit to cash
//   // (cash in) and −amount for a credit to cash (cash out).
//   const operating = Money.zero; // TODO: replace with your derivation
//   const investing = Money.zero; // TODO: replace with your derivation
//   const financing = Money.zero; // TODO: replace with your derivation

//   const netChangeInCash = Money.sum([operating, investing, financing]);

//   return {
//     operating,
//     investing,
//     financing,
//     netChangeInCash,
//     beginningCash,
//     endingCash,
//     reconciles: Money.equals(
//       netChangeInCash,
//       Money.subtract(endingCash, beginningCash),
//     ),
//   };
// };