# `parseAnd`

## Purpose

The `parseAnd` function is part of the parser component in the Quantum Language compiler. Its primary purpose is to parse expressions involving the logical AND operator (`and`) and its shorthand form (`&&`). The function constructs an abstract syntax tree (AST) node representing the parsed expression.

## Parameters

- None explicitly stated in the provided code snippet.

## Return Value

- Returns a unique pointer to an `ASTNode` object representing the parsed logical AND expression.

## How It Works

1. **Initial Parsing**: The function starts by calling `parseBitwise()` to parse the left-hand side of the logical AND expression. This allows the function to handle any bitwise operations that might precede the logical AND.

2. **Loop for Multiple ANDs**: 
   - A loop is initiated to continue parsing additional `and` or `&&` operators and their corresponding right-hand sides.
   - Inside the loop, the function saves the current position (`savedPos`) to allow for backtracking if necessary.
   - It then skips any newlines using `skipNewlines()`.
   - The function checks if the next token is either `TokenType::AND` or `TokenType::AND_AND`. If not, it breaks out of the loop, indicating that there are no more `and` or `&&` operators to parse.

3. **Consuming Operator Token**:
   - If the next token is `TokenType::AND` or `TokenType::AND_AND`, the function consumes it using `consume()`.
   - Depending on the type of token consumed, it sets the operator string (`opStr`) to `"and"` or the actual value of the token.

4. **Parsing Right-Hand Side**:
   - After consuming the operator token, the function again skips any newlines using `skipNewlines()`.
   - It then calls `parseBitwise()` to parse the right-hand side of the logical AND expression.

5. **Constructing AST Node**:
   - An `ASTNode` object is created to represent the binary expression, containing the operator string (`opStr`), the left-hand side (`std::move(left)`), and the right-hand side (`std::move(right)`).
   - The line number (`ln`) associated with the current token is passed to the `ASTNode` constructor to maintain context in the AST.
   - The constructed `ASTNode` is assigned back to `left`, which will be used as the left-hand side for the next iteration of the loop.

6. **Backtracking**:
   - If the next token is neither `TokenType::AND` nor `TokenType::AND_AND`, the function restores the saved position (`pos = savedPos`) and breaks out of the loop, effectively ending the parsing of the logical AND expression.

7. **Return Statement**:
   - Finally, the function returns the unique pointer to the `ASTNode` representing the entire parsed logical AND expression.

## Edge Cases

- **No More ANDs**: If there are no more `and` or `&&` operators after the initial call to `parseBitwise()`, the function correctly handles this case by breaking out of the loop and returning the left-hand side.
- **Unexpected Tokens**: If a token other than `TokenType::AND` or `TokenType::AND_AND` is encountered during the loop, the function backtracks and continues parsing without constructing an invalid AST node.

## Interactions with Other Components

- **Tokenizer**: The `parseAnd` function relies on the tokenizer to provide the sequence of tokens for parsing. The tokenizer must have already processed the input source code into a series of tokens before `parseAnd` can begin.
- **Error Handling**: While not shown in the provided code snippet, the parser component likely includes error handling mechanisms that would be invoked if unexpected tokens or syntax errors are detected during the parsing process.
- **AST Construction**: The `parseAnd` function interacts closely with the AST construction logic. It uses the `ASTNode` class to create nodes representing the parsed logical AND expressions, which are then linked together to form the complete AST.

Overall, the `parseAnd` function plays a crucial role in parsing logical AND expressions within the Quantum Language compiler, ensuring that the resulting AST accurately reflects the structure and intent of the original source code.