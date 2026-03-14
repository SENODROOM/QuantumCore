# asNative() Function Explanation

## Complete Code

```cpp
std::shared_ptr<QuantumNative> QuantumValue::asNative() const
{
    if (!isNative())
        throw RuntimeError("Value is not a native function");
    return std::get<std::shared_ptr<QuantumNative>>(data);
}
```

## Line-by-Line Explanation

### Function Signature (Line 221)
- **Line 221**: `std::shared_ptr<QuantumNative> QuantumValue::asNative() const` - Member function that returns the value as a native function
  - Returns a shared pointer to the native function
  - `const` means this function doesn't modify the QuantumValue object

### Function Body (Lines 222-226)
- **Line 222**: `{` - Opening brace for function body
- **Line 223**: `if (!isNative())` - Check if the value is not a native function
  - Calls the `isNative()` method to verify the type
  - `!` negates the result, so this executes if it's NOT a native function
- **Line 224**: `throw RuntimeError("Value is not a native function");` - Throw runtime error if type mismatch
  - Creates a RuntimeError with descriptive message
  - This prevents unsafe type casting
- **Line 225**: `return std::get<std::shared_ptr<QuantumNative>>(data);` - Extract and return the native function
  - `std::get` safely extracts the value from the variant (we know it's the correct type due to the check)
  - Returns the shared pointer to the QuantumNative function
- **Line 226**: `}` - Closing brace for function body

## Summary

The `asNative()` function provides safe type casting from a QuantumValue to a native function:

### Key Features
- **Type-Safe**: Verifies the type before extraction to prevent undefined behavior
- **Error Handling**: Throws descriptive runtime error for type mismatches
- **Efficient**: Direct variant access after type verification
- **Safe**: Uses `std::get` which is safe after type checking

### Use Cases
- **Function Calling**: Extracting native functions for execution
- **Method Dispatch**: Converting values to callable objects
- **API Access**: Getting access to built-in functionality

### Error Handling
- **RuntimeError**: Thrown when the value is not a native function
- **Message**: "Value is not a native function" provides clear feedback
- **Safety**: Prevents crashes from invalid type access

### Return Value
- **Success**: Returns `std::shared_ptr<QuantumNative>` containing the native function
- **Failure**: Throws RuntimeError (does not return)

This function is essential for the interpreter's function calling system to safely extract and execute native functions.
