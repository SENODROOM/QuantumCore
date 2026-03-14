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

## Line-by-Line Explanation

### Header Guard and Include (Lines 1-2)
- **Line 1**: `#pragma once` - Prevents the header from being included multiple times
- **Line 2**: `#include <string>` - Includes string functionality for token values

### TokenType Enum Declaration (Line 3)
- **Line 3**: `enum class TokenType` - Declares a strongly-typed enumeration for token types

### Literal Token Types (Lines 5-12)

#### Basic Literals (Lines 5-12)
- **Line 5**: Comment indicating literal token types section
- **Line 6**: `NUMBER,` - Numeric literals (e.g., 42, 3.14)
- **Line 7**: `STRING,` - String literals (e.g., "hello")
- **Line 8**: `TEMPLATE_STRING, // backtick template literal segment (text before ${)` - Template literal segments
- **Line 9**: `BOOL_TRUE,` - Boolean true literal
- **Line 10**: `BOOL_FALSE,` - Boolean false literal
- **Line 11**: `NIL,` - Null/nil literal
- **Line 12**: Empty line for readability

### Identifier and Keyword Token Types (Lines 13-58)

#### Basic Keywords (Lines 13-16)
- **Line 13**: Comment indicating identifiers and keywords section
- **Line 14**: `IDENTIFIER,` - Variable and function names
- **Line 15**: `LET,` - Variable declaration keyword (JavaScript-style)
- **Line 16**: `CONST,` - Constant declaration keyword

#### Function Keywords (Lines 17-19)
- **Line 17**: `FN,` - Function keyword (short form)
- **Line 18**: `DEF,      // Python: def` - Function definition (Python-style)
- **Line 19**: `FUNCTION, // JavaScript: function` - Function keyword (JavaScript-style)

#### Object-Oriented Keywords (Lines 20-25)
- **Line 20**: `CLASS,    // class keyword` - Class declaration
- **Line 21**: `EXTENDS,  // extends / inherits` - Inheritance keyword
- **Line 22**: `NEW,      // new keyword` - Object instantiation
- **Line 23**: `THIS,     // this (JS alias for self)` - Self-reference
- **Line 24**: `SUPER,    // super keyword` - Parent class reference
- **Line 25**: Empty line for readability

#### Control Flow Keywords (Lines 26-44)
- **Line 26**: `RETURN,` - Return statement
- **Line 27**: `IF,` - Conditional statement
- **Line 28**: `ELSE,` - Else clause
- **Line 29**: `ELIF,` - Else if clause (Python-style)
- **Line 30**: `WHILE,` - While loop
- **Line 31**: `FOR,` - For loop
- **Line 32**: `IN,` - Iteration keyword
- **Line 33**: `OF, // JavaScript for...of` - For-of loop (JavaScript-style)
- **Line 34**: `BREAK,` - Loop break
- **Line 35**: `CONTINUE,` - Loop continue
- **Line 36**: `RAISE,` - Exception throwing
- **Line 37**: `TRY,` - Exception handling start
- **Line 38**: `EXCEPT,` - Exception handler (Python-style)
- **Line 39**: `FINALLY,` - Exception cleanup
- **Line 40**: `AS,` - Exception alias (Python-style)
- **Line 41**: Empty line for readability

#### I/O Keywords (Lines 42-45)
- **Line 42**: `PRINT,` - Print statement
- **Line 43**: `INPUT,` - Input statement
- **Line 44**: `COUT, // cout` - C++ output stream
- **Line 45**: `CIN,  // cin` - C++ input stream

#### Import Keywords (Lines 46-48)
- **Line 46**: `FROM,` - Import from module
- **Line 47**: `IMPORT,` - Import statement
- **Line 48**: Empty line for readability

### C/C++ Type Keywords (Lines 49-58)

#### Basic Types (Lines 49-58)
- **Line 49**: Comment indicating C/C++ style type keywords
- **Line 50**: `TYPE_INT,` - Integer type
- **Line 51**: `TYPE_FLOAT,` - Float type
- **Line 52**: `TYPE_DOUBLE,` - Double precision type
- **Line 53**: `TYPE_CHAR,` - Character type
- **Line 54**: `TYPE_STRING,` - String type
- **Line 55**: `TYPE_BOOL,` - Boolean type
- **Line 56**: `TYPE_VOID,` - Void type
- **Line 57**: `TYPE_LONG,` - Long integer type
- **Line 58**: `TYPE_SHORT,` - Short integer type
- **Line 59**: `TYPE_UNSIGNED,` - Unsigned type modifier

### Cybersecurity Keywords (Lines 60-65)

#### Future Security Features (Lines 60-65)
- **Line 60**: Comment indicating cybersecurity reserved keywords
- **Line 61**: `SCAN,` - Network scanning
- **Line 62**: `PAYLOAD,` - Attack payload
- **Line 63**: `ENCRYPT,` - Encryption operation
- **Line 64**: `DECRYPT,` - Decryption operation
- **Line 65**: `HASH,` - Hashing operation

### Operator Token Types (Lines 66-106)

