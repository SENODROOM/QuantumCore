# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is a crucial component of the QuantumLanguage compiler's architecture. It encapsulates the definition of various abstract syntax tree (AST) node types essential for representing the structure of the language's source code. These nodes include literals, expressions, statements, and more complex constructs like function declarations and lambda expressions. This file plays a vital role in the compiler pipeline by serving as the foundation for parsing, semantic analysis, and code generation phases.

## Key Design Decisions

### Use of `std::variant`
- **Why**: The `std::variant` type was chosen to represent different kinds of AST nodes in a single unified type. This approach simplifies the handling of multiple node types without requiring explicit casting or branching logic.
  
### Smart Pointers (`std::unique_ptr`)
- **Why**: By using smart pointers, the file ensures automatic memory management and avoids manual deletion of dynamically allocated AST nodes. This reduces the risk of memory leaks and makes the code cleaner and safer.

### Forward Declarations
- **Why**: Forward declarations are used extensively to break circular dependencies between header files. This allows for a modular design where each header can focus on its specific functionality without being burdened by the details of other components.

## Documentation of Major Classes/Functions

### ASTNode
- **Purpose**: Base class for all AST nodes. Provides a common interface for traversing and manipulating the AST.
- **Behaviour**: All concrete AST node types inherit from `ASTNode`. Each subclass implements methods to handle specific node operations.

### NumberLiteral
- **Purpose**: Represents numeric literals in the source code.
- **Behaviour**: Holds a `double` value which corresponds to the literal number.

### StringLiteral
- **Purpose**: Represents string literals in the source code.
- **Behaviour**: Holds a `std::string` value which corresponds to the literal string.

### BoolLiteral
- **Purpose**: Represents boolean literals in the source code.
- **Behaviour**: Holds a `bool` value which corresponds to the literal boolean.

### NilLiteral
- **Purpose**: Represents the `nil` literal in the source code.
- **Behaviour**: No additional members since it represents an empty or null value.

### Identifier
- **Purpose**: Represents variable identifiers in the source code.
- **Behaviour**: Holds a `std::string` name which identifies the variable.

### BinaryExpr
- **Purpose**: Represents binary arithmetic or logical expressions.
- **Behaviour**: Contains an operation string (`op`) and two operands (`left`, `right`). Used for expressions like `a + b` or `x && y`.

### UnaryExpr
- **Purpose**: Represents unary arithmetic or logical expressions.
- **Behaviour**: Contains an operation string (`op`) and one operand (`operand`). Used for expressions like `-a` or `!x`.

### AssignExpr
- **Purpose**: Represents assignment expressions.
- **Behaviour**: Contains an operation string (`op`) indicating the type of assignment (e.g., `=`, `+=`, etc.), a target variable, and a value expression. Used for expressions like `a = b` or `c += d`.

### CallExpr
- **Purpose**: Represents function calls.
- **Behaviour**: Contains a callee expression and a vector of argument expressions. Used for calling functions like `f(x, y)`.

### IndexExpr
- **Purpose**: Represents indexing into collections.
- **Behaviour**: Contains an object expression and an index expression. Used for accessing elements like `array[index]`.

### SliceExpr
- **Purpose**: Represents slicing operations on sequences.
- **Behaviour**: Contains an object expression and optional start, stop, and step expressions. Used for slicing like `array[start:stop:step]`.

### MemberExpr
- **Purpose**: Represents member access on objects.
- **Behaviour**: Contains an object expression and a member name. Used for accessing properties like `object.member`.

### ArrayLiteral
- **Purpose**: Represents array literals.
- **Behaviour**: Contains a vector of element expressions. Used for creating arrays like `[1, 2, 3]`.

### DictLiteral
- **Purpose**: Represents dictionary literals.
- **Behaviour**: Contains a vector of key-value pairs, where both keys and values are expressions. Used for creating dictionaries like `{key1: value1, key2: value2}`.

### LambdaExpr
- **Purpose**: Represents anonymous function literals (lambda expressions).
- **Behaviour**: Contains a list of parameter names, their types, default arguments, return type, and a body expression. Used for defining functions inline like `(x, y) -> x + y`.

### TernaryExpr
- **Purpose**: Represents conditional expressions (ternaries).
- **Behaviour**: Contains a condition expression, a then expression, and an else expression. Used for expressions like `condition ? then_expr : else_expr`.

### SuperExpr
- **Purpose**: Represents super constructor or method calls.
- **Behaviour**: Contains an optional method name. If empty, it represents a super constructor call. Used for calling parent constructors or methods like `super()` or `super.method()`.

## Tradeoffs/Limitations

- **Flexibility vs. Complexity**: Using `std::variant` simplifies the AST representation but adds complexity when dealing with new node types.
- **Memory Management**: While smart pointers provide automatic memory management, they can introduce overhead compared to raw pointers.
- **Circular Dependencies**: Forward declarations help manage circular dependencies but can make the code harder to understand if not properly documented.

This file is a fundamental building block for the QuantumLanguage compiler, providing a robust framework for representing and manipulating the language's syntax.