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

## Code Explanation

###
-  `#pragma once` - Prevents the header from being included multiple times
-  `#include "Token.h"` - Includes token type definitions
-  `#include <string>` - Includes string functionality for source code processing
-  `#include <vector>` - Includes vector for storing tokens
-  `#include <unordered_map>` - Includes hash map for keyword lookup

###
-  `class Lexer` - Declares the Lexer class that converts source code into tokens

###

####
-  `public:` - Starts the public section of the class
-  `explicit Lexer(const std::string &source);` - Constructor that takes source code as string
  - `explicit` prevents implicit conversions
  - Takes reference to source code string

####
-  `std::vector<Token> tokenize();` - Main method that converts source code into a vector of tokens

###
-  Empty line for readability
-  `private:` - Starts the private section of the class

###

####
-  `std::string src;` - Stores the source code to be tokenized
-  `size_t pos;` - Current position in the source string
-  `int line, col;` - Current line and column numbers for error reporting

####
-  Empty line for readability
-  `static const std::unordered_map<std::string, TokenType> keywords;` - Static constant map from keyword strings to token types

####
-  `std::vector<Token> pendingTokens_; // used for f-string expansion` - Vector of tokens waiting to be processed (used for template literals)
-  `// C preprocessor #define macros: name → replacement token list` - Comment explaining defines map
-  `std::unordered_map<std::string, std::vector<Token>> defines_;` - Map for C-style macro definitions
-  Empty line for readability

###

####
-  `char current() const;` - Returns the current character at position
-  `char peek(int offset = 1) const;` - Looks ahead at character with optional offset (default 1)
-  `char advance();` - Advances position and returns the previous character
-  Empty line for readability

###

####
-  `void skipWhitespace();` - Skips whitespace characters (spaces, tabs, newlines)
-  `void skipComment();      // single-line: // ...` - Skips single-line comments
-  `void skipBlockComment(); // multi-line:  /* ... */` - Skips multi-line block comments
-  Empty line for readability

###

####
-  `Token readNumber();` - Reads and creates a number token
-  `Token readString(char quote);` - Reads and creates a string token (takes quote character)
-  `void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol);` - Reads template literals and adds tokens to output vector

####
-  `Token readIdentifierOrKeyword();` - Reads identifier or keyword and creates appropriate token
-  `Token readOperator();` - Reads operator characters and creates operator token
-  Empty line for readability
-  `};` - Closing brace for the Lexer class

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
