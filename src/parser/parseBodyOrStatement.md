# `parseBodyOrStatement`

## Purpose

The `parseBodyOrStatement` function is designed to handle the parsing of either a statement or a body in the context of the Quantum Language compiler. It determines whether the next token indicates the start of a statement or a block and processes accordingly.

## Parameters

- None

## Return Value

- Returns a unique pointer to an `ASTNode` object representing the parsed statement or block.
  - If the next token is a semicolon (`;`), it returns an empty `BlockStmt`.
  - If the next token is an opening brace (`{`) or indentation, it calls `parseBlock()` and returns its result.
  - Otherwise, it parses a single statement using `parseStatement()` and wraps it in a `BlockStmt`.

## Edge Cases

1. **Empty Body**: The function handles empty bodies indicated by a semicolon (`;`). In such cases, it returns an empty `BlockStmt`, which represents a null statement.
2. **Single Statement**: When there is no block or semicolon following a statement, the function parses the single statement and wraps it in a `BlockStmt`. This ensures that all statements are treated uniformly as blocks within the AST.
3. **Nested Blocks**: The function correctly identifies nested blocks by checking for `{` or indentation after a statement. This allows for the proper construction of nested structures in the AST.

## Interactions with Other Components

- **Tokenizer**: The function uses the tokenizer to fetch the current token (`current()`) and check subsequent tokens (`check()`).
- **Block Parser**: When encountering an opening brace (`{`) or indentation, the function delegates parsing to `parseBlock()`, which further breaks down the block into individual statements.
- **Statement Parser**: For any other token, the function invokes `parseStatement()` to handle the parsing of individual statements.

This interaction ensures that the parser can handle various constructs in the Quantum Language, including simple statements, empty bodies, and complex nested blocks, effectively constructing the Abstract Syntax Tree (AST).