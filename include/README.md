# QuantumLanguage Compiler - Interpreter.h

## Overview

The `include/Interpreter.h` header file is an essential part of the QuantumLanguage compiler, focusing on the execution phase of the compilation process. This file defines the `Interpreter` class, which is responsible for interpreting and executing Abstract Syntax Tree (AST) nodes generated during the parsing stage. The `Interpreter` class manages the evaluation of expressions, execution of statements, and handling of function calls, providing the core functionality needed for running quantum programs.

## Key Design Decisions

### Use of Smart Pointers

**Why:** To ensure memory safety and prevent memory leaks, smart pointers (`std::shared_ptr`) are used extensively throughout the `Interpreter` class. This decision simplifies memory management by automatically deallocating memory when it is no longer needed, reducing the risk of bugs related to manual memory management.

### Separate ASTNode Types for Execution and Evaluation

**Why:** Differentiating between `ASTNode` types for execution and evaluation allows for more efficient processing. For example, some nodes can be evaluated directly without further interpretation, while others require full execution. This separation ensures that the interpreter focuses on executing statements and calling functions, rather than evaluating every expression repeatedly.

### Environment Management

**Why:** An environment (`std::shared_ptr<Environment>`) is crucial for managing variable scopes and storing variables during the execution phase. By maintaining separate global and local environments, the interpreter can accurately resolve variable references and manage state across different parts of the program.

## Classes and Functions Documentation

### Class: Interpreter

**Purpose:** Manages the interpretation and execution of AST nodes, including statement execution and expression evaluation.

**Behavior:**
- **Constructor:** Initializes the interpreter with a global environment.
- **execute(ASTNode &node):** Executes the given AST node.
- **evaluate(ASTNode &node):** Evaluates the given AST node and returns its result.
- **execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr):** Executes a block of statements, optionally using a custom scope.
- **registerNatives():** Registers built-in native functions and methods.
- **Private Member Functions:** Various helper functions for executing specific types of statements and evaluating expressions.

### Function: QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)

**Purpose:** Calls a user-defined function with the provided arguments.

**Behavior:** Invokes the specified function with the arguments and returns the result.

### Function: QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args)

**Purpose:** Calls a native function with the provided arguments.

**Behavior:** Invokes the specified native function with the arguments and returns the result.

### Function: QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)

**Purpose:** Calls a method on an instance object with the provided arguments.

**Behavior:** Invokes the specified method on the given instance object with the arguments and returns the result.

### Function: QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args)

**Purpose:** Dispatches a method call based on the type of the object.

**Behavior:** Determines the appropriate method dispatcher based on the object type and invokes the method with the provided arguments.

### Function: QuantumValue callArrayMethod(std::shared_ptr<Array> arr, const std::string &method, std::vector<QuantumValue> args)

**Purpose:** Handles method calls on array objects.

**Behavior:** Invokes the specified method on the given array object with the arguments and returns the result.

### Function: QuantumValue callStringMethod(const std::string &str, const std::string &method, std::vector<QuantumValue> args)

**Purpose:** Handles method calls on string objects.

**Behavior:** Invokes the specified method on the given string object with the arguments and returns the result.

### Function: QuantumValue callDictMethod(std::shared_ptr<Dict> dict, const std::string &method, std::vector<QuantumValue> args)

**Purpose:** Handles method calls on dictionary objects.

**Behavior:** Invokes the specified method on the given dictionary object with the arguments and returns the result.

### Function: void setLValue(ASTNode &target, QuantumValue val, const std::string &op)

**Purpose:** Sets the value of an l-value (variable or member) based on the operation performed.

**Behavior:** Updates the target l-value with the provided value according to the specified operation.

## Tradeoffs and Limitations

- **Performance:** While smart pointers provide memory safety, they may introduce slight performance overhead compared to raw pointers.
- **Complexity:** The separation of execution and evaluation into distinct classes/functions adds complexity to the codebase but improves modularity and maintainability.
- **Infinite Loops Protection:** The `stepCount_` mechanism prevents infinite loops by limiting the number of steps the interpreter can take. However, this may not catch all potential infinite loop scenarios.

This file plays a critical role in the QuantumLanguage compiler by enabling the execution of quantum programs. Through careful design decisions and comprehensive implementation, the `Interpreter` class provides a robust foundation for handling various aspects of quantum programming.