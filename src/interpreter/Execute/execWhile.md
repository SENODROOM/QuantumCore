# execWhile() Function Explanation

## Complete Code

```cpp
void Interpreter::execWhile(WhileStmt &s)
{
    while (evaluate(*s.condition).isTruthy())
    {
        execute(*s.body);
        stepCount_++;
        if (stepCount_ > MAX_STEPS)
            throw RuntimeError("Infinite loop detected");
    }
}
```

## Line-by-Line Explanation

### Function Signature (Line 1914)
- **Line 1914**: `void Interpreter::execWhile(WhileStmt &s)` - Execute while statements
  - `s`: Reference to WhileStmt AST node
  - Returns void as while statements don't produce values

### While Loop (Lines 1915-1924)
- **Line 1915**: `{` - Opening brace
- **Line 1916**: `while (evaluate(*s.condition).isTruthy())` - Main while loop condition
  - `evaluate(*s.condition)`: Evaluate condition expression each iteration
  - `.isTruthy()`: Check if result is truthy
- **Line 1917**: `{` - Opening brace for loop body
- **Line 1918**: `execute(*s.body);` - Execute loop body statements
- **Line 1919**: `stepCount_++;` - Increment step counter for infinite loop detection
- **Line 1920**: `if (stepCount_ > MAX_STEPS)` - Check for infinite loop
- **Line 1921**: `throw RuntimeError("Infinite loop detected");` - Throw error for infinite loop
- **Line 1922**: `}` - Closing brace for loop body
- **Line 1923**: `}` - Closing brace for function

## Summary

The `execWhile()` function handles while loop execution in the Quantum Language:

### Key Features
- **Condition Evaluation**: Evaluates condition each iteration
- **Loop Body Execution**: Executes body statements repeatedly
- **Infinite Loop Protection**: Prevents endless loops with step counting
- **Truthiness Checking**: Uses QuantumValue truthiness rules

### Loop Execution Process
1. **Condition Check**: Evaluate condition expression
2. **Truthiness Test**: Check if condition is truthy
3. **Body Execution**: Execute loop body if condition is truthy
4. **Step Counting**: Track execution steps
5. **Loop Detection**: Check for infinite loops
6. **Repeat**: Continue until condition is falsy

### Condition Evaluation
- **Per Iteration**: Condition evaluated each loop iteration
- **Truthiness**: Uses QuantumValue truthiness semantics
- **Side Effects**: Condition evaluation can have side effects
- **Type Safety**: All condition types handled safely

### Infinite Loop Protection
- **Step Counting**: Tracks total steps across all loops
- **MAX_STEPS Limit**: Prevents infinite loops from hanging
- **RuntimeError**: Thrown when step limit exceeded
- **Global Counter**: Shared across all loop executions

### Loop Body Features
- **Block Execution**: Body can contain any statements
- **Scope Management**: Body gets its own scope
- **Control Flow**: Can contain break, continue, return
- **Nested Loops**: While loops can be nested

### Truthiness Rules
- **Truthy Values**: Non-zero numbers, non-empty strings, non-empty arrays, true
- **Falsy Values**: nil, false, zero, empty strings, empty arrays
- **Type Safety**: All QuantumValue types have defined truthiness

### While Loop Types
- **Simple Loop**: `while (condition) { body }`
- **Empty Loop**: `while (condition) { }`
- **Complex Conditions**: Any expression that evaluates to a value
- **Nested Loops**: While loops can contain other loops

### Design Benefits
- **Safety**: Infinite loop protection prevents hanging
- **Correctness**: Proper truthiness semantics
- **Flexibility**: Supports complex loop conditions
- **Performance**: Efficient condition evaluation

### Use Cases
- **Iteration**: Processing collections and data structures
- **Input Validation**: Loop until valid input received
- **Game Loops**: Main game execution loops
- **Processing**: Repeated data processing operations

### Error Handling
- **Condition Errors**: Errors in condition evaluation propagate up
- **Body Errors**: Errors in body execution propagate up
- **Infinite Loop**: RuntimeError thrown when step limit exceeded
- **Type Errors**: Truthiness handles all types safely

### Performance Characteristics
- **Condition Overhead**: Condition evaluated each iteration
- **Step Counting**: Minimal overhead for safety
- **Memory Efficient**: No additional memory allocation
- **Early Exit**: Loop exits immediately when condition is falsy

### Integration with Other Statements
- **Break Statement**: Exits loop early
- **Continue Statement**: Skips to next iteration
- **Return Statement**: Exits function from within loop
- **Nested Control**: Can contain other control statements

### Loop Control Flow
- **Normal Exit**: Condition becomes falsy
- **Break Exit**: Break statement encountered
- **Return Exit**: Return statement encountered
- **Error Exit**: Exception thrown during execution

This function provides the foundation for iterative programming in the Quantum Language, enabling flexible while loop execution while maintaining safety through infinite loop protection and proper truthiness semantics.
