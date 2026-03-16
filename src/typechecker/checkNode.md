# `checkNode` Function

## Purpose
The `checkNode` function is a crucial part of the Quantum Language compiler's Type Checker module. It serves as the central method for determining and validating the data types of expressions and declarations in the source code being compiled. By ensuring that operations are performed on compatible data types, it helps prevent runtime errors and enhances the overall reliability of the compiled program.

## Parameters
- `node`: A pointer to the current AST (Abstract Syntax Tree) node being processed. This can be any type of node such as a literal, variable declaration, function declaration, or block statement.
- `env`: A shared pointer to the current type environment (`TypeEnv`). This environment keeps track of variable names and their associated types throughout the compilation process.

## Return Value
- The function returns a string representing the inferred or explicitly specified type of the given AST node. For example, it might return `"float"`, `"string"`, `"bool"`, `"fn"`, etc.

## How It Works
1. **Null Check**: If the provided `node` is `nullptr`, the function immediately returns `"void"` indicating an empty or undefined state.

2. **Literal Types**:
   - If the node is a `NumberLiteral`, it returns `"float"` because numbers in Quantum Language are typically treated as floating-point values.
   - If the node is a `StringLiteral`, it returns `"string"` since strings represent textual data.
   - If the node is a `BoolLiteral`, it returns `"bool"` to indicate boolean values.

3. **Identifiers**:
   - When encountering an `Identifier`, the function uses the `env` parameter to resolve the identifier's type. It looks up the identifier in the current type environment and returns its type.

4. **Variable Declarations**:
   - For a `VarDecl` (variable declaration), the function first checks if there is an initializer. If so, it recursively calls `checkNode` on the initializer to determine its type (`initType`).
   - It then considers any type hint provided in the declaration. If a type hint exists and differs from the inferred type, it issues a static type warning using `std::cerr`. This helps catch potential type mismatches early in the development process.
   - Regardless of whether a type hint was provided, the function defines the variable in the current environment (`env`) with the appropriate type (`declaredType`).

5. **Function Declarations**:
   - When processing a `FunctionDecl`, the function creates a new sub-environment (`subEnv`) to manage the types of function parameters.
   - It iterates over each parameter and assigns a type based on either the explicit type provided in `paramTypes` or `"any"` if no type is specified.
   - After defining all parameters, the function recursively checks the body of the function using the sub-environment.
   - Finally, it defines the function itself in the main environment with a simplified type of `"fn"`.

6. **Block Statements**:
   - For a `BlockStmt` (block statement), the function creates a new sub-environment (`subEnv`) to encapsulate the scope of the block.
   - It iterates through each statement within the block and recursively checks them using the sub-environment.
   - The function returns `"void"` after checking all statements in the block.

## Edge Cases
- **Empty Initializers**: If a variable declaration has no initializer, the function infers its type as `"any"`.
- **Missing Type Hints**: If a variable or function declaration lacks a type hint, the function defaults to `"any"` unless the initializer provides a concrete type.
- **Recursive Calls**: The function makes recursive calls to itself when dealing with nested structures like blocks within functions or initializers within variables.

## Interactions with Other Components
- **Type Environment**: The `checkNode` function interacts closely with the `TypeEnv` class, which manages the mapping between variable names and their types. This allows the function to resolve identifiers and define new variables or functions with correct types.
- **Error Reporting**: For type mismatches detected during the type checking process, the function uses `std::cerr` to report these warnings. These warnings help developers identify potential issues before running the compiled code.
- **AST Traversal**: As part of the broader compilation process, the `checkNode` function is invoked for every node in the AST. This ensures comprehensive type checking across the entire source code.

By performing thorough type validation and resolution, the `checkNode` function plays a vital role in maintaining the integrity and correctness of the Quantum Language programs being compiled.