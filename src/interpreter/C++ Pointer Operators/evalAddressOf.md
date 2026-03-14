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

## Line-by-Line Explanation

### Function Signature (Line 4128)
- **Line 4128**: `QuantumValue Interpreter::evalAddressOf(AddressOfExpr &e)` - Evaluate address-of expressions
  - `e`: Reference to AddressOfExpr AST node
  - Returns QuantumValue containing a QuantumPointer

### Variable Address (Lines 4129-4138)
- **Line 4129**: `{` - Opening brace
- **Line 4130**: `// &var — returns a live shared pointer to the variable's cell` - Comment about variable addressing
- **Line 4131**: `if (e.operand->is<Identifier>())` - Check if operand is identifier
- **Line 4132**: `{` - Opening brace for identifier case
- **Line 4133**: `auto &name = e.operand->as<Identifier>().name;` - Get variable name
- **Line 4134**: `auto cell = env->getCell(name);` - Get variable's cell from environment
- **Line 4135**: `if (!cell)` - Check if variable exists
- **Line 4136**: `throw NameError("Undefined variable: '" + name + "'");` - Throw error for undefined variable
- **Line 4137**: `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
- **Line 4138**: `}` - Closing brace for identifier case

### Field Address (Lines 4139-4155)
- **Line 4139**: `// &obj.field — get address of field` - Comment about field addressing
- **Line 4140**: `if (e.operand->is<MemberExpr>())` - Check if operand is member expression
- **Line 4141**: `{` - Opening brace for member case
- **Line 4142**: `auto &member = e.operand->as<MemberExpr>();` - Get member expression
- **Line 4143**: `auto obj = evaluate(*member.object);` - Evaluate object expression
- **Line 4144**: `if (obj.isPointer())` - Check if object is a pointer
- **Line 4145**: `{` - Opening brace for pointer handling
- **Line 4146**: `obj = obj.asPointer()->deref();` - Dereference pointer
- **Line 4147**: `}` - Closing brace for pointer handling
- **Line 4148**: `if (obj.isInstance())` - Check if object is instance
- **Line 4149**: `{` - Opening brace for instance case
- **Line 4150**: `auto instance = obj.asInstance();` - Get instance object
- **Line 4151**: `auto cell = instance->getFieldCell(member.member);` - Get field's cell
- **Line 4152**: `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
- **Line 4153**: `}` - Closing brace for instance case
- **Line 4154**: `throw TypeError("Cannot take address of field on " + obj.typeName());` - Error for non-instance
- **Line 4155**: `}` - Closing brace for member case

### Array Element Address (Lines 4156-4177)
- **Line 4156**: `// &ptr[index] — get address of array element` - Comment about array element addressing
- **Line 4157**: `if (e.operand->is<IndexExpr>())` - Check if operand is index expression
- **Line 4158**: `{` - Opening brace for index case
- **Line 4159**: `auto &index = e.operand->as<IndexExpr>();` - Get index expression
- **Line 4160**: `auto obj = evaluate(*index.object);` - Evaluate object expression
- **Line 4161**: `auto idx = evaluate(*index.index);` - Evaluate index expression
- **Line 4162**: `if (obj.isPointer())` - Check if object is a pointer
- **Line 4163**: `{` - Opening brace for pointer handling
- **Line 4164**: `obj = obj.asPointer()->deref();` - Dereference pointer
- **Line 4165**: `}` - Closing brace for pointer handling
- **Line 4166**: `if (obj.isArray())` - Check if object is array
- **Line 4167**: `{` - Opening brace for array case
- **Line 4168**: `auto arr = obj.asArray();` - Get array object
- **Line 4169**: `long long i = idx.isNumber() ? (long long)idx.asNumber() : 0;` - Convert index to integer
- **Line 4170**: `if (i < 0 || i >= (long long)arr->size())` - Check bounds
- **Line 4171**: `throw IndexError("Array index out of bounds");` - Throw error for out of bounds
- **Line 4172**: `auto cell = arr->getCell(i);` - Get array element's cell
- **Line 4173**: `return QuantumValue(std::make_shared<QuantumPointer>(cell, 0));` - Create and return pointer
- **Line 4174**: `}` - Closing brace for array case
- **Line 4175**: `throw TypeError("Cannot take address of index on " + obj.typeName());` - Error for non-array
- **Line 4176**: `}` - Closing brace for index case

### Error Handling (Lines 4177-4179)
- **Line 4177**: `throw TypeError("Cannot take address of expression");` - Default error case
- **Line 4178**: `}` - Closing brace for function

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
