# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is an integral part of the QuantumLanguage compiler's architecture, focusing on defining various error handling mechanisms. This file serves as a central repository for custom exception classes tailored to specific error conditions encountered during compilation and execution phases. By extending standard library exceptions like `std::runtime_error`, it provides a structured way to manage errors, including their type, message, and line number where they occurred. Additionally, it includes a namespace for color codes to enhance error output readability in terminal environments.

## Key Design Decisions

- **Custom Exception Classes**: The decision to create custom exception classes (`QuantumError`, `RuntimeError`, `TypeError`, `NameError`, `IndexError`) over using generic exceptions was made to provide more context-specific information about errors. This allows for easier debugging and error reporting.
  
- **Inheritance from Standard Exceptions**: Extending standard library exceptions ensures compatibility and interoperability with existing error handling frameworks in C++. It also leverages the robustness and performance optimizations provided by these libraries.

- **Color Coding for Terminal Output**: Adding a namespace for color codes (`Colors`) was designed to improve the visual distinction between different types of errors in terminal outputs. This makes it easier for developers to quickly identify and address issues.

## Documentation of Major Classes/Functions

### QuantumError

**Purpose**: Base class for all custom QuantumLanguage exceptions. It inherits from `std::runtime_error` and adds additional attributes to store the error type and line number.

**Behaviour**: 
- Takes three parameters: `kind` (type of error), `msg` (error message), and `line` (line number where the error occurred).
- Initializes the base class with the error message and stores the error type and line number.

### RuntimeError

**Purpose**: Represents runtime errors that occur during the execution of QuantumLanguage programs.

**Behaviour**: Inherits from `QuantumError` and initializes with the "RuntimeError" kind.

### TypeError

**Purpose**: Indicates type-related errors, such as attempting to perform operations on incompatible types.

**Behaviour**: Inherits from `QuantumError` and initializes with the "TypeError" kind.

### NameError

**Purpose**: Used when an undefined variable or function name is accessed.

**Behaviour**: Inherits from `QuantumError` and initializes with the "NameError" kind.

### IndexError

**Purpose**: Captures errors related to accessing elements outside the bounds of arrays or lists.

**Behaviour**: Inherits from `QuantumError` and initializes with the "IndexError" kind.

### Colors Namespace

**Purpose**: Provides a set of ANSI escape codes for text coloring in terminal outputs.

**Contents**:
- Various color constants (`RED`, `YELLOW`, `WHITE`, `CYAN`, `GREEN`, `BLUE`, `BOLD`, `RESET`, `MAGENTA`) to style error messages.
- Each constant represents a different color or formatting option in the terminal.

## Tradeoffs/Limitations

- **Performance Overhead**: Using custom exception classes might introduce a slight performance overhead compared to using raw strings or other lightweight mechanisms. However, this is generally negligible and outweighed by the benefits of improved error management and clarity.
  
- **Complexity**: While providing more detailed error information, the introduction of multiple custom exception classes increases the complexity of the codebase. Developers must be aware of the various error types and handle them appropriately.

- **Terminal Compatibility**: The use of ANSI escape codes for color coding may not work on all terminals or platforms, potentially limiting the effectiveness of this feature.

## Usage Example

Here's how you might use the `RuntimeError` class in your compiler:

```cpp
try {
    // Some code that might throw a runtime error
} catch (const RuntimeError &e) {
    std::cerr << Colors::RED << "Runtime Error at line " << e.line << ": " << e.what() << Colors::RESET << std::endl;
}
```

This example demonstrates catching a `RuntimeError` and printing it with a red color, highlighting the line number where the error occurred.