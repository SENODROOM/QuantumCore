# `evalArrow`

The `evalArrow` function is designed to handle the arrow (`->`) operator in the Quantum Language interpreter. This operator is used to access members of an object or dictionary through a pointer. The function evaluates the expression and returns the value of the specified member.

## What It Does

The `evalArrow` function performs the following steps:
1. Evaluates the object expression using the `evaluate` function.
2. Checks if the evaluated result is a pointer. If not, throws a `RuntimeError`.
3. Dereferences the pointer and accesses the specified member.
4. Returns the value of the member if found; otherwise, returns an empty `QuantumValue`.

## Why It Works This Way

This implementation ensures that the arrow operator can only be used on pointers, which aligns with the typical behavior of the arrow operator in languages like C++. By throwing a `RuntimeError` when the object is not a pointer, the function prevents invalid memory access and maintains the integrity of the program.

## Parameters/Return Value

- **Parameters**:
  - `e`: An expression containing the object and member names to be accessed.
  
- **Return Value**:
  - A `QuantumValue` representing the value of the specified member. If the member is not found, returns an empty `QuantumValue`.

## Edge Cases

1. **Non-pointer Object**: If the object expression evaluates to a non-pointer value, the function will throw a `RuntimeError`.
2. **Null Pointer**: If the pointer is null, the function will throw a `RuntimeError`.
3. **Member Not Found**: If the specified member does not exist in the object or dictionary, the function will return an empty `QuantumValue`.

## Interactions With Other Components

- **Evaluator**: The `evalArrow` function uses the `evaluate` function to resolve the object expression into its corresponding `QuantumValue`.
- **Type Checking**: Before accessing the member, the function checks the type of the `QuantumValue`. If it's not a pointer or a dictionary, it throws a `RuntimeError`.
- **Instance Access**: If the pointer points to an instance, the function attempts to retrieve the field using the `getField` method of the `Instance` class. If the field is not found, it catches any exceptions and throws a `TypeError`.
- **Dictionary Access**: If the pointer points to a dictionary, the function searches for the key in the dictionary. If the key exists, it returns the corresponding value; otherwise, it returns an empty `QuantumValue`.

Here's a breakdown of how these interactions contribute to the overall functionality:

### Evaluator

The `evaluate` function resolves the object expression into its corresponding `QuantumValue`. For example, if the object expression is `"myObject"`, the `evaluate` function would look up the variable named `myObject` and return its `QuantumValue`.

### Type Checking

Before accessing the member, the `evalArrow` function checks the type of the `QuantumValue`. If it's not a pointer or a dictionary, it throws a `RuntimeError`. This ensures that the arrow operator is used correctly and prevents invalid memory access.

### Instance Access

If the pointer points to an instance, the function attempts to retrieve the field using the `getField` method of the `Instance` class. If the field is not found, it catches any exceptions and throws a `TypeError`. This allows instances to have fields that can be accessed dynamically.

### Dictionary Access

If the pointer points to a dictionary, the function searches for the key in the dictionary. If the key exists, it returns the corresponding value; otherwise, it returns an empty `QuantumValue`. This provides a flexible way to access values in dictionaries without knowing their keys at compile time.

Overall, the `evalArrow` function plays a crucial role in handling the arrow operator in the Quantum Language interpreter. It ensures that the operator is used correctly, prevents invalid memory access, and allows dynamic access to fields and values in instances and dictionaries.