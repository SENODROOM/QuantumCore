# toString() Function Explanation

## Complete Code

```cpp
std::string QuantumValue::toString() const
{
    return std::visit([](const auto &v) -> std::string
                      {
        using T = std::decay_t<decltype(v)>;
        if constexpr (std::is_same_v<T, QuantumNil>)  return "nil";
        if constexpr (std::is_same_v<T, bool>)        return v ? "true" : "false";
        if constexpr (std::is_same_v<T, double>) {
            if (std::floor(v) == v && std::abs(v) < 1e15)
                return std::to_string((long long)v);
            std::ostringstream oss;
            oss << std::setprecision(10) << v;
            return oss.str();
        }
        if constexpr (std::is_same_v<T, std::string>) return v;
        if constexpr (std::is_same_v<T, std::shared_ptr<Array>>) {
            std::string s = "[";
            for (size_t i = 0; i < v->size(); i++) {
                if (i) s += ", ";
                if ((*v)[i].isString()) s += "\"" + (*v)[i].toString() + "\"";
                else s += (*v)[i].toString();
            }
            return s + "]";
        }
        if constexpr (std::is_same_v<T, std::shared_ptr<Dict>>) {
            std::string s = "{";
            bool first = true;
            for (auto& [k, val] : *v) {
                if (!first) s += ", ";
                s += "\"" + k + "\": ";
                if (val.isString()) s += "\"" + val.toString() + "\"";
                else s += val.toString();
                first = false;
            }
            return s + "}";
        }
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumFunction>>) return "<fn:" + v->name + ">";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumNative>>)   return "<native:" + v->name + ">";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumInstance>>) {
            // Call __str__ if defined
            auto k = v->klass.get();
            while (k) {
                auto mit = k->methods.find("__str__");
                if (mit != k->methods.end()) {
                    break;
                }
                k = k->base.get();
            }
            return "<instance:" + v->klass->name + ">";
        }
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumClass>>)    return "<class:" + v->name + ">";
        if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>) {
            if (!v || v->isNull()) return "0x0";
            // Show a deterministic fake address based on cell pointer value
            // so repeated prints of the same pointer give the same address
            std::ostringstream oss;
            oss << "0x" << std::hex << std::uppercase
                << (reinterpret_cast<uintptr_t>(v->cell.get()) + (size_t)v->offset * 8);
            return oss.str();
        }
        return "?"; }, data);
}
```

## Code Explanation

### Function Signature
-  `std::string QuantumValue::toString() const` - Member function that converts the value to its string representation
  - Returns a string representation suitable for display
  - `const` means this function doesn't modify the QuantumValue object

###
-  `return std::visit([](const auto &v) -> std::string` - Uses std::visit to handle different value types
  - Applies a visitor function to the active type in the variant
  - Lambda returns a string representation

###
-  `{` - Opening brace for lambda function
-  `using T = std::decay_t<decltype(v)>;` - Gets the actual type of the value
-  Empty line for readability

###
-  `if constexpr (std::is_same_v<T, QuantumNil>)  return "nil";` - Nil values return "nil"
  - Simple string representation for null values

###
-  `if constexpr (std::is_same_v<T, bool>)        return v ? "true" : "false";` - Boolean values return "true" or "false"
  - Uses ternary operator to convert boolean to string

###
-  `if constexpr (std::is_same_v<T, double>) {` - Start of number handling
-  `if (std::floor(v) == v && std::abs(v) < 1e15)` - Check if number is integer-like and within safe range
  - `std::floor(v) == v` checks if number has no fractional part
  - `std::abs(v) < 1e15` ensures number is within safe integer range
-  `return std::to_string((long long)v);` - Convert to integer string if integer-like
-  `std::ostringstream oss;` - Create string stream for floating point formatting
-  `oss << std::setprecision(10) << v;` - Format with 10 digits of precision
-  `return oss.str();` - Return formatted string
-  `}` - Close number handling block

