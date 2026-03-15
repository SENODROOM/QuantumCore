# Quantum Language Compiler - TypeChecker.cpp

## Overview

`TypeChecker.cpp` is a vital part of the Quantum Language compiler, focusing on static type checking within the Abstract Syntax Tree (AST). This process ensures that all expressions and statements conform to their designated types, thus preventing runtime errors caused by type mismatches.

## Role in the Compiler Pipeline

The `TypeChecker.cpp` plays a critical role in the compiler's pipeline, specifically during the semantic analysis phase. It follows the lexical and syntactic analysis stages, where tokens and syntax trees are generated, respectively. The type checker then traverses these structures to validate type consistency across the entire program.

### Key Design Decisions and Why

1. **Built-in Functions**: The type checker initializes a global environment with predefined types for built-in functions like `print`, `input`, `len`, `sha256`, and `aes128`. This simplifies the handling of these functions throughout the compilation process.

2. **Type Inference**: For variables without explicit type hints, the type checker infers their types based on their initializers. This approach reduces verbosity and makes the code more readable while ensuring type safety.

3. **Scope Management**: Each function and block statement creates its own scope, encapsulated by a nested `TypeEnv`. This allows the type checker to manage variable declarations and their associated types accurately, even when they share names.

4. **Recursive Checking**: The `check` method is designed to handle both individual nodes and blocks of statements recursively. This ensures that every part of the AST is thoroughly checked for type correctness.

## Major Classes/Functions Overview

### `TypeChecker`
- **Constructor**: Initializes the global environment with predefined types for built-in functions.
- **Public Methods**:
  - `check(const std::vector<ASTNodePtr>& nodes)`: Checks multiple AST nodes.
  - `check(const ASTNodePtr& node)`: Checks a single AST node, including handling block statements.

### `TypeEnv`
- **Purpose**: Manages the current scope's type information.
- **Methods**:
  - `define(const std::string& name, const std::string& type)`: Adds or updates a variable's type.
  - `resolve(const std::string& name)`: Retrieves the type of a variable.

### `checkNode`
- **Purpose**: Recursively checks an AST node and returns its type.
- **Parameters**:
  - `const ASTNodePtr& node`: The node to check.
  - `std::shared_ptr<TypeEnv> env`: The current scope's type environment.
- **Return Value**: The inferred or explicitly defined type of the node as a string.

## Tradeoffs

1. **Simplicity vs. Flexibility**: By inferring types for variables without explicit hints, the type checker simplifies the user experience but may limit flexibility in complex scenarios.

2. **Performance**: Creating nested scopes for each function and block adds overhead, which could impact performance, especially in large programs.

3. **Readability vs. Error Handling**: While type inference enhances readability, it also complicates error handling, as type mismatches can occur silently unless explicitly caught.

Overall, `TypeChecker.cpp` is a robust component that significantly improves the reliability and maintainability of the Quantum Language compiler by enforcing strict type constraints at compile time.