# Parser.h - Parser Header File Explanation

## Complete Code

```cpp
#pragma once
#include "Token.h"
#include "AST.h"
#include <vector>
#include <stdexcept>

class ParseError : public std::runtime_error
{
public:
    int line, col;
    ParseError(const std::string &msg, int l, int c)
        : std::runtime_error(msg), line(l), col(c) {}
};

class Parser
{
public:
    explicit Parser(std::vector<Token> tokens);
    ASTNodePtr parse();

private:
    std::vector<Token> tokens;
    size_t pos;

    // Token helpers
    Token &current();
    Token &peek(int offset = 1);
    Token &consume();
    Token &expect(TokenType t, const std::string &msg);
    bool check(TokenType t) const;
    bool match(TokenType t);
    bool atEnd() const;
    void skipNewlines();

    // Parsing methods
    ASTNodePtr parseStatement();
    ASTNodePtr parseBlock();
    ASTNodePtr parseBodyOrStatement(); // block OR single statement (brace-optional)
    ASTNodePtr parseVarDecl(bool isConst);
    ASTNodePtr parseFunctionDecl();
    ASTNodePtr parseClassDecl();
    ASTNodePtr parseIfStmt();
    ASTNodePtr parseWhileStmt();
    ASTNodePtr parseForStmt();
    ASTNodePtr parseReturnStmt();
    ASTNodePtr parsePrintStmt();
    ASTNodePtr parseInputStmt();
    ASTNodePtr parseCoutStmt(); // cout << x << y << endl
    ASTNodePtr parseCinStmt();  // cin >> x >> y
    ASTNodePtr parseImportStmt(bool isFrom = false);
    ASTNodePtr parseExprStmt();
    ASTNodePtr parseCTypeVarDecl(const std::string &typeHint); // int x = ...  / int* p = ...
    bool isCTypeKeyword(TokenType t) const;

    // Expression parsing (Pratt-style precedence)
    ASTNodePtr parseExpr();
    ASTNodePtr parseAssignment();
    ASTNodePtr parseOr();
    ASTNodePtr parseAnd();
    ASTNodePtr parseBitwise();
    ASTNodePtr parseEquality();
    ASTNodePtr parseComparison();
    ASTNodePtr parseShift();
    ASTNodePtr parseAddSub();
    ASTNodePtr parseMulDiv();
    ASTNodePtr parsePower();
    ASTNodePtr parseUnary();
    ASTNodePtr parsePostfix();
    ASTNodePtr parsePrimary();

    ASTNodePtr parseArrayLiteral();
    ASTNodePtr parseDictLiteral();
    ASTNodePtr parseLambda();
    ASTNodePtr parseArrowFunction(std::vector<std::string> params, int ln);
    std::vector<ASTNodePtr> parseArgList();
    // Returns param names; populates outIsRef with true for each & (reference) param
    std::vector<std::string> parseParamList(std::vector<bool> *outIsRef = nullptr, std::vector<ASTNodePtr> *outDefaultArgs = nullptr);
};
```

## Code Explanation

###
-  `#pragma once` - Prevents multiple inclusion of this header file
-  `#include "Token.h"` - Includes token type definitions
-  `#include "AST.h"` - Includes Abstract Syntax Tree definitions
-  `#include <vector>` - Includes vector for storing tokens
-  `#include <stdexcept>` - Includes standard exception classes

###

####
-  `class ParseError : public std::runtime_error` - Declares ParseError class inheriting from std::runtime_error

####
-  `public:` - Starts the public section

####
-  `int line, col;` - Stores line and column where the parse error occurred

####
-  `ParseError(const std::string &msg, int l, int c)` - Constructor taking error message, line, and column
-  `: std::runtime_error(msg), line(l), col(c) {}` - Constructor initializer list that:
  - Calls base class constructor with error message
  - Initializes line and column members
-  Empty line for readability

-  `};` - Closing brace for ParseError class

###
-  `class Parser` - Declares the Parser class that converts tokens into AST

###

####
-  `public:` - Starts the public section of the Parser class
-  `explicit Parser(std::vector<Token> tokens);` - Constructor that takes vector of tokens
  - `explicit` prevents implicit conversions

####
-  `ASTNodePtr parse();` - Main method that parses tokens into an AST node

###
-  `private:` - Starts the private section of the class

###

####
-  `std::vector<Token> tokens;` - Stores the tokens to be parsed
-  `size_t pos;` - Current position in the token vector
-  Empty line for readability

###

####
-  Comment indicating token helpers section
-  `Token &current();` - Returns the current token
-  `Token &peek(int offset = 1);` - Looks ahead at token with optional offset
-  `Token &consume();` - Consumes and advances to next token
-  `Token &expect(TokenType t, const std::string &msg);` - Expects a specific token type or throws error
-  Empty line for readability

####
-  `bool check(TokenType t) const;` - Checks if current token matches type
-  `bool match(TokenType t);` - Matches and consumes if token type matches
-  `bool atEnd() const;` - Checks if at end of token stream

####
-  `void skipNewlines();` - Skips newline tokens
-  Empty line for readability

###

