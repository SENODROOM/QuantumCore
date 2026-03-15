# `parseBitwise` Function

## Overview

The `parseBitwise` function is part of the parser in the Quantum Language compiler and is responsible for parsing bitwise operations (`&`, `|`, `^`). It starts by calling another parsing function, `parseEquality`, to handle equality expressions. Then, it enters a loop that continues as long as the next token is one of the bitwise operators (`BIT_AND`, `BIT_OR`, or `BIT_XOR`). Inside the loop, it consumes the current token (the bitwise operator), calls `parseEquality` again to get the right-hand side expression, and constructs a new binary expression node using these elements. This process repeats until there are no more bitwise operators in the sequence. Finally, it returns the parsed expression.

## Parameters and Return Value

- **Parameters**: None explicitly defined within the function signature; it relies on global state managed by the parser.
- **Return Type**: `std::unique_ptr<ASTNode>` - A unique pointer to an abstract syntax tree (AST) node representing the parsed bitwise expression.

## Why It Works This Way

### Bitwise Operator Precedence

Bitwise AND (`&`), OR (`|`), and XOR (`^`) have lower precedence than comparison operators like equality (`==`, `!=`). By starting with `parseEquality` and then entering a loop to handle bitwise operators, the function ensures that comparisons are evaluated before bitwise operations, adhering to standard operator precedence rules.

### Loop Structure

The loop checks if the next token is a bitwise operator using `check`. If it is, the loop proceeds to consume the operator and recursively call `parseEquality` to get the operands. The result is wrapped in a new `BinaryExpr` node, which represents a binary operation in the AST. This structure allows the parser to build up complex expressions involving multiple bitwise operations.

## Edge Cases

1. **No Bitwise Operators**: If the input sequence does not contain any bitwise operators after the initial call to `parseEquality`, the function will simply return the result of `parseEquality`.
2. **Nested Expressions**: The function can handle nested bitwise expressions correctly due to its recursive nature. For example, the input `a & b | c ^ d` would be parsed as `(a & b) | (c ^ d)`.

## Interactions with Other Components

### Parser State Management

The function uses global state managed by the parser, such as `current()` to access the current token and `consume()` to advance to the next token. This interaction is crucial for navigating through the input tokens and constructing the AST.

### Abstract Syntax Tree Construction

`parseBitwise` constructs nodes of type `BinaryExpr` in the AST. These nodes represent binary operations and store the operator, the left operand, and the right operand. This construction facilitates further analysis and code generation phases of the compilation process.

### Error Handling

While not visible in the provided code snippet, error handling mechanisms are likely integrated into the parser's framework. These might include checking for unexpected tokens or malformed expressions and reporting appropriate errors.

In summary, the `parseBitwise` function efficiently parses sequences of bitwise operations by leveraging recursion and adherence to operator precedence rules, ensuring robust and accurate AST construction for subsequent processing stages.