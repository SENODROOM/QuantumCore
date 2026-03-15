# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is an integral part of the QuantumLanguage compiler, responsible for defining custom error classes to manage exceptions and errors encountered during compilation and execution. This file provides a structured way to report errors, including their type, message, and line number, which aids in debugging and improving user experience.

## Key Design Decisions

### Custom Exception Classes

Custom exception classes (`QuantumError`, `RuntimeError`, `TypeError`, `NameError`, `IndexError`) extend the standard `std::runtime_error` class. This decision was made to provide more specific error information and to allow for easier categorization and handling of different types of errors throughout the compiler.

### Line Number Tracking

Each error class includes a `line` member variable, which tracks the line number where the error occurred. This feature is crucial for pinpointing issues in the source code, making it easier for developers to correct them.

### Color Coding

A namespace `Colors` is defined to hold ANSI escape codes for color coding error messages. This choice enhances the readability of error output by visually distinguishing between different types of errors.

## Detailed Documentation

### QuantumError Class

**Purpose**: The base class for all custom errors in the QuantumLanguage compiler. It inherits from `std::runtime_error`.

**Behavior**:
- Accepts three parameters: `kind` (the type of error), `msg` (the error message), and `line` (the line number where the error occurred).
- Stores the error kind, message, and line number.
- Inherits the constructor from `std::runtime_error` to provide a consistent interface for accessing the error message.

### RuntimeError Class

**Purpose**: Represents runtime errors that occur during the execution of the compiled program.

**Behavior**:
- Inherits from `QuantumError`.
- Initializes the error kind to "RuntimeError".

### TypeError Class

**Purpose**: Indicates type-related errors, such as mismatched types in operations.

**Behavior**:
- Inherits from `QuantumError`.
- Initializes the error kind to "TypeError".

### NameError Class

**Purpose**: Used when a name (variable, function, etc.) is not found in the current scope.

**Behavior**:
- Inherits from `QuantumError`.
- Initializes the error kind to "NameError".

### IndexError Class

**Purpose**: Denotes errors related to invalid indices, such as out-of-bounds array access.

**Behavior**:
- Inherits from `QuantumError`.
- Initializes the error kind to "IndexError".

### Colors Namespace

**Purpose**: Provides ANSI escape codes for color coding error messages.

**Contents**:
- Various constants representing different colors and formatting options (e.g., RED, YELLOW, WHITE, CYAN, GREEN, BLUE, BOLD, RESET, MAGENTA).

## Tradeoffs and Limitations

- **Performance Overhead**: Using custom exception classes and tracking line numbers adds some overhead compared to using raw strings or simpler exception mechanisms. However, this overhead is minimal and significantly improves the clarity and maintainability of error reporting.
  
- **Complexity**: Adding multiple error classes increases the complexity of the codebase. Developers must be aware of the different error types and how they should be handled. While this may seem daunting, it leads to more robust and user-friendly error management.

- **Readability vs. Flexibility**: The use of color coding for error messages enhances readability but limits flexibility in terms of customization. Future enhancements might consider allowing users to configure error message appearance.

## Usage Example

Here's a simple example demonstrating how to use these error classes:

```cpp
try {
    // Simulate a runtime error
    throw RuntimeError("Division by zero", 10);
} catch (const QuantumError &err) {
    std::cerr << Colors::RED << err.what() << Colors::RESET << " at line " << err.line << std::endl;
}
```

This will output an error message in red, indicating a runtime error on line 10.

By following these guidelines, the `include/Error.h` header file ensures that the QuantumLanguage compiler can effectively manage and report errors, thereby enhancing the overall reliability and usability of the compiler.