# QuantumLanguage Compiler - Interpreter.h

## Overview

The `include/Interpreter.h` header file is an integral part of the QuantumLanguage compiler, responsible for interpreting and executing abstract syntax tree (AST) nodes. It defines the core functionalities needed to process different types of statements and expressions, ensuring that the program logic is correctly evaluated and executed during the compilation phase.

## Key Design Decisions

### Use of Smart Pointers

**Why:** To manage memory efficiently and avoid memory leaks, smart pointers (`std::shared_ptr`) are used extensively throughout the interpreter. This ensures automatic deallocation of resources when they are no longer needed, enhancing overall stability and performance of the compiler.

### Environment Management

**Why:** The interpreter maintains an environment (`std::shared_ptr<Environment>`) to store variables, functions, and other state information. This allows for dynamic scoping and variable resolution, essential features of the QuantumLanguage.

### Step Count Guard

**Why:** A guard against infinite loops is implemented using a step count mechanism (`stepCount_`). This prevents the interpreter from running indefinitely on malformed input, thus safeguarding the system from potential crashes due to resource exhaustion.

## Class and Function Documentation

### Interpreter Class

**Purpose:** Manages the execution context and provides methods to interpret AST nodes.

**Behaviour:**
- **Constructor:** Initializes the interpreter with global and local environments.
- **execute(ASTNode &node):** Executes the given AST node.
- **evaluate(ASTNode &node):** Evaluates the given AST node and returns its result.
- **execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr):** Executes a block statement within a specified scope.
- **registerNatives():** Registers built-in native functions and methods.
- **Statement Executors:** Methods like `execVarDecl`, `execFunctionDecl`, etc., handle specific types of statements.
- **Expression Evaluators:** Methods like `evalBinary`, `evalUnary`, etc., handle various expression types.

### QuantumValue Class

**Purpose:** Represents a value in the QuantumLanguage, supporting multiple types including integers, doubles, strings, arrays, dictionaries, and more.

**Behaviour:** Provides constructors and methods to create and manipulate values of different types.

### Tradeoffs and Limitations

- **Memory Usage:** While smart pointers help manage memory, the overhead associated with them might impact performance, especially in scenarios with high memory allocation.
- **Scalability:** The current implementation assumes a relatively small number of steps before detecting an infinite loop. For very complex programs, this limit might need to be adjusted or replaced with a more sophisticated detection mechanism.
- **Error Handling:** Error handling is minimal within this header file. More robust error reporting and recovery mechanisms should be integrated into the interpreter for better reliability.

## Usage Example

To use the interpreter, you would typically:

1. Parse your QuantumLanguage code into an AST.
2. Create an instance of the `Interpreter`.
3. Call `execute()` or `evaluate()` on the root AST node to start processing.

```cpp
#include "Parser.h"
#include "Interpreter.h"

int main() {
    Parser parser("your_code.q");
    auto ast = parser.parse();

    Interpreter interpreter;
    interpreter.execute(*ast);

    return 0;
}
```

This example demonstrates how to integrate the interpreter into a simple application that parses and executes QuantumLanguage code.