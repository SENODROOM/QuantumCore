# `has` Function

## Overview

The `has` function is a member method of the `Value` class in the Quantum Language compiler's source file `src/Value.cpp`. This function checks whether a variable named `name` exists within the current scope or any of its parent scopes.

## What It Does

The primary purpose of the `has` function is to determine if a variable with a given name is accessible in the current context. If the variable is found in the current scope (`vars`), the function returns `true`. If not, it recursively checks the parent scope (`parent`). If the variable is still not found after checking all parent scopes, the function returns `false`.

## Parameters and Return Value

- **Parameters**:
  - `name`: A string representing the name of the variable to be checked.

- **Return Value**:
  - Returns `true` if the variable exists in the current scope or any of its parent scopes.
  - Returns `false` if the variable does not exist in any scope.

## Why It Works This Way

This design allows for a hierarchical lookup mechanism, which is essential in many programming languages where variables can have different scopes (e.g., local, global). By first checking the current scope and then delegating the search to parent scopes, the `has` function ensures that variables defined in outer scopes are accessible to inner scopes unless they are shadowed by variables with the same name in the inner scope.

## Edge Cases

1. **Empty Scope**: If the current scope (`vars`) is empty, the function will only check parent scopes.
2. **Variable Not Found**: If the variable is not found in any scope, including the current one and all parent scopes, the function will correctly return `false`.
3. **Shadowing**: If a variable with the same name exists in both the current scope and a parent scope, the function will return `true` for the variable in the current scope.

## Interactions With Other Components

- **Scope Management**: The `has` function interacts with the `ScopeManager`, which maintains the hierarchy of scopes. Each `Value` object represents a scope, and the `parent` pointer points to the enclosing scope.
  
- **Variable Storage**: The `vars` map stores the names and values of variables defined in the current scope. When a new scope is entered, a new `Value` object is created, inheriting the `parent` pointer from the previous scope.

- **Recursive Lookup**: The recursive nature of the `has` function allows for efficient searching through nested scopes without requiring explicit iteration over each scope level.

Here is an example of how you might use the `has` function:

```cpp
#include "Value.h"

int main() {
    // Create a root scope
    Value* root = new Value(nullptr);

    // Add a variable to the root scope
    root->add("x", 42);

    // Create a child scope
    Value* child = new Value(root);

    // Check if 'x' exists in the child scope
    bool xExistsInChild = child->has("x");
    std::cout << "Does 'x' exist in child scope? " << (xExistsInChild ? "Yes" : "No") << std::endl;

    // Check if 'y' exists in the child scope
    bool yExistsInChild = child->has("y");
    std::cout << "Does 'y' exist in child scope? " << (yExistsInChild ? "Yes" : "No") << std::endl;

    // Clean up memory
    delete child;
    delete root;

    return 0;
}
```

In this example, the `child` scope inherits the `root` scope. Since "x" is added to the `root` scope, calling `has("x")` on the `child` scope will return `true`. Calling `has("y")` will return `false` because "y" is not defined in either scope.