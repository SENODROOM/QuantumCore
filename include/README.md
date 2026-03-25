# QuantumLanguage Compiler - Lexer.h

## Overview

The `include/Lexer.h` header file is a critical component of the QuantumLanguage compiler, primarily responsible for converting source code into a sequence of tokens. This process is fundamental to the compilation pipeline as it lays the groundwork for subsequent stages such as parsing and semantic analysis. The lexer class, `Lexer`, encapsulates the logic necessary to accurately identify and categorize each token in the source code, ensuring that the compiler can correctly interpret the program's structure and intent.

### Key Design Decisions and Why

1. **State Machine Approach**: The lexer uses a state machine to handle different types of characters and transitions between states based on the encountered input. This approach allows for efficient and straightforward tokenization without complex nested loops or recursive functions, making the implementation both readable and maintainable.

2. **Support for F-Strings**: To accommodate Python-like formatted string literals, the lexer includes support for f-strings. This feature involves using a separate data structure (`pendingTokens_`) to temporarily store tokens during the expansion of f-strings, which are then combined back into a single token stream. This ensures that f-strings are handled seamlessly and correctly within the compiler.

3. **C Preprocessor Support**: The lexer also supports C preprocessor directives, specifically `#define`. These macros are stored in a hash map (`defines_`), where each macro name maps to its corresponding replacement token list. This allows the lexer to expand macros before further processing, ensuring that all preprocessed content is correctly interpreted.

4. **Error Handling**: While not explicitly shown in the provided code snippet, the lexer should have robust error handling mechanisms to manage unexpected characters, syntax errors, and other issues that may arise during tokenization. This helps in providing clear and actionable error messages to the developer, facilitating easier debugging and maintenance.

## Major Classes/Functions Overview

### Lexer Class

- **Constructor**: `explicit Lexer(const std::string &source);`
  - Initializes the lexer with the source code to be tokenized.

- **tokenize Method**: `std::vector<Token> tokenize();`
  - Converts the entire source code into a vector of tokens.

### Private Methods

- **current Method**: `char current() const;`
  - Returns the character at the current position in the source code.

- **peek Method**: `char peek(int offset = 1) const;`
  - Returns the character at the specified offset from the current position.

- **advance Method**: `char advance();`
  - Advances the current position in the source code and returns the new character.

- **skipWhitespace Method**: `void skipWhitespace();`
  - Skips over any whitespace characters in the source code.

- **skipComment Method**: `void skipComment();`
  - Skips over a single-line comment starting with `//`.

- **skipBlockComment Method**: `void skipBlockComment();`
  - Skips over a multi-line comment enclosed between `/*` and `*/`.

- **readNumber Method**: `Token readNumber();`
  - Reads a numeric literal from the source code and returns it as a `Token`.

- **readString Method**: `Token readString(char quote);`
  - Reads a string literal enclosed by the specified quote character and returns it as a `Token`.

- **readTemplateLiteral Method**: `void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol);`
  - Handles the expansion of template literals (f-strings) and appends the resulting tokens to the output vector.

- **readIdentifierOrKeyword Method**: `Token readIdentifierOrKeyword();`
  - Reads an identifier or keyword from the source code and returns it as a `Token`.

- **readOperator Method**: `Token readOperator();`
  - Reads an operator or punctuation mark from the source code and returns it as a `Token`.

## Tradeoffs

- **Complexity vs. Efficiency**: By using a state machine, the lexer achieves a balance between simplicity and efficiency. However, more advanced features like f-string expansion and C preprocessor support add complexity to the implementation.

- **Readability vs. Performance**: The use of separate data structures for f-string expansion and macro definitions might slightly impact performance, but it significantly improves the readability and maintainability of the code.

- **Flexibility vs. Simplicity**: Supporting both f-strings and C preprocessor directives increases the flexibility of the lexer, but it also adds additional layers of complexity to the codebase.

Overall, the `Lexer.h` file is a well-designed and essential part of the QuantumLanguage compiler, enabling accurate and efficient tokenization of source code. Its ability to handle advanced features like f-strings and C preprocessor directives makes it a versatile tool for developers working with the QuantumLanguage platform.