# Lexer.h - Lexer Header File Explanation

## Complete Code

```cpp
#pragma once
#include "Token.h"
#include <string>
#include <vector>
#include <unordered_map>

class Lexer
{
public:
    explicit Lexer(const std::string &source);
    std::vector<Token> tokenize();

private:
    std::string src;
    size_t pos;
    int line, col;

    static const std::unordered_map<std::string, TokenType> keywords;

    std::vector<Token> pendingTokens_; // used for f-string expansion
    // C preprocessor #define macros: name → replacement token list
    std::unordered_map<std::string, std::vector<Token>> defines_;

    char current() const;
    char peek(int offset = 1) const;
    char advance();
    void skipWhitespace();
    void skipComment();      // single-line: // ...
    void skipBlockComment(); // multi-line:  /* ... */

    Token readNumber();
    Token readString(char quote);
    void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol);
    Token readIdentifierOrKeyword();
    Token readOperator();
};
```

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-5)
- **Line 1**: `#pragma once` - Prevents the header from being included multiple times
- **Line 2**: `#include "Token.h"` - Includes token type definitions
- **Line 3**: `#include <string>` - Includes string functionality for source code processing
- **Line 4**: `#include <vector>` - Includes vector for storing tokens
- **Line 5**: `#include <unordered_map>` - Includes hash map for keyword lookup

### Class Declaration (Line 6)
- **Line 6**: `class Lexer` - Declares the Lexer class that converts source code into tokens

### Public Interface (Lines 7-11)

#### Constructor (Line 7)
- **Line 7**: `public:` - Starts the public section of the class
- **Line 8**: `explicit Lexer(const std::string &source);` - Constructor that takes source code as string
  - `explicit` prevents implicit conversions
  - Takes reference to source code string

#### Main Tokenization Method (Line 9)
- **Line 9**: `std::vector<Token> tokenize();` - Main method that converts source code into a vector of tokens

### Private Section (Line 11)
- **Line 10**: Empty line for readability
- **Line 11**: `private:` - Starts the private section of the class

### Private Member Variables (Lines 12-20)

#### Source Code Tracking (Lines 12-14)
- **Line 12**: `std::string src;` - Stores the source code to be tokenized
- **Line 13**: `size_t pos;` - Current position in the source string
- **Line 14**: `int line, col;` - Current line and column numbers for error reporting

#### Keyword Mapping (Line 16)
- **Line 15**: Empty line for readability
- **Line 16**: `static const std::unordered_map<std::string, TokenType> keywords;` - Static constant map from keyword strings to token types

#### Advanced Features (Lines 17-20)
- **Line 17**: `std::vector<Token> pendingTokens_; // used for f-string expansion` - Vector of tokens waiting to be processed (used for template literals)
- **Line 18**: `// C preprocessor #define macros: name → replacement token list` - Comment explaining defines map
- **Line 19**: `std::unordered_map<std::string, std::vector<Token>> defines_;` - Map for C-style macro definitions
- **Line 20**: Empty line for readability

### Character Access Methods (Lines 21-24)

#### Current Character Access (Lines 21-24)
- **Line 21**: `char current() const;` - Returns the current character at position
- **Line 22**: `char peek(int offset = 1) const;` - Looks ahead at character with optional offset (default 1)
- **Line 23**: `char advance();` - Advances position and returns the previous character
- **Line 24**: Empty line for readability

### Skipping Methods (Lines 25-28)

#### Whitespace and Comment Skipping (Lines 25-28)
- **Line 25**: `void skipWhitespace();` - Skips whitespace characters (spaces, tabs, newlines)
- **Line 26**: `void skipComment();      // single-line: // ...` - Skips single-line comments
- **Line 27**: `void skipBlockComment(); // multi-line:  /* ... */` - Skips multi-line block comments
- **Line 28**: Empty line for readability

### Token Reading Methods (Lines 29-35)

#### Literal Token Methods (Lines 29-31)
- **Line 29**: `Token readNumber();` - Reads and creates a number token
- **Line 30**: `Token readString(char quote);` - Reads and creates a string token (takes quote character)
- **Line 31**: `void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol);` - Reads template literals and adds tokens to output vector

#### Identifier and Operator Methods (Lines 32-35)
- **Line 32**: `Token readIdentifierOrKeyword();` - Reads identifier or keyword and creates appropriate token
- **Line 33**: `Token readOperator();` - Reads operator characters and creates operator token
- **Line 34**: Empty line for readability
- **Line 35**: `};` - Closing brace for the Lexer class

## Summary

This header file defines the lexical analyzer (lexer) for the Quantum Language compiler with:

### Core Functionality
- **Tokenization**: Converts source code text into a sequence of tokens
- **Position Tracking**: Maintains line and column information for error reporting
- **Keyword Recognition**: Maps reserved words to appropriate token types

### Advanced Features
- **Template Literals**: Support for f-string style template literals with pending tokens
- **C Preprocessor**: Basic support for #define macro expansion
- **Comment Handling**: Skips both single-line (//) and multi-line (/* */) comments

### Token Types Supported
- **Literals**: Numbers, strings, template literals
- **Identifiers**: Variable names and function names
- **Keywords**: Reserved language words
- **Operators**: Mathematical and logical operators
- **Whitespace**: Skipped during tokenization

### Design Patterns
- **Single Responsibility**: Focused solely on lexical analysis
- **Immutable Input**: Source code is not modified during tokenization
- **Position Awareness**: Maintains accurate source location information

The lexer serves as the first phase of the compilation process, breaking down source code into meaningful tokens that the parser can then analyze for grammatical structure. It handles the complexity of modern language features like template literals while maintaining compatibility with C-style preprocessing directives.
