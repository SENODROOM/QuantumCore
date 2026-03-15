# Parser.cpp - The Heart of Syntax Analysis in Quantum Language Compiler

## Overview

`Parser.cpp` is a critical component of the Quantum Language compiler, responsible for converting a sequence of tokens into an Abstract Syntax Tree (AST). This transformation ensures that the program conforms to the syntax rules of the Quantum Language, facilitating further semantic analysis and code generation stages.

### Role in the Compiler Pipeline

The parser operates after the lexer has generated a stream of tokens. Its primary function is to take these tokens and construct a structured representation of the source code, which can then be analyzed semantically and translated into executable code.

### Key Design Decisions and Why

1. **Flexibility with Decorators**: The parser includes functionality to handle Python-style decorators, such as `@property`, `@dataclass`. This flexibility allows the Quantum Language to adopt some features from Python, enhancing its usability and readability without compromising on performance or safety.

2. **Handling Storage Class Specifiers**: To maintain compatibility with existing C/C++ codebases, the parser also supports storage class specifiers like `static`, `extern`, `inline`, etc. These specifiers are ignored during parsing but preserved in the AST for potential use in later phases of the compilation process.

3. **Support for Different Variable Declarations**: The parser handles both `let` and `const` variable declarations, allowing for different levels of immutability within the language. This decision was made to provide developers with more control over their variables' lifetimes and values.

4. **Error Handling**: Robust error handling mechanisms are implemented to ensure that any syntax errors are caught early in the compilation process. This helps in providing clear and actionable feedback to the developer.

## Major Classes/Functions Overview

### Parser Class

- **Constructor**: Initializes the parser with a vector of tokens.
- **Current Token**: Returns the current token being processed.
- **Peek Token**: Allows looking ahead at a specified number of tokens without advancing the position.
- **Consume Token**: Advances the position to the next token and returns the current one.
- **Expect Token**: Checks if the current token matches the expected type and throws a parse error if it does not.
- **Check Token**: Verifies if the current token matches a given type.
- **Match Token**: Consumes the current token if it matches the given type, otherwise returns false.
- **At End**: Determines if the end of the token stream has been reached.
- **Skip Newlines**: Skips all newline tokens until the next non-newline token is encountered.
- **Parse**: Main entry point for parsing the entire token stream into an AST.
- **Parse Statement**: Parses individual statements based on the current token type.

### Utility Functions

- **Is C Type Keyword**: Helper function to determine if the current token is part of a C/C++ type keyword.
- **Trade-offs**: The parser's design aims to balance flexibility with performance. By supporting Python-like decorators and C/C++ storage class specifiers, it enhances usability but may introduce additional complexity in handling these constructs. Ignoring the `const` qualifier in C-style variable declarations optimizes parsing speed but could lead to subtle bugs if not handled correctly in subsequent phases.

This README provides a comprehensive overview of the `Parser.cpp` file, detailing its role in the compiler pipeline, key design decisions, and the major classes and functions involved. It also highlights the trade-offs made in the design to achieve a balance between usability and performance.