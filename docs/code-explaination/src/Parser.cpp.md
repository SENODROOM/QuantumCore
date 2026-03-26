# Parser.cpp - The Heart of Syntax Analysis in Quantum Language Compiler

## Overview

`Parser.cpp` is a crucial component of the Quantum Language compiler, responsible for transforming a sequence of tokens into an Abstract Syntax Tree (AST). This process ensures that the source code adheres to the syntax rules of the Quantum Language, enabling subsequent stages such as semantic analysis and code generation.

## Role in the Compiler Pipeline

The parser operates at the heart of the compilation process, taking the output of the lexer (tokenized input) and constructing a structured representation of the program. This AST serves as the foundation for all further processing steps.

## Key Design Decisions and Why

1. **Flexibility with Decorators**: The parser includes functionality to handle Python-style decorators, which can be used to modify or annotate functions or methods. This flexibility allows for extensions that mimic popular programming paradigms without altering the core language syntax.

2. **Support for Storage Class Specifiers**: To accommodate C/C++-style storage class specifiers (like `static`, `extern`, etc.), the parser skips these identifiers. This decision simplifies handling of legacy codebases while maintaining compatibility with modern quantum programming practices.

3. **Abstract Syntax Tree Construction**: The parser constructs an AST using smart pointers (`std::unique_ptr`) to manage memory efficiently. Each node in the AST represents a syntactic element of the program, making it easy to traverse and manipulate during later phases of compilation.

## Major Classes/Functions Overview

### Parser Class

- **Constructor**: Initializes the parser with a vector of tokens.
- **Current Token**: Returns the current token being processed.
- **Peek Token**: Returns the token at a specified offset ahead in the token stream.
- **Consume Token**: Advances the position in the token stream and returns the consumed token.
- **Expect Token**: Checks if the current token matches the expected type; throws a `ParseError` otherwise.
- **Check Token**: Verifies if the current token has a specific type.
- **Match Token**: Attempts to match and consume a token of a given type; returns `true` if successful.
- **At End**: Determines if the end of the token stream has been reached.
- **Skip Newlines**: Consumes all newline tokens until the next non-newline token is encountered.
- **Parse**: Main function that parses the entire token stream into an AST.
- **Parse Statement**: Parses individual statements within the program.

### Helper Functions

- **Is C Type Keyword**: A utility function to determine if a token corresponds to a C/C++ type keyword, aiding in parsing variable declarations.

## Tradeoffs

1. **Memory Management**: Using smart pointers for AST nodes helps manage memory more effectively but adds overhead compared to raw pointers.

2. **Compatibility**: Supporting C/C++ storage class specifiers increases compatibility with existing codebases but may complicate the parser's logic.

3. **Extensibility**: Handling Python-style decorators provides extensibility but requires additional parsing logic and state management.

Overall, `Parser.cpp` plays a vital role in ensuring that the Quantum Language compiler accurately interprets the source code, providing a robust foundation for subsequent stages of compilation.