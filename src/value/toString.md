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

## Line-by-Line Explanation

### Function Signature (Line 24)
- **Line 24**: `std::string QuantumValue::toString() const` - Member function that converts the value to its string representation
  - Returns a string representation suitable for display
  - `const` means this function doesn't modify the QuantumValue object

### std::visit Pattern (Lines 25-27)
- **Line 25**: `return std::visit([](const auto &v) -> std::string` - Uses std::visit to handle different value types
  - Applies a visitor function to the active type in the variant
  - Lambda returns a string representation

### Type Deduction (Lines 26-28)
- **Line 26**: `{` - Opening brace for lambda function
- **Line 27**: `using T = std::decay_t<decltype(v)>;` - Gets the actual type of the value
- **Line 28**: Empty line for readability

### Nil Type (Line 29)
- **Line 29**: `if constexpr (std::is_same_v<T, QuantumNil>)  return "nil";` - Nil values return "nil"
  - Simple string representation for null values

### Boolean Type (Line 30)
- **Line 30**: `if constexpr (std::is_same_v<T, bool>)        return v ? "true" : "false";` - Boolean values return "true" or "false"
  - Uses ternary operator to convert boolean to string

### Number Type (Lines 31-37)
- **Line 31**: `if constexpr (std::is_same_v<T, double>) {` - Start of number handling
- **Line 32**: `if (std::floor(v) == v && std::abs(v) < 1e15)` - Check if number is integer-like and within safe range
  - `std::floor(v) == v` checks if number has no fractional part
  - `std::abs(v) < 1e15` ensures number is within safe integer range
- **Line 33**: `return std::to_string((long long)v);` - Convert to integer string if integer-like
- **Line 34**: `std::ostringstream oss;` - Create string stream for floating point formatting
- **Line 35**: `oss << std::setprecision(10) << v;` - Format with 10 digits of precision
- **Line 36**: `return oss.str();` - Return formatted string
- **Line 37**: `}` - Close number handling block

### String Type (Line 38)
- **Line 38**: `if constexpr (std::is_same_v<T, std::string>) return v;` - Strings return themselves directly
  - No additional formatting needed

### Array Type (Lines 39-47)
- **Line 39**: `if constexpr (std::is_same_v<T, std::shared_ptr<Array>>) {` - Start of array handling
- **Line 40**: `std::string s = "[";` - Start with opening bracket
- **Line 41**: `for (size_t i = 0; i < v->size(); i++) {` - Loop through array elements
- **Line 42**: `if (i) s += ", ";` - Add comma separator after first element
- **Line 43**: `if ((*v)[i].isString()) s += "\"" + (*v)[i].toString() + "\"";` - Quote string elements
- **Line 44**: `else s += (*v)[i].toString();` - Add non-string elements without quotes
- **Line 45**: `}` - Close loop
- **Line 46**: `return s + "]";` - Add closing bracket and return
- **Line 47**: `}` - Close array handling

### Dictionary Type (Lines 48-59)
- **Line 48**: `if constexpr (std::is_same_v<T, std::shared_ptr<Dict>>) {` - Start of dictionary handling
- **Line 49**: `std::string s = "{";` - Start with opening brace
- **Line 50**: `bool first = true;` - Track first element for comma handling
- **Line 51**: `for (auto& [k, val] : *v) {` - Loop through key-value pairs
- **Line 52**: `if (!first) s += ", ";` - Add comma after first element
- **Line 53**: `s += "\"" + k + "\": ";` - Add quoted key and colon
- **Line 54**: `if (val.isString()) s += "\"" + val.toString() + "\"";` - Quote string values
- **Line 55**: `else s += val.toString();` - Add non-string values without quotes
- **Line 56**: `first = false;` - Mark that we've processed the first element
- **Line 57**: `}` - Close loop
- **Line 58**: `return s + "}";` - Add closing brace and return
- **Line 59**: `}` - Close dictionary handling

### Function Types (Lines 60-61)
- **Line 60**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumFunction>>) return "<fn:" + v->name + ">";` - User functions show name
- **Line 61**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumNative>>)   return "<native:" + v->name + ">";` - Native functions show name

### Instance Type (Lines 62-73)
- **Line 62**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumInstance>>) {` - Start of instance handling
- **Line 63**: `// Call __str__ if defined` - Comment about custom string method
- **Line 64**: `auto k = v->klass.get();` - Get pointer to class
- **Line 65**: `while (k) {` - Walk inheritance chain
- **Line 66**: `auto mit = k->methods.find("__str__");` - Look for custom __str__ method
- **Line 67**: `if (mit != k->methods.end()) {` - If method found
- **Line 68**: `break;` - Break (method exists but not called in current implementation)
- **Line 69**: `}` - Close if
- **Line 70**: `k = k->base.get();` - Move to base class
- **Line 71**: `}` - Close while loop
- **Line 72**: `return "<instance:" + v->klass->name + ">";` - Return instance representation
- **Line 73**: `}` - Close instance handling

### Class Type (Line 74)
- **Line 74**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumClass>>)    return "<class:" + v->name + ">";` - Classes show name

### Pointer Type (Lines 75-83)
- **Line 75**: `if constexpr (std::is_same_v<T, std::shared_ptr<QuantumPointer>>) {` - Start of pointer handling
- **Line 76**: `if (!v || v->isNull()) return "0x0";` - Null pointers show as 0x0
- **Line 77**: `// Show a deterministic fake address based on cell pointer value` - Comment about address generation
- **Line 78**: `// so repeated prints of the same pointer give the same address` - Comment about consistency
- **Line 79**: `std::ostringstream oss;` - Create string stream
- **Line 80**: `oss << "0x" << std::hex << std::uppercase` - Format as hexadecimal with uppercase
- **Line 81**: `<< (reinterpret_cast<uintptr_t>(v->cell.get()) + (size_t)v->offset * 8);` - Calculate fake address
- **Line 82**: `return oss.str();` - Return formatted address
- **Line 83**: `}` - Close pointer handling

### Default Case (Line 84)
- **Line 84**: `return "?"; }, data);` - Default case returns "?" for unknown types
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
