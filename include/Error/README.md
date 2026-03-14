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

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-3)
- **Line 1**: `#pragma once` - Prevents the header from being included multiple times in the same compilation unit
- **Line 2**: `#include <stdexcept>` - Includes standard exception classes like `std::runtime_error`
- **Line 3**: `#include <string>` - Includes string functionality for error messages

### Base Error Class (Lines 5-13)

#### Class Declaration (Lines 5-6)
- **Line 5**: `class QuantumError : public std::runtime_error` - Declares the base error class that inherits from `std::runtime_error`
- **Line 6**: `{` - Opening brace for the class definition

#### Public Section (Line 7)
- **Line 7**: `public:` - Starts the public section of the class

#### Member Variables (Lines 8-9)
- **Line 8**: `int line;` - Stores the line number where the error occurred
- **Line 9**: `std::string kind;` - Stores the type/kind of error (e.g., "TypeError", "NameError")

#### Constructor (Lines 11-12)
- **Line 11**: `QuantumError(const std::string &kind, const std::string &msg, int line = -1)` - Constructor that takes error kind, message, and optional line number
- **Line 12**: `: std::runtime_error(msg), line(line), kind(kind) {}` - Constructor initializer list that:
  - Calls the base class constructor with the error message
  - Initializes the line member variable
  - Initializes the kind member variable

- **Line 13**: `};` - Closing brace for the QuantumError class

### Specific Error Classes (Lines 15-41)

#### RuntimeError Class (Lines 15-20)
- **Line 15**: `class RuntimeError : public QuantumError` - Declares RuntimeError class inheriting from QuantumError
- **Line 16**: `{` - Opening brace
- **Line 17**: `public:` - Public section
- **Line 18**: `RuntimeError(const std::string &msg, int line = -1)` - Constructor taking message and optional line
- **Line 19**: `: QuantumError("RuntimeError", msg, line) {}` - Calls base constructor with "RuntimeError" as the kind
- **Line 20**: `};` - Closing brace

#### TypeError Class (Lines 22-27)
- **Line 22**: `class TypeError : public QuantumError` - Declares TypeError class
- **Line 23**: `{` - Opening brace
- **Line 24**: `public:` - Public section
- **Line 25**: `TypeError(const std::string &msg, int line = -1)` - Constructor
- **Line 26**: `: QuantumError("TypeError", msg, line) {}` - Calls base constructor with "TypeError" as the kind
- **Line 27**: `};` - Closing brace

#### NameError Class (Lines 29-34)
- **Line 29**: `class NameError : public QuantumError` - Declares NameError class
- **Line 30**: `{` - Opening brace
- **Line 31**: `public:` - Public section
- **Line 32**: `NameError(const std::string &msg, int line = -1)` - Constructor
- **Line 33**: `: QuantumError("NameError", msg, line) {}` - Calls base constructor with "NameError" as the kind
- **Line 34**: `};` - Closing brace

#### IndexError Class (Lines 36-41)
- **Line 36**: `class IndexError : public QuantumError` - Declares IndexError class
- **Line 37**: `{` - Opening brace
- **Line 38**: `public:` - Public section
- **Line 39**: `IndexError(const std::string &msg, int line = -1)` - Constructor
- **Line 40**: `: QuantumError("IndexError", msg, line) {}` - Calls base constructor with "IndexError" as the kind
- **Line 41**: `};` - Closing brace

### Colors Namespace (Lines 43-54)

#### Namespace Declaration (Line 43)
- **Line 43**: `namespace Colors` - Declares a namespace for color constants

#### Color Constants (Lines 45-53)
- **Line 45**: `inline const char *RED = "\033[31m";` - Red color escape sequence
- **Line 46**: `inline const char *YELLOW = "\033[33m";` - Yellow color escape sequence
- **Line 47**: `inline const char *WHITE = "\033[37m";` - White color escape sequence
- **Line 48**: `inline const char *CYAN = "\033[36m";` - Cyan color escape sequence
- **Line 49**: `inline const char *GREEN = "\033[32m";` - Green color escape sequence
- **Line 50**: `inline const char *BLUE = "\033[34m";` - Blue color escape sequence
- **Line 51**: `inline const char *BOLD = "\033[1m";` - Bold text escape sequence
- **Line 52**: `inline const char *RESET = "\033[0m";` - Reset formatting escape sequence
- **Line 53**: `inline const char *MAGENTA = "\033[35m";` - Magenta color escape sequence

- **Line 54**: `}` - Closing brace for the Colors namespace

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
