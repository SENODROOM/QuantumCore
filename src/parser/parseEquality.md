# `parseEquality` Function

The `parseEquality` function in the Quantum Language compiler is responsible for parsing equality and inequality expressions. It builds an Abstract Syntax Tree (AST) node representing these operations.

## What it Does

This function parses expressions that involve equality (`==`) or inequality (`!=`). If the parser encounters strict equality (`===`) or strict inequality (`!==`), it treats them as their non-strict counterparts (`==` and `!=`, respectively). The function constructs a binary expression AST node to represent the parsed operation.

## Why it Works This Way

The function operates under the assumption that Quantum Language is dynamically typed, which means type checking occurs at runtime rather than compile time. Therefore, it simplifies the handling of equality and inequality operators by treating strict versions as non-strict ones. This approach allows the compiler to focus on syntax and structure without prematurely enforcing type constraints.

## Parameters/Return Value

### Parameters
- None

### Return Value
- A unique pointer to an `ASTNode` representing the parsed equality or inequality expression.

## Edge Cases

1. **No Equality or Inequality Operators**: If the input expression does not contain any equality or inequality operators, the function returns the result of `parseComparison()`.
2. **Nested Expressions**: The function can handle nested equality or inequality expressions, constructing the appropriate AST nodes based on the operator precedence and associativity rules.
3. **Strict vs Non-Strict Operators**: When encountering strict equality (`===`) or strict inequality (`!==`), the function converts them to non-strict operators (`==` and `!=`, respectively) before building the AST node.

## Interactions with Other Components

- **`parseComparison()`**: This function is called within `parseEquality()` to parse the left-hand side of the equality or inequality expression. The result of `parseComparison()` is used as the left operand for the binary expression.
- **Token Consumption**: The function consumes tokens using the `consume()` method. It checks for equality or inequality operators using the `check()` method and then processes them accordingly.
- **Error Handling**: Although not explicitly shown in the provided code snippet, the function should include error handling mechanisms to manage unexpected token types or incorrect syntax during parsing.

By following this approach, the `parseEquality` function ensures that the Quantum Language compiler can accurately parse and construct AST nodes for equality and inequality expressions, even when dealing with dynamic typing scenarios.