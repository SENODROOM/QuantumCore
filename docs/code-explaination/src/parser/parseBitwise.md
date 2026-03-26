# `parseBitwise` Function

## Overview

The `parseBitwise` function is an integral part of the parser within the Quantum Language compiler, designed to interpret and construct Abstract Syntax Trees (ASTs) for bitwise operations such as `&` (bitwise AND), `|` (bitwise OR), and `^` (bitwise XOR). This function operates recursively, starting with the parsing of equality expressions through a call to `parseEquality`. It then enters a loop that checks for subsequent bitwise operators in the input stream, consuming each operator and its corresponding operands until no more bitwise operators are found.

### Why It Works This Way

This design allows the `parseBitwise` function to handle multiple levels of precedence for bitwise operations, ensuring that they are evaluated correctly according to the rules of arithmetic. By repeatedly calling `parseEquality` and constructing binary expression nodes, the function can build complex expressions involving both bitwise and equality operations seamlessly.

## Parameters/Return Value

- **Parameters**: None explicitly declared; it utilizes global state managed by the parser, including the current token and methods like `consume()` and `check()`.
  
- **Return Value**:
  - Returns a unique pointer to an `ASTNode` representing the parsed bitwise expression or the initial equality expression if no bitwise operators are encountered.

## Edge Cases

1. **No Bitwise Operators**: If the input stream contains only equality expressions without any bitwise operators, the function will simply return the result of `parseEquality`.

2. **Nested Expressions**: The function handles nested expressions correctly by recursively calling itself to parse inner expressions before combining them with outer bitwise operators.

3. **Invalid Tokens**: If invalid tokens are encountered during the parsing process, the function should gracefully handle these errors, likely throwing exceptions or returning error states.

4. **End of Input Stream**: The function must be able to detect when the end of the input stream has been reached, preventing infinite loops or accessing out-of-bounds data.

## Interactions With Other Components

- **`parseEquality` Function**: This function is called at the beginning of `parseBitwise` to start parsing the equality expressions. The results of these parses are used as operands for the bitwise operations.

- **Token Consumption**: The `consume()` method is used to advance the parser's position in the input stream after identifying a token. This ensures that the correct tokens are processed and combined into the AST.

- **Error Handling**: The function interacts with error handling mechanisms within the parser, which may include logging errors, reporting syntax issues, or halting the compilation process if necessary.

- **AST Construction**: The `std::make_unique<ASTNode>` method is used to create new nodes in the AST, encapsulating the parsed bitwise expressions. These nodes are then linked together based on their precedence and the order in which they appear in the input.

## Detailed Explanation

Here’s a step-by-step breakdown of how the `parseBitwise` function processes the input:

1. **Initial Call to `parseEquality`**:
   ```cpp
   auto left = parseEquality();
   ```
   This line initiates the parsing of the first equality expression in the input stream. The result is stored in the `left` variable, which represents the left-hand side of the bitwise operation.

2. **Loop to Handle Bitwise Operations**:
   ```cpp
   while (check(TokenType::BIT_AND) || check(TokenType::BIT_OR) || check(TokenType::BIT_XOR)) {
       int ln = current().line;
       auto op = consume().value;
       auto right = parseEquality();
       left = std::make_unique<ASTNode>(BinaryExpr{op, std::move(left), std::move(right)}, ln);
   }
   ```
   - The loop continues as long as the next token is one of the bitwise operators (`TokenType::BIT_AND`, `TokenType::BIT_OR`, or `TokenType::BIT_XOR`).
   - Inside the loop, the current line number (`ln`) is recorded using `current().line`.
   - The next token is consumed using `consume()`, and its value (`op`) is extracted, representing the bitwise operator being used.
   - Another call to `parseEquality()` is made to parse the next equality expression, storing the result in `right`.
   - A new `ASTNode` is constructed using `std::make_unique<ASTNode>`, containing a `BinaryExpr` object that holds the operator and the two operands (`left` and `right`). The line number is also passed to ensure accurate error reporting.
   - The newly created node becomes the new `left` operand for the next iteration of the loop, allowing for the chaining of bitwise operations.

3. **Return Statement**:
   ```cpp
   return left;
   ```
   After exiting the loop, the function returns the final `ASTNode` representing the entire bitwise expression tree.

By following this structure, the `parseBitwise` function ensures that all bitwise operations in the input are correctly parsed and integrated into the AST, maintaining the integrity and correctness of the quantum program being compiled.