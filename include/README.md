# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is an essential part of the QuantumLanguage compiler, focusing on error handling mechanisms. This file defines several custom exception classes derived from `std::runtime_error` to manage different types of errors encountered during compilation and execution. Each error class includes additional information such as the error kind and line number, which aids in debugging and provides more context about where the error occurred.

This header file plays a critical role in ensuring robust error management throughout the compiler pipeline. By centralizing error handling logic, it simplifies the process of propagating errors up the call stack and makes it easier to maintain consistent error reporting across the entire compiler.

## Design Decisions

### Why Custom Exception Classes?

Custom exception classes are used instead of relying solely on standard exceptions like `std::runtime_error` because they provide a more structured way to represent specific error conditions. Each custom class (`QuantumError`, `RuntimeError`, `TypeError`, `NameError`, `IndexError`) clearly identifies the type of error, making it easier to catch and respond to errors appropriately.

### Why Additional Information?

Including additional information such as the error kind (`kind`) and line number (`line`) in each exception class enhances the debugging experience. The error kind helps quickly identify the nature of the error, while the line number allows developers to pinpoint the exact location in the source code where the error occurred.

## Documentation

### QuantumError Class

**Purpose:** Base class for all custom quantum language errors.

**Behavior:** Inherits from `std::runtime_error` and adds two additional members: `kind` (a string representing the type of error) and `line` (an integer indicating the line number where the error occurred).

**Usage:**
```cpp
throw QuantumError("SyntaxError", "Unexpected token at end of line");
```

### RuntimeError Class

**Purpose:** Represents runtime errors that occur during program execution.

**Behavior:** Inherits from `QuantumError` and sets the error kind to `"RuntimeError"`.

**Usage:**
```cpp
if (condition) {
    throw RuntimeError("Division by zero");
}
```

### TypeError Class

**Purpose:** Indicates errors related to incorrect data types being used in operations.

**Behavior:** Inherits from `QuantumError` and sets the error kind to `"TypeError"`.

**Usage:**
```cpp
if (!isInteger(value)) {
    throw TypeError("Expected an integer but got a float");
}
```

### NameError Class

**Purpose:** Used when a variable or identifier is not found.

**Behavior:** Inherits from `QuantumError` and sets the error kind to `"NameError"`.

**Usage:**
```cpp
if (!variableExists(name)) {
    throw NameError("Variable '" + name + "' is not defined");
}
```

### IndexError Class

**Purpose:** Signifies errors related to accessing elements outside the bounds of arrays or lists.

**Behavior:** Inherits from `QuantumError` and sets the error kind to `"IndexError"`.

**Usage:**
```cpp
if (index >= arraySize) {
    throw IndexError("Index out of range");
}
```

### Colors Namespace

**Purpose:** Provides ANSI escape codes for console text coloring.

**Behavior:** Contains constants for various colors and formatting options (e.g., bold, reset). These constants can be used to colorize error messages in the console output, making them stand out and easier to read.

**Usage:**
```cpp
std::cerr << Colors::RED << "Error: " << Colors::RESET << message << std::endl;
```

## Tradeoffs and Limitations

- **Overhead:** Using custom exception classes introduces some overhead compared to using standard exceptions. However, this overhead is minimal and is outweighed by the benefits of clearer error handling.
  
- **Complexity:** Adding additional information to exception classes increases the complexity of error handling code. Developers must ensure that this information is correctly propagated and handled throughout the compiler.

- **Console Output:** The use of ANSI escape codes for console coloring may not work on all platforms or terminals. While this feature enhances readability, it should be used judiciously to avoid compatibility issues.

Overall, the `include/Error.h` header file provides a flexible and informative error handling mechanism, which is crucial for maintaining the reliability and usability of the QuantumLanguage compiler.