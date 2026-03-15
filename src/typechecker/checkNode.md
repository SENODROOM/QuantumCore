# `checkNode` Function

## Purpose
The `checkNode` function is a core component of the Quantum Language compiler's Type Checker module. Its primary role is to determine and validate the data types of expressions and declarations within the source code being compiled. This ensures that operations are performed on compatible data types, preventing runtime errors due to type mismatches.

## Parameters
- **node**: A pointer to the current AST (Abstract Syntax Tree) node being processed. This can represent various elements such as literals, identifiers, variable declarations, function declarations, blocks of statements, or binary expressions.
- **env**: A shared pointer to the current type environment (`TypeEnv`). This environment holds information about the types of variables and functions in scope, allowing for recursive type checking within nested structures.

## Return Value
- The function returns a string representing the inferred or explicitly specified type of the given AST node. For example:
  - `"float"` for number literals.
  - `"string"` for string literals.
  - `"bool"` for boolean literals.
  - `"any"` for untyped or implicitly typed nodes where the type cannot be determined statically.
  - `"fn"` for function declarations, indicating they are treated as first-class citizens without specifying their return type directly.

## How It Works
1. **Null Check**: If the input `node` is `nullptr`, the function immediately returns `"void"`. This handles cases where there might be missing or null nodes in the AST.

2. **Literal Types**:
   - If the node is a `NumberLiteral`, it returns `"float"`.
   - If the node is a `StringLiteral`, it returns `"string"`.
   - If the node is a `BoolLiteral`, it returns `"bool"`.

3. **Identifiers**:
   - If the node is an `Identifier`, the function resolves its name using the provided type environment (`env`). This allows for looking up previously defined variables and their types.

4. **Variable Declarations**:
   - If the node is a `VarDecl` (variable declaration), the function checks both the initializer and the type hint associated with the variable.
   - It first determines the initialization type by recursively calling `checkNode` on the initializer.
   - Then, it uses the type hint if provided, otherwise defaults to the initialization type.
   - If there is a type hint and it doesn't match the initialization type, the function emits a static type warning indicating the mismatch.
   - Finally, the function defines the variable in the current environment with its resolved type.

5. **Function Declarations**:
   - If the node is a `FunctionDecl`, the function sets up a new sub-environment (`subEnv`) to handle local variable types.
   - It iterates through the parameters, assigning each parameter a type based on either the type hint or defaulting to `"any"`.
   - The function then proceeds to check the body of the function within this sub-environment.
   - After processing the body, it defines the function itself in the parent environment, treating it as a first-class citizen with a simplified type of `"fn"`.

6. **Block Statements**:
   - If the node is a `BlockStmt` (block of statements), the function creates a new sub-environment (`subEnv`) to isolate the scope of the block.
   - It iterates through each statement within the block, performing type checking on them.
   - The function returns `"void"` after processing all statements in the block.

## Edge Cases
- **Untyped Nodes**: When encountering nodes without explicit type hints, the function assumes a type of `"any"`. This allows for flexibility in the code but requires careful handling during subsequent type inference passes.
- **Recursive Definitions**: The use of sub-environments ensures that variable and function definitions within blocks or functions do not interfere with outer scopes, maintaining proper scoping rules.
- **Type Mismatch Warnings**: The function provides warnings for potential type mismatches between variable initializers and type hints, helping developers catch errors early in the compilation process.

## Interactions With Other Components
- **AST Parser**: The `checkNode` function relies on the output of the AST parser to receive nodes for type checking.
- **Type Environment**: It interacts with the `TypeEnv` class to manage and resolve types, ensuring consistency across different parts of the program.
- **Error Handling**: The function outputs static type warnings using standard error streams, which are handled by the compiler's error reporting mechanism.

This comprehensive approach to type checking forms the backbone of the Quantum Language compiler, ensuring that the generated code adheres to strict type safety rules while providing flexibility through implicit typing.