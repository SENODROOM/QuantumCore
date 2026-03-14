# evalAddressOf() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalAddressOf(AddressOfExpr &e)
{
    // &var — returns a live shared pointer to the variable's cell
    if (e.operand->is<Identifier>())
    {
        auto &name = e.operand->as<Identifier>().name;
        auto cell = env->getCell(name);
        if (!cell)
            throw NameError("Undefined variable: '" + name + "'");
        return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));
    }

    // &obj.field — get address of field
    if (e.operand->is<MemberExpr>())
    {
        auto &member = e.operand->as<MemberExpr>();
        auto obj = evaluate(*member.object);
        if (obj.isPointer())
        {
            obj = obj.asPointer()->deref();
        }
        if (obj.isInstance())
        {
            auto instance = obj.asInstance();
            auto cell = instance->getFieldCell(member.member);
            return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));
        }
        throw TypeError("Cannot take address of field on " + obj.typeName());
    }

    // &ptr[index] — get address of array element
    if (e.operand->is<IndexExpr>())
    {
        auto &index = e.operand->as<IndexExpr>();
        auto obj = evaluate(*index.object);
        auto idx = evaluate(*index.index);
        if (obj.isPointer())
        {
            obj = obj.asPointer()->deref();
        }
        if (obj.isArray())
        {
            auto arr = obj.asArray();
            long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;
            if (i < 0 || i >= (long long)arr->size())
                throw IndexError("Array index out of bounds");
            auto cell = arr->getCell(i);
            return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));
        }
        throw TypeError("Cannot take address of index on " + obj.typeName());
    }

    throw TypeError("Cannot take address of expression");
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalAddressOf(AddressOfExpr &e)` - Evaluate address-of expressions
  - `e`: Reference to AddressOfExpr AST node
  - Returns QuantumValue containing a QuantumPointer

###
-  `{` - Opening brace
-  `// &var — returns a live shared pointer to the variable's cell` - Comment about variable addressing
-  `if (e.operand->is<Identifier>())` - Check if operand is identifier
-  `{` - Opening brace for identifier case
-  `auto &name = e.operand->as<Identifier>().name;` - Get variable name
-  `auto cell = env->getCell(name);` - Get variable's cell from environment
-  `if (!cell)` - Check if variable exists
-  `throw NameError("Undefined variable: '" + name + "'");` - Throw error for undefined variable
-  `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
-  `}` - Closing brace for identifier case

###
-  `// &obj.field — get address of field` - Comment about field addressing
-  `if (e.operand->is<MemberExpr>())` - Check if operand is member expression
-  `{` - Opening brace for member case
-  `auto &member = e.operand->as<MemberExpr>();` - Get member expression
-  `auto obj = evaluate(*member.object);` - Evaluate object expression
-  `if (obj.isPointer())` - Check if object is a pointer
-  `{` - Opening brace for pointer handling
-  `obj = obj.asPointer()->deref();` - Dereference pointer
-  `}` - Closing brace for pointer handling
-  `if (obj.isInstance())` - Check if object is instance
-  `{` - Opening brace for instance case
-  `auto instance = obj.asInstance();` - Get instance object
-  `auto cell = instance->getFieldCell(member.member);` - Get field's cell
-  `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
-  `}` - Closing brace for instance case
-  `throw TypeError("Cannot take address of field on " + obj.typeName());` - Error for non-instance
-  `}` - Closing brace for member case

###
-  `// &ptr[index] — get address of array element` - Comment about array element addressing
-  `if (e.operand->is<IndexExpr>())` - Check if operand is index expression
-  `{` - Opening brace for index case
-  `auto &index = e.operand->as<IndexExpr>();` - Get index expression
-  `auto obj = evaluate(*index.object);` - Evaluate object expression
-  `auto idx = evaluate(*index.index);` - Evaluate index expression
-  `if (obj.isPointer())` - Check if object is a pointer
-  `{` - Opening brace for pointer handling
-  `obj = obj.asPointer()->deref();` - Dereference pointer
-  `}` - Closing brace for pointer handling
-  `if (obj.isArray())` - Check if object is array
-  `{` - Opening brace for array case
-  `auto arr = obj.asArray();` - Get array object
-  `long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;` - Convert index to integer
-  `if (i < 0 || i >= (long long)arr->size())` - Check bounds
-  `throw IndexError("Array index out of bounds");` - Throw error for out of bounds
-  `auto cell = arr->getCell(i);` - Get array element's cell
-  `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
-  `}` - Closing brace for array case
-  `throw TypeError("Cannot take address of index on " + obj.typeName());` - Error for non-array
-  `}` - Closing brace for index case

###
-  `throw TypeError("Cannot take address of expression");` - Default error case
-  `}` - Closing brace for function

## Summary

The `evalAddressOf()` function implements C-style address-of operator (`&`) for the Quantum Language:

### Key Features
- **Variable Addresses**: Get pointers to variables in the current scope
- **Field Addresses**: Get pointers to object fields
- **Array Element Addresses**: Get pointers to array elements
- **Live Pointers**: Pointers reference actual variable cells for live updates

### Address Types Supported
- **Variables**: `&variable` creates pointer to variable storage
- **Object Fields**: `&object.field` creates pointer to field storage
- **Array Elements**: `&array[index]` creates pointer to element storage

### Pointer Creation Process
1. **Type Detection**: Determine what type of address operation
2. **Object Evaluation**: Evaluate the object being addressed
3. **Cell Retrieval**: Get the storage cell for the target
4. **Pointer Creation**: Create QuantumPointer with cell and offset
5. **Return Value**: Wrap pointer in QuantumValue

### Memory Management
- **Shared Pointers**: Use std::shared_ptr for automatic cleanup
- **Live References**: Pointers reference actual storage cells
- **Offset Support**: Zero offset for direct addressing
- **Type Safety**: Proper type checking for all address operations

### Error Handling
- **NameError**: Thrown for undefined variables
- **TypeError**: Thrown for invalid address operations
- **IndexError**: Thrown for array bounds violations
- **Field Errors**: Thrown for missing object fields

### Design Benefits
- **C Compatibility**: Mirrors C-style pointer semantics
- **Live Updates**: Changes through pointers affect original values
- **Memory Safety**: Smart pointers prevent memory leaks
- **Type Safety**: Comprehensive type checking prevents errors

### Use Cases
- **Pass-by-Reference**: Function parameters can be modified
- **Data Structures**: Implement linked lists and trees
- **Performance**: Avoid copying large objects
- **Interoperability**: C-style pointer operations

This function enables C-style pointer operations in the Quantum Language, providing low-level memory access while maintaining safety through smart pointers and comprehensive type checking.
