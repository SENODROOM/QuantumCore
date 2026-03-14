# Token.h - Token Header File Explanation

## Complete Code

```cpp
#pragma once
#include <string>

enum class TokenType
{
    // Literals
    NUMBER,
    STRING,
    TEMPLATE_STRING, // backtick template literal segment (text before ${)
    BOOL_TRUE,
    BOOL_FALSE,
    NIL,

    // Identifiers & Keywords
    IDENTIFIER,
    LET,
    CONST,
    FN,
    DEF,      // Python: def
    FUNCTION, // JavaScript: function
    CLASS,    // class keyword
    EXTENDS,  // extends / inherits
    NEW,      // new keyword
    THIS,     // this (JS alias for self)
    SUPER,    // super keyword
    RETURN,
    IF,
    ELSE,
    ELIF,
    WHILE,
    FOR,
    IN,
    OF, // JavaScript for...of
    BREAK,
    CONTINUE,
    RAISE,
    TRY,
    EXCEPT,
    FINALLY,
    AS,
    PRINT,
    INPUT,
    COUT, // cout
    CIN,  // cin
    FROM,
    IMPORT,
    // C/C++ style type keywords
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_DOUBLE,
    TYPE_CHAR,
    TYPE_STRING,
    TYPE_BOOL,
    TYPE_VOID,
    TYPE_LONG,
    TYPE_SHORT,
    TYPE_UNSIGNED,

    // Cybersecurity reserved keywords (future)
    SCAN,
    PAYLOAD,
    ENCRYPT,
    DECRYPT,
    HASH,

    // Operators
    PLUS,
    MINUS,
    STAR,
    SLASH,
    FLOOR_DIV, // // integer division (Python)
    PERCENT,
    POWER,
    EQ,         // ==
    NEQ,        // !=
    STRICT_EQ,  // ===
    STRICT_NEQ, // !==
    NULL_COALESCE, // ??
    LT,
    GT,
    LTE,
    GTE,
    AND,
    OR,
    NOT,
    IS,
    ASSIGN,
    PLUS_ASSIGN,
    MINUS_ASSIGN,
    STAR_ASSIGN,
    SLASH_ASSIGN,
    AND_ASSIGN, // &=
    OR_ASSIGN,  // |=
    XOR_ASSIGN, // ^=
    MOD_ASSIGN, // %=
    FAT_ARROW,  // =>
    PLUS_PLUS,
    MINUS_MINUS,
    BIT_AND,
    BIT_OR,
    BIT_XOR,
    BIT_NOT,
    LSHIFT,
    RSHIFT,
    AND_AND, // &&
    OR_OR,   // ||

    // Delimiters
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    LBRACKET,
    RBRACKET,
    COMMA,
    SEMICOLON,
    COLON,
    DOT,
    ARROW,
    QUESTION,
    DECORATOR,
    NEWLINE,
    
    // Special
    EOF_TOKEN,
    UNKNOWN,
    INDENT, // Python-style indentation block start
    DEDENT, // Python-style indentation block end
};

struct Token
{
    TokenType type;
    std::string value;
    int line;
    int col;

    Token(TokenType t, std::string v, int ln, int c)
        : type(t), value(std::move(v)), line(ln), col(c) {}

    std::string toString() const;
};
```

## Code Explanation

###
-  `#pragma once` - Prevents the header from being included multiple times
-  `#include <string>` - Includes string functionality for token values

###
-  `enum class TokenType` - Declares a strongly-typed enumeration for token types

###

####
-  Comment indicating literal token types section
-  `NUMBER,` - Numeric literals (e.g., 42, 3.14)
-  `STRING,` - String literals (e.g., "hello")
-  `TEMPLATE_STRING, // backtick template literal segment (text before ${)` - Template literal segments
-  `BOOL_TRUE,` - Boolean true literal
-  `BOOL_FALSE,` - Boolean false literal
-  `NIL,` - Null/nil literal
-  Empty line for readability

###

