# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is a crucial component of the QuantumLanguage compiler, responsible for defining and managing the Abstract Syntax Tree (AST). The AST represents the syntactic structure of a program in a tree-like format, making it easier for the compiler to analyze, transform, and generate code. This file plays a pivotal role in the compiler pipeline, serving as the intermediate representation between the source code and the final executable.

### Key Design Decisions

1. **Use of Variants**: The AST nodes are defined using `std::variant`, allowing for a flexible and extensible representation of different expression and statement types without the need for multiple inheritance or polymorphism. This decision simplifies the implementation and reduces memory overhead compared to traditional approaches.

2. **Smart Pointers**: All AST node pointers are managed using `std::unique_ptr`. This ensures that each node is properly deallocated when it goes out of scope, preventing memory leaks and improving resource management.

3. **Forward Declarations**: To reduce compilation time and dependency issues, forward declarations are used where possible. This approach minimizes the inclusion of unnecessary headers and promotes better modularity.

4. **Type Hints and Reference Parameters**: For enhanced type safety and flexibility, many AST node structures include optional type hints and support for reference parameters. These features help in generating more efficient and correct code during the compilation process.

## Major Classes/Functions Overview

### Expression Types

- **NumberLiteral**: Represents a numeric literal with a double value.
- **StringLiteral**: Represents a string literal with a `std::string`.
- **BoolLiteral**: Represents a boolean literal (`true` or `false`).
- **NilLiteral**: Represents a null literal (`nil`).
- **Identifier**: Represents a variable or function identifier with a `std::string`.
- **BinaryExpr**: Represents a binary expression with an operator and two operands.
- **UnaryExpr**: Represents a unary expression with an operator and one operand.
- **AssignExpr**: Represents an assignment expression with an operator, target, and value.
- **CallExpr**: Represents a function call with a callee and arguments.
- **IndexExpr**: Represents an array or dictionary indexing expression.
- **SliceExpr**: Represents a slicing expression similar to Python's syntax, supporting optional start, stop, and step values.
- **MemberExpr**: Represents a member access expression through an object.
- **ArrayLiteral**: Represents an array literal with a list of elements.
- **DictLiteral**: Represents a dictionary literal with key-value pairs.
- **LambdaExpr**: Represents a lambda function with parameters, parameter types, default arguments, return type, and body.
- **TernaryExpr**: Represents a ternary conditional expression with a condition, true branch, and false branch.
- **SuperExpr**: Represents a super constructor or method call expression.

### C++ Pointer Expression Types

- **AddressOfExpr**: Represents an address-of operation (`&var`).
- **DerefExpr**: Represents a dereference operation (`*ptr`).
- **ArrowExpr**: Represents a member access through a pointer (`ptr->member`).

### Statement Types

- **VarDecl**: Represents a variable declaration with an optional initializer and type hint.
- **FunctionDecl**: Represents a function declaration with parameters, parameter types, default arguments, return type, and body.
- **ReturnStmt**: Represents a return statement with an optional value.
- **IfStmt**: Represents an if statement with a condition and a then branch. Additional branches can be added via an `elifChains` field.

## Tradeoffs

- **Flexibility vs. Complexity**: Using `std::variant` provides a high degree of flexibility but can introduce complexity in terms of handling and querying specific node types.
  
- **Memory Management**: Smart pointers ensure proper memory management, reducing the risk of memory leaks. However, they add some overhead compared to raw pointers.

- **Performance**: While `std::variant` offers convenience, it might impact performance slightly due to its runtime type information checks. Careful optimization techniques can mitigate these effects.

- **Readability vs. Conciseness**: The use of forward declarations and smart pointers improves readability and maintainability. However, it might sacrifice some conciseness in certain cases.

Overall, the `AST.h` file is designed to provide a robust and scalable foundation for the QuantumLanguage compiler, balancing flexibility, performance, and readability.