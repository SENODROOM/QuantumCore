# QuantumLanguage Compiler - Token.h

## Overview

The `include/Token.h` header file is an essential component of the QuantumLanguage compiler, responsible for representing tokens within the language. Tokens serve as the smallest units of meaningful elements in the source code, such as keywords, identifiers, literals, operators, and delimiters. This file defines the `TokenType` enum and the `Token` struct, which are used throughout the compiler to parse and process the input source code.

## Key Design Decisions

### Enum Class `TokenType`
- **Purpose**: To define a comprehensive set of token types that cover all possible lexical elements in the QuantumLanguage.
- **Why**: Using an enum class ensures type safety and makes it clear that `TokenType` can only take on predefined values. It also allows for easy expansion and maintenance of the token list without affecting existing code.

### Struct `Token`
- **Purpose**: To encapsulate the properties of a token, including its type, value, line number, and column position.
- **Why**: The `Token` struct provides a structured way to store and access token information. By separating the token's type and value into distinct members, the compiler can efficiently categorize and utilize tokens during parsing and semantic analysis phases.

## Classes and Functions Documentation

### Enum Class `TokenType`
Represents different types of tokens in the QuantumLanguage.

**Members**:
- **NUMBER**: Represents numeric literals.
- **STRING**: Represents string literals.
- **TEMPLATE_STRING**: Represents template string segments.
- **BOOL_TRUE** and **BOOL_FALSE**: Represent boolean literals.
- **NIL**: Represents the nil or null value.
- **IDENTIFIER**: Represents variable names and function/class names.
- **LET**, **CONST**: Keyword for declaring variables.
- **FN**, **DEF**, **FUNCTION**: Keywords for defining functions.
- **CLASS**, **EXTENDS**: Keywords for defining and extending classes.
- **NEW**, **THIS**, **SUPER**: Keywords related to object-oriented programming.
- **RETURN**: Keyword for returning values from functions.
- **IF**, **ELSE**, **ELIF**, **WHILE**, **FOR**, **IN**, **OF**: Control flow statements.
- **BREAK**, **CONTINUE**: Loop control statements.
- **RAISE**, **TRY**, **EXCEPT**, **FINALLY**, **AS**: Exception handling keywords.
- **PRINT**, **INPUT**: I/O operations.
- **COUT**, **CIN**: C++ I/O stream operations.
- **FROM**, **IMPORT**: Module import statements.
- **TYPE_INT**, **TYPE_FLOAT**, **TYPE_DOUBLE**, **TYPE_CHAR**, **TYPE_STRING**, **TYPE_BOOL**, **TYPE_VOID**, **TYPE_LONG**, **TYPE_SHORT**, **TYPE_UNSIGNED**: Type keywords for specifying data types.
- **PLUS**, **MINUS**, **STAR**, **SLASH**, **FLOOR_DIV**, **PERCENT**, **POWER**: Arithmetic operators.
- **EQ**, **NEQ**, **STRICT_EQ**, **STRICT_NEQ**, **NULL_COALESCE**: Comparison operators.
- **LT**, **GT**, **LTE**, **GTE**: Relational operators.
- **AND**, **OR**, **NOT**, **IS**: Logical operators.
- **ASSIGN**, **PLUS_ASSIGN**, **MINUS_ASSIGN**, **STAR_ASSIGN**, **SLASH_ASSIGN**, **AND_ASSIGN**, **OR_ASSIGN**, **XOR_ASSIGN**, **MOD_ASSIGN**, **FAT_ARROW**: Assignment operators.
- **PLUS_PLUS**, **MINUS_MINUS**: Increment and decrement operators.
- **BIT_AND**, **BIT_OR**, **BIT_XOR**, **BIT_NOT**, **LSHIFT**, **RSHIFT**: Bitwise operators.
- **AND_AND**, **OR_OR**: Short-circuit logical operators.
- **LPAREN**, **RPAREN**, **LBRACE**, **RBRACE**, **LBRACKET**, **RBRACKET**, **COMMA**, **SEMICOLON**, **COLON**, **DOT**, **ARROW**, **QUESTION**, **DECORATOR**: Delimiters and punctuation marks.
- **NEWLINE**: Represents a newline character.
- **EOF_TOKEN**, **UNKNOWN**: Special tokens indicating end-of-file and unknown characters.
- **INDENT**, **DEDENT**: Python-style indentation markers.

### Function `toString()` const
Converts a `Token` object to a human-readable string representation.

**Parameters**:
- None

**Returns**:
- A string containing the token's type, value, line number, and column position.

**Behavior**:
- Concatenates the token's type, value, line number, and column position into a single string formatted for readability.

**Trade-offs/Limitations**:
- The string representation may not be suitable for all debugging purposes, especially when dealing with complex token structures.
- The function assumes that the token's value can be safely converted to a string using `std::to_string`.

## Tradeoffs and Limitations

- The current implementation relies on `std::string` for storing token values, which may lead to memory inefficiencies for large strings.
- The lack of support for Unicode characters in the token system limits the compiler's ability to handle internationalized text.
- The absence of a more sophisticated tokenization algorithm means that the compiler may struggle with edge cases and complex syntax constructs.
- The use of fixed-size integers for line and column positions may cause overflow issues if the source code exceeds certain size constraints.

## Conclusion

The `include/Token.h` header file plays a crucial role in the QuantumLanguage compiler by providing a robust and flexible framework for representing tokens. While there are some limitations and areas for improvement, the current design offers a solid foundation upon which further enhancements can be built.