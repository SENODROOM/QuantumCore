# QuantumLanguage Compiler - Lexer.h

## Overview

The `include/Lexer.h` header file is an essential part of the QuantumLanguage compiler, serving as the lexical analyzer or lexer. Its primary responsibility is to convert the raw source code into a sequence of tokens, which are then processed by the parser. This process involves recognizing patterns in the source code, such as keywords, identifiers, operators, numbers, and strings, and converting them into corresponding token types.

## Key Design Decisions

### Use of Token Types

**Why:** The use of predefined token types ensures consistency and clarity in how different elements of the source code are represented. It simplifies the parsing process by providing a clear mapping between syntactic constructs and their semantic representations.

### Support for F-Strings

**Why:** F-strings (formatted string literals) provide a powerful way to embed expressions inside string literals for formatting. By implementing support for f-strings, the lexer can handle complex string interpolation scenarios, making the compiler more versatile and user-friendly.

### Preprocessor Macros

**Why:** Preprocessor macros allow for text substitution during compilation, which can be useful for defining constants, conditional compilation, and other common tasks. Implementing a mechanism to handle macros in the lexer helps in maintaining cleaner and more maintainable source code.

## Class and Function Documentation

### Lexer Class

**Purpose:** The `Lexer` class is the main component responsible for tokenizing the source code.

#### Constructor

```cpp
explicit Lexer(const std::string &source);
```

**Behaviour:** Initializes the lexer with the given source code and sets up internal state variables.

#### tokenize Method

```cpp
std::vector<Token> tokenize();
```

**Behaviour:** Converts the source code into a vector of tokens by repeatedly calling private methods to recognize and create tokens.

### Private Methods

#### current Method

```cpp
char current() const;
```

**Behaviour:** Returns the character at the current position in the source code.

#### peek Method

```cpp
char peek(int offset = 1) const;
```

**Behaviour:** Returns the character at the specified offset relative to the current position without advancing the lexer.

#### advance Method

```cpp
char advance();
```

**Behaviour:** Advances the lexer's position to the next character and returns it.

#### skipWhitespace Method

```cpp
void skipWhitespace();
```

**Behaviour:** Skips over any whitespace characters in the source code.

#### skipComment Method

```cpp
void skipComment();
```

**Behaviour:** Skips over a single-line comment starting with `//`.

#### skipBlockComment Method

```cpp
void skipBlockComment();
```

**Behaviour:** Skips over a multi-line comment enclosed within `/* */`.

#### readNumber Method

```cpp
Token readNumber();
```

**Behaviour:** Recognizes and creates a token representing a numeric literal.

#### readString Method

```cpp
Token readString(char quote);
```

**Behaviour:** Recognizes and creates a token representing a string literal, handling both single and double quotes.

#### readTemplateLiteral Method

```cpp
void readTemplateLiteral(std::vector<Token> &out, int startLine, int startCol);
```

**Behaviour:** Handles the recognition and creation of template literals, which are used for f-string expansion. The method appends the resulting tokens to the provided output vector.

#### readIdentifierOrKeyword Method

```cpp
Token readIdentifierOrKeyword();
```

**Behaviour:** Recognizes and creates a token representing either an identifier or a keyword.

#### readOperator Method

```cpp
Token readOperator();
```

**Behaviour:** Recognizes and creates a token representing an operator.

## Tradeoffs and Limitations

### Complexity of F-String Handling

**Tradeoff:** Supporting f-strings adds complexity to the lexer, requiring additional logic to handle embedded expressions within string literals. **Limitation:** While f-strings enhance readability and flexibility, they may introduce performance overhead during the tokenization phase.

### Limited Preprocessor Macro Expansion

**Tradeoff:** The current implementation of macro expansion is straightforward but lacks advanced features like recursive expansion or macro parameter handling. **Limitation:** This limitation means that macros with complex behavior cannot be fully expanded during the lexical analysis stage, potentially affecting the overall efficiency and correctness of the compiler.

### Lack of Error Recovery

**Tradeoff:** The lexer currently does not implement error recovery mechanisms, which can lead to premature termination of the tokenization process upon encountering syntax errors. **Limitation:** Without robust error handling, the compiler may fail to produce meaningful output even when the source code contains minor issues.

In summary, the `Lexer.h` file plays a critical role in the QuantumLanguage compiler by breaking down the source code into manageable tokens. The design choices made, including support for f-strings and preprocessor macros, aim to improve the usability and functionality of the compiler. However, these enhancements come with increased complexity and potential limitations, which require careful consideration during implementation and testing phases.