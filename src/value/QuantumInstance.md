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

## Code Explanation

###

#### Method Signature
-  `QuantumValue QuantumInstance::getField(const std::string &name) const` - Get instance field or method
  - `name`: Field or method name to retrieve
  - Returns the field value or method as QuantumValue
  - `const` means this method doesn't modify the instance

#### Implementation
-  `{` - Opening brace
-  `auto it = fields.find(name);` - Look for field in instance fields map
-  `if (it != fields.end())` - If field found in instance
-  `return it->second;` - Return the field value
-  `// Check methods` - Comment about method lookup
-  `auto k = klass.get();` - Get pointer to the instance's class
-  `while (k)` - Loop through class hierarchy (inheritance)
-  `{` - Opening brace for inheritance loop
-  `auto mit = k->methods.find(name);` - Look for method in current class
-  `if (mit != k->methods.end())` - If method found in current class
-  `return QuantumValue(mit->second);` - Return method as QuantumValue
-  `k = k->base.get();` - Move to base class (inheritance)
-  `}` - Closing brace for inheritance loop
-  `throw NameError("No field/method '" + name + "' on instance of " + klass->name);` - Throw error if not found
-  `}` - Closing brace

###

#### Method Signature
-  `void QuantumInstance::setField(const std::string &name, QuantumValue val)` - Set instance field value
  - `name`: Field name to set
  - `val`: New field value

#### Implementation
-  `{` - Opening brace
-  `fields[name] = std::move(val);` - Store field value with efficient move semantics
-  `}` - Closing brace

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
