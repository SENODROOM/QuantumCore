# Lexer.cpp - The Quantum Language Compiler's Lexical Analyzer

## Overview

`Lexer.cpp` is a crucial component of the Quantum Language compiler responsible for the lexical analysis phase. This phase transforms the input source code into a sequence of tokens, which are subsequently utilized by the parser to construct the abstract syntax tree (AST). The lexer effectively handles various lexical elements including keywords, operators, identifiers, literals, and whitespace, ensuring precise parsing.

## Key Design Decisions

### Tokenization Strategy

The decision to use a map-based approach for keyword recognition was pivotal because it allowed for efficient lookup and easy maintenance of the language's reserved words. By storing keywords in an unordered map, the lexer can quickly determine if a sequence of characters represents a keyword, thereby simplifying the overall parsing process.

### Error Handling

Implementing robust error handling mechanisms within the lexer was essential to provide meaningful feedback during compilation. The inclusion of custom exceptions and error reporting functions enables the compiler to identify and report syntax errors accurately, facilitating easier debugging and correction of issues in the source code.

## Major Classes/Functions Documentation

### `Lexer` Class

**Purpose**: 
The `Lexer` class encapsulates the functionality required for lexical analysis. It processes the input source code character by character, converting them into tokens that represent the syntactic structure of the program.

**Behavior**:
- Initializes with the source code string.
- Provides methods to read and advance through the source code.
- Recognizes and categorizes different types of tokens such as keywords, operators, identifiers, and literals.
- Handles whitespace and newline characters appropriately to maintain accurate line and column tracking.

### `tokenize()` Function

**Purpose**:
This function is the core method of the lexer, responsible for generating tokens from the input source code.

**Behavior**:
- Iterates over each character in the source code.
- Skips whitespace and identifies the start of a new token.
- Determines the type of token based on the character(s) read.
- Returns a vector containing all the tokens generated from the source code.

### `keywords` Map

**Purpose**:
The `keywords` map stores all the reserved keywords of the Quantum Language along with their corresponding token types.

**Behavior**:
- Maps strings representing keywords to specific `TokenType` values.
- Enables quick identification of keywords during the lexing process.
- Supports case-insensitive matching for certain keywords like "true" and "false".

## Tradeoffs and Limitations

- **Performance**: While the map-based approach provides fast keyword lookup, it may not be the most memory-efficient solution for languages with a large number of keywords.
- **Complexity**: Adding new keywords requires updating the map, which could introduce complexity in maintaining the lexer's state.
- **Case Sensitivity**: Although the lexer supports case-insensitive matching for some keywords, it might not be suitable for languages where case sensitivity is critical.

## Usage Example

To utilize the `Lexer` class in your Quantum Language compiler project, you would typically instantiate it with the source code string and call the `tokenize()` function to obtain a list of tokens.

```cpp
#include "src/Lexer.cpp"

int main() {
    std::string sourceCode = "let x = 5;";
    Lexer lexer(sourceCode);
    std::vector<Token> tokens = lexer.tokenize();

    for (const auto& token : tokens) {
        std::cout << token.type << ": " << token.value << std::endl;
    }

    return 0;
}
```

This example demonstrates how to create a `Lexer` object, pass it the source code, and print out the resulting tokens.