# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is an integral component of the QuantumLanguage compiler, designed to manage and categorize errors encountered during the compilation process. It provides a structured approach to error handling, ensuring that each error is clearly identified and associated with its location in the source code. The file includes several custom exception classes derived from `std::runtime_error`, each tailored to specific error scenarios such as runtime errors, type mismatches, name conflicts, and index out-of-bounds errors. Additionally, it defines a namespace `Colors` containing ANSI escape codes for console text formatting, which can be used to highlight error messages in the output.

## Key Design Decisions

### Custom Exception Classes

The design decision to create custom exception classes was driven by the need for precise error identification and localization. Each exception class (`QuantumError`, `RuntimeError`, `TypeError`, `NameError`, `IndexError`) serves a distinct purpose:

- **QuantumError**: A base class for all quantum-related errors, providing common attributes like `line` and `kind`.
- **RuntimeError**: Used for errors that occur during program execution, such as division by zero or accessing a null pointer.
- **TypeError**: Indicates issues related to incorrect data types being used in operations, ensuring type safety.
- **NameError**: Thrown when a variable or function name is not found, helping developers identify missing identifiers.
- **IndexError**: Used for errors involving array or list indices, such as accessing an element at an invalid position.

This hierarchical structure allows for easy differentiation between different error types and facilitates more informative error reporting.

### ANSI Escape Codes for Console Formatting

Using ANSI escape codes to format error messages in the console was a conscious choice to enhance readability and provide visual cues. These codes allow the compiler to color-code error messages, making them stand out against normal text. For example, runtime errors could be displayed in red, while type errors might appear in yellow. This feature is particularly useful during development and debugging phases, where quick identification of error types is crucial.

However, this approach has limitations:

- **Platform Dependency**: ANSI escape codes are primarily supported on Unix-like systems. Windows users may not see colored output unless they use a compatible terminal emulator.
- **Readability Trade-off**: While colorful output can help distinguish between different error types, overuse or misuse of these codes might reduce overall readability.

## Documentation

### QuantumError Class

**Purpose**: Base class for all quantum-related errors, providing a common interface for error handling.

**Behavior**: Accepts a `kind` (error category), a `message` (description of the error), and optionally a `line` number where the error occurred. Inherits from `std::runtime_error`.

**Usage Example**:
```cpp
try {
    // Some operation that throws an error
} catch (const QuantumError &e) {
    std::cerr << "Error on line " << e.line << ": " << e.what() << std::endl;
}
```

### RuntimeError Class

**Purpose**: Represents errors that occur during program execution.

**Behavior**: Inherits from `QuantumError` with a fixed `kind` of `"RuntimeError"`. Accepts a message and optionally a line number.

**Usage Example**:
```cpp
if (value == 0) {
    throw RuntimeError("Division by zero");
}
```

### TypeError Class

**Purpose**: Indicates issues related to incorrect data types being used in operations.

**Behavior**: Inherits from `QuantumError` with a fixed `kind` of `"TypeError"`. Accepts a message and optionally a line number.

**Usage Example**:
```cpp
if (!isInteger(value)) {
    throw TypeError("Expected integer but got " + valueType);
}
```

### NameError Class

**Purpose**: Thrown when a variable or function name is not found.

**Behavior**: Inherits from `QuantumError` with a fixed `kind` of `"NameError"`. Accepts a message and optionally a line number.

**Usage Example**:
```cpp
if (!variableExists(name)) {
    throw NameError("Variable '" + name + "' not defined");
}
```

### IndexError Class

**Purpose**: Used for errors involving array or list indices.

**Behavior**: Inherits from `QuantumError` with a fixed `kind` of `"IndexError"`. Accepts a message and optionally a line number.

**Usage Example**:
```cpp
if (index >= arraySize) {
    throw IndexError("Index out of bounds: " + std::to_string(index));
}
```

### Colors Namespace

**Purpose**: Provides ANSI escape codes for console text formatting, enhancing the visibility of error messages.

**Contents**: 
- `RED`: Red text color.
- `YELLOW`: Yellow text color.
- `WHITE`: White text color.
- `CYAN`: Cyan text color.
- `GREEN`: Green text color.
- `BLUE`: Blue text color.
- `BOLD`: Bold text style.
- `RESET`: Reset text style to default.
- `MAGENTA`: Magenta text color.

**Usage Example**:
```cpp
std::cerr << Colors::RED << "Runtime Error" << Colors::RESET << std::endl;
```

## Limitations

- **Platform Dependency**: The console coloring feature is limited to Unix-like systems due to the dependency on ANSI escape codes.
- **Overuse of Color**: Excessive use of colored output might reduce the overall readability of the error messages.

These limitations should be considered when integrating this header file into larger projects or deploying the compiler on different platforms.