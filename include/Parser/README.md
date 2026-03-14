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

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-5)
- **Line 1**: `#pragma once` - Prevents multiple inclusion of this header file
- **Line 2**: `#include "Token.h"` - Includes token type definitions
- **Line 3**: `#include "AST.h"` - Includes Abstract Syntax Tree definitions
- **Line 4**: `#include <vector>` - Includes vector for storing tokens
- **Line 5**: `#include <stdexcept>` - Includes standard exception classes

### ParseError Class (Lines 7-13)

#### Class Declaration (Line 7)
- **Line 7**: `class ParseError : public std::runtime_error` - Declares ParseError class inheriting from std::runtime_error

#### Public Section (Line 8)
- **Line 8**: `public:` - Starts the public section

#### Member Variables (Line 9)
- **Line 9**: `int line, col;` - Stores line and column where the parse error occurred

#### Constructor (Lines 10-12)
- **Line 10**: `ParseError(const std::string &msg, int l, int c)` - Constructor taking error message, line, and column
- **Line 11**: `: std::runtime_error(msg), line(l), col(c) {}` - Constructor initializer list that:
  - Calls base class constructor with error message
  - Initializes line and column members
- **Line 12**: Empty line for readability

- **Line 13**: `};` - Closing brace for ParseError class

### Parser Class Declaration (Line 14)
- **Line 14**: `class Parser` - Declares the Parser class that converts tokens into AST

### Public Interface (Lines 15-19)

#### Constructor (Line 15)
- **Line 15**: `public:` - Starts the public section of the Parser class
- **Line 16**: `explicit Parser(std::vector<Token> tokens);` - Constructor that takes vector of tokens
  - `explicit` prevents implicit conversions

#### Main Parsing Method (Line 17)
- **Line 17**: `ASTNodePtr parse();` - Main method that parses tokens into an AST node

### Private Section (Line 18)
- **Line 18**: `private:` - Starts the private section of the class

### Private Member Variables (Lines 19-21)

#### Token Storage (Lines 19-21)
- **Line 19**: `std::vector<Token> tokens;` - Stores the tokens to be parsed
- **Line 20**: `size_t pos;` - Current position in the token vector
- **Line 21**: Empty line for readability

### Token Helper Methods (Lines 22-30)

#### Basic Token Access (Lines 22-27)
- **Line 22**: Comment indicating token helpers section
- **Line 23**: `Token &current();` - Returns the current token
- **Line 24**: `Token &peek(int offset = 1);` - Looks ahead at token with optional offset
- **Line 25**: `Token &consume();` - Consumes and advances to next token
- **Line 26**: `Token &expect(TokenType t, const std::string &msg);` - Expects a specific token type or throws error
- **Line 27**: Empty line for readability

#### Token Checking Methods (Lines 28-30)
- **Line 28**: `bool check(TokenType t) const;` - Checks if current token matches type
- **Line 29**: `bool match(TokenType t);` - Matches and consumes if token type matches
- **Line 30**: `bool atEnd() const;` - Checks if at end of token stream

#### Newline Handling (Line 31)
- **Line 31**: `void skipNewlines();` - Skips newline tokens
- **Line 32**: Empty line for readability

### Statement Parsing Methods (Lines 33-54)

#### Basic Statement Parsing (Lines 33-36)
- **Line 33**: Comment indicating parsing methods section
- **Line 34**: `ASTNodePtr parseStatement();` - Parses a general statement
- **Line 35**: `ASTNodePtr parseBlock();` - Parses a block of statements
- **Line 36**: `ASTNodePtr parseBodyOrStatement(); // block OR single statement (brace-optional)` - Parses block or single statement

#### Declaration Parsing (Lines 37-39)
- **Line 37**: `ASTNodePtr parseVarDecl(bool isConst);` - Parses variable declarations
- **Line 38**: `ASTNodePtr parseFunctionDecl();` - Parses function declarations
- **Line 39**: `ASTNodePtr parseClassDecl();` - Parses class declarations

#### Control Flow Parsing (Lines 40-44)
- **Line 40**: `ASTNodePtr parseIfStmt();` - Parses if statements
- **Line 41**: `ASTNodePtr parseWhileStmt();` - Parses while loops
- **Line 42**: `ASTNodePtr parseForStmt();` - Parses for loops
- **Line 43**: `ASTNodePtr parseReturnStmt();` - Parses return statements
- **Line 44**: Empty line for readability

