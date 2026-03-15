# QuantumLanguage Compiler - TypeChecker.h

## Overview

The `include/TypeChecker.h` header file is an essential component of the QuantumLanguage compiler, focusing on type checking during the semantic analysis phase. It provides the infrastructure to validate the types of expressions, statements, and declarations within the source code, ensuring that operations are performed between compatible types and preventing runtime errors due to type mismatches.

This file plays a crucial role in maintaining the integrity and correctness of the compiled code by enforcing strict type rules throughout the compilation process.

## Key Design Decisions

### 1. **StaticTypeError Class**
   - **Purpose**: To represent static type errors encountered during the type checking process.
   - **Why**: A custom exception class allows for more specific error handling related to type issues, making it easier to diagnose problems at compile time rather than at runtime.

### 2. **TypeEnv Structure**
   - **Purpose**: To manage the environment of variable types, allowing for nested scopes where variables can be defined and resolved.
   - **Why**: Nested environments enable the tracking of local and global variable types, facilitating the resolution of variable references based on their scope. The use of shared pointers ensures efficient memory management and avoids deep copying of environment objects.

### 3. **TypeChecker Class**
   - **Purpose**: To orchestrate the type checking process across the entire program.
   - **Why**: Centralizing the type checking logic within a single class makes it easier to maintain and extend. It also simplifies the integration of type checking into the broader compiler architecture.

## Documentation

### StaticTypeError Class

**Inheritance**: Inherits from `std::runtime_error`.

**Constructor**:
- `StaticTypeError(const std::string &msg, int l)`: Constructs a new `StaticTypeError` object with the given message and line number.

**Members**:
- `int line`: Stores the line number where the error occurred.

### TypeEnv Structure

**Purpose**: Manages the environment of variable types, supporting nested scopes.

**Members**:
- `std::map<std::string, std::string> vars`: Maps variable names to their types.
- `std::shared_ptr<TypeEnv> parent`: Points to the parent environment, enabling nested scopes.

**Methods**:
- `void define(const std::string& name, const std::string& type)`: Defines a new variable in the current environment.
- `std::string resolve(const std::string& name)`: Resolves the type of a variable by searching through the current and parent environments.

### TypeChecker Class

**Purpose**: Orchestrates the type checking process across the entire program.

**Members**:
- `std::shared_ptr<TypeEnv> globalEnv`: Represents the global type environment.

**Methods**:
- `TypeChecker()`: Initializes a new `TypeChecker` object with an empty global environment.
- `void check(const std::vector<ASTNodePtr>& nodes)`: Checks the types of all nodes in a vector of abstract syntax tree (AST) nodes.
- `void check(const ASTNodePtr& node)`: Checks the type of a single AST node.
- `std::string checkNode(const ASTNodePtr& node, std::shared_ptr<TypeEnv> env)`: Recursively checks the type of an AST node within a given environment and returns the inferred type.

## Tradeoffs and Limitations

- **Complexity**: Implementing a comprehensive type checker adds significant complexity to the compiler, requiring careful handling of various data types and operations.
- **Performance**: Frequent type lookups and validation can impact performance, especially in large programs with many nested scopes.
- **Error Handling**: While `StaticTypeError` provides specific information about type errors, it may not cover all possible scenarios, leading to potential gaps in error reporting.

By addressing these tradeoffs, the QuantumLanguage compiler aims to strike a balance between thoroughness, efficiency, and usability.