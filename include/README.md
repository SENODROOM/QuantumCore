# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is a critical component of the QuantumLanguage compiler, dedicated to defining the Abstract Syntax Tree (AST) structure. This file outlines various types of nodes that can represent different parts of the source code, facilitating the parsing and interpretation phases of compilation. The AST serves as a blueprint for the compiler's understanding of the program's syntax and semantics, enabling efficient translation into executable code.

## Role in Compiler Pipeline

- **Parsing**: Converts the source code into an AST during the lexical analysis phase.
- **Semantic Analysis**: Validates the AST for correctness and consistency, ensuring that all references are valid and types match.
- **Code Generation**: Translates the validated AST into machine-readable instructions suitable for the target platform.

## Key Design Decisions and Why

### Use of Variants

The AST uses `std::variant` to handle different expression types dynamically. This choice allows for flexibility and reduces the need for multiple inheritance, making the code cleaner and easier to manage.

### Separate Expression and Statement Types

By categorizing expressions and statements into distinct types, the AST becomes more organized and intuitive. Expressions evaluate to values, while statements perform actions without returning a value, which helps in distinguishing between them during semantic analysis and code generation.

### Optional Components

Many AST node types include optional components such as initializers, return types, and parameter types. These options allow for a wide range of constructs to be represented accurately, including complex function declarations and conditional statements.

## Major Classes/Functions Overview

### Expression Nodes

- **NumberLiteral**, **StringLiteral**, **BoolLiteral**, **NilLiteral**: Represent literal values.
- **Identifier**: Represents variable names.
- **BinaryExpr**, **UnaryExpr**: Handle binary and unary operations respectively.
- **AssignExpr**: Represents assignment operations with support for compound assignments.
- **CallExpr**: Models function calls, capturing the callee and arguments.
- **IndexExpr**: Handles indexing operations.
- **SliceExpr**: Represents Python-style slicing operations.
- **MemberExpr**: Models access to members of objects.
- **ArrayLiteral**, **DictLiteral**: Represent array and dictionary literals.
- **LambdaExpr**: Captures lambda functions, their parameters, default arguments, and return type.
- **TernaryExpr**: Models ternary conditional expressions.
- **SuperExpr**: Represents calls to superclass constructors or methods.

### Pointer Expression Nodes

- **AddressOfExpr**: Models the address-of (`&`) operator.
- **DerefExpr**: Models the dereference (`*`) operator.
- **ArrowExpr**: Models the arrow (`->`) operator for accessing members through pointers.

### Statement Nodes

- **VarDecl**: Represents variable declarations, including constness, type hints, and pointer status.
- **FunctionDecl**: Captures function declarations, including parameters, parameter types, default arguments, and return type.
- **ReturnStmt**: Models return statements, capturing the returned value.
- **IfStmt**: Represents conditional statements, storing the condition, then branch, and else branches.

## Tradeoffs

- **Flexibility vs. Complexity**: Using `std::variant` for dynamic expression types provides flexibility but increases complexity in terms of handling different cases.
- **Memory Usage**: Storing optional components in each node can lead to increased memory usage, especially when many of these components are not used.
- **Readability**: Separating expression and statement types improves readability but might increase cognitive load due to the additional distinction.

Overall, the `include/AST.h` header file is a vital piece of infrastructure for the QuantumLanguage compiler, providing a structured representation of the source code that is both flexible and easy to work with. By carefully designing the AST, the compiler can efficiently parse, analyze, and generate code, ultimately producing high-quality output.