# `parseWhileStmt`

## Purpose

The `parseWhileStmt` function is responsible for parsing a while loop statement in the Quantum Language compiler. It constructs an AST (Abstract Syntax Tree) node representing the parsed while loop and returns it.

## Functionality

1. **Retrieve Line Number**: The function starts by retrieving the line number of the current token using `current().line`.
2. **Parse Condition**: It then calls `parseExpr()` to parse the condition expression of the while loop. This expression determines whether the loop should continue executing.
3. **Match Optional Colon**: The function attempts to match an optional Python-style colon (`:`) after the condition expression using `match(TokenType::COLON)`. If the colon is not present, the function proceeds without error.
4. **Skip Newlines**: To ensure that the code within the while loop is correctly indented and recognized as part of the loop body, the function skips any newlines using `skipNewlines()`.
5. **Parse Body or Statement**: Finally, it parses the body of the while loop using `parseBodyOrStatement()`, which can either be a single statement or a block of statements enclosed in curly braces (`{}`). The result is stored in the variable `body`.

## Parameters/Return Value

- **Parameters**:
  - None explicitly stated in the provided code snippet, but implicitly relies on global state such as the current token position and input stream.

- **Return Value**:
  - Returns a `std::unique_ptr<ASTNode>` containing an instance of `WhileStmt`. The `WhileStmt` object holds two members:
    - `cond`: A `std::unique_ptr<Expression>` representing the condition expression of the while loop.
    - `body`: A `std::unique_ptr<StatementList>` representing the body of the while loop.
  - The line number (`ln`) is passed to the `WhileStmt` constructor to maintain context information about where the loop was defined in the source code.

## Edge Cases

- **Missing Colon**: If the Python-style colon (`:`) is missing after the condition expression, the function will still proceed, assuming the next tokens represent the loop body.
- **Empty Body**: An empty body (i.e., no statement following the colon) would result in a `StatementList` with zero elements. This is handled gracefully by `parseBodyOrStatement()`.
- **Syntax Errors**: If there is a syntax error during parsing (e.g., mismatched brackets, unexpected token types), the function will throw an exception indicating the error location and type.

## Interactions with Other Components

- **Tokenizer**: `current()` retrieves the current token from the tokenizer, which is used to determine the start of the while loop.
- **Expression Parser**: `parseExpr()` is called to parse the condition expression, utilizing the expression parser's capabilities to handle various arithmetic, logical, and relational expressions.
- **Statement List Parser**: `parseBodyOrStatement()` is invoked to parse the body of the while loop. Depending on the input, it may call `parseSingleStatement()` or `parseBlock()`, interacting with these functions to construct the appropriate AST nodes.
- **Error Handling**: Throughout the parsing process, the function checks for syntax errors and throws exceptions if necessary, ensuring robust error handling during compilation.

This function is crucial for accurately parsing while loops in the Quantum Language, allowing the compiler to generate correct intermediate representations and ultimately compile the program into executable quantum instructions.