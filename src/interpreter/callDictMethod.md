# `callDictMethod`

The `callDictMethod` function in the Quantum Language compiler's interpreter handles method calls on dictionary objects. It provides a variety of operations that can be performed on dictionaries, including checking for keys, retrieving values, setting new key-value pairs, deleting entries, clearing the entire dictionary, adding new entries, getting the size of the dictionary, and iterating over its entries.

## Parameters/Return Value

- **Parameters**:
  - `dict`: A shared pointer to a `Dictionary` object representing the dictionary on which the method is being called.
  - `m`: A string representing the name of the method to be called.
  - `args`: A vector of `QuantumValue` objects representing the arguments passed to the method.

- **Return Value**:
  - Returns a `QuantumValue` object containing the result of the method call. The type of the returned value depends on the method being called.

## How It Works

The function uses a series of conditional statements to determine which method was requested based on the string `m`. Each case corresponds to a different dictionary operation:

- `"has"`: Checks if the dictionary contains a specified key. If the key exists, it returns `true`; otherwise, it returns `false`.
- `"get"`: Retrieves the value associated with a specified key. If the key does not exist, it returns either the default value provided as an argument or an empty `QuantumValue` if no default value is given.
- `"set"`: Sets a new key-value pair in the dictionary. If the key already exists, its value is updated. The function then returns the modified dictionary.
- `"delete"`: Removes a specified key from the dictionary. If the key exists, it is deleted; otherwise, nothing happens. The function returns `true` indicating successful deletion.
- `"clear"`: Clears all entries from the dictionary. The function returns an empty `QuantumValue`.
- `"add"`: Adds a new entry to the dictionary where the key and value are the same. If the key already exists, its value is updated. The function returns the modified dictionary.
- `"size"`: Returns the number of entries in the dictionary as a `QuantumValue` containing a double.
- `"values"`: Returns an array of all values stored in the dictionary.
- `"keys"`: Returns an array of all keys stored in the dictionary.
- `"entries"`: Returns an array of arrays, each containing a key-value pair from the dictionary.
- `"forEach"`: Iterates over each entry in the dictionary and calls a callback function with the current value and key.

## Edge Cases

- When calling `"get"`, if the key does not exist and no default value is provided, the function returns an empty `QuantumValue`.
- When calling `"delete"`, if the key does not exist, the function does nothing but still returns `true`.
- When calling `"forEach"`, if no callback function is provided, the behavior is undefined.

## Interactions With Other Components

The `callDictMethod` function interacts with several other components in the Quantum Language compiler:

- **Dictionary Class**: Manages the storage and retrieval of key-value pairs.
- **Array Class**: Used to store multiple values, such as when returning an array of keys, values, or entries.
- **QuantumValue Class**: Represents the values in the dictionary and handles conversions between different data types.
- **Callback Mechanism**: For the `"forEach"` method, it uses the native callback mechanism provided by the interpreter to execute user-defined functions.

By providing these comprehensive operations, the `callDictMethod` function ensures that dictionary manipulation is flexible and powerful within the Quantum Language compiler's interpreter.