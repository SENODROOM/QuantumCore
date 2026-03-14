# evalArrow() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalArrow(ArrowExpr &e)
{
    // ptr->member — dereference pointer then access member
    auto ptrVal = evaluate(*e.object);
    if (!ptrVal.isPointer())
        throw TypeError("Cannot use -> on non-pointer: " + ptrVal.typeName());
    
    auto ptr = ptrVal.asPointer();
    auto cell = ptr->deref();
    if (!cell)
        throw RuntimeError("Dereferencing null pointer");
    
    auto obj = *cell;
    if (obj.isInstance())
    {
        return obj.asInstance()->getField(e.member);
    }
    throw RuntimeError("Cannot use -> on type " + obj.typeName());
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalArrow(ArrowExpr &e)` - Evaluate arrow operator expressions
  - `e`: Reference to ArrowExpr AST node
  - Returns QuantumValue result of arrow operation

###
-  `{` - Opening brace
-  `// ptr->member — dereference pointer then access member` - Comment about arrow operator
-  `auto ptrVal = evaluate(*e.object);` - Evaluate pointer expression
-  `if (!ptrVal.isPointer())` - Check if result is pointer
-  `throw TypeError("Cannot use -> on non-pointer: " + ptrVal.typeName());` - Error for non-pointer

###
-  Empty line for readability
-  `auto ptr = ptrVal.asPointer();` - Get pointer object
-  `auto cell = ptr->deref();` - Dereference pointer to get cell
-  `if (!cell)` - Check if pointer is null
-  `throw RuntimeError("Dereferencing null pointer");` - Error for null pointer
-  `auto obj = *cell;` - Get object from cell

###
-  Empty line for readability
-  `if (obj.isInstance())` - Check if object is instance
-  `{` - Opening brace for instance case
-  `return obj.asInstance()->getField(e.member);` - Return instance field
-  `}` - Closing brace for instance case
-  `throw RuntimeError("Cannot use -> on type " + obj.typeName());` - Error for non-instance types
-  `}` - Closing brace for function

## Summary

The `evalArrow()` function handles arrow operator expressions for pointer member access in the Quantum Language:

### Key Features
- **Pointer Dereference**: Automatically dereferences pointer before member access
- **Type Safety**: Validates pointer type and target object type
- **Null Pointer Check**: Prevents dereferencing null pointers
- **Instance Member Access**: Accesses fields on object instances

### Arrow Operation Process
1. **Pointer Evaluation**: Evaluate the pointer expression
2. **Type Validation**: Ensure operand is a pointer type
3. **Pointer Access**: Get the QuantumPointer object
4. **Cell Dereference**: Get the memory cell pointer points to
5. **Null Check**: Verify pointer is not null
6. **Object Access**: Get the object from the cell
7. **Member Access**: Access the specified member on the object

### Arrow Operator Semantics
- **C-Style**: Mirrors C++ arrow operator behavior
- **Automatic Dereference**: Combines dereferencing and member access
- **Instance Only**: Only works on object instances
- **Field Access**: Accesses instance fields and properties

### Type Requirements
- **Pointer Type**: Left operand must be a QuantumPointer
- **Instance Target**: Pointer must point to object instance
- **Valid Member**: Member name must exist on instance
- **Non-Null**: Pointer cannot be null

### Error Conditions
- **Non-Pointer**: TypeError when left operand is not a pointer
- **Null Pointer**: RuntimeError when pointer is null
- **Non-Instance**: RuntimeError when pointer doesn't point to instance
- **Missing Member**: RuntimeError when member doesn't exist

### Design Benefits
- **C Compatibility**: Familiar C++ arrow operator syntax
- **Type Safety**: Comprehensive type checking
- **Memory Safety**: Null pointer protection
- **Convenience**: Combines dereferencing and member access

### Use Cases
- **Object Pointers**: `ptr->field` - access object field through pointer
- **Method Access**: `ptr->method()` - call method through pointer
- **Data Structures**: Access nested object fields
- **API Integration**: Work with C-style APIs

### Integration with Other Components
- **Pointer System**: Uses QuantumPointer for memory management
- **Instance System**: Uses QuantumInstance for field access
- **Error System**: Uses TypeError and RuntimeError
- **Expression System**: Integrates with expression evaluation

### Performance Characteristics
- **Combined Operation**: Single operation for dereference + access
- **Direct Access**: O(1) member access after dereference
- **Type Check**: Minimal overhead for type validation
- **Memory Access**: Direct memory cell access

### Arrow Examples
- **Simple Access**: `ptr->name` - access name field
- **Method Call**: `ptr->method()` - call method through pointer
- **Nested Access**: `ptr->nested->field` - chained access
- **Error Cases**: `non_ptr->field` - throws TypeError

### Memory Safety
- **Null Protection**: Prevents null pointer dereferencing
- **Type Validation**: Ensures proper pointer types
- **Instance Validation**: Verifies target is object instance
- **Member Validation**: Checks member existence

### Error Messages
- **Non-Pointer**: "Cannot use -> on non-pointer: type"
- **Null Pointer**: "Dereferencing null pointer"
- **Non-Instance**: "Cannot use -> on type type"
- **Missing Member**: "No member 'member' on type"

### Comparison with Other Operators
- **Dereference + Member**: `(*ptr).field` - equivalent to `ptr->field`
- **Member Access**: `obj.field` - direct access without pointer
- **Address-Of**: `&obj.field` - get pointer to member
- **Arrow vs Dot**: Arrow for pointers, dot for objects

This function provides the foundation for pointer member access in the Quantum Language, enabling C-style arrow operator semantics while maintaining proper type safety and memory protection throughout the pointer dereferencing and member access process.
