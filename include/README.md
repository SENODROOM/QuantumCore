# QuantumLanguage Compiler - TypeChecker.h

## Overview

The `include/TypeChecker.h` header file is an integral part of the QuantumLanguage compiler's architecture, focusing on the static type checking process. This file defines essential data structures and classes to manage and validate the types of expressions and declarations during compilation. The primary goal is to ensure type safety and catch errors early in the development cycle, enhancing the reliability and maintainability of the generated quantum programs.

## Key Design Decisions

### 1. **StaticTypeError Class**
   - **Purpose**: To represent type-related errors that occur at compile time.
   - **Why**: By deriving from `std::runtime_error`, it leverages C++'s exception handling mechanism, making error reporting more structured and easier to handle.
   - **Tradeoff**: While exceptions provide a powerful way to handle errors, they can also lead to performance overhead and complex control flow, especially in large codebases.

### 2. **TypeEnv Structure**
   - **Purpose**: To maintain a lexical scope-based environment for resolving variable types.
   - **Why**: Using a shared pointer (`std::shared_ptr`) allows for efficient management of nested scopes, enabling the resolution of variable types in a hierarchical manner.
   - **Tradeoff**: Memory management becomes crucial, as shared ownership must be carefully handled to avoid memory leaks or dangling references.

### 3. **TypeChecker Class**
   - **Purpose**: To perform static type checking on abstract syntax tree (AST) nodes.
   - **Why**: Encapsulating the type checking logic within a dedicated class helps in organizing the code better and makes it reusable across different parts of the compiler.
   - **Tradeoff**: Increased complexity due to the need for maintaining state and handling multiple types of nodes.

## Documentation of Major Classes/Functions

### **StaticTypeError Class**

**Constructor**:
```cpp
StaticTypeError(const std::string &msg, int l)
```
- **Parameters**:
  - `msg`: A string message describing the error.
  - `l`: An integer indicating the line number where the error occurred.
- **Behavior**: Initializes a `StaticTypeError` object with the provided message and line number.

### **TypeEnv Structure**

**Constructor**:
```cpp
TypeEnv(std::shared_ptr<TypeEnv> p = nullptr)
```
- **Parameters**:
  - `p`: An optional shared pointer to the parent environment.
- **Behavior**: Creates a new `TypeEnv` object, optionally linked to a parent environment.

**Methods**:
- `define(const std::string& name, const std::string& type)`:
  - **Parameters**:
    - `name`: The name of the variable.
    - `type`: The type of the variable.
  - **Behavior**: Defines a new variable in the current environment with the specified type.

- `resolve(const std::string& name)`:
  - **Parameters**:
    - `name`: The name of the variable to resolve.
  - **Behavior**: Resolves the type of a variable by searching through the current and parent environments. Returns "any" if the variable is not found.

### **TypeChecker Class**

**Constructor**:
```cpp
TypeChecker()
```
- **Behavior**: Initializes a `TypeChecker` object with a default global environment.

**Methods**:
- `check(const std::vector<ASTNodePtr>& nodes)`:
  - **Parameters**:
    - `nodes`: A vector of AST nodes to check.
  - **Behavior**: Checks the type of all nodes in the provided vector using the `globalEnv`.

- `check(const ASTNodePtr& node)`:
  - **Parameters**:
    - `node`: An AST node to check.
  - **Behavior**: Checks the type of a single AST node using the `globalEnv`.

- `checkNode(const ASTNodePtr& node, std::shared_ptr<TypeEnv> env)`:
  - **Parameters**:
    - `node`: An AST node to check.
    - `env`: A shared pointer to the current type environment.
  - **Behavior**: Recursively checks the type of an AST node within the given environment. Handles different types of nodes like literals, variables, function calls, etc., and resolves their types accordingly.

## Tradeoffs and Limitations

- **Performance Overhead**: The use of exceptions and dynamic memory allocation can introduce performance overhead, which might become significant in large projects.
- **Complexity**: Managing nested scopes and ensuring correct type resolution requires careful implementation and testing.
- **Error Handling**: While exceptions provide robust error handling, they can make the code harder to read and understand compared to traditional error codes.

This header file plays a pivotal role in the QuantumLanguage compiler by providing the necessary infrastructure for static type checking, ensuring that the generated quantum programs adhere to type safety rules.