#### Arithmetic Operators (Lines 66-73)
- **Line 66**: Comment indicating operators section
- **Line 67**: `PLUS,` - Addition (+)
- **Line 68**: `MINUS,` - Subtraction (-)
- **Line 69**: `STAR,` - Multiplication (*)
- **Line 70**: `SLASH,` - Division (/)
- **Line 71**: `FLOOR_DIV, // // integer division (Python)` - Integer division (//)
- **Line 72**: `PERCENT,` - Modulo (%)
- **Line 73**: `POWER,` - Exponentiation (** or ^)

#### Comparison Operators (Lines 74-84)
- **Line 74**: `EQ,         // ==` - Equality comparison
- **Line 75**: `NEQ,        // !=` - Not equal comparison
- **Line 76**: `STRICT_EQ,  // ===` - Strict equality (JavaScript)
- **Line 77**: `STRICT_NEQ, // !==` - Strict not equal (JavaScript)
- **Line 78**: `NULL_COALESCE, // ??` - Null coalescing operator
- **Line 79**: `LT,` - Less than (<)
- **Line 80**: `GT,` - Greater than (>)
- **Line 81**: `LTE,` - Less than or equal (<=)
- **Line 82**: `GTE,` - Greater than or equal (>=)
- **Line 83**: Empty line for readability

#### Logical Operators (Lines 84-88)
- **Line 84**: `AND,` - Logical and
- **Line 85**: `OR,` - Logical or
- **Line 86**: `NOT,` - Logical not
- **Line 87**: `IS,` - Identity comparison
- **Line 88**: Empty line for readability

#### Assignment Operators (Lines 89-100)
- **Line 89**: `ASSIGN,` - Simple assignment (=)
- **Line 90**: `PLUS_ASSIGN,` - Addition assignment (+=)
- **Line 91**: `MINUS_ASSIGN,` - Subtraction assignment (-=)
- **Line 92**: `STAR_ASSIGN,` - Multiplication assignment (*=)
- **Line 93**: `SLASH_ASSIGN,` - Division assignment (/=)
- **Line 94**: `AND_ASSIGN, // &=` - Bitwise and assignment
- **Line 95**: `OR_ASSIGN,  // |=` - Bitwise or assignment
- **Line 96**: `XOR_ASSIGN, // ^=` - Bitwise xor assignment
- **Line 97**: `MOD_ASSIGN, // %=` - Modulo assignment
- **Line 98**: Empty line for readability

#### Special Operators (Lines 99-106)
- **Line 99**: `FAT_ARROW,  // =>` - Arrow function (=>)
- **Line 100**: `PLUS_PLUS,` - Increment (++)
- **Line 101**: `MINUS_MINUS,` - Decrement (--)
- **Line 102**: `BIT_AND,` - Bitwise and (&)
- **Line 103**: `BIT_OR,` - Bitwise or (|)
- **Line 104**: `BIT_XOR,` - Bitwise xor (^)
- **Line 105**: `BIT_NOT,` - Bitwise not (~)
- **Line 106**: Empty line for readability

#### Shift and Logical Operators (Lines 107-108)
- **Line 107**: `LSHIFT,` - Left shift (<<)
- **Line 108**: `RSHIFT,` - Right shift (>>)
- **Line 109**: `AND_AND, // &&` - Logical and (&&)
- **Line 110**: `OR_OR,   // ||` - Logical or (||)
- **Line 111**: Empty line for readability

### Delimiter Token Types (Lines 112-127)

#### Brackets and Punctuation (Lines 112-127)
- **Line 112**: Comment indicating delimiters section
- **Line 113**: `LPAREN,` - Left parenthesis (()
- **Line 114**: `RPAREN,` - Right parenthesis ())
- **Line 115**: `LBRACE,` - Left brace ({)
- **Line 116**: `RBRACE,` - Right brace (})
- **Line 117**: `LBRACKET,` - Left bracket ([)
- **Line 118**: `RBRACKET,` - Right bracket (])
- **Line 119**: `COMMA,` - Comma (,)
- **Line 120**: `SEMICOLON,` - Semicolon (;)
- **Line 121**: `COLON,` - Colon (:)
- **Line 122**: `DOT,` - Dot (.)
- **Line 123**: `ARROW,` - Arrow (->)
- **Line 124**: `QUESTION,` - Question mark (?)
- **Line 125**: `DECORATOR,` - Decorator (@)
- **Line 126**: `NEWLINE,` - Newline character
- **Line 127**: Empty line for readability

### Special Token Types (Lines 128-132)

#### End and Control Tokens (Lines 128-132)
- **Line 128**: Comment indicating special tokens
- **Line 129**: `EOF_TOKEN,` - End of file marker
- **Line 130**: `UNKNOWN,` - Unknown/unrecognized token
- **Line 131**: `INDENT, // Python-style indentation block start` - Indentation increase
- **Line 132**: `DEDENT, // Python-style indentation block end` - Indentation decrease

### Token Structure Declaration (Lines 133-142)

#### Token Struct Definition (Lines 133-142)
- **Line 133**: `struct Token` - Declares the Token structure
- **Line 134**: `{` - Opening brace for struct definition
- **Line 135**: `TokenType type;` - Token type enumeration
- **Line 136**: `std::string value;` - Token text value
- **Line 137**: `int line;` - Line number where token appears
- **Line 138**: `int col;` - Column number where token appears
- **Line 139**: Empty line for readability

#### Token Constructor (Lines 140-141)
- **Line 140**: `Token(TokenType t, std::string v, int ln, int c)` - Constructor taking type, value, line, and column
- **Line 141**: `: type(t), value(std::move(v)), line(ln), col(c) {}` - Constructor initializer list that:
  - Sets token type
  - Moves string value (efficient transfer)
  - Sets line and column numbers

#### Token Method (Line 142)
- **Line 142**: `std::string toString() const;` - Method to convert token to string representation

### Struct Closing (Line 143)
- **Line 143**: `};` - Closing brace for Token struct

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
