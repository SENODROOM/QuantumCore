# Error.h - Error Handling Header File Explanation

## Complete Code

```cpp
#pragma once
#include <stdexcept>
#include <string>

class QuantumError : public std::runtime_error
{
public:
    int line;
    std::string kind;

    QuantumError(const std::string &kind, const std::string &msg, int line = -1)
        : std::runtime_error(msg), line(line), kind(kind) {}
};

class RuntimeError : public QuantumError
{
public:
    RuntimeError(const std::string &msg, int line = -1)
        : QuantumError("RuntimeError", msg, line) {}
};

class TypeError : public QuantumError
{
public:
    TypeError(const std::string &msg, int line = -1)
        : QuantumError("TypeError", msg, line) {}
};

class NameError : public QuantumError
{
public:
    NameError(const std::string &msg, int line = -1)
        : QuantumError("NameError", msg, line) {}
};

class IndexError : public QuantumError
{
public:
    IndexError(const std::string &msg, int line = -1)
        : QuantumError("IndexError", msg, line) {}
};

namespace Colors
{
    inline const char *RED = "\033[31m";
    inline const char *YELLOW = "\033[33m";
    inline const char *WHITE = "\033[37m";
    inline const char *CYAN = "\033[36m";
    inline const char *GREEN = "\033[32m";
    inline const char *BLUE = "\033[34m";
    inline const char *BOLD = "\033[1m";
    inline const char *RESET = "\033[0m";
    inline const char *MAGENTA = "\033[35m";
}
```

## Code Explanation

###
-  `#pragma once` - Prevents the header from being included multiple times in the same compilation unit
-  `#include <stdexcept>` - Includes standard exception classes like `std::runtime_error`
-  `#include <string>` - Includes string functionality for error messages

###

####
-  `class QuantumError : public std::runtime_error` - Declares the base error class that inherits from `std::runtime_error`
-  `{` - Opening brace for the class definition

####
-  `public:` - Starts the public section of the class

####
-  `int line;` - Stores the line number where the error occurred
-  `std::string kind;` - Stores the type/kind of error (e.g., "TypeError", "NameError")

####
-  `QuantumError(const std::string &kind, const std::string &msg, int line = -1)` - Constructor that takes error kind, message, and optional line number
-  `: std::runtime_error(msg), line(line), kind(kind) {}` - Constructor initializer list that:
  - Calls the base class constructor with the error message
  - Initializes the line member variable
  - Initializes the kind member variable

-  `};` - Closing brace for the QuantumError class

###

####
-  `class RuntimeError : public QuantumError` - Declares RuntimeError class inheriting from QuantumError
-  `{` - Opening brace
-  `public:` - Public section
-  `RuntimeError(const std::string &msg, int line = -1)` - Constructor taking message and optional line
-  `: QuantumError("RuntimeError", msg, line) {}` - Calls base constructor with "RuntimeError" as the kind
-  `};` - Closing brace

####
-  `class TypeError : public QuantumError` - Declares TypeError class
-  `{` - Opening brace
-  `public:` - Public section
-  `TypeError(const std::string &msg, int line = -1)` - Constructor
-  `: QuantumError("TypeError", msg, line) {}` - Calls base constructor with "TypeError" as the kind
-  `};` - Closing brace

####
-  `class NameError : public QuantumError` - Declares NameError class
-  `{` - Opening brace
-  `public:` - Public section
-  `NameError(const std::string &msg, int line = -1)` - Constructor
-  `: QuantumError("NameError", msg, line) {}` - Calls base constructor with "NameError" as the kind
-  `};` - Closing brace

####
-  `class IndexError : public QuantumError` - Declares IndexError class
-  `{` - Opening brace
-  `public:` - Public section
-  `IndexError(const std::string &msg, int line = -1)` - Constructor
-  `: QuantumError("IndexError", msg, line) {}` - Calls base constructor with "IndexError" as the kind
-  `};` - Closing brace

###

####
-  `namespace Colors` - Declares a namespace for color constants

####
-  `inline const char *RED = "\033[31m";` - Red color escape sequence
-  `inline const char *YELLOW = "\033[33m";` - Yellow color escape sequence
-  `inline const char *WHITE = "\033[37m";` - White color escape sequence
-  `inline const char *CYAN = "\033[36m";` - Cyan color escape sequence
-  `inline const char *GREEN = "\033[32m";` - Green color escape sequence
-  `inline const char *BLUE = "\033[34m";` - Blue color escape sequence
-  `inline const char *BOLD = "\033[1m";` - Bold text escape sequence
-  `inline const char *RESET = "\033[0m";` - Reset formatting escape sequence
-  `inline const char *MAGENTA = "\033[35m";` - Magenta color escape sequence

-  `}` - Closing brace for the Colors namespace

## Summary

This header file provides a comprehensive error handling system for the Quantum Language compiler with:

### Error Hierarchy
- **Base Class**: `QuantumError` extends `std::runtime_error` with line number and error kind
- **Specific Errors**: `RuntimeError`, `TypeError`, `NameError`, `IndexError` for different error types

### Key Features
- **Line Tracking**: All errors can track the source line where they occurred
- **Error Classification**: Each error type has a specific kind string for identification
- **Standard Compliance**: Inherits from `std::runtime_error` for compatibility with standard exception handling

### Color Support
- **ANSI Escape Codes**: Provides color constants for terminal output formatting
- **Multiple Colors**: Supports red, yellow, white, cyan, green, blue, magenta, plus bold and reset
- **Inline Variables**: Uses `inline` to allow header-only definition without multiple definition errors

This design allows for structured error reporting with visual formatting to help developers identify and fix issues in their Quantum Language code.
