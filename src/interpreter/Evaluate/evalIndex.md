# evalIndex() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalIndex(IndexExpr &e)
{
    auto obj = evaluate(*e.object);
    auto idx = evaluate(*e.index);
    if (obj.isArray())
    {
        long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;
        if (i < 0 || i >= (long long)obj.asArray()->size())
            throw IndexError("Array index out of bounds");
        return obj.asArray()->elements[i];
    }
    if (obj.isString())
    {
        long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;
        std::string str = obj.asString();
        if (i < 0 || i >= (long long)str.size())
            throw IndexError("String index out of bounds");
        return QuantumValue(std::string(1, str[i]));
    }
    if (obj.isDict())
    {
        return obj.asDict()->get(idx.toString());
    }
    throw TypeError("Cannot index " + obj.typeName());
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalIndex(IndexExpr &e)` - Evaluate indexing expressions
  - `e`: Reference to IndexExpr AST node
  - Returns QuantumValue result of indexing operation

###
-  `{` - Opening brace
-  `auto obj = evaluate(*e.object);` - Evaluate object expression
-  `auto idx = evaluate(*e.index);` - Evaluate index expression

###
-  `if (obj.isArray())` - Check if object is array
-  `{` - Opening brace for array case
-  `long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;` - Convert index to integer
-  `if (i < 0 || i >= (long long)obj.asArray()->size())` - Check bounds
-  `throw IndexError("Array index out of bounds");` - Throw error for out of bounds
-  `return obj.asArray()->elements[i];` - Return array element
-  `}` - Closing brace for array case

###
-  Empty line for readability
-  `if (obj.isString())` - Check if object is string
-  `{` - Opening brace for string case
-  `long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;` - Convert index to integer
-  `std::string str = obj.asString();` - Get string reference
-  `if (i < 0 || i >= (long long)str.size())` - Check bounds
-  `throw IndexError("String index out of bounds");` - Throw error for out of bounds
-  `return QuantumValue(std::string(1, str[i]));` - Return character as string
-  `}` - Closing brace for string case

###
-  Empty line for readability
-  `if (obj.isDict())` - Check if object is dictionary
-  `{` - Opening brace for dict case
-  `return obj.asDict()->get(idx.toString());` - Return value for key
-  `}` - Closing brace for dict case

###
-  Empty line for readability
-  `throw TypeError("Cannot index " + obj.typeName());` - Throw error for non-indexable types
-  `}` - Closing brace for function

## Summary

The `evalIndex()` function handles indexing operations for various data types in the Quantum Language:

### Key Features
- **Multiple Types**: Supports arrays, strings, and dictionaries
- **Bounds Checking**: Prevents out-of-bounds access
- **Type Safety**: Proper type checking and conversion
- **Error Handling**: Clear error messages for invalid operations

### Indexable Types Supported
- **Arrays**: `array[index]` - access array elements
- **Strings**: `string[index]` - access string characters
- **Dictionaries**: `dict[key]` - access dictionary values

### Array Indexing
- **Index Conversion**: Converts index to integer with default 0
- **Bounds Checking**: Validates index against array size
- **Element Access**: Direct access to array elements
- **Error Handling**: IndexError for out-of-bounds access

### String Indexing
- **Character Access**: Returns single character as string
- **Index Conversion**: Same integer conversion as arrays
- **Bounds Checking**: Validates index against string length
- **Unicode Support**: Works with Unicode characters

### Dictionary Indexing
- **Key Conversion**: Converts index to string for key lookup
- **Value Retrieval**: Gets value associated with key
- **Key Types**: Any type can be used as dictionary key
- **Missing Keys**: Handled by dictionary get method

### Index Conversion
- **Numeric Index**: Converts numbers to integers
- **Default Index**: Non-numeric indices default to 0
- **Type Safety**: Safe conversion with error handling
- **Performance**: Efficient conversion process

### Bounds Checking
- **Array Bounds**: Checks against array element count
- **String Bounds**: Checks against string character count
- **Negative Indices**: Negative indices considered out of bounds
- **Error Messages**: Clear IndexError messages

### Design Benefits
- **Type Safety**: Comprehensive type checking
- **Memory Safety**: Bounds checking prevents crashes
- **Flexibility**: Multiple indexing patterns supported
- **Performance**: Efficient direct access where possible

### Use Cases
- **Array Access**: `arr[0]`, `arr[i]` for element access
- **String Access**: `str[0]`, `str[i]` for character access
- **Dictionary Access**: `dict["key"]` for value lookup
- **Data Processing**: Processing collections and strings

### Integration with Other Components
- **Array Class**: Uses array element storage
- **String Class**: Uses string character access
- **Dictionary Class**: Uses key-value lookup
- **Error System**: Uses IndexError and TypeError

### Performance Characteristics
- **Direct Access**: O(1) array and dictionary access
- **Bounds Checking**: Minimal overhead for safety
- **Type Dispatch**: Efficient type checking
- **Memory Efficient**: No unnecessary allocations

### Indexing Examples
- **Array**: `[1, 2, 3][1]` → `2`
- **String**: `"hello"[1]` → `"e"`
- **Dictionary**: `{"a": 1}["a"]` → `1`
- **Out of Bounds**: `[1, 2][5]` → IndexError

### Error Handling
- **IndexError**: Thrown for out-of-bounds access
- **TypeError**: Thrown for non-indexable types
- **Conversion Errors**: Safe index conversion
- **Missing Keys**: Handled by dictionary get method

This function provides the foundation for indexing operations in the Quantum Language, enabling safe and efficient access to array elements, string characters, and dictionary values while maintaining proper type safety and bounds checking throughout the indexing process.
