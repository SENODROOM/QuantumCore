# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is a crucial component of the QuantumLanguage compiler, designed to manage and report errors encountered during compilation and execution. This file provides a structured approach to error handling by defining custom exception classes that inherit from `std::runtime_error`. Each class corresponds to a specific type of error, making it easier to identify and respond to different issues within the compiler.

### Role in Compiler Pipeline

- **Compilation Errors**: These occur during the parsing or semantic analysis phases when the source code does not conform to the language grammar or rules.
- **Runtime Errors**: These happen during the execution phase when invalid operations are performed, such as accessing out-of-bounds indices or calling undefined functions.

## Key Design Decisions and Why

1. **Custom Exception Classes**: By creating separate classes for each type of error (`QuantumError`, `RuntimeError`, `TypeError`, `NameError`, `IndexError`), the compiler can provide more specific information about the nature of the error. This helps in debugging and improving user experience.
   
2. **Line Number Information**: Each error class includes a line number attribute (`line`). This allows the compiler to pinpoint exactly where the error occurred in the source code, facilitating quicker resolution.

3. **Color Coding**: The `Colors` namespace contains constants for color codes, which can be used to format error messages in the console output. This makes error messages visually distinct and easier to read, especially in large codebases.

## Major Classes/Functions Overview

### QuantumError Class

- **Inheritance**: Inherits from `std::runtime_error`.
- **Attributes**:
  - `int line`: Line number where the error occurred.
  - `std::string kind`: Type of error (e.g., "RuntimeError").
- **Constructor**: Takes a kind, message, and optional line number.

### RuntimeError Class

- **Inheritance**: Inherits from `QuantumError`.
- **Purpose**: Used for runtime errors, which occur during the execution phase.
- **Constructor**: Simplified constructor that sets the kind to "RuntimeError".

### TypeError Class

- **Inheritance**: Inherits from `QuantumError`.
- **Purpose**: Used for type-related errors, such as mismatched operand types.
- **Constructor**: Simplified constructor that sets the kind to "TypeError".

### NameError Class

- **Inheritance**: Inherits from `QuantumError`.
- **Purpose**: Used for errors related to variable or function names, such as using an undefined name.
- **Constructor**: Simplified constructor that sets the kind to "NameError".

### IndexError Class

- **Inheritance**: Inherits from `QuantumError`.
- **Purpose**: Used for errors related to index access, such as accessing an array element outside its bounds.
- **Constructor**: Simplified constructor that sets the kind to "IndexError".

### Colors Namespace

- **Constants**: Provides constants for ANSI escape codes to change text color and style.
- **Usage**: Can be used to format error messages in the console, enhancing readability and visual distinction.

## Tradeoffs

- **Complexity**: Adding multiple custom exception classes increases the complexity of the codebase but improves maintainability and error reporting.
- **Performance**: While the additional overhead of these classes may have a slight impact on performance, the benefits in terms of clarity and ease of debugging often outweigh this cost.
- **Readability**: Color coding enhances the readability of error messages, making them stand out and easier to understand quickly.

Overall, the `include/Error.h` header file plays a vital role in the QuantumLanguage compiler by providing a robust framework for error management and reporting, ensuring that developers can effectively diagnose and fix issues in their code.