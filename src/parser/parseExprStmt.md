# `parseExprStmt`

## Overview

`parseExprStmt` is an essential method within the Quantum Language compiler's parser, tasked with interpreting expressions that serve as standalone statements. These expressions can be as straightforward as `x = 5`, or they may involve intricate constructs such as multiple operations separated by commas.

## Functionality

The primary role of `parseExprStmt` is to parse an expression and convert it into an ASTNode representing an expression statement. If the parsed expression is followed by a comma, indicating a sequence of expressions, it will continue to parse subsequent expressions until encountering a newline, semicolon, or reaching the end of the input.

### Detailed Steps

1. **Initialization**: The method starts by capturing the current line number (`ln`) using `current().line`.
2. **Parsing Expression**: It then invokes `parseExpr()` to extract the initial expression from the token stream.
3. **Handling Comma Expressions**:
   - If a comma token is detected (`check(TokenType::COMMA)`), it indicates the presence of a comma-separated list of expressions.
   - A `BlockStmt` is initialized to hold these expressions as individual statements.
   - The first expression is wrapped in an `ExprStmt` and added to the `statements` vector of the `BlockStmt`.
   - The method enters a loop where it continues to parse additional expressions following commas.
   - For each subsequent expression, it captures the line number (`eln`), parses the expression, wraps it in an `ExprStmt`, and adds it to the `BlockStmt`.
   - The loop breaks when it encounters a newline, semicolon, or reaches the end of the input.
4. **Consuming Newlines/Semicolons**: After processing any trailing commas, the method consumes all consecutive newlines and semicolons using `consume()`. This ensures that the parser moves past any extraneous whitespace or syntax elements.
5. **Returning Result**: Finally, the method returns a unique pointer to an `ASTNode` containing either a single `ExprStmt` or a `BlockStmt` depending on whether commas were present.

## Parameters/Return Value

- **Parameters**:
  - None explicitly defined in the provided code snippet; however, it relies on global state managed by the parser, such as the current token and the ability to advance through the token stream.
  
- **Return Value**:
  - Returns a `unique_ptr<ASTNode>` representing the parsed expression statement(s). If a comma was encountered, it returns a `BlockStmt`; otherwise, it returns a `single ExprStmt`.

## Edge Cases

- **Single Expression**: When only one expression is present, the method returns a `unique_ptr<ASTNode>` containing a single `ExprStmt`.
- **Empty Input**: If the input is empty or reaches its end before parsing any expression, the method handles gracefully without crashing.
- **Trailing Commas**: Multiple consecutive commas after an expression are handled correctly, consuming them until a newline, semicolon, or end of input is reached.

## Interactions with Other Components

- **Tokenizer**: `parseExprStmt` relies on the tokenizer to provide tokens for parsing.
- **Error Handling**: Although not shown in the snippet, the parser likely has error handling mechanisms in place to manage unexpected tokens or malformed expressions.
- **Scope Management**: While not directly evident from the snippet, the parser might interact with scope management to ensure that variables declared or modified within expressions are properly recognized and scoped.

This comprehensive approach allows `parseExprStmt` to handle both simple and complex expression statements effectively, contributing to the robustness of the Quantum Language compiler's parsing capabilities.