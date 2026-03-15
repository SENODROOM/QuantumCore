# QuantumLanguage Compiler - Interpreter.h

## Overview

The `include/Interpreter.h` header file is a critical component of the QuantumLanguage compiler's execution phase. It defines the `Interpreter` class responsible for interpreting and executing abstract syntax tree (AST) nodes generated during the parsing stage. The interpreter handles various types of statements and expressions, evaluates their values, and manages the execution context through environments.

This file plays a pivotal role in converting high-level quantum language constructs into executable operations, ensuring that the compiled program can run efficiently on the target platform.

## Key Design Decisions

### Use of ASTNodes for Execution

**WHY:** Using `ASTNode` as the primary unit for interpretation allows for a flexible and extensible approach. Each node type can be handled individually, making it easier to add new features or optimize existing ones without affecting the entire system.

### Environment Management

**WHY:** Environments are essential for managing variable scopes, function calls, and object lifetimes. By using shared pointers (`std::shared_ptr`) for environments, the interpreter ensures that memory is properly managed and shared between different parts of the program.

### Step Counting for Infinite Loops

**WHY:** To prevent infinite loops, especially in cases where input might be empty or not provided, the interpreter tracks the number of steps executed. If the step count exceeds `MAX_STEPS`, the program is terminated, preventing potential crashes due to uncontrolled recursion or iteration.

## Classes and Functions Documentation

### Interpreter Class

**Purpose:** Manages the overall execution state of the program, including the current environment and step counter.

**Behavior:**
- **Constructor (`Interpreter()`):** Initializes the interpreter with default settings.
- **execute (`void execute(ASTNode &node)`):** Executes the given AST node.
- **evaluate (`QuantumValue evaluate(ASTNode &node)`):** Evaluates the given AST node and returns its value.
- **execBlock (`void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr)`):** Executes a block of statements within a specific scope.
- **registerNatives (`void registerNatives()`):** Registers built-in functions and methods that can be called from the quantum language.
- **Private Methods:** Various private methods handle the execution of different statement and expression types, such as variable declarations, if statements, binary expressions, etc.

### QuantumValue Class

**Purpose:** Represents a value in the quantum language, which could be an integer, double, string, array, dictionary, function, instance, class, pointer, or any other custom type.

**Behavior:** Provides methods for evaluating and manipulating quantum values, including arithmetic operations, method calls, and indexing.

### Tradeoffs and Limitations

- **Performance:** While the use of environments provides flexibility, it also incurs some overhead in terms of memory management and lookup times.
- **Complexity:** Handling multiple types of values and operations increases the complexity of the interpreter, making it harder to maintain and debug.
- **Error Handling:** The interpreter currently lacks comprehensive error handling mechanisms, which could lead to runtime errors in complex programs.

## Usage Example

To use the interpreter, you would typically create an instance of the `Interpreter` class and call the `execute` method with the root AST node of your program:

```cpp
#include "Interpreter.h"

int main() {
    // Parse your quantum language code into an AST
    ASTNode rootNode = parseCode("your_code_here");

    // Create an interpreter instance
    Interpreter interpreter;

    // Execute the parsed AST
    interpreter.execute(rootNode);

    return 0;
}
```

This example demonstrates how to integrate the interpreter into a larger application, allowing for the execution of quantum language code.