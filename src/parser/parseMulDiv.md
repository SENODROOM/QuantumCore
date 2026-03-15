# `parseMulDiv` Function

## Purpose
The `parseMulDiv` function is designed to parse expressions involving multiplication (`*`), division (`/`), modulus (`%`), and floor division (`//`). It builds an Abstract Syntax Tree (AST) node representing these operations based on the input tokens provided by the parser.

## Parameters
- None explicitly defined in the function signature, but it relies on global state maintained by the parser:
  - `current()`: Returns the current token being processed.
  - `consume()`: Advances the parser to the next token and returns the previous one.
  - `check(TokenType type)`: Checks if the current token matches the specified token type without consuming it.

## Return Value
- The function returns a unique pointer to an `ASTNode`, which represents the parsed expression tree up to the point where no more multiplication or division operators are found.

## How It Works
1. **Initialization**:
   - The function starts by calling `parsePower()` to parse the left-hand side of the expression. This initial call sets the variable `left` to the result of parsing a power expression (which includes exponentiation).

2. **Loop Through Operators**:
   - The function enters a loop that continues as long as the current token is one of the following types: `TokenType::STAR` (multiplication), `TokenType::SLASH` (division), `TokenType::PERCENT` (modulus), or `TokenType::FLOOR_DIV` (floor division).
   
3. **Consume Operator Token**:
   - Inside the loop, the function consumes the current operator token using `consume()` and stores its value in the variable `op`.

4. **Parse Right Hand Side**:
   - The function then calls `parsePower()` again to parse the right-hand side of the expression after the operator.

5. **Construct AST Node**:
   - A new `ASTNode` is constructed with a `BinaryExpr` object containing the operator `op`, the previously parsed left-hand side expression (`std::move(left)`), and the newly parsed right-hand side expression (`std::move(right)`). The line number of the current token (`ln`) is also passed to the `ASTNode` constructor to maintain context.

6. **Update Left Variable**:
   - The `left` variable is updated to hold the newly constructed `ASTNode`. This allows the loop to continue with the newly formed left-hand side of the expression, effectively chaining multiple multiplicative/divisive operations together.

7. **Return Final AST Node**:
   - Once the loop exits (i.e., when there are no more multiplication or division operators), the final parsed expression tree is returned.

## Edge Cases
- **Empty Expression**: If the initial call to `parsePower()` results in an empty expression (e.g., due to unexpected end-of-file or syntax errors), the function will simply return this empty expression.
- **No Multiplicative/Division Operators**: If the input contains no multiplication or division operators, the function will return the result of the initial `parsePower()` call, which could be a single term or another binary operation.

## Interactions With Other Components
- **Tokenizer**: The function relies on the tokenizer to provide the sequence of tokens for parsing.
- **Error Handling**: While not shown in the snippet, the function likely interacts with error handling mechanisms to report syntax errors if unexpected tokens are encountered during parsing.
- **Expression Parsing**: The function uses `parsePower()` to handle the base case of the recursive descent parsing algorithm, which parses terms like numbers, variables, and parenthesized sub-expressions.

This function is crucial for handling arithmetic operations in the Quantum Language compiler, ensuring that they are correctly parsed and represented in the AST for further processing and code generation.