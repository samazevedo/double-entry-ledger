/**
 * Public API of the ledger core. React components import from here:
 *
 *   import { Money, postEntry, ledgerReducer, trialBalance } from '@/core';
 *
 * Nothing in this folder imports React or touches the DOM — it's the
 * framework-agnostic domain, and this barrel is its single entry point.
 */
export * from './result';
export * from './money';
export * from './accounts';
export * from './ledger';
export * from './Journal';
export * from './Statements';