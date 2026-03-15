# `evalNewExpr`

## Function Overview

The `evalNewExpr` function is responsible for evaluating expressions that involve dynamic memory allocation in the Quantum Language compiler's interpreter. It handles two primary scenarios:

1. Allocating arrays of a specified size.
2. Allocating single instances of a class or primitive type with given arguments.

This function ensures proper initialization and management of dynamically allocated memory within the quantum programming environment.

## Parameters

- **`e`**: A reference to an `Expression` object representing the new expression to be evaluated. This object contains information about the type being instantiated (`typeName`) and any arguments passed to the constructor (`args`). Additionally, it includes details on whether the expression is an array allocation (`isArray`) and the size expression (`sizeExpr`).

## Return Value

The function returns a `QuantumValue` object containing either a pointer to the newly allocated array or an instance of the class/primitive type. If the expression involves an array allocation, the returned value is a `QuantumPointer` pointing to an `Array` object. For class or primitive allocations, it returns a `QuantumValue` directly.

## Edge Cases

- **Negative Array Size**: If the size expression evaluates to a negative number, the function sets the allocation size to 0. However, to prevent immediate errors, it ensures that at least one element is allocated.
  
- **Empty Arguments for Primitives**: When creating instances of primitive types without any arguments, the function initializes them with default values:
  - `int`, `long`, `short`, `unsigned`: Default to 0.
  - `float`, `double`: Default to 0.0.
  - `char`: Default to an empty string.
  - `bool`: Default to false.

- **Class Type Allocation**: The function currently supports only primitive types. For class types, further implementation is required to handle constructors and member initializations.

## Interactions with Other Components

- **Memory Management**: `evalNewExpr` interacts with the memory management system of the Quantum Language compiler to allocate and initialize memory for new objects.
  
- **Evaluation Engine**: It utilizes the evaluation engine to compute the values of arguments passed to the constructor.

- **Type System**: The function checks against a predefined set of primitive types to determine how to handle the instantiation. This interaction with the type system ensures that only valid types can be instantiated.

- **Error Handling**: The function includes basic error handling for invalid array sizes and missing arguments for primitives, ensuring robustness in the interpreter.

## Code Explanation

### Array Allocation

If the expression is marked as an array allocation (`e.isArray`):

1. **Size Calculation**:
   - The function first attempts to evaluate the size expression (`e.sizeExpr`).
   - If successful, it converts the result to an integer. If not, it defaults to 0.
   - Negative sizes are clamped to 0 to avoid errors.

2. **Allocation**:
   - The function calculates the actual allocation size (`allocN`) to ensure at least one element is allocated.
   - An `Array` object is created using `std::make_shared`.
   - The array is resized to `allocN` elements, all initialized to `0.0`.

3. **Pointer Creation**:
   - A `QuantumPointer` object is created to hold the array.
   - The `QuantumPointer`'s `cell` member points to the shared `QuantumValue` containing the array.
   - The `varName` member is set to indicate the type of the array.

4. **Return Value**:
   - The function returns a `QuantumValue` containing the `QuantumPointer`.

### Single Instance Allocation

For non-array allocations:

1. **Argument Evaluation**:
   - The function iterates over each argument in `e.args`, evaluates it using the `evaluate` function, and stores the results in a vector called `args`.

2. **Primitive Type Handling**:
   - If the type name corresponds to a primitive type (checked using the `primitives` set), the function processes the arguments accordingly:
     - For numeric types (`int`, `long`, `short`, `unsigned`), it casts the input to a double.
     - For `char`, it converts the input to a string of length 1.
     - For `bool`, it determines truthiness based on the input value.
   - If no arguments are provided, it initializes the value with the default for the respective type.

3. **Class Type Handling**:
   - Currently, the function does not support class types. Further development is needed to implement constructors and member initializations.

4. **Return Value**:
   - The function returns a `QuantumValue` containing the instantiated primitive or class object.

## Conclusion

The `evalNewExpr` function is crucial for managing dynamic memory allocation in the Quantum Language compiler. By correctly interpreting array and class instantiations, it ensures that resources are allocated and initialized appropriately, contributing to the stability and functionality of the quantum programming environment.