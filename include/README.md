# QuantumLanguage Compiler - Token.h

## Overview

The `include/Token.h` header file is an essential part of the QuantumLanguage compiler, focusing on the representation and management of tokens. Tokens are the smallest units of meaning in the language, serving as the building blocks for parsing and interpreting the source code. This file defines the `TokenType` enum and the `Token` struct, which are fundamental for handling these tokens throughout the compiler pipeline.

## Key Design Decisions

### TokenType Enum

- **Purpose**: To categorize different types of tokens encountered during lexical analysis.
- **Why**: By using an enumeration (`enum class`), we ensure type safety and clarity when referring to token types. Each token type is explicitly defined, making it easier to understand and maintain the codebase.
  
### Token Struct

- **Purpose**: To encapsulate all necessary information about a token, including its type, value, and position in the source code.
- **Why**: A structured approach allows us to store and manage token details efficiently. The `type`, `value`, `line`, and `col` members provide comprehensive information about each token, enabling accurate error reporting and syntax highlighting.

## Classes and Functions Documentation

### TokenType Enum

**Members**:

- **NUMBER**: Represents numeric literals.
- **STRING**: Represents string literals.
- **TEMPLATE_STRING**: Represents segments of backtick template literals.
- **BOOL_TRUE** and **BOOL_FALSE**: Represent boolean literals.
- **NIL**: Represents the `nil` or `None` value.
- **IDENTIFIER**: Represents variable names, function names, etc.
- **LET**, **CONST**: Used for declaring variables with scope.
- **FN**, **DEF**, **FUNCTION**: Used for defining functions.
- **CLASS**, **EXTENDS**: Used for defining classes and inheritance.
- **NEW**, **THIS**, **SUPER**: Used for object-oriented programming constructs.
- **RETURN**: Indicates the return statement in a function.
- **IF**, **ELSE**, **ELIF**: Control flow statements.
- **WHILE**, **FOR**, **IN**, **OF**: Looping constructs.
- **BREAK**, **CONTINUE**: Flow control statements.
- **RAISE**: Used for exception handling.
- **TRY**, **EXCEPT**, **FINALLY**: Exception handling blocks.
- **AS**: Used for aliasing in imports.
- **PRINT**, **INPUT**: I/O operations.
- **COUT**, **CIN**: Stream-based I/O operations.
- **FROM**, **IMPORT**: Module import statements.
- **TYPE_***: C/C++ style type keywords.
- **OPERATORS**: Various arithmetic, logical, and assignment operators.
- **DELIMITERS**: Symbols used to delimit elements in the code (e.g., parentheses, brackets).
- **SPECIAL**: Additional tokens like `EOF_TOKEN`, `UNKNOWN`, `INDENT`, and `DEDENT`.

### Token Struct

**Members**:

- **type**: An instance of `TokenType` representing the type of the token.
- **value**: A `std::string` containing the actual text of the token.
- **line**: An integer indicating the line number where the token appears in the source code.
- **col**: An integer indicating the column number where the token appears in the source code.

**Constructor**:

```cpp
Token(TokenType t, std::string v, int ln, int c);
```

**Parameters**:

- **t**: The type of the token.
- **v**: The textual value of the token.
- **ln**: The line number in the source code.
- **c**: The column number in the source code.

**Purpose**: Initializes a new `Token` instance with the specified type, value, and position.

**Functionality**:

- **toString() const**: Converts the token into a human-readable string format, useful for debugging and logging purposes.

## Tradeoffs and Limitations

- **Flexibility vs. Simplicity**: While the use of enums ensures type safety, it may limit flexibility in adding new token types without modifying existing code.
- **Performance**: String manipulation can be resource-intensive, especially for large codebases. However, the simplicity and readability of the code outweigh potential performance concerns.
- **Complexity**: Managing multiple token types and their associated behaviors can introduce complexity. Careful planning and modularization help mitigate this issue.

This README provides a clear understanding of the `Token.h` file's role in the QuantumLanguage compiler, the rationale behind its design decisions, and the functionality of its main components.