# isTruthy() Function Explanation

## Complete Code

```cpp
bool QuantumValue::isTruthy() const
{
    return std::visit([](const auto &v) -> bool
                      {
        using T = std::decay_t<decltype(v)>;
        if constexpr (std::is_same_v<T, QuantumNil>)    return false;
        if constexpr (std::is_same_v<T, bool>)          return v;
        if constexpr (std::is_same_v<T, double>)        return v != 0.0;
        if constexpr (std::is_same_v<T, std::string>)   return !v.empty() && !(v.size() == 1 && v[0] == '\0');
        if constexpr (std::is_same_v<T, std::shared_ptr<Array>>) return !v->empty();
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>) return v && !v->isNull();
        return true; }, data);
}
```

## Line-by-Line Explanation

### Function Signature (Line 10)
- **Line 10**: `bool QuantumValue::isTruthy() const` - Member function that returns a boolean indicating if the value is "truthy"
  - `const` means this function doesn't modify the QuantumValue object
  - Returns `true` if the value should be considered true in conditional contexts

### std::visit Pattern (Lines 11-12)
- **Line 11**: `return std::visit([](const auto &v) -> bool` - Uses std::visit to handle different value types in the variant
  - `std::visit` applies a visitor function to the active type in the variant
  - `[](const auto &v) -> bool` is a lambda that takes any value type by const reference and returns bool

### Type Deduction (Lines 12-14)
- **Line 12**: `{` - Opening brace for lambda function
- **Line 13**: `using T = std::decay_t<decltype(v)>;` - Gets the actual type of the value, removing references and const
- **Line 14**: Empty line for readability

### Nil Type Check (Line 15)
- **Line 15**: `if constexpr (std::is_same_v<T, QuantumNil>)    return false;` - If the value is nil/null, return false
  - `if constexpr` is compile-time conditional (no runtime overhead)
  - `std::is_same_v<T, QuantumNil>` checks if the type T is exactly QuantumNil
  - Nil values are always considered falsy

### Boolean Type Check (Line 16)
- **Line 16**: `if constexpr (std::is_same_v<T, bool>)          return v;` - If the value is boolean, return the boolean value directly
  - True values return true, false values return false

### Number Type Check (Line 17)
- **Line 17**: `if constexpr (std::is_same_v<T, double>)        return v != 0.0;` - If the value is a number, return true if not zero
  - Zero is considered falsy, any non-zero number is truthy
  - This follows the convention from languages like C and JavaScript

### String Type Check (Line 18)
- **Line 18**: `if constexpr (std::is_same_v<T, std::string>)   return !v.empty() && !(v.size() == 1 && v[0] == '\0');` - Complex string truthiness check
  - `!v.empty()` - String must not be empty
  - `!(v.size() == 1 && v[0] == '\0')` - String must not be a single null character
  - Non-empty strings (except single null char) are truthy

### Array Type Check (Line 19)
- **Line 19**: `if constexpr (std::is_same_v<T, std::shared_ptr<Array>>) return !v->empty();` - If the value is an array, return true if not empty
  - Empty arrays are falsy, non-empty arrays are truthy
  - This follows Python-like truthiness rules

### Pointer Type Check (Line 20)
- **Line 20**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>) return v && !v->isNull();` - If the value is a pointer, return true if not null
  - `v` checks if the shared pointer itself is not null
  - `!v->isNull()` checks if the pointer doesn't point to null
  - Only non-null pointers are truthy

### Default Case (Line 21)
- **Line 21**: `return true; }, data);` - Default case: all other types are truthy
  - Functions, classes, instances, dictionaries, etc. are always truthy
  - `}, data)` closes the lambda and applies it to the `data` variant member

## Summary

The `isTruthy()` function implements a comprehensive truthiness system that follows conventions from multiple programming languages:

### Truthiness Rules
- **Nil**: Always false
- **Boolean**: Direct boolean value
- **Numbers**: False if zero, true otherwise
- **Strings**: False if empty or single null character, true otherwise
- **Arrays**: False if empty, true otherwise
- **Pointers**: False if null, true otherwise
- **Everything Else**: Always true (functions, classes, instances, dictionaries)

### Key Features
- **Type Safety**: Uses `std::visit` and `if constexpr` for compile-time type checking
- **Performance**: No runtime type checking overhead due to `if constexpr`
- **Multi-Paradigm**: Combines truthiness rules from Python, JavaScript, and C
- **Comprehensive**: Handles all value types in the Quantum Language

This function is essential for implementing conditional statements (`if`, `while`) and logical operations in the Quantum Language interpreter.
