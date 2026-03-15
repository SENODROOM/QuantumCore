# parseCoutStmt

The `parseCoutStmt` function in the Quantum Language compiler is responsible for parsing statements that involve output operations using the `cout` object. This function specifically handles the syntax of `cout` statements where multiple expressions can be concatenated and separated by `<<` operators, followed optionally by an `endl` to trigger a newline.

## What It Does

The primary task of `parseCoutStmt` is to construct an Abstract Syntax Tree (AST) node representing a print statement. The AST node contains a list of arguments to be printed and a boolean flag indicating whether a newline should be inserted after printing.

## Why It Works This Way

The function avoids calling `parseExpr()` directly due to the potential for `parseShift()` within it to greedily consume the `<<` operator as a bitwise shift operator instead of recognizing it as the stream insertion operator used in `cout`. By calling `parseAddSub()` instead, which operates at a lower precedence than `parseShift()`, the function ensures that each `<<` remains available as the intended stream insertion separator.

Additionally, the function checks for the presence of `"endl"` as a special case. When encountered, it sets the `newline` flag to `true` without adding any expression to the argument list. This allows the parser to correctly handle `endl` as a directive to insert a newline character rather than a regular expression.

## Parameters/Return Value

- **Parameters**: None explicitly defined in the provided code snippet.
  
- **Return Value**:
  - Returns a unique pointer to an `ASTNode` containing a `PrintStmt`.
  - The `PrintStmt` has two members:
    - A vector of `ASTNodePtr` representing the arguments to be printed.
    - A boolean flag indicating whether a newline should be inserted after printing.

## Edge Cases

1. **No Expressions**: If there are no expressions following `cout`, the function will return an empty `args` vector and `newline` set to `false`.

2. **Single Expression**: If only one expression follows `cout`, it will be added to the `args` vector, and `newline` will remain `false` unless `"endl"` is encountered.

3. **Multiple Expressions**: Multiple expressions can be chained together using `<<`. Each expression is parsed separately and added to the `args` vector.

4. **String Literal Ending with `\n`**: If a string literal ends with `\n`, it is treated as a newline directive and not included in the `args` vector. The `newline` flag is set to `true`.

5. **Bare `\n` String Literal**: A bare string literal consisting solely of `\n` is treated as an `endl` directive, setting the `newline` flag to `true` without including it in the `args` vector.

6. **Trailing Newline or Semicolon**: Any trailing newlines or semicolons after the print statement are consumed to ensure proper parsing.

## Interactions With Other Components

- **Tokenizer**: The function relies on the tokenizer to provide tokens such as `TokenType::LSHIFT`, `TokenType::IDENTIFIER`, and others. The tokenizer's state is managed through calls like `current()` and `consume()`.

- **Precedence Parsing**: By calling `parseAddSub()` instead of `parseExpr()`, the function leverages the precedence parsing mechanism to handle different types of expressions correctly. This interaction is crucial for maintaining the correct order of operations in complex `cout` statements.

- **Error Handling**: While not shown in the snippet, the function likely includes error handling mechanisms to manage unexpected token sequences or invalid expressions.

Overall, `parseCoutStmt` plays a vital role in accurately parsing and constructing AST nodes for `cout` statements, ensuring that the semantics of these statements are preserved during compilation.