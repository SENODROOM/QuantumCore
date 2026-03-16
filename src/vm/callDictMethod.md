# `callDictMethod`

The `callDictMethod` function is designed to handle various methods associated with dictionary objects in the Quantum Language compiler's virtual machine (VM). This function processes method calls on dictionary instances and returns appropriate results based on the method invoked.

## What It Does

- **Keys Method**: Returns an array containing all keys of the dictionary.
- **Values Method**: Returns an array containing all values of the dictionary.
- **Items/Entries Method**: Returns an array of arrays, where each inner array contains a key-value pair from the dictionary.
- **Has/Contains/HasOwnProperty Method**: Checks if the dictionary contains a specified key and returns a boolean value.
- **Get Method**: Retrieves the value associated with a specified key. If the key is not found, it can optionally return a default value.
- **Set Method**: Sets or updates the value associated with a specified key.
- **Delete Method**: Removes a key-value pair from the dictionary based on the provided key.
- **Clear Method**: Removes all key-value pairs from the dictionary.
- **Size/Length Method**: Returns the number of key-value pairs in the dictionary as a double.

## Why It Works This Way

The implementation follows a straightforward approach to handle different dictionary methods:

- **Keys Method**: Iterates through the dictionary using range-based for loop and pushes each key into a new array.
- **Values Method**: Similar to the Keys Method but pushes each value instead.
- **Items/Entries Method**: Creates an array for each key-value pair, pushing both the key and value into the sub-array before adding the sub-array to the main result array.
- **Has/Contains/HasOwnProperty Method**: Uses the `count` method to check if the key exists in the dictionary. If the key is not present, it returns `false`; otherwise, it returns `true`.
- **Get Method**: Utilizes the `find` method to locate the key in the dictionary. If the key is found, it returns the corresponding value; otherwise, it checks if a default value is provided and returns that or an empty `QuantumValue`.
- **Set Method**: Directly assigns the provided value to the specified key in the dictionary. If the key already exists, its value is updated.
- **Delete Method**: Erases the key-value pair from the dictionary using the `erase` method. It returns `true` regardless of whether the key was found and deleted.
- **Clear Method**: Clears all elements from the dictionary using the `clear` method. It returns an empty `QuantumValue`.
- **Size/Length Method**: Converts the size of the dictionary to a double and returns it.

This design ensures that the `callDictMethod` function provides comprehensive support for common dictionary operations, making it versatile and useful within the Quantum Language compiler.

## Parameters/Return Value

### Parameters

- `m`: A string representing the method name to be called on the dictionary.
- `args`: A vector of `QuantumValue` objects representing arguments passed to the method.

### Return Value

The function returns a `QuantumValue` object, which can represent various data types including arrays, booleans, and doubles, depending on the method being called.

## Edge Cases

- **Empty Dictionary**: The functions handling keys, values, items, and entries will return empty arrays. The `has`, `contains`, and `hasOwnProperty` methods will return `false`. The `get` method without a default value will return an empty `QuantumValue`. The `size` and `length` methods will return `0.0`.
- **Non-existent Key**: The `get` method will return an empty `QuantumValue` if the key is not found, unless a default value is provided. The `has`, `contains`, and `hasOwnProperty` methods will correctly identify non-existent keys.
- **Default Value**: The `get` method allows providing a default value to return when the key is not found. If no default value is provided, it returns an empty `QuantumValue`.

## Interactions With Other Components

The `callDictMethod` function interacts with the following components:

- **Dictionary Object (`dict`)**: The primary data structure on which the method operations are performed.
- **Array Class**: Used to create arrays for storing keys, values, and key-value pairs.
- **QuantumValue Class**: Represents various data types and serves as the return type for the method calls.

These interactions facilitate the execution of dictionary operations within the VM, ensuring seamless integration with other parts of the compiler.