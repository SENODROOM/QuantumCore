# Parser.cpp - The Heart of Syntax Analysis in Quantum Language Compiler

## Overview

`Parser.cpp` is a crucial component of the Quantum Language compiler, responsible for converting a sequence of tokens into an Abstract Syntax Tree (AST). This process involves understanding the structure and semantics of the language to ensure correct parsing and error handling.

## Design Decisions

### Tokenization vs Lexical Analysis

**Why:** Tokenization is the first step in any compiler where individual characters are converted into meaningful units called tokens. In `Parser.cpp`, we assume that tokenization has already been handled by another module, focusing instead on the syntactic analysis phase. This separation allows for modular development and easier testing of both phases independently.

### Use of Smart Pointers

**Why:** To manage memory efficiently and avoid manual deletion of dynamically allocated objects, smart pointers (`std::unique_ptr`) are used extensively throughout the parser. This choice ensures that resources are automatically released when they are no longer needed, reducing the risk of memory leaks.

### Error Handling

**Why:** Robust error handling is essential for compilers to provide useful feedback to users. In `Parser.cpp`, errors are thrown as exceptions (`ParseError`). This approach allows for immediate termination of parsing upon encountering a syntax error, making it easier to locate and fix issues in the source code.

## Class and Function Documentation

### Parser Class

**Purpose:** Manages the parsing process, including state tracking and error handling.

**Behavior:**
- **Constructor:** Initializes the parser with a vector of tokens.
- **current():** Returns the current token being processed.
- **peek(offset):** Returns the token at the specified offset ahead without advancing the position.
- **consume():** Advances the position and returns the current token.
- **expect(t, msg):** Consumes the current token if it matches the expected type, otherwise throws a `ParseError`.
- **check(t):** Checks if the current token matches the specified type.
- **match(t):** Consumes the current token if it matches the specified type and returns `true`; otherwise, returns `false`.
- **atEnd():** Determines if the end of the token stream has been reached.
- **skipNewlines():** Skips over newline tokens until the end of the stream or a non-newline token is encountered.
- **parse():** Parses the entire input stream into an AST starting with a `BlockStmt`.
- **parseStatement():** Parses a single statement from the input stream.

### ASTNodePtr Type

**Purpose:** Represents a shared pointer to an abstract syntax tree node, facilitating efficient memory management.

### BlockStmt Structure

**Purpose:** Defines the structure for a block statement in the AST, which can contain multiple statements.

### parseVarDecl(bool isConst)

**Purpose:** Parses variable declarations, handling both regular and constant declarations.

**Behavior:** Consumes the `let` or `const` keyword and then proceeds to parse the variable declaration.

## Tradeoffs and Limitations

- **Performance:** While smart pointers help manage memory effectively, they may introduce some overhead compared to raw pointers.
- **Complexity:** Handling different types of storage class specifiers and Python-style decorators adds complexity to the parser but enhances its flexibility.
- **Error Reporting:** Immediate exception throwing simplifies error reporting but might not be suitable for all use cases, especially those requiring more granular control over error handling.

This README provides a comprehensive overview of `Parser.cpp`, detailing its functionality, design choices, and potential limitations. It serves as a guide for developers working on the Quantum Language compiler, ensuring they understand the role of this component and how it contributes to the overall compilation process.