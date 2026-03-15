# `parseReturnStmt`

## Purpose

The `parseReturnStmt` function is responsible for parsing a return statement in the source code of the Quantum Language. It constructs an abstract syntax tree (AST) node representing the return statement and its associated expression(s).

## Parameters

- None explicitly declared in the function signature.

## Return Value

- An `ASTNodePtr`, which is a unique pointer to an `ASTNode`. This node represents the parsed return statement.

## How It Works

1. **Initialization**: The function starts by retrieving the current line number (`ln`) using the `current()` method, which presumably returns a token containing information about the current position in the input stream.

2. **Expression Parsing**:
   - If the next token is not a newline, semicolon, or end of file, the function attempts to parse an expression using `parseExpr()`.
   - If the parsed expression is followed by a comma, indicating a tuple return, the function enters a loop to handle multiple expressions separated by commas.
   - Inside the loop, it creates a `TupleLiteral` object and adds the initially parsed expression to its elements.
   - The loop continues to parse additional expressions until a comma is encountered that is not immediately followed by a newline, semicolon, or end of file.

3. **Post-Processing**:
   - After parsing the main expression or the tuple of expressions, the function consumes any trailing newlines or semicolons using a while loop with `consume()`.

4. **Return Statement Construction**:
   - Finally, the function constructs a `ReturnStmt` object, passing the parsed expression or tuple as an argument.
   - An `ASTNode` is created with this `ReturnStmt` and the original line number (`ln`).
   - The unique pointer to this `ASTNode` is returned.

## Edge Cases

- **Empty Return Statement**: If the return statement does not contain any expression (i.e., it only has a `return` keyword followed by a newline or semicolon), the function will return a `ReturnStmt` with a null expression.
- **Single Expression**: If the return statement contains a single expression, the function will simply return a `ReturnStmt` with that expression.
- **Tuple Expression**: If the return statement contains multiple expressions separated by commas, the function will construct a `TupleLiteral` and return a `ReturnStmt` with this tuple.

## Interactions with Other Components

- **Tokenizer**: The function relies on the tokenizer to provide tokens for parsing. Tokens are used to determine whether an expression should be parsed or whether the return statement is complete.
- **Error Handling**: While not explicitly shown in the provided code snippet, the tokenizer and parser typically include error handling mechanisms to manage unexpected tokens or malformed statements.
- **Abstract Syntax Tree (AST)**: The function constructs nodes for the AST, which represent different parts of the parsed code structure. These nodes are then used by subsequent stages of compilation for further processing.

This function is crucial for correctly interpreting and constructing return statements in the Quantum Language's syntax, ensuring that the resulting AST accurately reflects the program's structure and logic.