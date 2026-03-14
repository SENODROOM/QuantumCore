# callFunction() Function Explanation

## Complete Code

```cpp
QuantumValue Interpreter::callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)
{
    auto scope = std::make_shared<Environment>(fn->closure);
    for (size_t i = 0; i < fn->params.size(); i++)
    {
        if (i < args.size())
        {
            if (fn->paramIsRef[i])
            {
                // Reference parameter - store L-value reference
                setLValue(*fn->params[i], args[i], "=");
            }
            else
            {
                // Regular parameter - store by value
                scope->define(fn->params[i], args[i]);
            }
        }
        else if (fn->defaultArgs[i])
        {
            // Use default argument
            auto defaultValue = evaluate(*fn->defaultArgs[i]);
            scope->define(fn->params[i], defaultValue);
        }
        else
        {
            throw TypeError("Missing argument for parameter '" + fn->params[i] + "'");
        }
    }
    
    // Check for too many arguments
    if (args.size() > fn->params.size())
        throw TypeError("Too many arguments: expected " + std::to_string(fn->params.size()) + ", got " + std::to_string(args.size()));
    
    auto prev = env;
    env = scope;
    stepCount_ = 0;
    
    try
    {
        execute(*fn->body);
        return QuantumValue(); // Implicit return
    }
    catch (const ReturnSignal &ret)
    {
        env = prev;
        return ret.value;
    }
}
```

## Code Explanation

### Function Signature
-  `QuantumValue Interpreter::callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)` - Call user-defined functions
  - `fn`: Shared pointer to QuantumFunction object
  - `args`: Vector of function arguments
  - Returns QuantumValue result of function call

###
-  `{` - Opening brace
-  `auto scope = std::make_shared<Environment>(fn->closure);` - Create local scope with closure

###
-  `for (size_t i = 0; i < fn->params.size(); i++)` - Loop through parameters
-  `{` - Opening brace for parameter loop
-  `if (i < args.size())` - Check if argument provided

###
-  `{` - Opening brace for argument case
-  `if (fn->paramIsRef[i])` - Check if reference parameter
-  `{` - Opening brace for reference case
-  `// Reference parameter - store L-value reference` - Comment about reference parameters
-  `setLValue(*fn->params[i], args[i], "=");` - Store L-value reference
-  `}` - Closing brace for reference case
-  `else` - Regular parameter case
-  `{` - Opening brace for regular case
-  `// Regular parameter - store by value` - Comment about regular parameters
-  `scope->define(fn->params[i], args[i]);` - Store parameter by value
-  `}` - Closing brace for regular case
-  `}` - Closing brace for argument case

###
-  `else if (fn->defaultArgs[i])` - Check if default argument exists
-  `{` - Opening brace for default case
-  `// Use default argument` - Comment about default arguments
-  `auto defaultValue = evaluate(*fn->defaultArgs[i]);` - Evaluate default expression
-  `scope->define(fn->params[i], defaultValue);` - Store default value
-  `}` - Closing brace for default case
-  `else` - Missing argument case
-  `throw TypeError("Missing argument for parameter '" + fn->params[i] + "'");` - Error for missing argument

###
-  `}` - Closing brace for parameter loop
-  `// Check for too many arguments` - Comment about argument count
-  `if (args.size() > fn->params.size())` - Check if too many arguments
-  `throw TypeError("Too many arguments: expected " + std::to_string(fn->params.size()) + ", got " + std::to_string(args.size()));` - Error for too many arguments

###
-  Empty line for readability
-  `auto prev = env;` - Save current environment
-  `env = scope;` - Set current environment to function scope
-  `stepCount_ = 0;` - Reset step counter for infinite loop detection

###
-  Empty line for readability
-  `try` - Start try block for function execution
-  `{` - Opening brace for try block
-  `execute(*fn->body);` - Execute function body
-  `return QuantumValue(); // Implicit return` - Return nil for implicit return
-  `}` - Closing brace for try block
-  `catch (const ReturnSignal &ret)` - Catch return signals
-  `{` - Opening brace for catch block
-  `env = prev;` - Restore previous environment
-  `return ret.value;` - Return explicit return value
-  `}` - Closing brace for catch block
-  `}` - Closing brace for function

## Summary

The `callFunction()` function handles user-defined function calls in the Quantum Language:

### Key Features
- **Closure Support**: Functions execute with captured environment
- **Parameter Types**: Support for regular and reference parameters
- **Default Arguments**: Support for optional parameters with defaults
- **Return Handling**: Both explicit and implicit returns supported

### Function Call Process
1. **Scope Creation**: Create local environment with closure
2. **Parameter Binding**: Bind arguments to parameters
3. **Environment Setup**: Set current environment to function scope
4. **Body Execution**: Execute function statements
5. **Return Handling**: Process return signals
6. **Environment Restore**: Return to previous environment

### Parameter Types
- **Regular Parameters**: Passed by value, stored in local scope
- **Reference Parameters**: Passed by reference, modify caller's variables
- **Default Parameters**: Optional parameters with default values
- **Required Parameters**: Must be provided by caller

### Argument Binding
- **Positional Binding**: Arguments bound to parameters by position
- **Reference Binding**: Reference parameters create L-value bindings
- **Default Binding**: Missing arguments use default values
- **Error Handling**: Clear errors for missing or extra arguments

### Closure Semantics
- **Environment Capture**: Functions capture variables from declaration scope
- **Lexical Scoping**: Proper variable resolution through closure
- **Variable Access**: Functions can access outer scope variables
- **Memory Management**: Smart pointers manage closure lifetime

### Return Handling
- **Implicit Return**: Functions without explicit return return nil
- **Explicit Return**: Return statements provide specific values
- **Exception-Based**: Uses ReturnSignal for non-local control flow
- **Environment Restoration**: Proper cleanup after return

### Design Benefits
- **Memory Safety**: Proper environment management
- **Type Safety**: Comprehensive parameter and return type handling
- **Flexibility**: Support for advanced parameter features
- **Performance**: Efficient closure and parameter handling

### Use Cases
- **Function Calls**: All user-defined function invocations
- **Method Calls**: Instance method calls (through wrapper)
- **Recursive Functions**: Functions that call themselves
- **Higher-Order Functions**: Functions passed as arguments

### Integration with Other Components
- **Environment System**: Uses Environment for variable storage
- **Closure System**: Captures lexical environment
- **Parameter System**: Supports advanced parameter features
- **Return System**: Uses ReturnSignal for control flow

### Performance Characteristics
- **Parameter Binding**: O(n) where n is parameter count
- **Environment Setup**: O(1) environment creation
- **Closure Access**: O(1) variable access through closure
- **Return Handling**: Efficient exception-based control flow

### Function Examples
- **Simple Function**: `function add(a, b) { return a + b; }`
- **Reference Parameter**: `function increment(&x) { x = x + 1; }`
- **Default Parameter**: `function greet(name="World") { print(name); }`
- **Recursive Function**: `function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }`

### Error Handling
- **Missing Arguments**: TypeError with parameter name
- **Too Many Arguments**: TypeError with expected/got counts
- **Type Errors**: Handled by individual operations
- **Runtime Errors**: Propagate through function execution

### Memory Management
- **Shared Pointers**: Environments use std::shared_ptr
- **Closure Lifetime**: Managed by reference counting
- **Scope Cleanup**: Automatic cleanup when function returns
- **Parameter Storage**: Efficient parameter storage in local scope

This function provides the foundation for function execution in the Quantum Language, enabling proper lexical scoping through closures while supporting advanced parameter features and maintaining memory safety throughout the function call process.
