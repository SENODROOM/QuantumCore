# QuantumLanguage Compiler - Token.h

## Overview

The `include/Token.h` header file is an integral part of the QuantumLanguage compiler's infrastructure, playing a pivotal role in the lexical analysis phase. This file defines the `TokenType` enum and the `Token` struct, which are fundamental for recognizing and categorizing tokens in the source code into meaningful units that can be processed further during compilation.

## Key Design Decisions

### Enum Class `TokenType`

- **Purpose**: To provide a clear and distinct enumeration of all possible token types encountered in the source code.
- **Why**: Using an enum class ensures type safety and makes it easier to understand and maintain the different categories of tokens. Each token type has a unique identifier, reducing the likelihood of errors due to incorrect token classification.

### Struct `Token`

- **Purpose**: To represent individual tokens in the source code, including their type, value, line number, and column position.
- **Why**: The `Token` struct encapsulates the necessary information about each token, facilitating easy access and manipulation during subsequent phases of the compiler. By storing these details together, the compiler can efficiently manage the flow of tokens and perform semantic analysis accurately.

## Detailed Documentation

### Enum Class `TokenType`

This enum class defines a comprehensive list of token types used by the QuantumLanguage compiler. Each token type corresponds to a specific category of input recognized during lexical analysis.

#### Example Usage

```cpp
TokenType tokenType = TokenType::NUMBER;
if (tokenType == TokenType::STRING) {
    // Handle string token
}
```

### Struct `Token`

The `Token` struct represents an individual token in the source code. It contains the following members:

- `type`: An instance of `TokenType`, indicating the category of the token.
- `value`: A `std::string` containing the actual text of the token.
- `line`: An integer representing the line number where the token appears in the source code.
- `col`: An integer representing the column position within the line where the token starts.

#### Constructor

```cpp
Token(TokenType t, std::string v, int ln, int c);
```

**Parameters**:
- `t`: The type of the token.
- `v`: The textual representation of the token.
- `ln`: The line number of the token in the source code.
- `c`: The column position of the token in the source code.

**Behavior**: Initializes a new `Token` object with the specified type, value, line number, and column position.

#### Method `toString()`

```cpp
std::string toString() const;
```

**Returns**: A formatted string representation of the token, useful for debugging and logging purposes.

**Example Output**:

```
Token(type=NUMBER, value="42", line=10, col=5)
```

## Tradeoffs and Limitations

- **Limited Flexibility**: While the current design provides a robust set of token types, it may not accommodate future extensions or variations in the language syntax without modifications.
- **Memory Overhead**: Storing the line and column numbers for every token might introduce unnecessary memory overhead, especially in large source files.
- **Complexity in Handling Indentation**: The inclusion of `INDENT` and `DEDENT` tokens simplifies handling indentation in Python-like languages but adds complexity to the lexer and parser.

## Conclusion

The `include/Token.h` header file is crucial for the QuantumLanguage compiler's ability to correctly parse and analyze source code. Its well-defined structure and comprehensive enumeration of token types ensure that the compiler can handle a wide range of inputs accurately and efficiently. However, like any system, it comes with certain tradeoffs and limitations that need to be considered during development and maintenance.