####
-  Comment indicating parsing methods section
-  `ASTNodePtr parseStatement();` - Parses a general statement
-  `ASTNodePtr parseBlock();` - Parses a block of statements
-  `ASTNodePtr parseBodyOrStatement(); // block OR single statement (brace-optional)` - Parses block or single statement

####
-  `ASTNodePtr parseVarDecl(bool isConst);` - Parses variable declarations
-  `ASTNodePtr parseFunctionDecl();` - Parses function declarations
-  `ASTNodePtr parseClassDecl();` - Parses class declarations

####
-  `ASTNodePtr parseIfStmt();` - Parses if statements
-  `ASTNodePtr parseWhileStmt();` - Parses while loops
-  `ASTNodePtr parseForStmt();` - Parses for loops
-  `ASTNodePtr parseReturnStmt();` - Parses return statements
-  Empty line for readability

####
-  `ASTNodePtr parsePrintStmt();` - Parses print statements
-  `ASTNodePtr parseInputStmt();` - Parses input statements
-  `ASTNodePtr parseCoutStmt(); // cout << x << y << endl` - Parses C++ cout statements
-  `ASTNodePtr parseCinStmt();  // cin >> x >> y` - Parses C++ cin statements

####
-  `ASTNodePtr parseImportStmt(bool isFrom = false);` - Parses import statements
-  `ASTNodePtr parseExprStmt();` - Parses expression statements
-  `ASTNodePtr parseCTypeVarDecl(const std::string &typeHint); // int x = ...  / int* p = ...` - Parses C-style variable declarations
-  `bool isCTypeKeyword(TokenType t) const;` - Checks if token is a C type keyword
-  Empty line for readability
-  Empty line for readability

###

####
-  Comment indicating Pratt-style precedence parsing
-  `ASTNodePtr parseExpr();` - Main expression parsing entry point
-  `ASTNodePtr parseAssignment();` - Parses assignment expressions

####
-  `ASTNodePtr parseOr();` - Parses logical OR expressions
-  `ASTNodePtr parseAnd();` - Parses logical AND expressions

####
-  `ASTNodePtr parseBitwise();` - Parses bitwise operations
-  `ASTNodePtr parseEquality();` - Parses equality comparisons
-  `ASTNodePtr parseComparison();` - Parses comparison operations
-  `ASTNodePtr parseShift();` - Parses bit shift operations
-  Empty line for readability

####
-  `ASTNodePtr parseAddSub();` - Parses addition and subtraction
-  `ASTNodePtr parseMulDiv();` - Parses multiplication and division
-  `ASTNodePtr parsePower();` - Parses exponentiation
-  Empty line for readability

####
-  `ASTNodePtr parseUnary();` - Parses unary operations
-  `ASTNodePtr parsePostfix();` - Parses postfix operations
-  `ASTNodePtr parsePrimary();` - Parses primary expressions (literals, identifiers)
-  Empty line for readability

###

####
-  `ASTNodePtr parseArrayLiteral();` - Parses array literals
-  `ASTNodePtr parseDictLiteral();` - Parses dictionary literals

####
-  `ASTNodePtr parseLambda();` - Parses lambda expressions
-  `ASTNodePtr parseArrowFunction(std::vector<std::string> params, int ln);` - Parses arrow functions
-  `std::vector<ASTNodePtr> parseArgList();` - Parses function argument lists

####
-  `// Returns param names; populates outIsRef with true for each & (reference) param` - Comment explaining parameter parsing
-  `std::vector<std::string> parseParamList(std::vector<bool> *outIsRef = nullptr, std::vector<ASTNodePtr> *outDefaultArgs = nullptr);` - Parses function parameter lists with reference and default argument support

###
-  `};` - Closing brace for the Parser class

## Summary

This header file defines the parser for the Quantum Language compiler with:

### Error Handling
- **ParseError Class**: Custom exception with line/column information for precise error reporting

### Core Functionality
- **Token Processing**: Manages token stream with position tracking
- **AST Generation**: Converts tokens into Abstract Syntax Tree
- **Pratt Parsing**: Uses precedence-based parsing for expressions

### Statement Parsing
- **Declarations**: Variables, functions, classes with C-style type hints
- **Control Flow**: If statements, loops, returns
- **I/O Operations**: Print, input, and C++ style cout/cin statements
- **Modules**: Import statement handling

### Expression Parsing
- **Precedence Hierarchy**: From assignment down to primary expressions
- **Operator Types**: Logical, bitwise, comparison, arithmetic operations
- **Advanced Features**: Unary, postfix, and function call parsing

### Language Features
- **Multi-paradigm**: Supports both Python-like and C++ syntax
- **Type System**: C-style type hints and pointer declarations
- **Functions**: Lambda expressions and arrow functions
- **Collections**: Array and dictionary literals

### Design Patterns
- **Pratt Parser**: Efficient precedence-based expression parsing
- **Recursive Descent**: Clear structure for statement parsing
- **Error Recovery**: Detailed error reporting with source locations

The parser serves as the second phase of compilation, transforming the token stream from the lexer into a structured AST that the interpreter can execute, supporting a rich set of language features from multiple programming paradigms.
