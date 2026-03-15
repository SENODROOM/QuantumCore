# QuantumLanguage Compiler - Interpreter.h

## Overview

The `include/Interpreter.h` header file is an essential part of the QuantumLanguage compiler, focusing on the interpretation and execution of abstract syntax tree (AST) nodes. This file defines the `Interpreter` class, which is responsible for evaluating expressions and executing statements based on the AST structure. It also includes utility functions to handle different types of values and operations encountered during the compilation process.

## Key Design Decisions

### Use of Smart Pointers

**Why:** The use of smart pointers (`std::shared_ptr`) ensures automatic memory management and helps prevent memory leaks by automatically deallocating memory when it's no longer needed. This is particularly important in a compiler where many objects are dynamically allocated and managed throughout the compilation lifecycle.

### Environment Management

**Why:** An environment (`std::shared_ptr<Environment>`) is used to manage variable scopes and symbol tables. This allows the interpreter to keep track of variables at different levels of the program, ensuring correct access and modification of variables within their respective scopes.

### Step Count Limitation

**Why:** To guard against potential infinite loops, especially in cases like empty input streams, a maximum step count (`MAX_STEPS`) is enforced. This limit prevents the interpreter from running indefinitely and ensures robustness in handling edge cases.

## Class and Function Documentation

### Interpreter Class

**Purpose:** The main interpreter class that handles the evaluation of AST nodes and the execution of quantum language programs.

**Behavior:**
- **Constructor (`Interpreter()`):** Initializes the interpreter with default settings.
- **execute (`void execute(ASTNode &node`):** Executes the given AST node.
- **evaluate (`QuantumValue evaluate(ASTNode &node`):** Evaluates the given AST node and returns its result.
- **execBlock (`void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr`):** Executes a block statement with an optional custom scope.
- **registerNatives (`void registerNatives()`):** Registers built-in native functions.
- **Statement Executors:** Functions like `execVarDecl`, `execFunctionDecl`, etc., handle specific types of statements.
- **Expression Evaluators:** Functions like `evalBinary`, `evalUnary`, etc., evaluate specific types of expressions.
- **C++ Pointer Evaluators:** Functions like `evalAddressOf`, `evalDeref`, etc., handle pointer-related operations in C++.
- **callFunction (`QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args`):** Calls a user-defined function with arguments.
- **callNative (`QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args`):** Calls a native function with arguments.
- **callInstanceMethod (`QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args`):** Calls a method on an instance object.
- **Built-in Method Dispatch:** Functions like `callMethod`, `callArrayMethod`, etc., dispatch calls to appropriate methods based on the type of object.
- **setLValue (`void setLValue(ASTNode &target, QuantumValue val, const std::string &op`):** Sets the value of a left-hand side expression.

### Major Functions

#### `void execute(ASTNode &node)`

**Purpose:** Executes the provided AST node.

**Behavior:** Depending on the type of node, either evaluates the expression or executes the statement.

#### `QuantumValue evaluate(ASTNode &node)`

**Purpose:** Evaluates the provided AST node and returns its result.

**Behavior:** Recursively evaluates the node and returns the corresponding `QuantumValue`.

#### `void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr)`

**Purpose:** Executes a block statement with an optional custom scope.

**Behavior:** Iterates through the statements in the block and executes them, using the provided scope if available.

#### `QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)`

**Purpose:** Calls a user-defined function with arguments.

**Behavior:** Invokes the function with the specified arguments and returns the result.

#### `QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args)`

**Purpose:** Calls a native function with arguments.

**Behavior:** Invokes the native function with the specified arguments and returns the result.

#### `QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)`

**Purpose:** Calls a method on an instance object.

**Behavior:** Invokes the method on the specified instance with the provided arguments and returns the result.

#### `QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args)`

**Purpose:** Dispatches calls to appropriate methods based on the type of object.

**Behavior:** Determines the type of the object and calls the corresponding method with the provided arguments.

#### `void setLValue(ASTNode &target, QuantumValue val, const std::string &op)`

**Purpose:** Sets the value of a left-hand side expression.

**Behavior:** Handles assignment operations and updates the target variable with the new value.

## Tradeoffs and Limitations

- **Memory Management:** While smart pointers provide automatic memory management, they may introduce overhead compared to manual memory management.
- **Infinite Loop Prevention:** The step count limitation prevents infinite loops but may be too restrictive