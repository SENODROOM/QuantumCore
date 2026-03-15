# QuantumLanguage Compiler - Parser.h

## Overview

The `include/Parser.h` header file is a critical component of the QuantumLanguage compiler, responsible for converting sequences of lexical tokens into an Abstract Syntax Tree (AST). This process involves understanding the grammar rules of the language and constructing a hierarchical representation of the code structure that can be easily interpreted or executed.

This file plays a pivotal role in the compiler pipeline, acting as the bridge between the lexer and the semantic analyzer. It ensures that the syntax is correct before moving on to further stages of compilation.

### Key Design Decisions and Why

1. **Use of Pratt Parsing**: The parser employs Pratt parsing, a technique for handling operator precedence without recursion. This approach simplifies the implementation and avoids potential stack overflow issues that could arise with recursive descent parsers.

2. **Separation of Concerns**: The file is organized into distinct sections, including token helpers and parsing methods. This separation makes the code more modular, easier to understand, and maintain.

3. **Exception Handling**: Custom exceptions (`ParseError`) are defined to provide detailed error information, including the line and column where the error occurred. This helps in debugging and improving user experience.

4. **Flexibility in Parsing**: Functions like `parseBodyOrStatement()` allow for flexible parsing of blocks or individual statements, making it easier to handle different syntactic structures.

### Major Classes/Functions Overview

#### Class: `ParseError`

- **Inheritance**: Inherits from `std::runtime_error`.
- **Purpose**: Represents errors encountered during parsing, providing additional context about the location of the error.
- **Attributes**:
  - `int line`: Line number where the error occurred.
  - `int col`: Column number where the error occurred.
- **Methods**:
  - Constructor: Initializes the exception message along with line and column numbers.

#### Class: `Parser`

- **Constructor**: Accepts a vector of `Token`s representing the input source code.
- **Method: `parse()`**
  - **Purpose**: Parses the entire input sequence into an AST.
  - **Returns**: A pointer to the root node of the constructed AST.

- **Private Methods**:
  - **Token Accessors**:
    - `Token &current()`: Returns the current token being processed.
    - `Token &peek(int offset = 1)`: Returns the next token without advancing the position.
    - `Token &consume()`: Consumes the current token and advances the position.
    - `Token &expect(TokenType t, const std::string &msg)`: Ensures the current token matches the expected type; throws an error otherwise.
    - `bool check(TokenType t) const`: Checks if the current token matches the specified type.
    - `bool match(TokenType t)`: Matches the current token against the specified type and advances if successful.
    - `bool atEnd() const`: Determines if the end of the token stream has been reached.
    - `void skipNewlines()`: Skips over any newline characters in the token stream.

  - **Parsing Statements**:
    - `ASTNodePtr parseStatement()`
    - `ASTNodePtr parseBlock()`
    - `ASTNodePtr parseBodyOrStatement()`
    - `ASTNodePtr parseVarDecl(bool isConst)`
    - `ASTNodePtr parseFunctionDecl()`
    - `ASTNodePtr parseClassDecl()`
    - `ASTNodePtr parseIfStmt()`
    - `ASTNodePtr parseWhileStmt()`
    - `ASTNodePtr parseForStmt()`
    - `ASTNodePtr parseReturnStmt()`
    - `ASTNodePtr parsePrintStmt()`
    - `ASTNodePtr parseInputStmt()`
    - `ASTNodePtr parseCoutStmt()`
    - `ASTNodePtr parseCinStmt()`
    - `ASTNodePtr parseImportStmt(bool isFrom = false)`
    - `ASTNodePtr parseExprStmt()`

  - **Parsing Expressions**:
    - `ASTNodePtr parseExpr()`
    - `ASTNodePtr parseAssignment()`
    - `ASTNodePtr parseOr()`
    - `ASTNodePtr parseAnd()`
    - `ASTNodePtr parseBitwise()`
    - `ASTNodePtr parseEquality()`
    - `ASTNodePtr parseComparison()`
    - `ASTNodePtr parseShift()`
    - `ASTNodePtr parseAddSub()`
    - `ASTNodePtr parseMulDiv()`
    - `ASTNodePtr parsePower()`
    - `ASTNodePtr parseUnary()`
    - `ASTNodePtr parsePostfix()`
    - `ASTNodePtr parsePrimary()`

  - **Special Literals and Functions**:
    - `ASTNodePtr parseArrayLiteral()`
    - `ASTNodePtr parseDictLiteral()`
    - `ASTNodePtr parseLambda()`
    - `ASTNodePtr parseArrowFunction(std::vector<std::string> params, int ln)`
    - `std::vector<ASTNodePtr> parseArgList()`
    - `std::vector<std::string> parseParamList(std::vector<bool> *outIsRef = nullptr, std::vector<ASTNodePtr> *outDefaultArgs = nullptr, std::vector<std::string> *outParamTypes = nullptr)`

### Tradeoffs

- **Complexity vs. Simplicity**: While Pratt parsing reduces complexity compared to recursive descent, it can introduce subtle bugs if not implemented carefully.
  
- **Performance**: Pratt parsing is generally faster than recursive descent due to its iterative nature, but both approaches have their performance implications depending on the specific use case and optimizations applied.

- **Maintainability**: The separation of concerns in `Parser.h` improves maintainability by allowing developers to focus on specific aspects of parsing independently.

Overall, `Parser