###
-  `if constexpr (std::is_same_v<T, std::string>) return v;` - Strings return themselves directly
  - No additional formatting needed

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<Array>>) {` - Start of array handling
-  `std::string s = "[";` - Start with opening bracket
-  `for (size_t i = 0; i < v->size(); i++) {` - Loop through array elements
-  `if (i) s += ", ";` - Add comma separator after first element
-  `if ((*v)[i].isString()) s += "\"" + (*v)[i].toString() + "\"";` - Quote string elements
-  `else s += (*v)[i].toString();` - Add non-string elements without quotes
-  `}` - Close loop
-  `return s + "]";` - Add closing bracket and return
-  `}` - Close array handling

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<Dict>>) {` - Start of dictionary handling
-  `std::string s = "{";` - Start with opening brace
-  `bool first = true;` - Track first element for comma handling
-  `for (auto& [k, val] : *v) {` - Loop through key-value pairs
-  `if (!first) s += ", ";` - Add comma after first element
-  `s += "\"" + k + "\": ";` - Add quoted key and colon
-  `if (val.isString()) s += "\"" + val.toString() + "\"";` - Quote string values
-  `else s += val.toString();` - Add non-string values without quotes
-  `first = false;` - Mark that we've processed the first element
-  `}` - Close loop
-  `return s + "}";` - Add closing brace and return
-  `}` - Close dictionary handling

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumFunction>>) return "<fn:" + v->name + ">";` - User functions show name
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumNative>>)   return "<native:" + v->name + ">";` - Native functions show name

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumInstance>>) {` - Start of instance handling
-  `// Call __str__ if defined` - Comment about custom string method
-  `auto k = v->klass.get();` - Get pointer to class
-  `while (k) {` - Walk inheritance chain
-  `auto mit = k->methods.find("__str__");` - Look for custom __str__ method
-  `if (mit != k->methods.end()) {` - If method found
-  `break;` - Break (method exists but not called in current implementation)
-  `}` - Close if
-  `k = k->base.get();` - Move to base class
-  `}` - Close while loop
-  `return "<instance:" + v->klass->name + ">";` - Return instance representation
-  `}` - Close instance handling

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumClass>>)    return "<class:" + v->name + ">";` - Classes show name

###
-  `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>) {` - Start of pointer handling
-  `if (!v || v->isNull()) return "0x0";` - Null pointers show as 0x0
-  `// Show a deterministic fake address based on cell pointer value` - Comment about address generation
-  `// so repeated prints of the same pointer give the same address` - Comment about consistency
-  `std::ostringstream oss;` - Create string stream
-  `oss << "0x" << std::hex << std::uppercase` - Format as hexadecimal with uppercase
-  `<< (reinterpret_cast<uintptr_t>(v->cell.get()) + (size_t)v->offset * 8);` - Calculate fake address
-  `return oss.str();` - Return formatted address
-  `}` - Close pointer handling

###
-  `return "?"; }, data);` - Default case returns "?" for unknown types
  - Closes lambda and applies it to the `data` variant member

## Summary

The `toString()` function provides comprehensive string conversion for all Quantum Language value types:

### Key Features
- **Type-Safe**: Uses `std::visit` and `if constexpr` for compile-time type checking
- **Formatted Output**: Proper formatting for collections (arrays, dictionaries)
- **Human-Readable**: Clear representations for functions, classes, and instances
- **Consistent**: Deterministic pointer addresses for debugging
- **Language-Aware**: Follows conventions from multiple programming languages

### Output Formats
- **Nil**: "nil"
- **Boolean**: "true" or "false"
- **Numbers**: Integer format for whole numbers, decimal for floats
- **Strings**: Direct string content
- **Arrays**: `[elem1, elem2, ...]` with quoted strings
- **Dictionaries**: `{"key": value, ...}` with quoted keys and string values
- **Functions**: `<fn:name>` or `<native:name>`
- **Classes**: `<class:name>`
- **Instances**: `<instance:classname>`
- **Pointers**: Hexadecimal addresses like "0x1234ABCD"

This function is essential for debugging, printing, and string operations in the Quantum Language interpreter.
