# QuantumLanguage Compiler - Lexer.h

## Overview

The `include/Lexer.h` header file plays a crucial role in the QuantumLanguage compiler by handling the lexical analysis phase. This involves converting the source code into a sequence of tokens that can be further processed by the parser. The lexer is designed with efficiency and flexibility in mind, ensuring that it can accurately identify and categorize different elements of the language syntax.

## Key Design Decisions and Why

### Efficient Tokenization

- **C++ Standard Library**: Utilizing C++'s standard library containers such as `std::vector` and `std::unordered_map` allows for efficient storage and retrieval of tokens and keywords.
- **State Machine Approach**: Implementing the lexer using a state machine approach ensures that transitions between states are handled cleanly and efficiently, making it easier to manage complex syntax rules.

### Flexibility and Extensibility

- **Macros Support**: The lexer includes support for C-style preprocessor macros (`#define`). This feature enhances the language's expressiveness and adaptability.
- **F-String Expansion**: A mechanism for expanding f-strings (formatted string literals) is implemented using a vector of pending tokens. This allows for dynamic generation of tokens based on runtime expressions, providing powerful string formatting capabilities.

### Error Handling

- **Detailed Error Reporting**: While not explicitly shown in the provided code snippet, the lexer is designed to provide detailed error reporting. This helps developers understand where and why errors occur in their code, facilitating quicker debugging and maintenance.

## Major Classes/Functions Overview

### Lexer Class

- **Constructor**: Initializes the lexer with the source code as input.
- **tokenize() Function**: Performs the main lexical analysis process, returning a vector of tokens representing the source code.

### Private Member Functions

- **current()**: Returns the character at the current position in the source code.
- **peek(int offset)**: Returns the character at the specified offset relative to the current position without advancing the position.
- **advance()**: Advances the position in the source code by one character and returns it.
- **skipWhitespace()**: Skips over any whitespace characters in the source code.
- **skipComment()**: Skips over single-line comments starting with `//`.
- **skipBlockComment()**: Skips over multi-line comments enclosed within `/* */`.

- **readNumber()**: Reads a numeric literal from the source code.
- **readString(char quote)**: Reads a string literal from the source code, handling both single and double quotes.
- **readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol)**: Handles the reading of template literals, which allow for embedded expressions within strings.
- **readIdentifierOrKeyword()**: Reads an identifier or keyword from the source code.
- **readOperator()**: Reads an operator from the source code.

## Tradeoffs

- **Complexity vs. Performance**: The use of a state machine for tokenization adds complexity to the implementation but improves performance by reducing the number of conditional checks required during parsing.
- **Flexibility vs. Simplicity**: Supporting macros and f-string expansion increases the language's flexibility but also complicates the lexer's implementation.
- **Error Handling vs. Usability**: Detailed error reporting enhances usability by providing clear feedback, but may add overhead during normal operation.

Overall, the `Lexer.h` file is a critical component of the QuantumLanguage compiler, balancing performance, flexibility, and usability to ensure robust and effective lexical analysis.