####
-  Comment indicating identifiers and keywords section
-  `IDENTIFIER,` - Variable and function names
-  `LET,` - Variable declaration keyword (JavaScript-style)
-  `CONST,` - Constant declaration keyword

####
-  `FN,` - Function keyword (short form)
-  `DEF,      // Python: def` - Function definition (Python-style)
-  `FUNCTION, // JavaScript: function` - Function keyword (JavaScript-style)

####
-  `CLASS,    // class keyword` - Class declaration
-  `EXTENDS,  // extends / inherits` - Inheritance keyword
-  `NEW,      // new keyword` - Object instantiation
-  `THIS,     // this (JS alias for self)` - Self-reference
-  `SUPER,    // super keyword` - Parent class reference
-  Empty line for readability

####
-  `RETURN,` - Return statement
-  `IF,` - Conditional statement
-  `ELSE,` - Else clause
-  `ELIF,` - Else if clause (Python-style)
-  `WHILE,` - While loop
-  `FOR,` - For loop
-  `IN,` - Iteration keyword
-  `OF, // JavaScript for...of` - For-of loop (JavaScript-style)
-  `BREAK,` - Loop break
-  `CONTINUE,` - Loop continue
-  `RAISE,` - Exception throwing
-  `TRY,` - Exception handling start
-  `EXCEPT,` - Exception handler (Python-style)
-  `FINALLY,` - Exception cleanup
-  `AS,` - Exception alias (Python-style)
-  Empty line for readability

####
-  `PRINT,` - Print statement
-  `INPUT,` - Input statement
-  `COUT, // cout` - C++ output stream
-  `CIN,  // cin` - C++ input stream

####
-  `FROM,` - Import from module
-  `IMPORT,` - Import statement
-  Empty line for readability

###

####
-  Comment indicating C/C++ style type keywords
-  `TYPE_INT,` - Integer type
-  `TYPE_FLOAT,` - Float type
-  `TYPE_DOUBLE,` - Double precision type
-  `TYPE_CHAR,` - Character type
-  `TYPE_STRING,` - String type
-  `TYPE_BOOL,` - Boolean type
-  `TYPE_VOID,` - Void type
-  `TYPE_LONG,` - Long integer type
-  `TYPE_SHORT,` - Short integer type
-  `TYPE_UNSIGNED,` - Unsigned type modifier

###

####
-  Comment indicating cybersecurity reserved keywords
-  `SCAN,` - Network scanning
-  `PAYLOAD,` - Attack payload
-  `ENCRYPT,` - Encryption operation
-  `DECRYPT,` - Decryption operation
-  `HASH,` - Hashing operation

###

