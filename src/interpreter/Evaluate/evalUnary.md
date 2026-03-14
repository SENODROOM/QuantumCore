# evalUnary() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalUnary(UnaryExpr &e)
{
    auto v = evaluate(*e.operand);
    if (e.op == "-")
        return QuantumValue(-v.toNum("unary -"));
    if (e.op == "!")
        return QuantumValue(!v.isTruthy());
    if (e.op == "~")
        return QuantumValue(~(long long)v.toNum("unary ~"));
    if (e.op == "++")
    {
        setLValue(*e.operand, v + 1, "=");
        return v;
    }
    if (e.op == "--")
    {
        setLValue(*e.operand, v - 1, "=");
        return v;
    }
    throw RuntimeError("Unknown unary op: " + e.op);
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalUnary(UnaryExpr &e)` - Evaluate unary expressions
  - `e`: Reference to UnaryExpr AST node
  - Returns QuantumValue result of unary operation

###
-  `{` - Opening brace
-  `auto v = evaluate(*e.operand);` - Evaluate operand expression

###
-  `if (e.op == "-")` - Check for negation operator
-  `return QuantumValue(-v.toNum("unary -"));` - Return numeric negation
-  Empty line for readability

###
-  `if (e.op == "!")` - Check for logical not operator
-  `return QuantumValue(!v.isTruthy());` - Return logical negation
-  Empty line for readability

###
-  `if (e.op == "~")` - Check for bitwise not operator
-  `return QuantumValue(~(long long)v.toNum("unary ~"));` - Return bitwise complement
-  Empty line for readability

###
-  `if (e.op == "++")` - Check for pre-increment operator
-  `{` - Opening brace for increment
-  `setLValue(*e.operand, v + 1, "=");` - Increment operand and assign
-  `return v;` - Return original value (pre-increment semantics)
-  `}` - Closing brace for increment
-  Empty line for readability

###
-  `if (e.op == "--")` - Check for pre-decrement operator
-  `{` - Opening brace for decrement
-  `setLValue(*e.operand, v - 1, "=");` - Decrement operand and assign
-  `return v;` - Return original value (pre-decrement semantics)
-  `}` - Closing brace for decrement
-  Empty line for readability

###
-  `throw RuntimeError("Unknown unary op: " + e.op);` - Throw error for unknown operator
-  `}` - Closing brace for function

## Summary

The `evalUnary()` function handles all unary operations in the Quantum Language:

### Key Features
- **Multiple Operators**: Supports arithmetic, logical, bitwise, and increment/decrement
- **Type Safety**: Proper type conversion and validation
- **Side Effects**: Increment/decrement operators modify operands
- **Error Handling**: Clear error messages for unknown operators

### Unary Operators Supported
- **Negation**: `-value` - numeric negation
- **Logical Not**: `!value` - truthiness negation
- **Bitwise Not**: `~value` - bitwise complement
- **Pre-increment**: `++value` - increment and return original
- **Pre-decrement**: `--value` - decrement and return original

### Operator Semantics
- **Arithmetic Negation**: Converts to number and negates
- **Logical Not**: Uses truthiness rules for negation
- **Bitwise Not**: Converts to integer and complements bits
- **Increment/Decrement**: Modifies variable and returns original value

### Type Conversion
- **Numeric Operations**: Convert operands to numbers
- **Logical Operations**: Use truthiness without conversion
- **Bitwise Operations**: Convert to integer for bit manipulation
- **Type Safety**: Proper error handling for invalid types

### Side Effect Handling
- **L-Value Assignment**: Uses setLValue for variable modification
- **Original Value Return**: Pre-increment/decrement return original value
- **Variable Update**: Variables are updated in-place
- **Scope Awareness**: Operates on variables in current scope

### Design Benefits
- **Comprehensive**: Covers all common unary operators
- **Type Safe**: Proper conversion and validation
- **Correct Semantics**: Follows language specification
- **Efficient**: Minimal overhead for operations

### Use Cases
- **Mathematical Operations**: `-x` for negation
- **Boolean Logic**: `!condition` for logical negation
- **Bit Manipulation**: `~mask` for bitwise complement
- **Variable Updates**: `++counter`, `--index` for increment/decrement

### Integration with Other Components
- **setLValue Function**: Used for variable modification
- **toNum Method**: Converts values to numbers
- **isTruthy Method**: Determines truthiness
- **Environment System**: Variables accessed through environment

### Performance Characteristics
- **Single Evaluation**: Operand evaluated once
- **Direct Operations**: Minimal overhead for simple operations
- **Type Conversion**: Efficient conversion when needed
- **Memory Efficient**: No unnecessary allocations

### Operator Examples
- **Negation**: `-5` → `5`, `-3.14` → `3.14`
- **Logical Not**: `!true` → `false`, `!0` → `true`
- **Bitwise Not**: `~5` → `-6`, `~0xFF` → `0x00`
- **Increment**: `++x` increments x, returns old value
- **Decrement**: `--x` decrements x, returns old value

### Error Handling
- **Type Errors**: Handled by toNum conversion
- **Unknown Operators**: RuntimeError with operator name
- **Variable Errors**: setLValue handles assignment errors
- **Conversion Errors**: Descriptive error messages

This function provides the foundation for unary operations in the Quantum Language, enabling mathematical, logical, and bitwise operations while maintaining proper type safety and side effect handling for increment/decrement operators.
