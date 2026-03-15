# Lexer.cpp - The Quantum Language Compiler's Lexical Analyzer

## Overview

`Lexer.cpp` is a critical component of the Quantum Language compiler, responsible for the lexical analysis phase. This phase involves converting the input source code into a sequence of tokens, which are essential for the parser to correctly interpret and construct the abstract syntax tree (AST). The lexer handles various tasks such as identifying keywords, operators, identifiers, literals, and whitespace, ensuring that the source code is accurately parsed.

## Key Design Decisions

### Tokenization Strategy

The decision to use a hash map (`std::unordered_map`) for keyword recognition was made for efficiency. Hash maps provide average-case constant time complexity for lookups, making it faster to determine if a token is a keyword compared to linear search methods. This optimization is particularly beneficial when dealing with large source files.

### Error Handling

Incorporating error handling within the lexer allows for early detection and reporting of syntax errors. By throwing exceptions when encountering invalid characters or structures, the lexer ensures that the compiler can quickly identify issues and report them to the user. This approach simplifies error management across the entire compilation process.

## Classes and Functions Documentation

### Lexer Class

**Purpose**: Manages the lexical analysis of the source code, converting it into a stream of tokens.

**Behavior**:
- Initializes with the source code string.
- Provides methods to advance through the source code, skip whitespace, and peek at upcoming characters.
- Recognizes and categorizes characters into meaningful tokens using regular expressions and predefined rules.

### Keywords Map

**Purpose**: Maps string representations of keywords to their corresponding token types.

**Behavior**:
- Contains entries for all recognized keywords in the Quantum Language.
- Used during the tokenization process to quickly identify and classify keywords.

### current() Function

**Purpose**: Returns the character at the current position in the source code.

**Behavior**:
- Checks if the current position is within the bounds of the source code.
- Returns the character at the current position; otherwise, returns null terminator (`'\0'`).

### peek(int offset) Function

**Purpose**: Returns the character at a specified offset relative to the current position without advancing the position.

**Behavior**:
- Calculates the new position based on the given offset.
- Checks if the calculated position is within the bounds of the source code.
- Returns the character at the calculated position; otherwise, returns null terminator (`'\0'`).

### advance() Function

**Purpose**: Advances the current position in the source code by one character and updates line and column information accordingly.

**Behavior**:
- Retrieves the character at the current position.
- Increments the position index.
- Updates line number and column position if the character is a newline (`'\n'`).

### skipWhitespace() Function

**Purpose**: Skips over any whitespace characters in the source code.

**Behavior**:
- Continuously advances through the source code until a non-whitespace character is encountered.
- Handles both single-line comments (starting with `//`) and multi-line comments (enclosed within `/* */`).

## Tradeoffs and Limitations

- **Keyword Recognition Efficiency**: Using a hash map for keyword recognition offers fast lookup times but may increase memory usage due to the storage requirements of the map.
- **Error Reporting**: Throwing exceptions for errors provides immediate feedback but can complicate error recovery mechanisms in the parser.
- **Language Compatibility**: The lexer is designed to recognize specific language constructs, which may limit its compatibility with other languages or dialects.

This README.md provides an overview of the `Lexer.cpp` file, explains the rationale behind key design decisions, documents the classes and functions involved, and highlights potential tradeoffs and limitations.