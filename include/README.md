# QuantumLanguage Compiler - AST.h

## Overview

The `include/AST.h` header file is an essential component of the QuantumLanguage compiler, responsible for defining the Abstract Syntax Tree (AST) structure. The AST serves as a hierarchical representation of the syntactic structure of a program written in QuantumLanguage. This file includes various structures and types that represent different components of the language syntax, such as expressions, statements, and literals. By providing a structured and flexible way to represent the program's syntax, `AST.h` facilitates semantic analysis, code generation, and other stages of the compilation process.

## Key Design Decisions

### Use of `std::variant` for Expressions

One of the primary design decisions in `AST.h` is the use of `std::variant` to represent different types of expressions. This choice allows for a single unified type (`Expression`) to hold various expression variants without requiring multiple inheritance or additional type-checking mechanisms. By using `std::variant`, we can efficiently manage and dispatch operations on expressions based on their actual type.

**Why:** Using `std::variant` simplifies the implementation of the visitor pattern, which is crucial for traversing and processing the AST during various phases of compilation. It also reduces the overhead associated with multiple inheritance and provides a more straightforward and intuitive way to handle different expression types.

### Separate Structures for Statements and Literals

Another significant decision is the separation of structures for statements and literals. This distinction ensures that each category has its own dedicated set of fields and behaviors, making the codebase easier to understand and maintain. For example, statements like variable declarations and function definitions have specific attributes related to their scope, initialization, and return types, while literals (like numbers and strings) contain only their values.

**Why:** Separating statements and literals into distinct structures helps in clearly distinguishing between the syntactic roles they play in the program. It also makes it easier to implement specialized handling for each category, ensuring that the AST accurately reflects the program's structure and semantics.

## Documentation of Major Classes/Functions

### `NumberLiteral`

Represents a numeric literal in the program. Contains a `double` value.

- **Purpose:** To store numeric constants encountered in the source code.
- **Behavior:** Provides easy access to the numeric value and supports arithmetic operations during semantic analysis.

### `StringLiteral`

Represents a string literal in the program. Contains a `std::string` value.

- **Purpose:** To store string constants encountered in the source code.
- **Behavior:** Allows for string manipulation and concatenation during semantic analysis.

### `Identifier`

Represents an identifier (variable, function, etc.) in the program. Contains a `std::string` name.

- **Purpose:** To identify variables, functions, and other named entities in the source code.
- **Behavior:** Used to resolve references to these entities during symbol table construction and semantic analysis.

### `BinaryExpr`

Represents a binary expression (e.g., addition, multiplication) in the program. Contains an operation string and two operands.

- **Purpose:** To model binary operations in the AST.
- **Behavior:** Supports evaluation of the expression during code generation and runtime interpretation.

### `UnaryExpr`

Represents a unary expression (e.g., negation, increment) in the program. Contains an operation string and one operand.

- **Purpose:** To model unary operations in the AST.
- **Behavior:** Enables the evaluation of the expression during code generation and runtime interpretation.

### `AssignExpr`

Represents an assignment expression in the program. Contains an operation string, a target variable, and a value.

- **Purpose:** To model variable assignments in the AST.
- **Behavior:** Handles both simple and compound assignments, updating the target variable's value accordingly.

### `CallExpr`

Represents a function call expression in the program. Contains a callee and a list of arguments.

- **Purpose:** To model function calls in the AST.
- **Behavior:** Supports passing arguments by value or reference and invokes the appropriate function during code generation.

### `IndexExpr`

Represents an indexing expression (e.g., array access, dictionary lookup) in the program. Contains an object and an index.

- **Purpose:** To model indexing operations in the AST.
- **Behavior:** Enables access to elements within arrays or dictionaries during code execution.

### `SliceExpr`

Represents a slicing expression in the program. Contains an object and optional start, stop, and step indices.

- **Purpose:** To model slicing operations in the AST.
- **Behavior:** Supports extracting subarrays or substrings from the object during code execution.

### `MemberExpr`

Represents a member access expression (e.g., struct field access) in the program. Contains an object and a member name.

- **Purpose:** To model member access operations in the AST.
- **Behavior:** Enables accessing fields or methods of objects during code execution.

### `ArrayLiteral`

Represents an array literal in the program. Contains a vector of element expressions.

- **Purpose:** To model array literals in the AST.
- **Behavior:** Facilitates the creation and initialization of arrays during code generation.

### `DictLiteral`

Represents a dictionary literal in the program. Contains a vector of key-value pairs.

- **Purpose:** To model dictionary literals in the AST.
- **Behavior:** Enables the creation and initialization of dictionaries during code generation.

### `LambdaExpr`

Represents a lambda expression in the program. Contains parameters, parameter types, default arguments, a return type, and a body.

- **Purpose:** To model anonymous functions in the AST.
- **Behavior:** Supports capturing local variables and generating executable code for the lambda function.

### `TernaryExpr`

Represents a ternary conditional expression in the program. Contains a condition, a 'then' expression, and an 'else' expression.

- **Purpose:** To model conditional logic in the AST