# evalNewExpr() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalNewExpr(NewExpr &e)
{
    static const std::unordered_set<std::string> primitives = {
        "int", "long", "short", "unsigned", "float", "double", "char", "bool"};
    
    std::string typeName = e.type;
    if (primitives.count(typeName))
    {
        // Create primitive value with default initialization
        if (typeName == "int" || typeName == "long" || typeName == "short" || typeName == "unsigned")
            return QuantumValue(0LL);
        if (typeName == "float" || typeName == "double")
            return QuantumValue(0.0);
        if (typeName == "char")
            return QuantumValue(std::string(1, '\0'));
        if (typeName == "bool")
            return QuantumValue(false);
    }
    
    // Treat as class instantiation
    auto klassVal = evaluate(*e.typeExpr);
    if (!klassVal.isClass())
        throw TypeError("Cannot instantiate non-class: " + klassVal.typeName());
    
    auto klass = klassVal.asClass();
    auto instance = std::make_shared<QuantumInstance>(klass);
    
    // Call constructor if exists
    auto ctor = klass->findMethod("<init>");
    if (ctor)
    {
        std::vector<QuantumValue> args;
        args.reserve(e.arguments.size());
        for (auto &arg : e.arguments)
            args.push_back(evaluate(*arg));
        callInstanceMethod(instance, ctor, std::move(args));
    }
    
    return QuantumValue(instance);
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalNewExpr(NewExpr &e)` - Evaluate new expressions
  - `e`: Reference to NewExpr AST node
  - Returns QuantumValue containing the created object

###
-  `{` - Opening brace
-  `static const std::unordered_set<std::string> primitives = {` - Define primitive types set
-  `"int", "long", "short", "unsigned", "float", "double", "char", "bool"};` - C++ primitive types
-  Empty line for readability

###
-  `std::string typeName = e.type;` - Get type name from expression

###
-  `if (primitives.count(typeName))` - Check if type is primitive
-  `{` - Opening brace for primitive case
-  `// Create primitive value with default initialization` - Comment about primitive creation
-  `if (typeName == "int" || typeName == "long" || typeName == "short" || typeName == "unsigned")` - Integer types
-  `return QuantumValue(0LL);` - Return zero integer
-  `if (typeName == "float" || typeName == "double")` - Float types
-  `return QuantumValue(0.0);` - Return zero float
-  `if (typeName == "char")` - Character type
-  `return QuantumValue(std::string(1, '\0'));` - Return null character
-  `if (typeName == "bool")` - Boolean type
-  `return QuantumValue(false);` - Return false
-  `}` - Closing brace for primitive case

###
-  Empty line for readability
-  `// Treat as class instantiation` - Comment about class creation
-  `auto klassVal = evaluate(*e.typeExpr);` - Evaluate class expression
-  `if (!klassVal.isClass())` - Check if result is class

###
-  `throw TypeError("Cannot instantiate non-class: " + klassVal.typeName());` - Error for non-class
-  Empty line for readability
-  `auto klass = klassVal.asClass();` - Get class object

###
-  `auto instance = std::make_shared<QuantumInstance>(klass);` - Create instance object
-  Empty line for readability
-  `// Call constructor if exists` - Comment about constructor call
-  `auto ctor = klass->findMethod("<init>");` - Find constructor method
-  `if (ctor)` - Check if constructor exists

###
-  `{` - Opening brace for constructor case
-  `std::vector<QuantumValue> args;` - Create arguments vector
-  `args.reserve(e.arguments.size());` - Reserve space for arguments
-  `for (auto &arg : e.arguments)` - Loop through arguments
-  `args.push_back(evaluate(*arg));` - Evaluate and add argument
-  `callInstanceMethod(instance, ctor, std::move(args));` - Call constructor
-  `}` - Closing brace for constructor case
-  Empty line for readability
-  `return QuantumValue(instance);` - Return instance value
-  `}` - Closing brace for function

## Summary

The `evalNewExpr()` function handles object creation with both primitive types and class instantiation in the Quantum Language:

### Key Features
- **Primitive Types**: Creates default-initialized primitive values
- **Class Instantiation**: Creates object instances with constructor calls
- **Constructor Support**: Automatically calls class constructors if they exist
- **Type Safety**: Validates type expressions before instantiation

### New Expression Types
- **Primitive Creation**: `new int` - creates primitive values
- **Class Instantiation**: `new ClassName(args)` - creates object instances
- **Constructor Calls**: `new Person("John", 25)` - calls constructors
- **Default Initialization**: Primitives get default values

### Primitive Type Handling
- **Integer Types**: int, long, short, unsigned → 0
- **Float Types**: float, double → 0.0
- **Character Type**: char → '\0' (null character)
- **Boolean Type**: bool → false

### Class Instantiation Process
1. **Type Evaluation**: Evaluate the class expression
2. **Type Validation**: Ensure result is a class type
3. **Instance Creation**: Create QuantumInstance object
4. **Constructor Lookup**: Find constructor method
5. **Argument Evaluation**: Evaluate constructor arguments
6. **Constructor Call**: Call constructor with arguments
7. **Instance Return**: Return created instance

### Constructor Support
- **Constructor Name**: `<init>` method name for constructors
- **Argument Passing**: Supports constructor arguments
- **Optional Constructor**: No error if constructor doesn't exist
- **Instance Binding**: Constructor called with proper instance binding

### Design Benefits
- **C Compatibility**: Familiar C++ new operator syntax
- **Type Safety**: Comprehensive type checking
- **Object-Oriented**: Proper constructor semantics
- **Memory Management**: Smart pointers for instance lifecycle

### Use Cases
- **Primitive Creation**: `new int` for primitive values
- **Object Creation**: `new Person()` for object instances
- **Constructor Arguments**: `new Person("John", 25)` with parameters
- **Complex Objects**: `new ComplexObject(arg1, arg2)`

### Integration with Other Components
- **Class System**: Uses QuantumClass for type information
- **Instance System**: Uses QuantumInstance for objects
- **Constructor System**: Uses `<init>` method for constructors
- **Method System**: Uses callInstanceMethod for constructor calls

### Performance Characteristics
- **Primitive Creation**: O(1) primitive value creation
- **Instance Creation**: O(1) instance object creation
- **Constructor Call**: O(n) where n is constructor complexity
- **Memory Management**: Automatic cleanup through shared pointers

### New Expression Examples
- **Primitive**: `new int` → `0`
- **Float**: `new double` → `0.0`
- **Character**: `new char` → `'\0'`
- **Boolean**: `new bool` → `false`
- **Class**: `new Person()` → Person instance
- **With Args**: `new Person("John", 25)` → constructed instance

### Error Handling
- **Type Errors**: TypeError for non-class instantiation
- **Constructor Errors**: Errors in constructor evaluation propagate
- **Argument Errors**: Errors in argument evaluation propagate
- **Memory Errors**: Handled by smart pointer system

### Memory Management
- **Shared Pointers**: Instances use std::shared_ptr
- **Automatic Cleanup**: Memory freed when no references remain
- **Reference Counting**: Tracks instance usage
- **Constructor Safety**: Proper cleanup if constructor fails

### Constructor Semantics
- **Method Name**: `<init>` for constructor identification
- **Instance Binding**: Constructor called with instance as `this`
- **Argument Passing**: Standard argument passing semantics
- **Return Value**: Constructor returns the instance

This function provides the foundation for object creation in the Quantum Language, enabling both primitive value creation and class instantiation with proper constructor support while maintaining type safety and memory management throughout the object creation process.