#### I/O Statement Parsing (Lines 45-48)
- **Line 45**: `ASTNodePtr parsePrintStmt();` - Parses print statements
- **Line 46**: `ASTNodePtr parseInputStmt();` - Parses input statements
- **Line 47**: `ASTNodePtr parseCoutStmt(); // cout << x << y << endl` - Parses C++ cout statements
- **Line 48**: `ASTNodePtr parseCinStmt();  // cin >> x >> y` - Parses C++ cin statements

#### Other Statement Parsing (Lines 49-54)
- **Line 49**: `ASTNodePtr parseImportStmt(bool isFrom = false);` - Parses import statements
- **Line 50**: `ASTNodePtr parseExprStmt();` - Parses expression statements
- **Line 51**: `ASTNodePtr parseCTypeVarDecl(const std::string &typeHint); // int x = ...  / int* p = ...` - Parses C-style variable declarations
- **Line 52**: `bool isCTypeKeyword(TokenType t) const;` - Checks if token is a C type keyword
- **Line 53**: Empty line for readability
- **Line 54**: Empty line for readability

### Expression Parsing Methods (Lines 55-70)

#### Expression Entry Point (Lines 55-57)
- **Line 55**: Comment indicating Pratt-style precedence parsing
- **Line 56**: `ASTNodePtr parseExpr();` - Main expression parsing entry point
- **Line 57**: `ASTNodePtr parseAssignment();` - Parses assignment expressions

#### Logical Expression Parsing (Lines 58-59)
- **Line 58**: `ASTNodePtr parseOr();` - Parses logical OR expressions
- **Line 59**: `ASTNodePtr parseAnd();` - Parses logical AND expressions

#### Bitwise and Comparison Parsing (Lines 60-64)
- **Line 60**: `ASTNodePtr parseBitwise();` - Parses bitwise operations
- **Line 61**: `ASTNodePtr parseEquality();` - Parses equality comparisons
- **Line 62**: `ASTNodePtr parseComparison();` - Parses comparison operations
- **Line 63**: `ASTNodePtr parseShift();` - Parses bit shift operations
- **Line 64**: Empty line for readability

#### Arithmetic Expression Parsing (Lines 65-68)
- **Line 65**: `ASTNodePtr parseAddSub();` - Parses addition and subtraction
- **Line 66**: `ASTNodePtr parseMulDiv();` - Parses multiplication and division
- **Line 67**: `ASTNodePtr parsePower();` - Parses exponentiation
- **Line 68**: Empty line for readability

#### Unary and Postfix Parsing (Lines 69-70)
- **Line 69**: `ASTNodePtr parseUnary();` - Parses unary operations
- **Line 70**: `ASTNodePtr parsePostfix();` - Parses postfix operations
- **Line 71**: `ASTNodePtr parsePrimary();` - Parses primary expressions (literals, identifiers)
- **Line 72**: Empty line for readability

### Literal and Function Parsing (Lines 73-78)

#### Collection Literals (Lines 73-74)
- **Line 73**: `ASTNodePtr parseArrayLiteral();` - Parses array literals
- **Line 74**: `ASTNodePtr parseDictLiteral();` - Parses dictionary literals

#### Function Parsing (Lines 75-78)
- **Line 75**: `ASTNodePtr parseLambda();` - Parses lambda expressions
- **Line 76**: `ASTNodePtr parseArrowFunction(std::vector<std::string> params, int ln);` - Parses arrow functions
- **Line 77**: `std::vector<ASTNodePtr> parseArgList();` - Parses function argument lists

#### Parameter Parsing (Lines 78-79)
- **Line 78**: `// Returns param names; populates outIsRef with true for each & (reference) param` - Comment explaining parameter parsing
- **Line 79**: `std::vector<std::string> parseParamList(std::vector<bool> *outIsRef = nullptr, std::vector<ASTNodePtr> *outDefaultArgs = nullptr);` - Parses function parameter lists with reference and default argument support

### Class Closing (Line 80)
- **Line 80**: `};` - Closing brace for the Parser class

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
