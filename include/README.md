# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is an essential part of the QuantumLanguage compiler, focusing on defining and managing Abstract Syntax Trees (ASTs). This file serves as the backbone for representing the syntactic structure of the source code, enabling efficient parsing, semantic analysis, and code generation. The use of C++'s type system allows for a flexible and robust representation of various AST nodes, facilitating the handling of complex expressions, statements, and function calls.

## Role in Compiler Pipeline

### Parsing Phase
In the parsing phase, the `AST.h` file is instrumental in converting the input source code into a structured AST. Each token generated during lexical analysis corresponds to a specific AST node, which is then constructed using the structures defined in this file.

### Semantic Analysis Phase
During semantic analysis, the AST is traversed to validate the syntax and semantics of the code. The `AST.h` file facilitates this process by providing mechanisms to check variable types, function signatures, and other language-specific rules.

### Code Generation Phase
Finally, the AST is used to generate machine code or intermediate representations like LLVM IR. The `AST.h` file ensures that all necessary information is available at each stage of the compilation process, allowing for accurate and efficient code generation.

## Key Design Decisions and Why

1. **Use of Variants**: The `std::variant` type is employed extensively to represent different kinds of AST nodes. This choice simplifies the management of heterogeneous data structures and enhances type safety without sacrificing flexibility.

2. **Smart Pointers**: All AST nodes are managed using `std::unique_ptr`, ensuring automatic memory management and preventing memory leaks. This approach aligns with modern C++ practices and promotes cleaner code.

3. **Forward Declarations**: Forward declarations are utilized where possible to reduce compilation times and avoid circular dependencies. This design decision helps maintain a modular architecture and improves overall build efficiency.

4. **Extensibility**: The AST structures are designed with extensibility in mind, allowing for easy addition of new expression and statement types as the language evolves. This flexibility is crucial for maintaining a dynamic and evolving compiler.

## Major Classes/Functions Overview

### Expression Types

- **NumberLiteral, StringLiteral, BoolLiteral, NilLiteral**: Represent literal values of numbers, strings, booleans, and nil respectively.
- **Identifier**: Represents variable names.
- **BinaryExpr, UnaryExpr, AssignExpr**: Handle binary operations, unary operations, and assignments, including compound assignment operators.
- **CallExpr, IndexExpr, SliceExpr, MemberExpr**: Manage function calls, array indexing, slicing, and member access.
- **ArrayLiteral, DictLiteral**: Represent arrays and dictionaries using their respective literal forms.
- **LambdaExpr**: Defines anonymous functions with parameters, return types, and bodies.
- **TernaryExpr**: Handles conditional expressions (`condition ? then : else`).
- **SuperExpr**: Represents calls to parent class constructors or methods.

### C++ Pointer Expression Types

- **AddressOfExpr, DerefExpr, ArrowExpr**: Manage pointer arithmetic and member access through pointers.

### Statement Types

- **VarDecl**: Declares variables, including support for constant declarations and type hints.
- **FunctionDecl**: Defines functions, including parameter types, return types, and default arguments.
- **ReturnStmt**: Represents return statements, optionally containing a return value.
- **IfStmt**: Manages conditional statements, supporting multiple `elif` branches.

## Tradeoffs

1. **Memory Overhead**: Using smart pointers adds some overhead compared to raw pointers, but it significantly reduces the risk of memory leaks and makes the code safer and more maintainable.

2. **Type Safety vs. Flexibility**: While `std::variant` enhances type safety, it can introduce complexity in handling large and diverse sets of AST nodes. However, the benefits in terms of error prevention and code clarity outweigh this potential drawback.

3. **Performance vs. Simplicity**: The use of forward declarations can improve compile time performance, but it might add cognitive load when reading and understanding the codebase. Balancing simplicity and performance is a continuous challenge in software development.

Overall, the `AST.h` file plays a pivotal role in the QuantumLanguage compiler's architecture, providing a solid foundation for representing and manipulating the syntactic structure of the source code. Its design decisions reflect a balance between safety, flexibility, and performance, making it a critical component of the compiler's ecosystem.