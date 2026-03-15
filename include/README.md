# QuantumLanguage Compiler - Lexer.h

## Overview

The `include/Lexer.h` header file is an essential part of the QuantumLanguage compiler, focusing on the lexical analysis phase. This phase involves breaking down the input source code into meaningful tokens that can be processed further by the parser. The `Lexer` class plays a pivotal role in this process by converting raw characters into structured tokens, including identifiers, keywords, operators, numbers, strings, and comments.

This file is critical because it forms the basis for understanding the syntax and structure of the QuantumLanguage code. By accurately identifying and categorizing these elements, the lexer enables subsequent phases of the compiler to build a proper abstract syntax tree (AST).

## Key Design Decisions

### Use of `std::unordered_map` for Keywords

**WHY:** Using `std::unordered_map` allows for efficient keyword lookup during the tokenization process. Since keywords are relatively few in number compared to other tokens like identifiers and numbers, this data structure provides faster access times than alternatives like linear search or binary search, making the lexer more performant.

### Pending Tokens for F-String Expansion

**WHY:** F-strings (formatted string literals) in QuantumLanguage require special handling during tokenization to ensure correct interpretation of embedded expressions. The `pendingTokens_` vector is used to temporarily store tokens generated during f-string expansion, allowing the lexer to manage complex string structures without disrupting the overall flow of tokenization.

### Support for Preprocessor Macros

**WHY:** Including support for preprocessor macros (`#define`) enhances the flexibility and power of the QuantumLanguage compiler. Macros allow developers to define reusable code snippets and constants, which simplifies maintenance and reduces redundancy in the source code. However, this feature also introduces complexity in the lexer, requiring additional logic to expand macro definitions before further processing.

## Class and Function Documentation

### Lexer Class

**Purpose:** The `Lexer` class is designed to take a source code string and convert it into a sequence of tokens, which represent the syntactic units of the language.

#### Public Methods

- **explicit Lexer(const std::string &source):**
  - **Purpose:** Initializes the lexer with the provided source code.
  - **Behaviour:** Sets up the internal state of the lexer, including the source string, position, line, and column counters.

- **std::vector<Token> tokenize():**
  - **Purpose:** Converts the entire source code into a vector of tokens.
  - **Behaviour:** Iterates through the source code, calling private methods to identify and create tokens until the end of the source is reached.

#### Private Methods

- **char current() const:**
  - **Purpose:** Returns the character at the current position in the source code.
  - **Behaviour:** Provides direct access to the current character without advancing the position.

- **char peek(int offset = 1) const:**
  - **Purpose:** Returns the character at the specified offset from the current position.
  - **Behaviour:** Allows lookahead without modifying the lexer's state, facilitating pattern matching.

- **char advance():**
  - **Purpose:** Advances the lexer's position to the next character and returns it.
  - **Behaviour:** Updates the line and column counters accordingly to track the lexer's progress.

- **void skipWhitespace():**
  - **Purpose:** Skips over any whitespace characters in the source code.
  - **Behaviour:** Ensures that only relevant characters are considered during tokenization.

- **void skipComment():**
  - **Purpose:** Skips over single-line comments (starting with `//`).
  - **Behaviour:** Removes comment text from the token stream, ensuring that it does not interfere with parsing.

- **void skipBlockComment():**
  - **Purpose:** Skips over multi-line comments (enclosed between `/*` and `*/`).
  - **Behaviour:** Handles nested comments and ensures that the entire block is skipped correctly.

- **Token readNumber():**
  - **Purpose:** Reads a numeric literal from the source code.
  - **Behaviour:** Identifies integer and floating-point numbers and converts them into appropriate token types.

- **Token readString(char quote):**
  - **Purpose:** Reads a string literal from the source code.
  - **Behaviour:** Handles both single-quoted and double-quoted strings, recognizing escape sequences and concatenation.

- **void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol):**
  - **Purpose:** Reads and processes template literals (f-strings) from the source code.
  - **Behaviour:** Expands embedded expressions within the string and appends the resulting tokens to the output vector.

- **Token readIdentifierOrKeyword():**
  - **Purpose:** Reads an identifier or keyword from the source code.
  - **Behaviour:** Distinguishes between valid identifiers and reserved keywords, returning the corresponding token type.

- **Token readOperator():**
  - **Purpose:** Reads an operator from the source code.
  - **Behaviour:** Recognizes various arithmetic, logical, and assignment operators and returns their respective token types.

## Tradeoffs and Limitations

- **Complexity Introduced by Macros:** Supporting macros adds significant complexity to the lexer, requiring careful handling to avoid premature expansion of tokens within macro definitions.
  
- **Limited Error Handling:** The lexer focuses primarily on tokenization and does not provide extensive error handling mechanisms. Errors related to invalid syntax or malformed tokens are typically detected later in the compilation process.

- **Performance Considerations:** While `std::unordered_map` offers fast keyword lookups, the overhead associated with maintaining and expanding macro definitions can impact performance, especially for large codebases.

Overall, the `Lexer.h` file is a fundamental component of the QuantumLanguage compiler, providing the necessary infrastructure for accurate lexical analysis. Its design choices balance functionality with performance and maintainability, while acknowledging the inherent complexities introduced