# Lexer.cpp - The Quantum Language Compiler's Lexical Analyzer

## Overview

`Lexer.cpp` is a crucial component of the Quantum Language compiler, responsible for the lexical analysis phase. This phase transforms the input source code into a sequence of tokens, forming the foundation for subsequent parsing. The lexer effectively handles various lexical elements including keywords, operators, identifiers, literals, and comments.

## Role in Compiler Pipeline

The lexer operates at the beginning of the compilation process, reading the source code character by character to identify and categorize each element into its corresponding token type. These tokens are then passed to the parser for semantic analysis and syntactic processing.

## Key Design Decisions and Why

1. **Tokenization Rules**: The lexer uses predefined rules to recognize different types of tokens, such as keywords, identifiers, literals, and operators. Each rule is designed to accurately capture its intended token category without misinterpreting adjacent characters or syntax structures.

2. **Error Handling**: To ensure robustness, the lexer includes comprehensive error handling mechanisms. It detects invalid characters, malformed tokens, and unexpected end-of-file conditions, reporting them appropriately using custom error messages.

3. **State Management**: The lexer maintains state information about the current position in the source code, line number, and column number. This allows it to provide accurate error locations and to handle multi-line comments seamlessly.

4. **Efficiency**: For performance reasons, the lexer employs efficient algorithms to skip whitespace and comments. By advancing through the source code only when necessary, it minimizes unnecessary operations and improves overall execution speed.

## Major Classes/Functions Overview

### Lexer Class

- **Constructor (`Lexer::Lexer(const std::string &source)`)**:
  Initializes the lexer with the source code string and sets up initial state variables.

- **Current Character (`char Lexer::current() const`)**:
  Returns the current character being processed.

- **Peek Character (`char Lexer::peek(int offset) const`)**:
  Allows lookahead of characters ahead in the source code without advancing the position.

- **Advance Position (`char Lexer::advance()`)**:
  Advances the lexer's position one character forward and updates line and column numbers accordingly.

- **Skip Whitespace (`void Lexer::skipWhitespace()`)**:
  Skips over any whitespace characters (spaces, tabs, carriage returns).

- **Skip Comment (`void Lexer::skipComment()`)**:
  Skips over single-line comments starting with `//`.

- **Skip Block Comment (`void Lexer::skipBlockComment()`)**:
  Skips over block comments enclosed within `/* */`. Note that the implementation is incomplete in the provided snippet.

### Token Types

The `Lexer` class utilizes an unordered map (`keywords`) to associate specific strings with their corresponding token types. This mapping facilitates quick identification of reserved words and other significant lexical elements.

## Tradeoffs

1. **Complexity vs. Performance**:
   While the lexer benefits from clear and well-defined rules for tokenization, these rules can introduce complexity in the implementation. However, the use of efficient algorithms and careful state management helps mitigate this tradeoff, ensuring both accuracy and speed.

2. **Flexibility vs. Simplicity**:
   Offering support for multiple programming language features like different types of comments and literal formats increases flexibility but also complicates the lexer's logic. Simplifying the lexer might limit its ability to handle diverse input sources.

3. **Memory Usage vs. Parsing Speed**:
   Storing the entire source code in memory during the lexical analysis phase requires additional memory resources. Optimizing memory usage could potentially slow down parsing speed, making a balance between these two factors essential.

By carefully balancing these considerations, `Lexer.cpp` provides a reliable and efficient foundation for the Quantum Language compiler, enabling the subsequent phases of compilation to proceed smoothly.