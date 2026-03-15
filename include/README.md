# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is an essential part of the QuantumLanguage compiler, focusing on the Abstract Syntax Tree (AST). This file defines the structure and behavior of nodes within the AST, which represent different elements of the QuantumLanguage syntax. The AST serves as the intermediate representation between the source code and the executable code, allowing for efficient parsing, semantic analysis, and code generation. By leveraging C++'s type system and features like `std::variant`, this file ensures that all possible node types can be encapsulated within a single unified structure, making it easier to manage and manipulate the tree during compilation.

## Key Design Decisions

### Use of `std::variant`

**WHY:** The use of `std::variant` allows for a flexible and type-safe way to represent different node types within the AST. Instead of using inheritance, which can lead to complex and hard-to-maintain hierarchies, `std::variant` provides a more straightforward approach by enabling a single variable to hold one of several alternative types. This decision simplifies the implementation and reduces runtime overhead associated with virtual functions.

### Separate Expression and Statement Types

**WHY:** Separating expression and statement types into distinct classes helps in maintaining clarity and separation of concerns within the AST. Expressions evaluate to a value, while statements perform actions without necessarily producing a result. By keeping these two categories distinct, the compiler can easily identify and process them separately, leading to more organized and maintainable code.

## Documentation of Major Classes/Functions

### ASTNode

**Purpose:** Base class for all AST nodes. Provides common functionality and interfaces for interacting with the nodes.

**Behavior:** All AST nodes inherit from `ASTNode`. They should implement methods for visiting the node during the traversal of the AST.

### NumberLiteral

**Purpose:** Represents a numeric literal in the source code.

**Behavior:** Holds a `double` value representing the number.

### StringLiteral

**Purpose:** Represents a string literal in the source code.

**Behavior:** Holds a `std::string` value representing the string.

### BoolLiteral

**Purpose:** Represents a boolean literal in the source code.

**Behavior:** Holds a `bool` value indicating whether the literal is `true` or `false`.

### NilLiteral

**Purpose:** Represents the `nil` literal in the source code.

**Behavior:** Does not store any value, serving as a placeholder for null or undefined values.

### Identifier

**Purpose:** Represents an identifier (variable name, function name, etc.) in the source code.

**Behavior:** Holds a `std::string` value representing the name of the identifier.

### BinaryExpr

**Purpose:** Represents a binary expression (e.g., `a + b`) in the source code.

**Behavior:** Holds an operation (`op`), a left operand (`left`), and a right operand (`right`). The operation is represented as a `std::string`.

### UnaryExpr

**Purpose:** Represents a unary expression (e.g., `-a`) in the source code.

**Behavior:** Holds an operation (`op`) and an operand (`operand`). The operation is represented as a `std::string`.

### AssignExpr

**Purpose:** Represents an assignment expression (e.g., `x = y`) in the source code.

**Behavior:** Holds an operation (`op`), a target (`target`), and a value (`value`). The operation indicates the type of assignment (e.g., `=`).

### CallExpr

**Purpose:** Represents a function call in the source code.

**Behavior:** Holds a callee (`callee`) and a list of arguments (`args`). The callee is an `ASTNodePtr`, and the arguments are stored in a `std::vector<ASTNodePtr>`.

### IndexExpr

**Purpose:** Represents an indexed expression (e.g., `arr[0]`) in the source code.

**Behavior:** Holds an object (`object`) and an index (`index`). Both the object and the index are `ASTNodePtr`s.

### SliceExpr

**Purpose:** Represents a slicing expression (e.g., `obj[start:stop:step]`) in the source code.

**Behavior:** Holds an object (`object`), a start index (`start`), a stop index (`stop`), and a step index (`step`). Each of these components is an `ASTNodePtr`. If any part is omitted, it defaults to `nullptr` or a specific value (e.g., `0` for start).

### MemberExpr

**Purpose:** Represents a member access expression (e.g., `obj.member`) in the source code.

**Behavior:** Holds an object (`object`) and a member name (`member`). Both the object and the member name are `ASTNodePtr`s and `std::string`, respectively.

### ArrayLiteral

**Purpose:** Represents an array literal in the source code.

**Behavior:** Holds a vector of elements (`elements`). Each element is an `ASTNodePtr`.

### DictLiteral

**Purpose:** Represents a dictionary literal in the source code.

**Behavior:** Holds a vector of key-value pairs (`pairs`). Each pair consists of an `ASTNodePtr` for the key and another `ASTNodePtr` for the value.

### LambdaExpr

**Purpose:** Represents a lambda expression in the source code.

**Behavior:** Holds parameters (`params`), parameter types (`paramTypes`), default arguments (`defaultArgs`), return type (`returnType`), and a body (`body`). Parameters and parameter types are vectors of strings, default arguments are vectors of `ASTNodePtr`s, and the return type is a string.

### TernaryExpr

**Purpose:** Represents a ternary conditional expression (e.g., `condition ? then : else`) in the source code.

**Behavior:** Holds a condition (`condition`), a