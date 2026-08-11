import {
  type Account,
  type AccountId,
  assertNever,
  normalBalance,
} from './accounts';
import { Money } from './money';
import { type PostedEntry } from './journal';

/**
 * The ledger's source of truth is just two things: the chart of accounts and the
 * list of posted (already-balanced) entries. Crucially, account balances are NOT
 * stored — they are always *derived* from the entries on demand (see `balanceOf`
 * / `trialBalance`). That mirrors React's derived-state model: keep a minimal
 * source of truth, compute everything else.
 */
export interface LedgerState {
  readonly accounts: ReadonlyMap<AccountId, Account>;
  readonly entries: readonly PostedEntry[];
}

export const emptyLedger = (): LedgerState => ({
  accounts: new Map(),
  entries: [],
});

/**
 * Actions are shaped for React's useReducer, but the reducer itself is a plain
 * pure function `(state, action) => state` with no React dependency — useReducer
 * is just one possible consumer.
 *
 * `record-entry` accepts only a PostedEntry, so the reducer can trust that what
 * it records already balances. Checking that referenced accounts exist is a
 * separate guard (`entryReferencesUnknownAccount`) meant to run before dispatch.
 */
export type LedgerAction =
  | { readonly type: 'add-account'; readonly account: Account }
  | { readonly type: 'record-entry'; readonly entry: PostedEntry };

export const ledgerReducer = (
  state: LedgerState,
  action: LedgerAction,
): LedgerState => {
  switch (action.type) {
    case 'add-account': {
      const accounts = new Map(state.accounts);
      accounts.set(action.account.id, action.account);
      return { ...state, accounts };
    }
    case 'record-entry':
      return { ...state, entries: [...state.entries, action.entry] };
    default:
      return assertNever(action);
  }
};

/**
 * The balance of an account, expressed in its normal-balance direction as a
 * positive number when the account carries a normal balance. Computed by walking
 * every posting on that account: a posting on the account's normal side adds,
 * one on the opposite side subtracts.
 *
 * Example: Cash is an asset (normal balance: debit). A $100 debit gives +100; a
 * later $30 credit gives −30; balanceOf returns 70 (a $70 debit balance).
 */
export const balanceOf = (state: LedgerState, accountId: AccountId): Money => {
  const account = state.accounts.get(accountId);
  if (account === undefined) {
    // Unknown account -> no balance. (Referencing unknown accounts should be
    // prevented before recording; see entryReferencesUnknownAccount.)
    return Money.zero;
  }
  const normal = normalBalance(account.type);
  let balance = Money.zero;
  for (const entry of state.entries) {
    for (const posting of entry.postings) {
      if (posting.accountId !== accountId) continue;
      balance =
        posting.side === normal
          ? Money.add(balance, posting.amount)
          : Money.subtract(balance, posting.amount);
    }
  }
  return balance;
};

export interface TrialBalanceRow {
  readonly account: Account;
  readonly debit: Money; // exactly one of debit/credit is non-zero
  readonly credit: Money;
}

export interface TrialBalance {
  readonly rows: readonly TrialBalanceRow[];
  readonly totalDebits: Money;
  readonly totalCredits: Money;
  /** True when totalDebits === totalCredits — i.e. the books balance. */
  readonly balanced: boolean;
}

/**
 * List every account's balance in the correct column and total the columns.
 * Because every recorded entry has equal debits and credits, the two column
 * totals must be equal — `balanced` is a running proof that the books are
 * internally consistent.
 */
export const trialBalance = (state: LedgerState): TrialBalance => {
  const rows: TrialBalanceRow[] = [];
  let totalDebits = Money.zero;
  let totalCredits = Money.zero;

  for (const account of state.accounts.values()) {
    const balance = balanceOf(state, account.id);
    const normal = normalBalance(account.type);
    const magnitude = Money.abs(balance);
    const onNormalSide = !Money.isNegative(balance);

    // A balance on its normal side goes in that column; a contra-normal
    // (negative) balance flips to the opposite column as a positive amount.
    let debit = Money.zero;
    let credit = Money.zero;
    if (normal === 'debit') {
      if (onNormalSide) debit = magnitude;
      else credit = magnitude;
    } else {
      if (onNormalSide) credit = magnitude;
      else debit = magnitude;
    }

    if (!Money.isZero(magnitude)) {
      rows.push({ account, debit, credit });
    }
    totalDebits = Money.add(totalDebits, debit);
    totalCredits = Money.add(totalCredits, credit);
  }

  return {
    rows,
    totalDebits,
    totalCredits,
    balanced: Money.equals(totalDebits, totalCredits),
  };
};

/**
 * Guard to run before dispatching `record-entry`: returns the first accountId in
 * the entry that isn't in the chart, or null if every referenced account exists.
 */
export const entryReferencesUnknownAccount = (
  state: LedgerState,
  entry: PostedEntry,
): AccountId | null => {
  for (const posting of entry.postings) {
    if (!state.accounts.has(posting.accountId)) {
      return posting.accountId;
    }
  }
  return null;
};