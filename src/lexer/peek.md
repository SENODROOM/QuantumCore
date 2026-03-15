# peek() Function - Lookahead Character Access

## Overview
The `peek()` function in the Quantum Language compiler allows for non-destructive lookahead into the source code string. It enables the lexer to inspect characters ahead of its current position without altering the lexer's state. This functionality is crucial for accurately identifying and parsing multi-character tokens, such as keywords or operators.

## Parameters
- **pos**: The current position within the source code string.
- **offset**: The number of characters to look ahead from the current position.

## Return Value
- Returns the character at the specified lookahead position (`pos + offset`).
- If the lookahead position exceeds the bounds of the source code string, returns the null terminator (`'\0'`).

## Edge Cases
- When `offset` is zero, `peek()` simply returns the character at the current position (`src[pos]`), effectively making it a read operation without advancement.
- If `pos + offset` equals or exceeds the size of the source code string (`src.size()`), `peek()` returns the null terminator (`'\0'`). This prevents out-of-bounds access and ensures that the lexer can safely handle end-of-file scenarios.

## Interactions with Other Components
- **Lexer Class**: The `peek()` function is typically used internally within the Lexer class to implement token recognition logic. By examining characters ahead of the current position, the lexer can determine whether a sequence of characters forms a valid token.
- **Tokenization Process**: During the tokenization process, the lexer uses `peek()` to check for potential multi-character tokens. For example, when encountering an identifier, it might use `peek()` to see if the next characters form a reserved keyword like "if" or "else".
- **Error Handling**: In some cases, `peek()` might be used to detect unexpected characters or patterns, which could indicate syntax errors. Returning the null terminator helps in gracefully handling these situations without causing runtime exceptions.

Overall, the `peek()` function serves as a fundamental utility for the lexer, enabling accurate and efficient tokenization of the source code while maintaining control over the lexer’s state.