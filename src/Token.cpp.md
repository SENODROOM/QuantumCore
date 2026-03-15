# Token.cpp

## Overview

The `Token.cpp` file is an integral component of the Quantum Language compiler, tasked with managing individual lexical tokens derived from the input source code. These tokens act as the foundational elements necessary to construct the syntax tree, a crucial step in subsequent phases such as semantic analysis and code generation.

## Role in Compiler Pipeline

**Lexer Stage:** The primary function of `Token.cpp` is within the lexer phase of the compiler pipeline. It processes the input source code character by character, identifying meaningful units called tokens. This includes keywords, identifiers, literals, operators, and punctuation marks.

**Syntax Tree Construction:** Once tokens are identified, they are used to build a syntax tree. This tree represents the structure of the program in a hierarchical format, facilitating easier parsing and understanding during later stages of compilation.

## Key Design Decisions and Why

1. **Token Representation:** Tokens are represented using a custom class `Token`. This class encapsulates essential attributes like the token's type, value, line number, and column number. This encapsulation ensures that all relevant information about each token is stored in one place, making it easy to manage and access throughout the compiler.

2. **Efficient String Handling:** To optimize performance, especially when dealing with large source files, the `Token` class uses `std::string_view` instead of `std::string`. `std::string_view` provides a lightweight way to handle string data without owning it, thus reducing memory overhead and improving speed.

3. **Error Reporting:** Each token includes its line and column numbers, enabling precise error reporting. If a syntax error occurs, the compiler can pinpoint exactly where the issue lies, enhancing debugging capabilities.

## Major Classes/Functions Overview

### Class: Token

- **Attributes:**
  - `type`: Indicates the category of the token (e.g., keyword, identifier).
  - `value`: Contains the actual text of the token.
  - `line`: Stores the line number where the token was found.
  - `col`: Stores the column number where the token was found.

- **Methods:**
  - `toString() const`: Returns a string representation of the token, useful for debugging and logging purposes.

### Function: toString()

This function converts a `Token` object into a human-readable string format. It concatenates the token's type, value, line number, and column number into a single string, enclosed in square brackets. This makes it easy to understand the context and details of each token at a glance.

## Tradeoffs

1. **Memory Overhead:** Using `std::string_view` instead of `std::string` reduces memory usage but requires careful management of the underlying string data to avoid dangling references.

2. **Complexity:** Encapsulating token details within a custom class adds some complexity to the codebase. However, this abstraction simplifies the overall architecture and enhances maintainability.

3. **Performance vs. Memory:** While `std::string_view` offers better performance due to reduced copying, it may increase complexity in certain scenarios. Balancing these factors is crucial for maintaining efficient and readable code.

By leveraging these design decisions and functions, `Token.cpp` plays a pivotal role in the Quantum Language compiler, ensuring accurate tokenization and efficient syntax tree construction.