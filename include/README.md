# QuantumLanguage Compiler - Token.h

## Overview

The `include/Token.h` header file is a fundamental component of the QuantumLanguage compiler's architecture. It encapsulates the definition of tokens, which are the smallest units of meaningful elements in the language. These tokens serve as the building blocks for parsing and interpreting the source code. The `Token` struct holds information about the type, value, line number, and column position of each token, enabling precise error reporting and context-aware processing throughout the compilation process.

## Key Design Decisions

### Token Types Enumeration

The `TokenType` enum class categorizes all possible token types into several categories:

- **Literals**: Represents numeric, string, boolean, and nil values.
- **Identifiers & Keywords**: Includes variable names, control flow statements, and other reserved words.
- **C/C++ Style Type Keywords**: Mimics common C/C++ type specifiers to support interoperability.
- **Operators**: Covers arithmetic, comparison, logical, bitwise, and assignment operators.
- **Delimiters**: Such as parentheses, braces, brackets, commas, semicolons, colons, dots, arrows, and question marks.
- **Special Tokens**: Includes end-of-file, unknown tokens, and Python-style indentation markers.

**Why**: This comprehensive enumeration ensures that every syntactic element of the language can be accurately identified and processed during the lexical analysis phase. By grouping similar token types together, it simplifies the implementation and maintenance of the lexer.

### Token Structure

The `Token` struct is designed to store essential information about each token:

- **type**: An instance of `TokenType` indicating the kind of token.
- **value**: A `std::string` containing the actual text of the token.
- **line**: An integer representing the line number where the token appears in the source code.
- **col**: An integer representing the column position within the line.

**Why**: Storing these details allows the compiler to maintain accurate context and generate meaningful error messages. The line and column numbers help pinpoint issues directly in the source code, improving debugging efficiency.

## Documentation of Major Classes/Functions

### Token Class

#### Purpose

The `Token` class represents a single token in the source code. It encapsulates the token's type, value, and location information.

#### Behavior

- **Constructor**: Initializes the token with the given type, value, line number, and column position.
- **toString Method**: Returns a string representation of the token, useful for debugging and logging purposes.

### toString Method

#### Purpose

The `toString` method provides a human-readable string representation of the `Token` object.

#### Behavior

It constructs a string that includes the token's type, value, line number, and column position. This method aids in logging and visualization of tokens during development and debugging phases.

## Tradeoffs and Limitations

- **Memory Usage**: Storing the entire token value as a `std::string` can lead to increased memory consumption, especially for large programs.
- **Performance**: Frequent construction and destruction of `std::string` objects might impact performance, particularly in scenarios involving high-frequency tokenization.
- **Flexibility**: While the current set of token types covers most common language features, additional types may need to be introduced to support emerging language standards or custom extensions.

## Conclusion

The `include/Token.h` header file is a critical backbone of the QuantumLanguage compiler, providing a robust framework for tokenizing the source code. Its well-designed structure and comprehensive enumeration ensure that every aspect of the language's syntax is accounted for, facilitating efficient parsing and semantic analysis. However, developers should be aware of potential memory and performance implications when working with large volumes of source code.