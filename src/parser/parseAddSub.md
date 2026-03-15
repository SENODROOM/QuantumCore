# parseAddSub

`parseAddSub` is a function within the Quantum Language compiler's `Parser.cpp` file that handles parsing expressions involving addition and subtraction operations. This function is crucial for constructing an Abstract Syntax Tree (AST) that represents the mathematical structure of the code being compiled.

## What It Does

The function parses an expression starting with a multiplication or division operation (handled by `parseMulDiv`) and then continues to parse any subsequent addition (`TokenType::PLUS`) or subtraction (`TokenType::MINUS`) operations. For each addition or subtraction operator encountered, it creates a new `BinaryExpr` node in the AST, combining the previously parsed expression (`left`) with the current expression (`right`). The process repeats until there are no more addition or subtraction operators left in the input stream.

## Why It Works This Way

This design allows for the recursive descent parsing technique used in the Quantum Language compiler. By breaking down the problem into smaller subproblems (multiplication/division first, followed by addition/subtraction), the function can handle complex expressions with multiple levels of precedence without getting overwhelmed. This approach ensures that the parser correctly interprets the order of operations according to standard arithmetic rules.

## Parameters/Return Value

- **Parameters**: None explicitly listed in the provided code snippet. However, it implicitly relies on global state managed by the parser, such as the current token (`current()`) and the ability to consume tokens (`consume()`).
  
- **Return Value**: The function returns a unique pointer to an `ASTNode` representing the parsed expression. This node could be a simple number literal or a complex binary expression tree depending on the input.

## Edge Cases

1. **Empty Input Stream**: If the input stream is empty when `parseAddSub` is called, it will simply return the result of `parseMulDiv`, which might be a number literal if the input starts with one.
   
2. **No Addition/Subtraction Operators**: If the input stream contains only multiplication or division operations and no addition or subtraction operators, the function will return the result of `parseMulDiv`.

3. **Mixed Precedence Operations**: Although the function itself doesn't handle mixed precedence operations directly, it assumes that `parseMulDiv` correctly parses these based on its own precedence rules.

4. **Invalid Tokens**: If invalid tokens are encountered during parsing, the function may throw exceptions or produce incorrect results, depending on how the error handling is implemented elsewhere in the compiler.

## Interactions With Other Components

- **parseMulDiv Function**: `parseAddSub` calls `parseMulDiv` initially to get the leftmost part of the expression. `parseMulDiv` is responsible for parsing multiplication and division operations, ensuring they are handled before addition and subtraction.

- **Token Management**: The function uses methods like `current()` and `consume()` to manage the flow of tokens through the input stream. These methods are likely defined in a separate class or module that handles tokenization and lexing.

- **Error Handling**: While not shown in the snippet, `parseAddSub` would interact with error handling mechanisms to deal with unexpected tokens or syntax errors.

- **AST Construction**: The function constructs an AST using `std::make_unique<ASTNode>` and `BinaryExpr`. This AST is used for further semantic analysis and code generation phases of the compilation process.

Overall, `parseAddSub` is a fundamental component of the Quantum Language compiler's parser, playing a critical role in accurately interpreting and constructing the AST for arithmetic expressions.