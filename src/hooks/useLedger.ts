// import {useCallback, useReducer} from 'react';
// import {
//     emptyLedger,
//     ledgerReducer,
//     postEntry,
//     type Account,
//     type JournalEntry,
//     type LedgerState,
//     type PostedEntry,
//     type PostEntryError,
//     type Result,
// } from '../core';
// /**
//  * This hook is the *bridge* between React and the framework-agnostic core. It's
//  * the one place that imports both React and the domain, so the core stays clean.
//  *
//  * A small starter chart of accounts so the app has something to work with on
//  * first load — swap these for whatever chart you want.
//  */
// const STARTER_ACCOUNTS: readonly Account[] =[
//     { id: 'cash', name:'Cash', type: 'asset'},
//     { id: 'accounts-receivable', name:'Accounts Receivable', type: 'asset'},
//     { id:'equipment', name:'Equipment', type: 'asset'},
//     { id: 'accounts-payable', name: 'Accounts Payable', type: 'liability' },
//     { id: 'owner-capital', name: "Owner's Capital", type: 'equity' },
//     { id: 'service-revenue', name: 'Service Revenue', type: 'revenue' },
//     { id: 'rent-expense', name: 'Rent Expense', type: 'expense' },
//     { id: 'wages-expense', name: 'Wages Expense', type: 'expense' },

// ];
// function createInitialLedger():LedgerState {
//     let state = emptyLedger();
//     for (const account of STARTER_ACCOUNTS) {
//         state = ledgerReducer(state, {type: 'add-account', account});
//     }
//     return state;
// }

// export interface UseLedger {
//     readonly state: LedgerState;
//     readonly addAccount: (account: Account) => void;

//  /**
//    * Validates the draft through the core's `postEntry` and, only if it balances,
//    * records it. Returns the Result so the caller can surface any error — the
//    * component never re-implements the double-entry rule, it just reports it.
//  */
//     readonly recordEntry:(
//         entry: JournalEntry,
//     )=> Result<PostedEntry,PostEntryError>;

// }
// export function useLedger(): UseLedger {
//     // Lazy initialization: the starter chart is only created once, on first render.
//     const [state, dispatch] = useReducer(
//         ledgerReducer,
//         undefined,
//         createInitialLedger,
//     );

//     const addAccount = useCallback((account: Account):void => {
//         dispatch({type:'add-account', account});

//     }, []);
//     const recordEntry = useCallback((
//         entry:JournalEntry):Result<PostedEntry, PostEntryError> => {
//             const result = postEntry(entry);
//             if (result.ok) {
//                 dispatch({type: 'record-entry', entry: result.value});
//             }
//             return result;

//         },
//         [],

//     );
//     return {state, addAccount, recordEntry};

// }
