# QuantumInstance Methods Explanation

## Complete Code

```cpp
QuantumValue QuantumInstance::getField(const std::string &name) const
{
    auto it = fields.find(name);
    if (it != fields.end())
        return it->second;
    // Check methods
    auto k = klass.get();
    while (k)
    {
        auto mit = k->methods.find(name);
        if (mit != k->methods.end())
            return QuantumValue(mit->second);
        k = k->base.get();
    }
    throw NameError("No field/method '" + name + "' on instance of " + klass->name);
}

void QuantumInstance::setField(const std::string &name, QuantumValue val)
{
    fields[name] = std::move(val);
}
```

## Line-by-Line Explanation

### getField() Method (Lines 194-209)

#### Method Signature
- **Line 194**: `QuantumValue QuantumInstance::getField(const std::string &name) const` - Get instance field or method
  - `name`: Field or method name to retrieve
  - Returns the field value or method as QuantumValue
  - `const` means this method doesn't modify the instance

#### Implementation
- **Line 195**: `{` - Opening brace
- **Line 196**: `auto it = fields.find(name);` - Look for field in instance fields map
- **Line 197**: `if (it != fields.end())` - If field found in instance
- **Line 198**: `return it->second;` - Return the field value
- **Line 199**: `// Check methods` - Comment about method lookup
- **Line 200**: `auto k = klass.get();` - Get pointer to the instance's class
- **Line 201**: `while (k)` - Loop through class hierarchy (inheritance)
- **Line 202**: `{` - Opening brace for inheritance loop
- **Line 203**: `auto mit = k->methods.find(name);` - Look for method in current class
- **Line 204**: `if (mit != k->methods.end())` - If method found in current class
- **Line 205**: `return QuantumValue(mit->second);` - Return method as QuantumValue
- **Line 206**: `k = k->base.get();` - Move to base class (inheritance)
- **Line 207**: `}` - Closing brace for inheritance loop
- **Line 208**: `throw NameError("No field/method '" + name + "' on instance of " + klass->name);` - Throw error if not found
- **Line 209**: `}` - Closing brace

### setField() Method (Lines 211-214)

#### Method Signature
- **Line 211**: `void QuantumInstance::setField(const std::string &name, QuantumValue val)` - Set instance field value
  - `name`: Field name to set
  - `val`: New field value

#### Implementation
- **Line 212**: `{` - Opening brace
- **Line 213**: `fields[name] = std::move(val);` - Store field value with efficient move semantics
- **Line 214**: `}` - Closing brace

## Summary

The QuantumInstance methods provide comprehensive field and method access for object instances:

### getField() Method Features
- **Instance Fields**: First checks instance-specific fields
- **Method Lookup**: Searches through class inheritance hierarchy
- **Polymorphism**: Supports inherited methods from base classes
- **Error Handling**: Descriptive error messages for missing members
- **Type Safety**: Returns QuantumValue for both fields and methods

### setField() Method Features
- **Simple Assignment**: Direct field value assignment
- **Efficient**: Uses move semantics for performance
- **Instance-Only**: Only affects instance fields, not class methods

### Search Order
1. **Instance Fields**: Check fields specific to this instance
2. **Instance Methods**: Check methods in the instance's class
3. **Inherited Methods**: Walk up inheritance chain to base classes
4. **Error**: Throw NameError if nothing found

### Inheritance Support
- **Method Inheritance**: Methods are inherited from base classes
- **Dynamic Dispatch**: Method lookup follows inheritance hierarchy
- **Class Walking**: Traverses from current class up to base classes

### Error Handling
- **NameError**: Thrown when field or method doesn't exist
- **Detailed Message**: Includes field name and class name for debugging
- **Runtime Safety**: Prevents access to non-existent members

### Use Cases
- **Property Access**: Getting and setting object properties
- **Method Invocation**: Accessing object methods (including inherited)
- **Object State**: Managing instance-specific data
- **Inheritance**: Supporting object-oriented programming patterns

These methods are essential for implementing object-oriented features in the Quantum Language, enabling proper encapsulation, inheritance, and polymorphism.
