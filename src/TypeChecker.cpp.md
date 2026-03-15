# Quantum Language Compiler - TypeChecker.cpp

## Overview

`TypeChecker.cpp` is a crucial component of the Quantum Language compiler responsible for performing static type checking on the Abstract Syntax Tree (AST). This ensures that all expressions and statements adhere to the defined types, preventing runtime errors due to type mismatches.

## Key Design Decisions

### Use of Shared Pointers for Environment Management

**Why:** Using `std::shared_ptr` for managing the type environment allows for efficient sharing of environments between different parts of the compiler without copying them. This is particularly useful in nested scopes where multiple functions and variables need access to the same environment.

### Simplified Function Types

**Why:** For simplicity, function types are represented as `"fn"` rather than specifying their exact parameter and return types. This approach reduces complexity during type checking while still providing enough information to catch basic type mismatches.

## Class and Function Documentation

### TypeChecker Class

**Purpose:** The primary class for the type checker. It initializes the global type environment with built-in functions and recursively checks each node in the AST for type correctness.

**Behavior:**
- **Constructor (`TypeChecker()`):** Initializes the global environment with built-in functions.
- **Public Methods:**
  - `void check(const std::vector<ASTNodePtr>& nodes);`: Checks an entire list of AST nodes.
  - `void check(const ASTNodePtr& node);`: Checks a single AST node, handling blocks specially.
  
### checkNode Function

**Purpose:** Recursively checks a single AST node for type correctness within a given environment.

**Behavior:**
- Takes an AST node and a shared pointer to the current type environment.
- Returns the inferred type of the node as a string.
- Handles various types of literals, identifiers, variable declarations, function declarations, and blocks.
- Performs basic type checking for variable declarations and outputs warnings for type mismatches.

## Tradeoffs and Limitations

### Basic Type Checking Only

The type checker currently only performs basic type checking and simplifies function types to `"fn"`. More advanced type systems like generics or complex type inference are not supported, which limits the expressiveness of the language.

### Limited Error Handling

While the type checker outputs warnings for type mismatches, it lacks comprehensive error handling mechanisms. Future enhancements could include more detailed error messages and recovery strategies.

### No Support for Generics

Generics are not supported, which means that type safety cannot be enforced across different data structures or collections. This limitation affects the scalability and robustness of the language.

## Conclusion

`TypeChecker.cpp` plays a vital role in ensuring type safety within the Quantum Language compiler. By initializing the global environment with built-in functions and recursively checking each node, it helps prevent runtime errors caused by type mismatches. However, the current implementation has limitations such as basic type checking only and lack of support for generics, which could be addressed in future versions of the compiler.