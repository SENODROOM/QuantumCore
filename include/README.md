# QuantumLanguage Compiler - Error.h

## Overview

The `include/Error.h` header file is a critical component of the QuantumLanguage compiler, dedicated to defining error handling mechanisms. This file includes various exception classes derived from `std::runtime_error`, each tailored to specific types of errors encountered during compilation or execution. Additionally, it provides a namespace for color codes used in error messages for better visibility and user experience.

### Role in Compiler Pipeline

- **Compilation Errors**: Captures issues related to syntax, type mismatches, and undefined names before the code reaches the virtual machine.
- **Execution Errors**: Handles runtime exceptions such as index out of bounds, type errors, and name resolution failures within the virtual machine.

### Key Design Decisions and Why

1. **Custom Exception Classes**: By deriving from `std::runtime_error`, custom exception classes (`QuantumError`, `RuntimeError`, `TypeError`, etc.) provide more context-specific error information, making debugging easier.
   
2. **Line Number Information**: Each error class includes a line number attribute, allowing developers to pinpoint the exact location of the error in their source code quickly.

3. **Color Coding**: The `Colors` namespace offers a set of ANSI escape codes to style error messages differently based on their severity or category. This enhances readability and makes it easier to distinguish between different types of errors.

### Major Classes/Functions Overview

#### QuantumError Class

- **Purpose**: Acts as a base class for all quantum-related errors, providing common attributes like `line` and `kind`.
- **Constructor**: Takes a message string, an optional line number, and a kind string indicating the type of error.

#### RuntimeError Class

- **Purpose**: Derived from `QuantumError`, specifically for runtime exceptions.
- **Constructor**: Simplifies the creation of runtime error instances with just a message and an optional line number.

#### TypeError Class

- **Purpose**: Derived from `QuantumError`, designed for type-related errors.
- **Constructor**: Facilitates the creation of type error instances using a message and an optional line number.

#### NameError Class

- **Purpose**: Derived from `QuantumError`, intended for errors related to undefined names.
- **Constructor**: Provides a straightforward way to create name error instances with a message and an optional line number.

#### IndexError Class

- **Purpose**: Derived from `QuantumError`, used for index out of bounds errors.
- **Constructor**: Simplifies the creation of index error instances by accepting a message and an optional line number.

#### Colors Namespace

- **Purpose**: Offers a collection of ANSI escape codes for styling console output.
- **Contents**: Includes constants for red, yellow, white, cyan, green, blue, bold, reset, and magenta colors.

### Tradeoffs

- **Performance**: Using custom exception classes might introduce slight performance overhead compared to standard exceptions, but this is generally negligible in most applications.
  
- **Complexity**: Adding color coding increases the complexity of error handling but improves usability significantly, especially in large projects where multiple types of errors need to be distinguished easily.

- **Readability**: Custom exception classes enhance readability by clearly categorizing errors, while color coding aids visual identification of error types.

By leveraging these components, the QuantumLanguage compiler ensures robust error management throughout its pipeline, from initial compilation to runtime execution, thereby improving both developer productivity and code quality.