####
-  Comment indicating operators section
-  `PLUS,` - Addition (+)
-  `MINUS,` - Subtraction (-)
-  `STAR,` - Multiplication (*)
-  `SLASH,` - Division (/)
-  `FLOOR_DIV, // // integer division (Python)` - Integer division (//)
-  `PERCENT,` - Modulo (%)
-  `POWER,` - Exponentiation (** or ^)

####
-  `EQ,         // ==` - Equality comparison
-  `NEQ,        // !=` - Not equal comparison
-  `STRICT_EQ,  // ===` - Strict equality (JavaScript)
-  `STRICT_NEQ, // !==` - Strict not equal (JavaScript)
-  `NULL_COALESCE, // ??` - Null coalescing operator
-  `LT,` - Less than (<)
-  `GT,` - Greater than (>)
-  `LTE,` - Less than or equal (<=)
-  `GTE,` - Greater than or equal (>=)
-  Empty line for readability

####
-  `AND,` - Logical and
-  `OR,` - Logical or
-  `NOT,` - Logical not
-  `IS,` - Identity comparison
-  Empty line for readability

####
-  `ASSIGN,` - Simple assignment (=)
-  `PLUS_ASSIGN,` - Addition assignment (+=)
-  `MINUS_ASSIGN,` - Subtraction assignment (-=)
-  `STAR_ASSIGN,` - Multiplication assignment (*=)
-  `SLASH_ASSIGN,` - Division assignment (/=)
-  `AND_ASSIGN, // &=` - Bitwise and assignment
-  `OR_ASSIGN,  // |=` - Bitwise or assignment
-  `XOR_ASSIGN, // ^=` - Bitwise xor assignment
-  `MOD_ASSIGN, // %=` - Modulo assignment
-  Empty line for readability

####
-  `FAT_ARROW,  // =>` - Arrow function (=>)
-  `PLUS_PLUS,` - Increment (++)
-  `MINUS_MINUS,` - Decrement (--)
-  `BIT_AND,` - Bitwise and (&)
-  `BIT_OR,` - Bitwise or (|)
-  `BIT_XOR,` - Bitwise xor (^)
-  `BIT_NOT,` - Bitwise not (~)
-  Empty line for readability

####
-  `LSHIFT,` - Left shift (<<)
-  `RSHIFT,` - Right shift (>>)
-  `AND_AND, // &&` - Logical and (&&)
-  `OR_OR,   // ||` - Logical or (||)
-  Empty line for readability

###

####
-  Comment indicating delimiters section
-  `LPAREN,` - Left parenthesis (()
-  `RPAREN,` - Right parenthesis ())
-  `LBRACE,` - Left brace ({)
-  `RBRACE,` - Right brace (})
-  `LBRACKET,` - Left bracket ([)
-  `RBRACKET,` - Right bracket (])
-  `COMMA,` - Comma (,)
-  `SEMICOLON,` - Semicolon (;)
-  `COLON,` - Colon (:)
-  `DOT,` - Dot (.)
-  `ARROW,` - Arrow (->)
-  `QUESTION,` - Question mark (?)
-  `DECORATOR,` - Decorator (@)
-  `NEWLINE,` - Newline character
-  Empty line for readability

###

####
-  Comment indicating special tokens
-  `EOF_TOKEN,` - End of file marker
-  `UNKNOWN,` - Unknown/unrecognized token
-  `INDENT, // Python-style indentation block start` - Indentation increase
-  `DEDENT, // Python-style indentation block end` - Indentation decrease

###

####
-  `struct Token` - Declares the Token structure
-  `{` - Opening brace for struct definition
-  `TokenType type;` - Token type enumeration
-  `std::string value;` - Token text value
-  `int line;` - Line number where token appears
-  `int col;` - Column number where token appears
-  Empty line for readability

####
-  `Token(TokenType t, std::string v, int ln, int c)` - Constructor taking type, value, line, and column
-  `: type(t), value(std::move(v)), line(ln), col(c) {}` - Constructor initializer list that:
  - Sets token type
  - Moves string value (efficient transfer)
  - Sets line and column numbers

####
-  `std::string toString() const;` - Method to convert token to string representation

###
-  `};` - Closing brace for Token struct

## Summary

This header file defines the complete token system for the Quantum Language compiler with:

### Comprehensive Token Coverage
- **Literals**: Numbers, strings, booleans, null values, and template literals
- **Keywords**: Multi-paradigm keywords from Python, JavaScript, and C++
- **Operators**: Complete set of arithmetic, logical, bitwise, and assignment operators
- **Delimiters**: All punctuation and bracket types
- **Special Tokens**: End-of-file, indentation, and error markers

### Multi-Paradigm Support
- **Python-style**: `def`, `elif`, `try/except`, indentation tokens
- **JavaScript-style**: `function`, `let`, `const`, `===`, `??`
- **C++ style**: Type keywords, `cout/cin`, pointer operators
- **Cybersecurity**: Reserved keywords for future security features

### Key Features
- **Strong Typing**: `enum class` prevents accidental type conversions
- **Source Location**: Line and column tracking for precise error reporting
- **Efficient Design**: Move semantics for string values
- **Extensible**: Easy to add new token types for language evolution

### Language Integration
The token system supports the Quantum Language's goal of being a multi-paradigm language that combines the best features from multiple programming languages while adding specialized cybersecurity capabilities. The comprehensive token set enables rich syntax expression and clear error reporting throughout the compilation process.
