# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is an essential component of the QuantumLanguage compiler, responsible for defining the Abstract Syntax Tree (AST) structure. The AST represents the syntactic structure of a program written in QuantumLanguage, allowing the compiler to parse and understand the code at a high level before generating machine code. Each node in the AST corresponds to a construct in the source code, such as variables, expressions, statements, and function definitions.

This file plays a crucial role in the compiler pipeline by providing a structured representation of the input code. It enables subsequent stages of the compilation process, including semantic analysis, optimization, and code generation, to operate on a consistent and predictable format.

## Key Design Decisions

### Use of `std::variant` for Expressions

One of the primary design decisions in `AST.h` is the use of `std::variant` to represent different types of expressions within the AST. This choice allows for a flexible and extensible way to define various expression types without resorting to multiple inheritance or complex visitor patterns. By using `std::variant`, we can easily add new expression types in the future without breaking existing code.

**Why:** `std::variant` provides a safe and efficient way to store one of several possible types in a single variable, making it ideal for representing the diverse range of expressions found in a programming language.

### Forward Declarations and Unique Pointers

Another significant decision is the use of forward declarations and `std::unique_ptr` for managing memory in the AST nodes. Forward declarations reduce compile-time dependencies and improve performance by deferring the actual definition of `ASTNode` until it's needed. Using `std::unique_ptr` ensures that all AST nodes are properly managed and automatically deallocated when they go out of scope, preventing memory leaks and dangling pointers.

**Why:** These practices help maintain a clean and modular codebase, improving both build times and overall reliability.

## Documentation of Major Classes/Functions

### ASTNode

**Purpose:** Base class for all AST nodes. Provides a common interface for accessing and manipulating nodes.

**Behaviour:** All AST nodes inherit from `ASTNode`. Concrete node types override virtual methods to implement specific functionality.

### NumberLiteral

**Purpose:** Represents numeric literals in the source code.

**Behaviour:** Stores the numerical value of the literal.

### StringLiteral

**Purpose:** Represents string literals in the source code.

**Behaviour:** Stores the string value of the literal.

### BoolLiteral

**Purpose:** Represents boolean literals in the source code.

**Behaviour:** Stores the boolean value (`true` or `false`) of the literal.

### NilLiteral

**Purpose:** Represents the `nil` literal in the source code.

**Behaviour:** No additional information is stored since `nil` typically indicates the absence of a value.

### Identifier

**Purpose:** Represents identifiers (variable names, function names, etc.) in the source code.

**Behaviour:** Stores the name of the identifier.

### BinaryExpr

**Purpose:** Represents binary arithmetic or logical operations.

**Behaviour:** Contains the operation symbol (`op`), and pointers to the left and right operands (`left` and `right`). This allows for easy evaluation of expressions involving two sub-expressions.

### UnaryExpr

**Purpose:** Represents unary arithmetic or logical operations.

**Behaviour:** Contains the operation symbol (`op`) and a pointer to the operand (`operand`). This facilitates handling expressions with a single sub-expression.

### AssignExpr

**Purpose:** Represents assignment operations.

**Behaviour:** Contains the assignment operator (`op`, e.g., `=`, `+=`, `-=`), a pointer to the target variable (`target`), and a pointer to the value being assigned (`value`). This structure supports compound assignments.

### CallExpr

**Purpose:** Represents function calls.

**Behaviour:** Contains a pointer to the callee (the function being called) and a vector of pointers to arguments. This allows for flexibility in handling varying numbers of arguments.

### IndexExpr

**Purpose:** Represents indexing operations (e.g., array access).

**Behaviour:** Contains a pointer to the object being indexed and a pointer to the index itself. This structure supports dynamic indexing.

### SliceExpr

**Purpose:** Represents slicing operations (e.g., Python's list slicing syntax).

**Behaviour:** Contains a pointer to the object being sliced, optional pointers to the start, stop, and step indices. Default values are provided for omitted parts (start defaults to 0, stop to the end of the object, and step to 1). This structure handles complex slicing scenarios gracefully.

### MemberExpr

**Purpose:** Represents member access operations (e.g., struct fields).

**Behaviour:** Contains a pointer to the object and the name of the member field. This structure supports accessing properties of objects.

### ArrayLiteral

**Purpose:** Represents array literals.

**Behaviour:** Contains a vector of pointers to the elements of the array. This structure allows for dynamically sized arrays.

### DictLiteral

**Purpose:** Represents dictionary literals.

**Behaviour:** Contains a vector of key-value pairs, where each pair consists of pointers to the key and value. This structure supports associative arrays.

### LambdaExpr

**Purpose:** Represents lambda functions.

**Behaviour:** Contains a vector of parameter names (`params`), a vector of parameter types (`paramTypes`), a vector of default argument values (`defaultArgs`), the return type (`returnType`), and a pointer to the function body (`body`). This structure encapsulates the entire lambda function definition.

### TernaryExpr

**Purpose:** Represents ternary conditional expressions.

**Behaviour:** Contains a pointer to the condition, a pointer to the expression executed if the condition is true (`thenExpr`), and a pointer to the expression executed if the condition is false (`elseExpr`). This structure supports concise conditional logic.

### SuperExpr

**Purpose:** Represents calls to the superclass constructor or