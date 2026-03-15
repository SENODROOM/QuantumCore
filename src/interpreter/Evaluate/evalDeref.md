# evalDeref

The `evalDeref` function is part of the Quantum Language compiler's interpreter and is responsible for evaluating the dereference operation on a pointer. Dereferencing in quantum computing typically involves accessing or modifying the value stored at a memory location pointed to by a quantum register or qubit.

## What It Does

The `evalDeref` function takes a pointer expression (`e`) as input and returns the value stored at the memory location pointed to by that pointer. The function handles different types of values that can be pointed to, including strings, arrays, and other pointers.

## Why It Works This Way

1. **Handling Pointers**: The function checks if the value being dereferenced is a pointer. If not, it throws a runtime error indicating that the operation cannot be performed on a non-pointer type.
2. **Double Indirection**: If the cell holding the pointer itself is another pointer (double-indirection), the function unwraps one level to access the actual value.
3. **Edge Cases**:
   - **Empty Strings**: When dereferencing an empty string, the function returns the null terminator (0).
   - **Out-of-Bounds Arrays**: When dereferencing an array with an offset that goes beyond its bounds, the function throws an index error.
4. **C-Style String Handling**: For C-style strings (represented as `const char*` in C++), the function treats the pointer as a character pointer and reads the first character.

## Parameters/Return Value

### Parameters
- `e`: A reference to a `Expression` object representing the pointer expression to be evaluated.

### Return Value
- Returns a `QuantumValue` object containing the value stored at the memory location pointed to by the pointer.

## Edge Cases

- **Empty Strings**: If the string pointed to by the pointer is empty, the function returns the null terminator (0).
- **Out-of-Bounds Arrays**: If the offset used to dereference an array is outside the valid range (either negative or greater than or equal to the size of the array), the function throws an `IndexError`.

## Interactions With Other Components

- **evaluate Function**: The `evalDeref` function uses the `evaluate` function to get the value of the operand, which should be a pointer.
- **QuantumValue Class**: The function manipulates `QuantumValue` objects to represent the value being dereferenced.
- **RuntimeError and IndexError Classes**: These classes are used to handle errors related to invalid pointer operations and out-of-bounds array accesses, respectively.

This function is crucial for correctly interpreting and executing pointer dereference operations in the Quantum Language compiler, ensuring that the program behaves as expected even when dealing with complex data structures like arrays and strings.