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

## Line-by-Line Explanation

### Function Signature (Line 3376)
- **Line 3376**: `QuantumValue Interpreter::evalAssign(AssignExpr &e)` - Evaluate assignment expressions
  - `e`: Reference to AssignExpr AST node
  - Returns QuantumValue result of the assignment

### Tuple Unpacking Detection (Lines 3377-3380)
- **Line 3377**: `{` - Opening brace
- **Line 3378**: `// Tuple unpacking: a, b, c = someIterable` - Comment about unpacking
- **Line 3379**: `if (e.op == "unpack")` - Check if this is unpacking assignment
- **Line 3380**: `{` - Opening brace for unpacking

### Iterable Evaluation (Lines 3381-3386)
- **Line 3381**: `auto iterable = evaluate(*e.right);` - Evaluate the right-hand side
- **Line 3382**: `std::vector<QuantumValue> items;` - Create vector for unpacked items
- **Line 3383**: Empty line for readability
- **Line 3384**: `if (iterable.isArray())` - Check if iterable is array
- **Line 3385**: `{` - Opening brace for array case
- **Line 3386**: `items = iterable.asArray()->elements;` - Copy array elements

### String Iteration (Lines 3387-3391)
- **Line 3387**: `}` - Closing brace for array case
- **Line 3388**: `else if (iterable.isString())` - Check if iterable is string
- **Line 3389**: `{` - Opening brace for string case
- **Line 3390**: `for (char ch : iterable.asString())` - Loop through string characters
- **Line 3391**: `items.push_back(QuantumValue(std::string(1, ch)));` - Add each character as string

### Generic Iteration (Lines 3392-3400)
- **Line 3392**: `}` - Closing brace for string case
- **Line 3393**: `else` - Generic iterable case
- **Line 3394**: `{` - Opening brace for generic case
- **Line 3395**: `// Try to iterate over the object` - Comment about iteration
- **Line 3396**: `auto it = iterable.begin();` - Get iterator begin
- **Line 3397**: `auto end = iterable.end();` - Get iterator end
- **Line 3398**: `for (; it != end; ++it)` - Loop through iterator
- **Line 3399**: `items.push_back(*it);` - Add each item
- **Line 3400**: `}` - Closing brace for generic case

### Unpacking Assignment (Lines 3401-3410)
- **Line 3401**: Empty line for readability
- **Line 3402**: `size_t i = 0;` - Initialize index counter
- **Line 3403**: `for (auto &target : e.left)` - Loop through assignment targets
- **Line 3404**: `{` - Opening brace for target loop
- **Line 3405**: `if (i >= items.size())` - Check if too many targets
- **Line 3406**: `throw RuntimeError("Too many targets in unpacking");` - Throw error
- **Line 3407**: `setLValue(*target, items[i], "=");` - Assign value to target
- **Line 3408**: `i++;` - Increment index
- **Line 3409**: `}` - Closing brace for target loop

### Unpacking Validation (Lines 3411-3416)
- **Line 3410**: Empty line for readability
- **Line 3411**: `if (i < items.size())` - Check if too few values
- **Line 3412**: `throw RuntimeError("Too few values in unpacking");` - Throw error
- **Line 3413**: `return iterable;` - Return the original iterable
- **Line 3414**: `}` - Closing brace for unpacking
- **Line 3415**: Empty line for readability

### Regular Assignment (Lines 3416-3420)
- **Line 3416**: `auto value = evaluate(*e.right);` - Evaluate right-hand side
- **Line 3417**: `setLValue(*e.left, value, e.op);` - Perform the assignment
- **Line 3418**: `return value;` - Return assigned value
- **Line 3419**: `}` - Closing brace for function

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
