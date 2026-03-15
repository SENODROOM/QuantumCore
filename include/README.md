# Error Handling Module for Quantum Language Compiler

This module is integral to the Quantum Language compiler's error handling system, designed to manage various types of errors encountered during compilation. It leverages C++'s standard exception hierarchy to provide a structured approach to error reporting, making it easier to identify and handle different kinds of issues within the compiler.

## Design Decisions

### Inheritance from `std::runtime_error`
The decision to inherit from `std::runtime_error` was made to ensure compatibility with existing C++ exception handling mechanisms. This choice allows the use of `try-catch` blocks and other standard exception handling techniques, simplifying error propagation and management throughout the compiler.

### Custom Error Classes
Each specific type of error (e.g., `RuntimeError`, `TypeError`) is represented by a custom class derived from `QuantumError`. This approach provides clear distinctions between different error categories and makes it straightforward to catch and respond to specific types of errors.

### Line Number Information
Including line number information in the error classes (`line`) was deemed crucial for debugging purposes. By associating each error with its location in the source code, developers can quickly locate and fix the issue, enhancing the overall development experience.

## Documentation

### Class: `QuantumError`
**Purpose:** Base class for all quantum-specific errors.
**Behavior:** Inherits from `std::runtime_error` and adds line number and error kind information.
**Trade-offs:** While providing flexibility, this class may lead to increased memory usage due to additional data members.

### Class: `RuntimeError`
**Purpose:** Represents runtime errors that occur during the execution of the compiled code.
**Behavior:** Inherits from `QuantumError` with a fixed kind of "RuntimeError".
**Trade-offs:** Limited flexibility compared to `QuantumError`, but ensures consistent error categorization.

### Class: `TypeError`
**Purpose:** Indicates type-related errors, such as mismatched data types in operations.
**Behavior:** Inherits from `QuantumError` with a fixed kind of "TypeError".
**Trade-offs:** Similar to `RuntimeError`, limited flexibility but ensures accurate error classification.

### Class: `NameError`
**Purpose:** Used when an undefined variable or function is referenced.
**Behavior:** Inherits from `QuantumError` with a fixed kind of "NameError".
**Trade-offs:** Minimal flexibility, but essential for catching name-related issues early in the compilation process.

### Class: `IndexError`
**Purpose:** Signifies errors related to accessing elements outside the bounds of arrays or lists.
**Behavior:** Inherits from `QuantumError` with a fixed kind of "IndexError".
**Trade-offs:** Provides specific error handling for index-related issues, which are common in many programming languages.

### Namespace: `Colors`
**Purpose:** Contains ANSI escape codes for console text coloring.
**Behavior:** Offers predefined constants for colorizing output in terminal-based environments.
**Trade-offs:** Adds complexity to the codebase for managing console output formatting, but enhances readability and user experience in error messages.

## Usage Example

```cpp
#include "Error.h"

int main() {
    try {
        // Simulate a runtime error
        throw RuntimeError("Division by zero", 10);
    } catch (const QuantumError &err) {
        std::cerr << Colors::RED << "Error on line " << err.line << ": " << Colors::RESET << err.what() << std::endl;
    }
    return 0;
}
```

In this example, the `RuntimeError` is thrown with a message and line number. The catch block catches the exception, and the error message is printed in red using the `Colors` namespace.

## Conclusion

This error handling module plays a vital role in the Quantum Language compiler by providing a robust framework for identifying and responding to various types of errors. Its design choices ensure compatibility with existing C++ practices while offering specific functionality tailored to quantum programming needs. By documenting each class and function thoroughly, developers can better understand how to utilize these tools effectively and maintain a high-quality error-handling system within the compiler.