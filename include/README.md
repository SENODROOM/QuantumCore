# QuantumLanguage Compiler - TypeChecker.h

## Overview

The `include/TypeChecker.h` header file is a critical component of the QuantumLanguage compiler, dedicated to the type checking phase. This phase ensures that the code adheres to its declared types, preventing runtime errors due to type mismatches. The `TypeChecker` class, along with supporting structures like `StaticTypeError` and `TypeEnv`, forms the backbone of this functionality.

### Role in Compiler Pipeline

1. **Syntax Analysis**: After parsing the source code into an Abstract Syntax Tree (AST), the next step is type checking.
2. **Semantic Validation**: Ensures that all variables, functions, and expressions are used correctly according to their declared types.
3. **Error Detection**: Identifies static type errors such as mismatched argument types or undeclared variables.

## Key Design Decisions and Why

### 1. Exception Handling with `StaticTypeError`

- **Why**: To provide clear and specific error messages indicating where and why a type error occurred during compilation.
- **Implementation**: Inherits from `std::runtime_error` and includes an additional `line` attribute to specify the error's location in the source code.

### 2. Type Environment (`TypeEnv`)

- **Why**: To manage variable scoping and type resolution efficiently.
- **Design**:
  - Uses a hierarchical map structure where each scope can override or extend the parent scope.
  - `define` method adds new variables to the current scope.
  - `resolve` method searches for a variable starting from the current scope and moving up to the global scope, returning `"any"` if not found.

### 3. Global Type Environment

- **Why**: To maintain a consistent state of defined types across different parts of the program.
- **Implementation**: A shared pointer to a `TypeEnv` instance that serves as the root of the type environment hierarchy.

## Major Classes/Functions Overview

### `TypeChecker`

- **Purpose**: Manages the overall type checking process.
- **Public Methods**:
  - `check(const std::vector<ASTNodePtr>& nodes)`: Checks a list of AST nodes.
  - `check(const ASTNodePtr& node)`: Checks a single AST node.
  - `checkNode(const ASTNodePtr& node, std::shared_ptr<TypeEnv> env)`: Recursively checks a node within a given type environment.

### `StaticTypeError`

- **Purpose**: Custom exception class for reporting static type errors.
- **Attributes**:
  - `int line`: Line number where the error occurred.
- **Constructor**: Takes a message and a line number, initializing the base `std::runtime_error`.

### `TypeEnv`

- **Purpose**: Represents the type environment, which tracks variable declarations and their types.
- **Attributes**:
  - `std::map<std::string, std::string> vars`: Map of variable names to their types.
  - `std::shared_ptr<TypeEnv> parent`: Pointer to the parent type environment.
- **Methods**:
  - `void define(const std::string& name, const std::string& type)`: Adds a variable declaration.
  - `std::string resolve(const std::string& name)`: Resolves the type of a variable, searching through the scope hierarchy.

## Tradeoffs

### Memory Management

- **Tradeoff**: Using shared pointers for `TypeEnv` allows efficient management of memory, especially in large programs with many nested scopes. However, it also introduces overhead associated with reference counting.

### Error Reporting

- **Tradeoff**: Providing detailed error messages with line numbers enhances debugging but requires more complex exception handling mechanisms.

### Performance

- **Tradeoff**: Recursive type resolution in `checkNode` can be computationally expensive, particularly in deeply nested programs. Optimizing these recursive calls might involve caching results or using memoization techniques.

Overall, the `TypeChecker.h` file plays a vital role in ensuring the correctness and reliability of the compiled code by performing comprehensive type validation. Its design choices balance functionality, performance, and memory usage, making it a robust and efficient part of the QuantumLanguage compiler.