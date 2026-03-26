# `callArrayMethod`

The `callArrayMethod` function is designed to handle method calls on quantum arrays within the Quantum Language compiler's virtual machine (VM). This function allows for various operations such as pushing elements onto the array, popping elements off the array, getting its length, shifting and unshifting elements, reversing and sorting the array, joining its elements into a string, checking if an element exists in the array, and finding the index of an element.

## What It Does

- **Push/Appending**: Adds an element to the end of the array. If no arguments are provided, it adds an empty `QuantumValue`.
- **Popping**: Removes the last element from the array and returns it. Throws a runtime error if the array is empty.
- **Length/Size**: Returns the number of elements in the array as a `QuantumValue`.
- **Shifting**: Removes the first element from the array and returns it. Returns an empty `QuantumValue` if the array is empty.
- **Unshifting**: Inserts an element at the beginning of the array. Returns the new size of the array as a `QuantumValue`.
- **Reversing**: Reverses the order of elements in the array.
- **Sorting**: Sorts the elements in the array. Elements can be sorted numerically or lexicographically based on their type.
- **Joining**: Concatenates all elements of the array into a single string, separated by a specified delimiter (default is comma).
- **Includes/Contains**: Checks if the array contains a specified element and returns a boolean result.
- **IndexOf**: Finds the index of the first occurrence of a specified element in the array and returns it. Returns -1 if the element is not found.

## Why It Works This Way

### Method Implementation

Each method is implemented using conditional checks to determine which operation to perform. For example, the `push` and `append` methods both add an element to the end of the array, with the latter handling the case where no arguments are provided. The `pop` method throws an exception if the array is empty to prevent undefined behavior.

### Sorting Logic

The sorting logic uses a lambda function that compares elements based on their type. If both elements are numbers, it sorts them numerically. Otherwise, it sorts them lexicographically. This approach ensures flexibility and handles different data types gracefully.

### Edge Cases

- **Empty Array Operations**: Methods like `pop`, `shift`, and `indexOf` handle empty arrays by either throwing exceptions or returning default values (`QuantumValue()` or `-1.0`).
- **Default Delimiter**: The `join` method uses a default delimiter of a comma if no arguments are provided.
- **No Arguments**: Methods like `includes`, `contains`, and `indexOf` check for empty argument lists and return appropriate results.

## Parameters/Return Value

- **Parameters**:
  - `m`: A string representing the method name to be called.
  - `args`: A vector of `QuantumValue` objects representing the arguments passed to the method.

- **Return Value**:
  - Returns a `QuantumValue` object containing the result of the method call. The type of the returned value depends on the method being called.

## Interactions With Other Components

- **QuantumValue Class**: Extensively used throughout the function to represent individual elements of the array and their operations.
- **RuntimeError Class**: Thrown when attempting to pop from an empty array, ensuring robust error handling.
- **std::reverse and std::sort**: Used for reversing and sorting the array, respectively, demonstrating integration with standard library algorithms.

This comprehensive implementation of `callArrayMethod` provides a versatile set of operations for manipulating quantum arrays, enhancing the functionality and usability of the VM.