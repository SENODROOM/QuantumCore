# `resolveLocal` Function

## Overview

The `resolveLocal` function is a method within the Quantum Language compiler's source code located in `src/Compiler.cpp`. This function is responsible for resolving the local variable or identifier within the current scope of execution. It searches through the list of local variables stored in the compiler's state and returns the index of the matching variable if found. If no match is found, it returns `-1`.

## Parameters/Return Value

- **Parameters**:
  - `name`: A string representing the name of the local variable to be resolved.

- **Return Value**:
  - An integer indicating the index of the local variable if found, otherwise `-1`.

## How It Works

The `resolveLocal` function operates by iterating over the list of local variables in reverse order. This approach ensures that the most recently declared variable takes precedence over any previously declared variables with the same name. The function checks each local variable's name against the provided `name` parameter using the equality operator (`==`). If a match is found, the function immediately returns the index of that variable. If the loop completes without finding a match, the function returns `-1`, indicating that the local variable was not found in the current scope.

### Why Reverse Order?

Reversing the order of iteration allows the function to handle nested scopes correctly. In languages like C++, when a variable is declared inside a block (e.g., a function or loop), it shadows any variables with the same name declared in outer blocks. By starting from the end of the list and moving backward, the function ensures that it finds the nearest declaration first, which aligns with the language's scoping rules.

## Edge Cases

- **Empty List**: If the `locals` vector in the compiler's state is empty, the function will return `-1` as there are no local variables to search through.
  
- **Non-Existent Variable**: If the `name` parameter does not match any variable in the `locals` vector, the function will return `-1`.
  
- **Case Sensitivity**: Since the comparison uses the equality operator (`==`), the function is case-sensitive. For example, searching for `"x"` will not find a variable named `"X"`.
  
- **Multiple Declarations**: If multiple variables with the same name exist in different scopes, only the nearest one (the last one encountered during reversed iteration) will be returned.

## Interactions With Other Components

- **State Management**: The function relies on the `state` object, which holds various pieces of information about the current compilation context, including the list of local variables (`locals`).

- **Scope Resolution**: When invoked, the function typically represents an attempt to resolve a variable reference in the current scope. This interaction may occur during parsing or semantic analysis phases of the compilation process.

- **Error Handling**: If the function returns `-1` indicating a non-existent variable, the calling component can use this information to generate appropriate error messages or handle the situation gracefully.

In summary, the `resolveLocal` function is a crucial utility for managing local variable resolution in the Quantum Language compiler. Its design leverages reverse iteration to ensure correct handling of nested scopes and provides robust support for various edge cases related to variable existence and naming conventions.