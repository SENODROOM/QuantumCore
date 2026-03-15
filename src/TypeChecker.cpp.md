# Quantum Language Compiler - TypeChecker.cpp

## Overview

`TypeChecker.cpp` is an essential component of the Quantum Language compiler responsible for performing static type checking on the Abstract Syntax Tree (AST). This phase validates that all expressions and statements adhere to the defined types, thereby preventing runtime errors due to type mismatches.

## Role in the Compiler Pipeline

The `TypeChecker` operates during the semantic analysis stage of the compilation process. It traverses the AST and checks the types of variables, function parameters, and return values. The type checker uses a symbol table (`TypeEnv`) to manage variable declarations and their associated types.

## Key Design Decisions

### Symbol Table Management

**Decision:** Use a shared pointer to a `TypeEnv` object for managing the symbol table.
**Why:** This approach allows the type environment to be passed around and modified throughout the type checking process without copying it extensively. It also facilitates the creation of nested environments for function scopes, ensuring that local variables do not interfere with global ones.

### Type Inference

**Decision:** Allow implicit type inference where possible, defaulting to `"any"` if no explicit type hint is provided.
**Why:** Implicit type inference simplifies the syntax for users who prefer not to explicitly declare types. However, it introduces the risk of type mismatches, which the type checker aims to mitigate through warnings and error handling.

### Error Handling

**Decision:** Use standard error streams (`std::cerr`) for reporting type-related issues.
**Why:** Standard error streams provide a clear and consistent way to report problems directly to the user. This decision avoids cluttering the output with unnecessary information and makes it easier to distinguish between regular output and error messages.

## Documentation of Major Classes/Functions

### Class: TypeChecker

**Purpose:** Manages the type checking process for the entire AST.

**Behaviour:**
- Initializes the global type environment with built-in functions.
- Provides methods to recursively check individual nodes and blocks within the AST.
- Handles type mismatches by issuing warnings and potentially errors.

### Function: check(const std::vector<ASTNodePtr>& nodes)

**Purpose:** Checks a list of AST nodes.

**Behaviour:**
- Iterates over each node in the list and calls `checkNode` to validate its type.
- Ensures that the entire program adheres to the specified types.

### Function: check(const ASTNodePtr& node)

**Purpose:** Checks a single AST node.

**Behaviour:**
- Recursively checks the node's children if it's a block statement.
- Validates the node's type based on its structure and content.

### Function: std::string checkNode(const ASTNodePtr& node, std::shared_ptr<TypeEnv> env)

**Purpose:** Validates the type of a specific AST node.

**Behaviour:**
- Determines the type of the node based on its literal value, identifier, declaration, or function body.
- Updates the type environment with new variable declarations or function signatures.
- Issues warnings for type mismatches when necessary.

## Tradeoffs/Limitations

- **Implicit Type Inference:** While convenient, implicit type inference can lead to subtle bugs and unexpected behavior. Users must be aware of these risks and use explicit type hints where appropriate.
- **Performance Over Accuracy:** The current implementation prioritizes performance by using simple string comparisons for type validation. This may result in false positives or negatives, especially in complex scenarios involving generic types or advanced data structures.
- **Limited Built-in Types:** The type system currently supports basic types like `float`, `string`, and `bool`. Extending this to include more complex types such as arrays, dictionaries, or custom structs would require additional logic and could complicate the type checker.

## Usage Example

To use the `TypeChecker` in your Quantum Language project, follow these steps:

1. Include the header file:
   ```cpp
   #include "TypeChecker.h"
   ```

2. Create an instance of `TypeChecker`:
   ```cpp
   TypeChecker tc;
   ```

3. Check the AST nodes:
   ```cpp
   tc.check(nodes);
   ```

This will validate the types of all nodes in the AST, ensuring that they conform to the specified types.