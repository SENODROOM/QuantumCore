# Quantum Language Compiler Interpreter

## Overview

`Interpreter.cpp` is a critical component of the Quantum Language compiler, responsible for interpreting and executing quantum programs. This file contains the core logic of the interpreter, processing quantum instructions and managing the execution environment.

## Role in Compiler Pipeline

The `Interpreter` operates during the execution phase of the compiler pipeline. It accepts parsed quantum programs as input and executes them based on the language's semantics.

## Key Design Decisions

### Token Buffering

To handle cases where a single `std::cin >>` operation might leave tokens buffered due to whitespace delimitation, a static token buffer (`s_cinBuffer`) is used. This decision ensures that subsequent `std::cin >>` operations can read from the remaining tokens without losing data.

**Why:** Standard library functions like `std::cin >>` do not consume newline characters or additional whitespace after reading a token, which can lead to unexpected behavior when multiple inputs are required consecutively.

### Error Handling

Error handling is implemented using custom exceptions (`TypeError`, `RuntimeError`). These exceptions provide clear error messages indicating the expected type and context of the error.

**Why:** Using custom exceptions allows for more precise control over error reporting, making it easier to identify issues within the quantum program being executed.

## Classes and Functions Documentation

### Helper Functions

#### `toNum(const QuantumValue &v, const std::string &ctx)`

- **Purpose:** Converts a `QuantumValue` to a `double`.
- **Behavior:** If the value is a number, it returns the numeric value. Otherwise, it throws a `TypeError` with a message indicating the expected type and context.
- **Tradeoffs:** This function assumes that all values intended to be numbers should be convertible to `double`. Any non-numeric types will result in an exception.

#### `toInt(const QuantumValue &v, const std::string &ctx)`

- **Purpose:** Converts a `QuantumValue` to a `long long`.
- **Behavior:** Calls `toNum` to convert the value to a `double` and then casts it to `long long`. Throws a `TypeError` if the conversion fails.
- **Tradeoffs:** Similar to `toNum`, this function assumes that the numeric value can be safely cast to `long long`. Loss of precision may occur if the number exceeds the range of `long long`.

### Format Engine

#### `applyFormat(const std::string &fmt, const std::vector<QuantumValue> &args, size_t argStart = 1)`

- **Purpose:** Applies formatting to a list of `QuantumValue` arguments according to a given format string.
- **Behavior:** The function supports various format specifiers including integers, floating-point numbers, strings, and more. It processes the format string character by character, applying the appropriate formatting to each argument.
- **Tradeoffs:** The implementation is complex and requires careful handling of different format specifiers and flags. Performance may be impacted by the need to parse and process the format string dynamically.

## Tradeoffs and Limitations

- **Type Safety:** The current implementation relies heavily on dynamic type checking and conversions. While flexible, this approach can lead to runtime errors if the expected types are not met.
- **Performance:** The format engine is designed for flexibility but may impact performance, especially for large format strings or high-frequency formatting operations.
- **Complexity:** Managing the state and execution flow of quantum programs adds significant complexity to the interpreter. Ensuring correctness and efficiency in handling these operations is challenging.

## Conclusion

`Interpreter.cpp` plays a vital role in the Quantum Language compiler by interpreting and executing quantum programs. Its design decisions aim to balance flexibility, type safety, and performance, though they introduce certain complexities and potential limitations. By thoroughly understanding and documenting these aspects, developers can better maintain and extend the functionality of the interpreter.