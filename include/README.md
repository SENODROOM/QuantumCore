# QuantumLanguage Compiler - Parser.h

## Overview

The `include/Parser.h` header file is a critical component of the QuantumLanguage compiler's architecture. It encapsulates the logic responsible for converting a sequence of tokens into an Abstract Syntax Tree (AST). The parser handles the syntactic analysis of the input code, ensuring it adheres to the language's grammar rules and constructs meaningful AST nodes from the parsed elements.

This file serves as the bridge between the lexical analysis phase (tokenization) and the semantic analysis phase (building the AST). By accurately interpreting the syntax of the source code, the parser facilitates subsequent phases such as type checking, optimization, and code generation.

## Key Design Decisions

### Error Handling

**Design Decision:** The parser uses custom exceptions (`ParseError`) to handle errors during parsing. These exceptions store both the error message and the location in the source code (line and column).

**Why:** Custom exceptions provide more context about the error, making debugging easier. They also allow for more precise control over error handling, enabling the compiler to report errors in a user-friendly manner.

### Pratt Parsing Algorithm

**Design Decision:** The expression parsing is implemented using the Pratt parsing algorithm, which supports operator precedence and associativity without requiring parentheses for all expressions.

**Why:** Pratt parsing is highly flexible and efficient, allowing for complex expressions to be parsed correctly while keeping the implementation straightforward. This approach simplifies the parser and reduces the likelihood of bugs related to operator precedence.

### Recursive Descent Parsing

**Design Decision:** The parser employs a recursive descent parsing technique, where each non-terminal rule in the grammar corresponds to a function in the parser class.

**Why:** Recursive descent parsing is intuitive and easy to implement, especially for simple grammars. It allows for clear separation of concerns, making the code modular and easier to understand and maintain.

### Support for C-Type Variables

**Design Decision:** The parser includes specific support for declaring variables with C-type hints (e.g., `int x`, `int* p`).

**Why:** This feature enables the parser to recognize and handle variables declared according to C-like syntax, providing compatibility and flexibility for developers familiar with C-based languages.

## Classes and Functions Documentation

### ParseError Class

**Purpose:** Represents a parsing error, storing the error message along with the line and column numbers where the error occurred.

**Behavior:** Inherits from `std::runtime_error` and adds additional fields for line and column information.

### Parser Class

**Purpose:** Manages the parsing process, converting a sequence of tokens into an AST.

#### Constructor

```cpp
explicit Parser(std::vector<Token> tokens);
```

**Behavior:** Initializes the parser with a vector of tokens.

#### parse Function

```cpp
ASTNodePtr parse();
```

**Purpose:** Parses the entire input stream and returns the root node of the AST.

**Behavior:** Iterates through the tokens, invoking appropriate parsing functions based on the current token type.

### Token Helpers

- **current**: Retrieves the current token being processed.
- **peek**: Looks ahead at a specified number of tokens without consuming them.
- **consume**: Consumes the current token and advances the position.
- **expect**: Ensures the next token matches the expected type, throwing an error if not.
- **check**: Checks if the next token matches a specified type.
- **match**: Attempts to consume the next token if it matches the specified type.
- **atEnd**: Determines if the end of the token stream has been reached.
- **skipNewlines**: Skips any newline characters encountered during parsing.

### Statement Parsing Methods

- **parseStatement**: Parses a single statement.
- **parseBlock**: Parses a block of statements enclosed in curly braces.
- **parseBodyOrStatement**: Parses either a block or a single statement, depending on whether curly braces are present.
- **parseVarDecl**: Parses a variable declaration, optionally marking it as constant.
- **parseFunctionDecl**: Parses a function declaration.
- **parseClassDecl**: Parses a class declaration.
- **parseIfStmt**: Parses an if statement.
- **parseWhileStmt**: Parses a while loop.
- **parseForStmt**: Parses a for loop.
- **parseReturnStmt**: Parses a return statement.
- **parsePrintStmt**: Parses a print statement.
- **parseInputStmt**: Parses an input statement.
- **parseCoutStmt**: Parses a `cout << ...` statement.
- **parseCinStmt**: Parses a `cin >> ...` statement.
- **parseImportStmt**: Parses an import statement, optionally specifying a module name.
- **parseExprStmt**: Parses an expression followed by a semicolon.

### Expression Parsing Methods

- **parseExpr**: Parses a top-level expression.
- **parseAssignment**: Parses an assignment expression.
- **parseOr**: Parses logical OR expressions.
- **parseAnd**: Parses logical AND expressions.
- **parseBitwise**: Parses bitwise operations.
- **parseEquality**: Parses equality comparisons.
- **parseComparison**: Parses relational comparisons.
- **parseShift**: Parses shift operations.
- **parseAddSub**: Parses addition and subtraction operations.
- **parseMulDiv**: Parses multiplication and division operations.
- **parsePower**: Parses exponentiation operations.
- **parseUnary**: Parses unary operators.
- **parsePostfix**: Parses postfix expressions.
- **parsePrimary**: Parses primary expressions (literals, identifiers, etc.).

### Additional Helper Functions

- **parseArrayLiteral**: Parses an array literal.
- **parseDictLiteral**: Parses a dictionary literal.
- **parseLambda**: Parses a lambda function.
- **parseArrowFunction**: Parses an arrow function with specified parameters.
- **parseArgList**: Parses a list of arguments.
- **parseParamList**: Parses a list of function parameters, supporting references and default values.

## Tradeoffs and Limitations

- **Flexibility vs. Simplicity