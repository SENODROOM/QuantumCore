# evalCall() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::evalCall(CallExpr &e)
{
    // Special: method call via MemberExpr callee
    if (e.callee->is<MemberExpr>())
    {
        auto &member = e.callee->as<MemberExpr>();
        auto obj = evaluate(*member.object);
        if (obj.isPointer())
        {
            obj = obj.asPointer()->deref();
        }
        if (obj.isInstance())
        {
            auto methodName = member.member;
            auto method = obj.asInstance()->getField(methodName);
            if (method.isFunction())
            {
                auto fn = method.asFunction();
                std::vector<QuantumValue> args;
                args.reserve(e.arguments.size());
                for (auto &arg : e.arguments)
                    args.push_back(evaluate(*arg));
                return callInstanceMethod(obj.asInstance(), fn, std::move(args));
            }
        }
    }

    auto callee = evaluate(*e.callee);
    std::vector<QuantumValue> args;
    args.reserve(e.arguments.size());
    for (auto &arg : e.arguments)
        args.push_back(evaluate(*arg));

    if (callee.isFunction())
        return callFunction(callee.asFunction(), std::move(args));
    if (callee.isNative())
        return callNative(callee.asNative(), std::move(args));
    if (callee.isClass())
    {
        auto klass = callee.asClass();
        auto instance = std::make_shared<QuantumInstance>(klass);
        // Call constructor if exists
        auto ctor = klass->findMethod("<init>");
        if (ctor)
            callInstanceMethod(instance, ctor, std::move(args));
        return QuantumValue(instance);
    }

    throw TypeError("Cannot call " + callee.typeName());
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::evalCall(CallExpr &e)` - Evaluate function calls
  - `e`: Reference to CallExpr AST node
  - Returns QuantumValue result of the function call

###
-  `{` - Opening brace
-  `// Special: method call via MemberExpr callee` - Comment about method calls
-  `if (e.callee->is<MemberExpr>())` - Check if callee is member expression
-  `{` - Opening brace for method call
-  `auto &member = e.callee->as<MemberExpr>();` - Get member expression
-  `auto obj = evaluate(*member.object);` - Evaluate object expression
-  `if (obj.isPointer())` - Check if object is a pointer

###
-  `{` - Opening brace for pointer handling
-  `obj = obj.asPointer()->deref();` - Dereference pointer
-  `}` - Closing brace for pointer handling
-  `if (obj.isInstance())` - Check if object is instance
-  `{` - Opening brace for instance handling
-  `auto methodName = member.member;` - Get method name
-  `auto method = obj.asInstance()->getField(methodName);` - Get method from instance

###
-  `if (method.isFunction())` - Check if field is a function
-  `{` - Opening brace for method call
-  `auto fn = method.asFunction();` - Get function object
-  `std::vector<QuantumValue> args;` - Create arguments vector
-  `args.reserve(e.arguments.size());` - Reserve space for arguments
-  `for (auto &arg : e.arguments)` - Loop through arguments
-  `args.push_back(evaluate(*arg));` - Evaluate and add argument
-  `return callInstanceMethod(obj.asInstance(), fn, std::move(args));` - Call instance method
-  `}` - Closing brace for method call
-  `}` - Closing brace for instance handling

###
-  `}` - Closing brace for method call
-  Empty line for readability
-  `auto callee = evaluate(*e.callee);` - Evaluate callee expression
-  `std::vector<QuantumValue> args;` - Create arguments vector
-  `args.reserve(e.arguments.size());` - Reserve space for arguments
-  `for (auto &arg : e.arguments)` - Loop through arguments
-  `args.push_back(evaluate(*arg));` - Evaluate and add argument
-  Empty line for readability

###
-  `if (callee.isFunction())` - Check if callee is user function
-  `return callFunction(callee.asFunction(), std::move(args));` - Call user function
-  `if (callee.isNative())` - Check if callee is native function
-  `return callNative(callee.asNative(), std::move(args));` - Call native function
-  `if (callee.isClass())` - Check if callee is class
-  `{` - Opening brace for class constructor

###
-  `auto klass = callee.asClass();` - Get class object
-  `auto instance = std::make_shared<QuantumInstance>(klass);` - Create instance
-  `// Call constructor if exists` - Comment about constructor
-  `auto ctor = klass->findMethod("<init>");` - Find constructor method
-  `if (ctor)` - Check if constructor exists
-  `callInstanceMethod(instance, ctor, std::move(args));` - Call constructor
-  `return QuantumValue(instance);` - Return new instance
-  `}` - Closing brace for class constructor

###
-  `throw TypeError("Cannot call " + callee.typeName());` - Throw error for non-callable types
-  `}` - Closing brace for function

## Summary

The `evalCall()` function handles all function and method calls in the Quantum Language:

### Key Features
- **Method Calls**: Special handling for instance method calls via MemberExpr
- **Pointer Support**: Automatic dereferencing of pointer objects
- **Multiple Call Types**: User functions, native functions, and class constructors
- **Argument Evaluation**: Proper evaluation of all arguments before calling

### Call Types Handled
- **Instance Methods**: `obj.method(args)` syntax
- **User Functions**: Regular function calls
- **Native Functions**: Built-in language functions
- **Class Constructors**: `ClassName(args)` creates instances

### Method Call Process
1. **Detection**: Identify MemberExpr callee
2. **Object Evaluation**: Evaluate the object expression
3. **Pointer Handling**: Dereference if object is a pointer
4. **Method Lookup**: Find method in instance or class hierarchy
5. **Argument Evaluation**: Evaluate all arguments
6. **Method Execution**: Call with proper instance binding

### Regular Function Call Process
1. **Callee Evaluation**: Evaluate the function expression
2. **Argument Evaluation**: Evaluate all arguments
3. **Type Dispatch**: Determine function type (user/native/class)
4. **Execution**: Call appropriate function handler

### Constructor Process
1. **Instance Creation**: Create new QuantumInstance
2. **Constructor Lookup**: Find `<init>` method
3. **Constructor Call**: Call constructor with arguments
4. **Return Instance**: Return new instance value

### Design Benefits
- **Object-Oriented**: Proper method binding and inheritance support
- **Pointer Integration**: Seamless pointer-to-object dereferencing
- **Type Safety**: Comprehensive type checking for callable objects
- **Efficiency**: Move semantics for argument vectors

### Error Handling
- **TypeError**: Thrown when attempting to call non-callable types
- **Method Resolution**: Proper error handling for missing methods
- **Argument Errors**: Handled by individual function callers

This function provides the foundation for all function and method calls in the Quantum Language, supporting object-oriented programming, native functions, and class instantiation with proper type safety and memory management.
