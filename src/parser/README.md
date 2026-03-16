# Parser Component of the Quantum Language Compiler

The `parser` component is a critical part of the Quantum Language compiler, responsible for converting source code into an abstract syntax tree (AST). This component performs syntactic analysis on the quantum programming language, ensuring that the input code adheres to the language's rules and structure.

## Overview

The parser component consists of several functions and classes designed to handle different aspects of quantum code parsing:

- **check**: Validates the current token against expected tokens.
- **match**: Consumes a specific token from the input stream.
- **atEnd**: Checks if the end of the input has been reached.
- **skipNewlines**: Skips over any newline characters in the input.
- **parse**: Main function to initiate parsing of the entire source file.
- **parseBodyOrStatement**: Parses either a block of statements or a single statement.
- **parseVarDecl**: Parses variable declarations.
- **parseIfStmt**: Parses conditional statements (`if`, `else`).
- **parseWhileStmt**: Parses loop statements (`while`).
- **parseReturnStmt**: Parses return statements.
- **parsePrintStmt**: Parses print statements.
- **parseInputStmt**: Parses input statements.
- **parseCoutStmt**: Parses output to console statements.
- **parseCinStmt**: Parses input from console statements.
- **parseImportStmt**: Parses import statements.
- **parseExprStmt**: Parses expression statements.
- **parseExpr**: Parses expressions.
- **parseAssignment**: Parses assignment operations.
- **parseOr**: Parses logical OR operations.
- **parseAnd**: Parses logical AND operations.
- **parseBitwise**: Parses bitwise operations.
- **parseEquality**: Parses equality comparisons.
- **parseComparison**: Parses relational comparisons.
- **parseShift**: Parses shift operations.
- **parseAddSub**: Parses addition and subtraction operations.
- **parseMulDiv**: Parses multiplication and division operations.
- **parsePower**: Parses exponentiation operations.
- **parseUnary**: Parses unary operations.
- **parseArrayLiteral**: Parses array literals.
- **parseDictLiteral**: Parses dictionary literals.
- **parseLambda**: Parses lambda functions.
- **parseArrowFunction**: Parses arrow functions.
- **parseArgList**: Parses argument lists.
- **parseParamList**: Parses parameter lists.
- **isCTypeKeyword**: Checks if the current token is a keyword related to C types.
- **parseCTypeVarDecl**: Parses variable declarations using C type keywords.

## File Structure

The files within this directory are organized as follows:

- `parser.cpp`: Contains the implementation of the parser functions.
- `parser.h`: Defines the interface for the parser functions.
- `token.cpp`: Contains the implementation of token-related functions.
- `token.h`: Defines the interface for token-related functions.
- `ast.cpp`: Contains the implementation of AST node creation and manipulation.
- `ast.h`: Defines the interface for AST node creation and manipulation.

## Overall Flow

1. **Initialization**: The parser initializes with the source code and sets up the necessary data structures to track the current position and state during parsing.
2. **Lexical Analysis**: Tokens are generated from the source code using a lexer.
3. **Syntactic Analysis**:
   - The main `parse` function starts the process by calling `parseBodyOrStatement`.
   - `parseBodyOrStatement` determines whether to parse a block of statements or a single statement.
   - Depending on the parsed element, it calls appropriate helper functions like `parseVarDecl`, `parseIfStmt`, etc., to handle more complex constructs.
4. **Building AST**: As elements are parsed, they are transformed into corresponding AST nodes.
5. **Error Handling**: If a syntax error is encountered, the parser reports an error and attempts to recover gracefully.
6. **Finalization**: Once all elements have been parsed, the final AST is returned, ready for semantic analysis and code generation.

## Usage

To use the parser component, include the necessary header files and call the `parse` function with the source code as input. The resulting AST can then be used by other parts of the compiler for further processing.

```cpp
#include "parser.h"
#include "lexer.h"

int main() {
    std::string sourceCode = "qubit q; measure q;";
    Lexer lexer(sourceCode);
    Parser parser(lexer);
    ASTNode* ast = parser.parse();
    // Further processing of the AST
    return 0;
}
```

For detailed information on individual functions and their usage, refer to the respective `.h` files in this directory.