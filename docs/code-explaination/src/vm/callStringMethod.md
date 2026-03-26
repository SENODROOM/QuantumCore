# `callStringMethod`

## Overview

The `callStringMethod` function is designed to handle various string manipulation methods in the Quantum Language compiler. It processes method calls on string objects and returns the appropriate result based on the method name provided.

## Parameters

- `m`: A string representing the method name to be called.
- `args`: A vector of `QuantumValue` objects containing the arguments passed to the method.

## Return Value

The function returns a `QuantumValue` object, which can represent different data types depending on the method being called. Commonly, it returns a boolean indicating success or failure, a double representing a numeric value, or another string.

## Edge Cases

1. **Empty String**: Methods like `length`, `size`, `toUpperCase`, `toLowerCase`, `trim`, `strip`, `startsWith`, `endsWith`, `includes`, and `contains` should handle empty strings gracefully.
2. **No Arguments**: Methods that require arguments (`startsWith`, `endsWith`, `includes`) should return `false` if no arguments are provided.
3. **Split Method**: The `split` method should handle cases where the separator is an empty string or `nil`.

## Interactions with Other Components

The `callStringMethod` function interacts primarily with the `QuantumValue` class to manage the data types and values returned. It also uses standard C++ libraries such as `<algorithm>` for transformations like converting characters to uppercase or lowercase, and `<cctype>` for checking character properties like whitespace.

Here's a breakdown of how each method works:

### `length` / `size`
- Returns the length of the string as a `double`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("length", {QuantumValue("hello")});
  // result will be QuantumValue(5.0)
  ```

### `toUpperCase` / `upper`
- Converts all characters in the string to uppercase.
- Returns the modified string as a `QuantumValue`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("toUpperCase", {QuantumValue("hello")});
  // result will be QuantumValue("HELLO")
  ```

### `toLowerCase` / `lower`
- Converts all characters in the string to lowercase.
- Returns the modified string as a `QuantumValue`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("toLowerCase", {QuantumValue("Hello")});
  // result will be QuantumValue("hello")
  ```

### `trim` / `strip`
- Removes leading and trailing whitespace from the string.
- Returns the trimmed string as a `QuantumValue`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("trim", {QuantumValue("   hello   ")});
  // result will be QuantumValue("hello")
  ```

### `startsWith` / `startswith`
- Checks if the string starts with the specified substring.
- Returns `true` if it does, otherwise `false`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("startsWith", {QuantumValue("hello"), QuantumValue("he")});
  // result will be QuantumValue(true)
  ```

### `endsWith` / `endswith`
- Checks if the string ends with the specified substring.
- Returns `true` if it does, otherwise `false`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("endsWith", {QuantumValue("hello"), QuantumValue("lo")});
  // result will be QuantumValue(true)
  ```

### `includes` / `contains`
- Checks if the string contains the specified substring.
- Returns `true` if it does, otherwise `false`.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("includes", {QuantumValue("hello"), QuantumValue("el")});
  // result will be QuantumValue(true)
  ```

### `indexOf`
- Finds the index of the first occurrence of the specified substring within the string.
- Returns `-1.0` if the substring is not found.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("indexOf", {QuantumValue("hello"), QuantumValue("l")});
  // result will be QuantumValue(2.0)
  ```

### `split`
- Splits the string into substrings based on the specified separator.
- If no separator is provided, splits the string into individual characters.
- Returns an array of `QuantumValue` objects representing the split substrings.
- Example:
  ```cpp
  QuantumValue result = callStringMethod("split", {QuantumValue("hello"), QuantumValue("")});
  // result will be Array([QuantumValue('h'), QuantumValue('e'), QuantumValue('l'), QuantumValue('l'), QuantumValue('o')])
  ```

This function provides a comprehensive set of string operations, ensuring flexibility and ease of use within the Quantum Language compiler. Each method is carefully implemented to handle common scenarios and edge cases, making it robust and reliable for various applications.