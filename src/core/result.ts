/**
 * A tiny Result type for operations that can fail in *expected* ways.
 *
 * Instead of throwing, a fallible function returns `ok(value)` or `err(error)`,
 * which forces the caller to handle the failure at compile time. Same idea as
 * Rust's Result. It fits domain rules like "a journal entry must balance": an
 * unbalanced entry is a normal outcome to report, not an exceptional crash.
 */

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/** Narrowing helper: true (and narrows) when a Result is the success case. */
export const isOk = <T, E>(
  result: Result<T, E>,
): result is { readonly ok: true; readonly value: T } => result.ok;