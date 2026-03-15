# `callArrayMethod`

## Description

The `callArrayMethod` function is designed to handle various operations on an array object within the Quantum Language compiler's interpreter. This function processes different methods such as `push`, `pop`, `shift`, `unshift`, `length`, `copy`, and `fill`.

## Parameters

- `arr`: A shared pointer to the `Array` object on which the method is being called.
- `m`: A string representing the method name to be executed.
- `args`: A vector containing the arguments passed to the method.

## Return Value

- Returns a `QuantumValue` object, which can represent any type of value in the Quantum Language, including arrays, numbers, or undefined values.

## Edge Cases

1. **Empty Array**: Methods like `pop`, `shift`, and `fill` with specified ranges that exceed the array size will handle these cases gracefully without throwing errors.
2. **Negative Indices**: For methods that accept indices (like `pop` and `fill`), negative indices are interpreted as relative to the end of the array.
3. **Invalid Arguments**: If non-numeric arguments are provided where numeric ones are expected (e.g., `pop` with a non-number argument), an error will be thrown.

## Interactions with Other Components

- **Array Class**: The `callArrayMethod` function interacts directly with the `Array` class, which manages the internal storage and operations of array objects.
- **Error Handling**: It uses custom error classes (`IndexError`) to manage exceptions related to invalid array operations, ensuring robustness in error handling.
- **Memory Management**: By using shared pointers, it ensures proper memory management of array objects, preventing premature deallocation.

## Implementation Details

Here’s a breakdown of how each method is implemented:

### `push` / `append`
- Adds elements from `args` to the end of the array `arr`.
- Returns an empty `QuantumValue`.

### `pop`
- Removes and returns the last element of the array if no arguments are provided.
- If an argument `i` is provided, removes and returns the element at index `i`. Handles negative indices by converting them to positive based on the array size.
- Throws an `IndexError` if the array is empty or if the index is out of range.

### `shift`
- Removes and returns the first element of the array.
- Throws an `IndexError` if the array is empty.

### `unshift`
- Inserts elements from `args` at the beginning of the array `arr`.
- Returns an empty `QuantumValue`.

### `length`
- Returns the current length of the array as a `QuantumValue`.

### `copy`
- Creates a deep copy of the array `arr` and returns it wrapped in a `QuantumValue`.

### `fill`
- Fills a portion of the array with a given value.
- Optionally accepts start and end indices to specify the range of the fill operation.
- Handles negative indices and adjusts them accordingly.
- Clamps the start and end indices to ensure they do not exceed the array bounds.
- Returns the modified array wrapped in a `QuantumValue`.

### `reverse`
- Reverses the order of elements in the array `arr`.
- Currently incomplete, likely intended to use `std::reverse` but requires further implementation to complete.

This function provides comprehensive support for common array operations, making it a crucial component of the interpreter's functionality for handling data structures effectively.