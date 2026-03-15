# Token.cpp

## Overview

The `Token.cpp` file is an integral component of the Quantum Language compiler, designed to represent and manipulate individual lexical tokens derived from the input source code. These tokens form the foundational elements of the syntax tree, which are subsequently utilized for semantic analysis and code generation phases.

## Key Design Decisions

### Utilization of `std::ostringstream` for String Formatting

**WHY**: Leveraging `std::ostringstream` streamlines the process of string formatting. This decision enhances readability and maintainability by allowing complex strings to be constructed using intuitive method chaining rather than manual concatenation. Additionally, it provides type safety and ensures proper handling of different data types during formatting.

## Documentation of Classes and Functions

### Class: `Token`

**Purpose**: The `Token` class encapsulates information about a single token, including its type, value, line number, and column position within the source code.

#### Member Variables:

- `int line`: Stores the line number where the token was found.
- `int col`: Stores the column number where the token was found.
- `std::string value`: Holds the textual representation of the token.
- `TokenType type`: Indicates the category of the token (e.g., keyword, identifier, operator).

#### Public Methods:

- **Constructor**: Initializes a `Token` object with the provided line number, column number, value, and type.
  ```cpp
  Token(int line, int col, std::string value, TokenType type);
  ```
- **Destructor**: Cleans up any resources used by the `Token` object.
  ```cpp
  ~Token();
  ```
- **Method: `toString()`**
  - **Purpose**: Returns a string representation of the token, formatted as `[line:col value]`.
  - **Behavior**: Utilizes `std::ostringstream` to format the token's details into a readable string.
  - **Tradeoffs/Limitations**: While enhancing readability, this approach may introduce slight performance overhead due to dynamic memory allocation associated with `std::ostringstream`. However, this is generally negligible compared to the benefits of improved code clarity and maintainability.

## Tradeoffs and Limitations

- **Performance Overhead**: Although minimal, the use of `std::ostringstream` introduces a small performance cost due to dynamic memory management. This is typically not a significant issue unless the compiler processes extremely large source files.
- **Complexity**: Introducing `std::ostringstream` adds some complexity to the codebase, particularly for developers unfamiliar with this library. However, this complexity is outweighed by the benefits of cleaner and more readable code.

## Conclusion

The `Token.cpp` file plays a pivotal role in the Quantum Language compiler by providing a robust mechanism for representing and manipulating lexical tokens. By utilizing `std::ostringstream` for string formatting, the file achieves enhanced readability and maintainability, making it easier for developers to understand and work with the token objects throughout the compilation process.