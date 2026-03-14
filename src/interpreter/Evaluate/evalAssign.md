# evalAssign() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalAssign(AssignExpr &e)
{
    // Tuple unpacking: a, b, c = someIterable
    if (e.op == "unpack")
    {
        auto iterable = evaluate(*e.right);
        std::vector<QuantumValue> items;
        
        if (iterable.isArray())
        {
            items = iterable.asArray()->elements;
        }
        else if (iterable.isString())
        {
            for (char ch : iterable.asString())
                items.push_back(QuantumValue(std::string(1, ch)));
        }
        else
        {
            // Try to iterate over the object
            auto it = iterable.begin();
            auto end = iterable.end();
            for (; it != end; ++it)
                items.push_back(*it);
        }
        
        size_t i = 0;
        for (auto &target : e.left)
        {
            if (i >= items.size())
                throw RuntimeError("Too many targets in unpacking");
            setLValue(*target, items[i], "=");
            i++;
        }
        
        if (i < items.size())
            throw RuntimeError("Too few values in unpacking");
        return iterable;
    }

    auto value = evaluate(*e.right);
    setLValue(*e.left, value, e.op);
    return value;
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalAssign(AssignExpr &e)` - Evaluate assignment expressions
  - `e`: Reference to AssignExpr AST node
  - Returns QuantumValue result of the assignment

###
-  `{` - Opening brace
-  `// Tuple unpacking: a, b, c = someIterable` - Comment about unpacking
-  `if (e.op == "unpack")` - Check if this is unpacking assignment
-  `{` - Opening brace for unpacking

###
-  `auto iterable = evaluate(*e.right);` - Evaluate the right-hand side
-  `std::vector<QuantumValue> items;` - Create vector for unpacked items
-  Empty line for readability
-  `if (iterable.isArray())` - Check if iterable is array
-  `{` - Opening brace for array case
-  `items = iterable.asArray()->elements;` - Copy array elements

###
-  `}` - Closing brace for array case
-  `else if (iterable.isString())` - Check if iterable is string
-  `{` - Opening brace for string case
-  `for (char ch : iterable.asString())` - Loop through string characters
-  `items.push_back(QuantumValue(std::string(1, ch)));` - Add each character as string

###
-  `}` - Closing brace for string case
-  `else` - Generic iterable case
-  `{` - Opening brace for generic case
-  `// Try to iterate over the object` - Comment about iteration
-  `auto it = iterable.begin();` - Get iterator begin
-  `auto end = iterable.end();` - Get iterator end
-  `for (; it != end; ++it)` - Loop through iterator
-  `items.push_back(*it);` - Add each item
-  `}` - Closing brace for generic case

###
-  Empty line for readability
-  `size_t i = 0;` - Initialize index counter
-  `for (auto &target : e.left)` - Loop through assignment targets
-  `{` - Opening brace for target loop
-  `if (i >= items.size())` - Check if too many targets
-  `throw RuntimeError("Too many targets in unpacking");` - Throw error
-  `setLValue(*target, items[i], "=");` - Assign value to target
-  `i++;` - Increment index
-  `}` - Closing brace for target loop

###
-  Empty line for readability
-  `if (i < items.size())` - Check if too few values
-  `throw RuntimeError("Too few values in unpacking");` - Throw error
-  `return iterable;` - Return the original iterable
-  `}` - Closing brace for unpacking
-  Empty line for readability

###
-  `auto value = evaluate(*e.right);` - Evaluate right-hand side
-  `setLValue(*e.left, value, e.op);` - Perform the assignment
-  `return value;` - Return assigned value
-  `}` - Closing brace for function

## Summary

The `evalAssign()` function handles all assignment operations in the Quantum Language:

### Key Features
- **Tuple Unpacking**: Support for multiple assignment targets from iterables
- **Compound Assignment**: Support for +=, -=, *=, /=, %=, &=, |=, ^=, <<=, >>=
- **Multiple Target Types**: Variables, array elements, object fields
- **Type Safety**: Proper type checking and conversion

### Assignment Types
- **Simple Assignment**: `x = value`
- **Compound Assignment**: `x += value`, `x *= value`, etc.
- **Tuple Unpacking**: `a, b, c = [1, 2, 3]`
- **String Unpacking**: `a, b, c = "abc"`

### Tuple Unpacking Process
1. **Iterable Evaluation**: Evaluate the right-hand side
2. **Item Extraction**: Extract items from array, string, or generic iterable
3. **Target Assignment**: Assign each item to corresponding target
4. **Validation**: Ensure target and item counts match
5. **Return Value**: Return the original iterable

### Supported Iterables
- **Arrays**: Direct element extraction
- **Strings**: Character-by-character unpacking
- **Generic Iterables**: Using iterator interface
- **Custom Objects**: Any object with begin()/end() methods

### Assignment Operators
- **Simple**: `=` for direct assignment
- **Arithmetic**: `+=`, `-=`, `*=`, `/=`, `%=`
- **Bitwise**: `&=`, `|=`, `^=`, `<<=`, `>>=`

### Error Handling
- **RuntimeError**: Thrown for unpacking mismatches
- **Target Errors**: Too many or too few targets for values
- **Type Errors**: Handled by setLValue function
- **Index Errors**: For array element assignments

### Design Benefits
- **Python Compatibility**: Familiar tuple unpacking syntax
- **Type Safety**: Proper type checking for all assignments
- **Flexibility**: Support for various iterable types
- **Efficiency**: Move semantics for value transfer

### Use Cases
- **Multiple Assignment**: `x, y = y, x` (swap)
- **Function Returns**: `a, b = getCoordinates()`
- **String Processing**: `first, second, third = "abc"`
- **Array Operations**: `head, *tail = array`

This function enables powerful assignment patterns including tuple unpacking and compound assignment, providing flexibility while maintaining type safety and proper error handling throughout the assignment process.
