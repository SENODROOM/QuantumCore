# typeName() Function Explanation

## Complete Code

```cpp
std::string QuantumValue::typeName() const
{
    return std::visit([](const auto &v) -> std::string
                      {
        using T = std::decay_t<decltype(v)>;
        if constexpr (std::is_same_v<T, QuantumNil>)   return "nil";
        if constexpr (std::is_same_v<T, bool>)         return "bool";
        if constexpr (std::is_same_v<T, double>)       return "number";
        if constexpr (std::is_same_v<T, std::string>)  return "string";
        if constexpr (std::is_same_v<T, std::shared_ptr<Array>>)           return "array";
        if constexpr (std::is_same_v<T, std::shared_ptr<Dict>>)            return "dict";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumFunction>>) return "function";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumNative>>)   return "native";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumInstance>>) return v->klass->name;
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumClass>>)    return "class";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>)  return "pointer";
        return "unknown"; }, data);
}
```

## Code Explanation

### Function Signature
-  `std::string QuantumValue::typeName() const` - Member function that returns the type name of the value
  - Returns a string representing the type of the stored value
  - `const` means this function doesn't modify the QuantumValue object

###
-  `return std::visit([](const auto &v) -> std::string` - Uses std::visit to handle different value types
  - Applies a visitor function to the active type in the variant
  - Lambda returns a string representing the type name

###
-  `{` - Opening brace for lambda function
-  `using T = std::decay_t<decltype(v)>;` - Gets the actual type of the value, removing references and const
-  Empty line for readability

###
-  `if constexpr (std::is_same_v<T, QuantumNil>)   return "nil";` - Nil values return "nil"
  - Simple type name for null values

###
-  `if constexpr (std::is_same_v<T, bool>)         return "bool";` - Boolean values return "bool"
  - Standard boolean type name

###
-  `if constexpr (std::is_same_v<T, double>)       return "number";` - Numeric values return "number"
  - Uses generic "number" instead of "double" for user-friendly type names
  - This matches JavaScript's typeof behavior

###
-  `if constexpr (std::is_same_v<T, std::string>)  return "string";` - String values return "string"
  - Standard string type name

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<Array>>)           return "array";` - Array values return "array"
  - Uses "array" instead of the complex template type name
  - User-friendly type name for collection types

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<Dict>>)            return "dict";` - Dictionary values return "dict"
  - Short, memorable name for hash map/dictionary type
  - Follows Python naming conventions

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumFunction>>) return "function";` - User functions return "function"
  - Standard function type name used in many languages

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumNative>>)   return "native";` - Native functions return "native"
  - Distinguishes built-in functions from user-defined functions
  - Useful for debugging and introspection

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumInstance>>) return v->klass->name;` - Instances return their class name
  - Dynamic type name based on the actual class of the instance
  - Enables polymorphic type checking

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumClass>>)    return "class";` - Class values return "class"
  - Standard class type name

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>)  return "pointer";` - Pointer values return "pointer"
  - Clear type name for C-style pointers

###
-  `return "unknown"; }, data);` - Default case returns "unknown" for any unexpected types
  - Safety fallback for future type additions
  - Closes lambda and applies it to the `data` variant member

## Summary

The `typeName()` function provides human-readable type names for all Quantum Language value types:

### Key Features
- **Type-Safe**: Uses `std::visit` and `if constexpr` for compile-time type checking
- **User-Friendly**: Returns simple, memorable type names instead of complex C++ template names
- **Consistent**: Follows naming conventions from popular languages (JavaScript, Python)
- **Dynamic**: Instance types return their actual class name for polymorphic behavior
- **Safe**: Includes fallback for unknown types

### Type Name Mapping
- **nil** → "nil"
- **bool** → "bool"
- **double** → "number"
- **std::string** → "string"
- **Array** → "array"
- **Dict** → "dict"
- **QuantumFunction** → "function"
- **QuantumNative** → "native"
- **QuantumInstance** → [actual class name]
- **QuantumClass** → "class"
- **QuantumPointer** → "pointer"
- **Unknown** → "unknown"

### Use Cases
- **Type Checking**: Runtime type introspection for debugging
- **Error Messages**: User-friendly error reporting
- **Reflection**: Dynamic type-based behavior
- **Documentation**: Clear type information for developers

This function is essential for runtime type checking, error reporting, and language introspection features in the Quantum Language interpreter.
