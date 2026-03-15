# QuantumLanguage Compiler - Value.h

## Overview

The `include/Value.h` header file is an integral part of the QuantumLanguage compiler's core infrastructure. It defines various data structures and types used to represent values within the language, including basic types like integers, doubles, strings, arrays, dictionaries, functions, native functions, instances, classes, and pointers. This file plays a crucial role in managing value semantics across different stages of compilation and execution.

## Key Design Decisions

### Use of Variants for Value Representation

One of the primary design decisions in `Value.h` is the use of `std::variant` to represent different types of values. This choice was made to provide a type-safe way to handle multiple value types without resorting to unions or void pointers. By encapsulating all possible value types within a single variant, the compiler can maintain strong typing throughout the evaluation process, reducing runtime errors and improving performance.

### Smart Pointers for Memory Management

To ensure efficient memory management and prevent memory leaks, smart pointers (`std::shared_ptr`) are extensively used in `Value.h`. These pointers automatically manage the lifecycle of dynamically allocated objects, ensuring that resources are properly freed when they are no longer needed. The use of shared pointers also facilitates easier sharing of state between different parts of the interpreter, which is essential for handling closures and function calls.

### Non-Owning Pointers for AST Nodes

In the context of representing function bodies, non-owning pointers (`std::weak_ptr`) to `ASTNode` are used instead of owning pointers (`std::shared_ptr`). This decision was made to avoid circular references and potential memory issues during garbage collection. By using weak pointers, the compiler ensures that AST nodes can be safely referenced without causing ownership cycles, leading to more robust and scalable code.

## Documentation

### QuantumNil

Represents the "nil" value, often used as a placeholder or default value.

**Purpose:** To provide a standard representation for the "nil" value in the compiler.

### QuantumFunction

Represents a user-defined function in the QuantumLanguage.

**Fields:**
- `name`: The name of the function.
- `params`: A vector of parameter names.
- `paramIsRef`: A vector indicating whether each parameter should be passed by reference.
- `defaultArgs`: A vector of default argument expressions.
- `body`: A non-owning pointer to the function body's AST node.
- `closure`: A shared pointer to the environment capturing the function's scope.

**Purpose:** To store information about user-defined functions and facilitate their execution.

### QuantumClass

Represents a user-defined class in the QuantumLanguage.

**Purpose:** To store information about user-defined classes and enable object-oriented programming features.

### QuantumInstance

Represents an instance of a user-defined class.

**Purpose:** To store state and behavior associated with specific instances of classes.

### QuantumNative

Represents a native function implemented in another language (e.g., C++).

**Fields:**
- `name`: The name of the native function.
- `fn`: A callable object representing the native function.

**Purpose:** To integrate external functionality into the QuantumLanguage compiler.

### QuantumNativeFunc

A type alias for a function that takes a vector of `QuantumValue`s and returns a `QuantumValue`.

**Purpose:** To define the signature for native functions.

### QuantumPointer

Represents a pointer to a variable in the QuantumLanguage.

**Fields:**
- `cell`: A shared pointer to the actual variable storage.
- `varName`: The name of the variable for display/debug purposes.
- `offset`: An optional integer offset for pointer arithmetic.

**Methods:**
- `isNull()`: Checks if the pointer is null.
- `deref()`: Dereferences the pointer and returns a reference to the underlying value. Throws an exception if the pointer is null.

**Purpose:** To support pointer operations and facilitate dynamic memory management.

### QuantumValue

Represents a generic value in the QuantumLanguage.

**Type Alias:**
- `Data`: A variant containing all possible value types.

**Constructor Overloads:**
- Default constructor initializes to `QuantumNil`.
- Explicit constructors for boolean, double, string, array, dictionary, function, native function, instance, class, and pointer types.

**Purpose:** To serve as a versatile container for any value type in the QuantumLanguage.

## Tradeoffs and Limitations

- **Memory Overhead:** Using smart pointers introduces some overhead compared to raw pointers, but it significantly improves memory safety and reduces manual memory management.
- **Complexity:** The use of variants and smart pointers adds complexity to the codebase, making it harder to understand and debug at times.
- **Performance:** While smart pointers help prevent memory leaks, they may introduce slight performance penalties due to additional indirection and locking mechanisms.

Overall, the design choices in `Value.h` aim to balance safety, flexibility, and performance, providing a solid foundation for the QuantumLanguage compiler's value system.