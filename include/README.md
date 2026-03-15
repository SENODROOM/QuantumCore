# QuantumLanguage Compiler - Parser.h

## Overview

The `include/Parser.h` header file is a crucial component of the QuantumLanguage compiler, responsible for converting a sequence of tokens into an Abstract Syntax Tree (AST). This file plays a pivotal role in the compiler's pipeline by interpreting the syntactic structure of the source code and constructing a hierarchical representation of it.

## Key Design Decisions

### Error Handling

A custom exception class, `ParseError`, is designed to handle errors during parsing. It extends `std::runtime_error` and includes additional information about the error location (`line` and `col`). This decision was made to provide more context-specific error messages, aiding in debugging and improving user experience.

### Pratt Parsing Algorithm

The parser employs the Pratt parsing algorithm for expression evaluation. This method allows for flexible handling of operator precedence and associativity without requiring complex recursive descent parsers. The choice of Pratt parsing simplifies the implementation of the parser while maintaining control over operator priorities.

## Classes and Functions Documentation

### ParseError Class

**Purpose:**  
To represent parsing errors with detailed location information.

**Behavior:**  
- Inherits from `std::runtime_error`.
- Stores the line and column number where the error occurred.
- Provides a constructor to initialize these attributes along with the error message.

### Parser Class

**Purpose:**  
To manage the parsing process, converting a vector of tokens into an AST.

**Behavior:**  
- Constructor initializes with a vector of tokens.
- `parse()` function initiates the parsing process, returning the root node of the AST.
- Private helper functions manage token consumption, checking, and error reporting.
- Major parsing methods correspond to different constructs in the language, such as variable declarations, function definitions, conditional statements, loops, and expressions.

### Expression Parsing Methods

These methods implement the Pratt parsing algorithm to evaluate expressions based on their precedence and associativity:

- `parseExpr()`: Main entry point for expression parsing.
- `parseAssignment()`, `parseOr()`, `parseAnd()`, etc.: Handle specific operators and operations.

### Statement Parsing Methods

These methods parse different types of statements in the language:

- `parseStatement()`: Parses individual statements.
- `parseBlock()`: Parses compound statements enclosed in braces.
- `parseIfStmt()`, `parseWhileStmt()`, `parseForStmt()`, etc.: Handle control flow statements.

## Tradeoffs and Limitations

- **Flexibility vs. Complexity:** While Pratt parsing offers flexibility, it can be more complex to implement than traditional recursive descent parsers. However, this complexity is managed through clear separation of concerns and modular design.
- **Error Reporting:** Detailed error reporting requires additional overhead but enhances the usability of the compiler by providing precise feedback.
- **Operator Precedence:** The Pratt parsing algorithm inherently handles operator precedence, which simplifies the parser's logic but may complicate the addition of new operators.

This README provides a comprehensive overview of the `Parser.h` file, detailing its functionality, design choices, and potential limitations.