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

## Line-by-Line Explanation

### Function Signature (Line 3428)
- **Line 3428**: `QuantumValue Interpreter::evalCall(CallExpr &e)` - Evaluate function calls
  - `e`: Reference to CallExpr AST node
  - Returns QuantumValue result of the function call

### Method Call Detection (Lines 3429-3435)
- **Line 3429**: `{` - Opening brace
- **Line 3430**: `// Special: method call via MemberExpr callee` - Comment about method calls
- **Line 3431**: `if (e.callee->is<MemberExpr>())` - Check if callee is member expression
- **Line 3432**: `{` - Opening brace for method call
- **Line 3433**: `auto &member = e.callee->as<MemberExpr>();` - Get member expression
- **Line 3434**: `auto obj = evaluate(*member.object);` - Evaluate object expression
- **Line 3435**: `if (obj.isPointer())` - Check if object is a pointer

### Pointer Dereference (Lines 3436-3442)
- **Line 3436**: `{` - Opening brace for pointer handling
- **Line 3437**: `obj = obj.asPointer()->deref();` - Dereference pointer
- **Line 3438**: `}` - Closing brace for pointer handling
- **Line 3439**: `if (obj.isInstance())` - Check if object is instance
- **Line 3440**: `{` - Opening brace for instance handling
- **Line 3441**: `auto methodName = member.member;` - Get method name
- **Line 3442**: `auto method = obj.asInstance()->getField(methodName);` - Get method from instance

### Instance Method Call (Lines 3443-3452)
- **Line 3443**: `if (method.isFunction())` - Check if field is a function
- **Line 3444**: `{` - Opening brace for method call
- **Line 3445**: `auto fn = method.asFunction();` - Get function object
- **Line 3446**: `std::vector<QuantumValue> args;` - Create arguments vector
- **Line 3447**: `args.reserve(e.arguments.size());` - Reserve space for arguments
- **Line 3448**: `for (auto &arg : e.arguments)` - Loop through arguments
- **Line 3449**: `args.push_back(evaluate(*arg));` - Evaluate and add argument
- **Line 3450**: `return callInstanceMethod(obj.asInstance(), fn, std::move(args));` - Call instance method
- **Line 3451**: `}` - Closing brace for method call
- **Line 3452**: `}` - Closing brace for instance handling

### Regular Function Call Setup (Lines 3453-3460)
- **Line 3453**: `}` - Closing brace for method call
- **Line 3454**: Empty line for readability
- **Line 3455**: `auto callee = evaluate(*e.callee);` - Evaluate callee expression
- **Line 3456**: `std::vector<QuantumValue> args;` - Create arguments vector
- **Line 3457**: `args.reserve(e.arguments.size());` - Reserve space for arguments
- **Line 3458**: `for (auto &arg : e.arguments)` - Loop through arguments
- **Line 3459**: `args.push_back(evaluate(*arg));` - Evaluate and add argument
- **Line 3460**: Empty line for readability

### Function Type Dispatch (Lines 3461-3475)
- **Line 3461**: `if (callee.isFunction())` - Check if callee is user function
- **Line 3462**: `return callFunction(callee.asFunction(), std::move(args));` - Call user function
- **Line 3463**: `if (callee.isNative())` - Check if callee is native function
- **Line 3464**: `return callNative(callee.asNative(), std::move(args));` - Call native function
- **Line 3465**: `if (callee.isClass())` - Check if callee is class
- **Line 3466**: `{` - Opening brace for class constructor

### Class Constructor Call (Lines 3467-3475)
- **Line 3467**: `auto klass = callee.asClass();` - Get class object
- **Line 3468**: `auto instance = std::make_shared<QuantumInstance>(klass);` - Create instance
- **Line 3469**: `// Call constructor if exists` - Comment about constructor
- **Line 3470**: `auto ctor = klass->findMethod("<init>");` - Find constructor method
- **Line 3471**: `if (ctor)` - Check if constructor exists
- **Line 3472**: `callInstanceMethod(instance, ctor, std::move(args));` - Call constructor
- **Line 3473**: `return QuantumValue(instance);` - Return new instance
- **Line 3474**: `}` - Closing brace for class constructor

### Error Handling (Lines 3475-3477)
- **Line 3475**: `throw TypeError("Cannot call " + callee.typeName());` - Throw error for non-callable types
- **Line 3476**: `}` - Closing brace for function

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
