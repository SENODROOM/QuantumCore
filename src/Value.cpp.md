# Value.cpp - Core Data Representation Module of Quantum Language Compiler

## Overview

`Value.cpp` is a critical component of the Quantum Language compiler, responsible for managing and manipulating various data types encountered during the compilation process. This module introduces the `QuantumValue` class and associated utility functions, ensuring efficient and accurate handling of these values throughout the compiler's execution phases.

## Role in the Compiler Pipeline

`Value.cpp` acts as a foundational layer, providing essential functionalities for value representation and manipulation. It is integral to the semantic analysis phase, where it helps in determining the truthiness of expressions, converting them into strings, and performing type-specific operations. Additionally, it supports the generation of machine code by providing representations of values suitable for the target architecture.

## Key Design Decisions

### Use of `std::variant` for Value Storage

The decision to use `std::variant` for storing different types of values was driven by the need for flexibility and type safety. By encapsulating various value types within a single variant, we can avoid manual type checking and casting, reducing the risk of runtime errors and improving code readability.

### Overloading Functions with `std::visit`

To handle different types of values without resorting to multiple function overloads, `std::visit` is employed. This approach allows us to define behavior for each specific type within a single function, making the code more maintainable and scalable.

## Documentation of Classes and Functions

### QuantumValue Class

**Purpose**: Represents a value in the Quantum Language, capable of holding various data types including numbers, strings, arrays, and functions.

**Behavior**:
- The `isTruthy()` method determines whether a value is considered "truthy" based on its underlying type.
- The `toString()` method converts the value to its string representation, handling different types appropriately.

**Trade-offs**: While `std::variant` provides flexibility, it may lead to increased memory usage compared to fixed-size unions. Additionally, the use of `std::visit` can result in less readable code if not properly managed.

### isTruthy Function

**Purpose**: Determines the truthiness of a `QuantumValue`.

**Behavior**: Utilizes `std::visit` to apply a lambda function that checks the truthiness based on the value's type. For example, a boolean value is considered true if it holds `true`, and a non-empty string is also considered true.

### toString Function

**Purpose**: Converts a `QuantumValue` to its string representation.

**Behavior**: Again, employing `std::visit`, this function transforms the value into a string format appropriate for its type. Arrays and dictionaries are represented in their respective list and dictionary formats, with strings enclosed in quotes.

## Limitations and Tradeoffs

- **Memory Usage**: Using `std::variant` can increase memory consumption due to the overhead of type storage.
- **Readability**: Overloaded functions with `std::visit` might make the code harder to read and understand, especially when dealing with complex types.
- **Performance**: Depending on the number of types supported and the complexity of the operations, performance can be impacted.

Despite these limitations, the design choices in `Value.cpp` provide a robust foundation for handling diverse data types efficiently and accurately within the Quantum Language compiler.