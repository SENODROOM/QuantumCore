# Quantum Language Compiler - TypeChecker.cpp

## Overview

`TypeChecker.cpp` is a crucial part of the Quantum Language compiler, focusing on static type checking within the Abstract Syntax Tree (AST). This phase ensures that all expressions and statements conform to the specified types, thus preventing runtime errors caused by type mismatches.

## Role in the Compiler Pipeline

The `TypeChecker` executes during the semantic analysis stage of the compilation process. Its primary function is to validate the types of variables, literals, function parameters, and return values throughout the program. By doing so, it helps catch potential errors early in the development cycle, improving overall code quality and reliability.

## Key Design Decisions

### Environment Management

**Decision:** The use of environment management (`TypeEnv`) to track variable and function types.
**Why:** This approach allows for dynamic scope resolution and type tracking across different parts of the AST. By maintaining separate environments for blocks and functions, we can accurately reflect the local scope and ensure type consistency within nested structures.

### Built-in Function Handling

**Decision:** Defining built-in functions like `print`, `input`, `len`, `sha256`, and `aes128` with default types.
**Why:** Built-in functions often operate on specific data types, and providing default types ensures that the compiler can handle them correctly without additional user input. This simplifies the type-checking logic for these functions.

### Flexible Type Hints

**Decision:** Allowing users to provide type hints for variable declarations.
**Why:** Type hints enhance code readability and allow developers to explicitly specify their intentions regarding variable types. However, they also introduce complexity as the compiler must reconcile these hints with actual type usage.

## Class and Function Documentation

### TypeChecker Class

**Purpose:** Manages the overall type-checking process, traversing the AST and validating types against the current environment.

**Behavior:**
- **Constructor:** Initializes the global type environment with predefined built-in functions.
- **check(const std::vector<ASTNodePtr>& nodes):** Iterates over a list of AST nodes and checks each one using `checkNode`.
- **check(const ASTNodePtr& node):** Recursively checks individual AST nodes, handling blocks specially by creating a new sub-environment.

### checkNode Function

**Purpose:** Validates the type of a single AST node based on its structure and the current environment.

**Behavior:**
- **NumberLiteral:** Returns `"float"` as the type.
- **StringLiteral:** Returns `"string"` as the type.
- **BoolLiteral:** Returns `"bool"` as the type.
- **Identifier:** Resolves the identifier's type in the current environment.
- **VarDecl:** Checks the initializer's type against any provided type hint and defines the variable in the environment.
- **FunctionDecl:** Sets up a new sub-environment for the function's body, defining parameters and the function itself.
- **BlockStmt:** Creates a new sub-environment for the block, checking each statement within it.

## Tradeoffs and Limitations

- **Flexibility vs. Complexity:** Allowing type hints adds flexibility but increases the complexity of the type-checking logic. Users may provide incorrect hints leading to subtle bugs.
- **Default Types for Built-ins:** While simplifying type handling for built-in functions, it might not always align with user expectations, especially when dealing with quantum operations which could require more specific types.
- **Limited Support for Advanced Types:** The current implementation supports basic types (`float`, `string`, `bool`). Extending support for advanced types like arrays, structs, or custom types would require significant changes and testing.

This README provides a comprehensive overview of the `TypeChecker.cpp` file, explaining its role, key design decisions, and functional details while acknowledging inherent tradeoffs and limitations.