# execIf() Function Explanation

## Complete Code

```cpp
void Interpreter::execIf(IfStmt &s)
{
    if (evaluate(*s.condition).isTruthy())
        execute(*s.thenBranch);
    else if (s.elseBranch)
        execute(*s.elseBranch);
}
```

## Code Explanation

### Function Signature
- `void Interpreter::execIf(IfStmt &s)` - Execute if statements
  - `s`: Reference to IfStmt AST node
  - Returns void as if statements don't produce values

### Condition Evaluation
- `{` - Opening brace
- `if (evaluate(*s.condition).isTruthy())` - Evaluate condition and check truthiness
  - `evaluate(*s.condition)`: Evaluate the condition expression
  - `.isTruthy()`: Check if result is truthy (not nil, not false, not empty)

### Then Branch Execution
- `execute(*s.thenBranch);` - Execute then branch if condition is truthy

### Else Branch Execution
- `else if (s.elseBranch)` - Check if else branch exists
- `execute(*s.elseBranch);` - Execute else branch if condition is falsy
- `}` - Closing brace for function

## Summary

The `execIf()` function handles conditional execution in the Quantum Language:

### Key Features
- **Condition Evaluation**: Evaluates condition expressions
- **Truthiness Checking**: Uses QuantumValue truthiness rules
- **Branch Selection**: Executes appropriate branch based on condition
- **Optional Else**: Handles if statements with or without else branches

### Execution Flow
1. **Condition Evaluation**: Evaluate the condition expression
2. **Truthiness Check**: Determine if condition is truthy
3. **Then Branch**: Execute if condition is truthy
4. **Else Branch**: Execute if condition is falsy and else exists

### Truthiness Rules
- **Truthy Values**: Non-zero numbers, non-empty strings, non-empty arrays, true
- **Falsy Values**: nil, false, zero, empty strings, empty arrays
- **Type Safety**: All QuantumValue types have defined truthiness

### If Statement Types
- **Simple If**: `if (condition) { statements }`
- **If-Else**: `if (condition) { then } else { else }`
- **Nested If**: If statements can be nested arbitrarily
- **Complex Conditions**: Any expression that evaluates to a value

### Branch Types
- **Then Branch**: Executed when condition is truthy
- **Else Branch**: Executed when condition is falsy (optional)
- **Block Statements**: Branches can contain any statements
- **Scope Management**: Each branch gets its own scope

### Design Benefits
- **Simplicity**: Clean, straightforward implementation
- **Efficiency**: Single condition evaluation
- **Flexibility**: Supports complex conditional logic
- **Correctness**: Proper truthiness semantics

### Use Cases
- **Conditional Logic**: All conditional program flow
- **Error Handling**: If statements for error checking
- **Validation**: Input validation and error checking
- **Control Flow**: Branching program execution

### Error Handling
- **Condition Errors**: Errors in condition evaluation propagate up
- **Branch Errors**: Errors in branch execution propagate up
- **Type Errors**: Truthiness handles all types safely
- **Scope Errors**: Proper scope management prevents errors

### Performance Characteristics
- **Single Evaluation**: Condition evaluated only once
- **Short-Circuit**: No unnecessary branch execution
- **Memory Efficient**: No additional memory allocation
- **Fast Execution**: Minimal overhead for conditional logic

### Integration with Other Statements
- **Nested Control**: If statements can contain other control statements
- **Function Calls**: Conditions can include function calls
- **Variable Access**: Conditions can access variables from current scope
- **Side Effects**: Condition evaluation can have side effects

This function provides the foundation for conditional programming in the Quantum Language, enabling flexible control flow while maintaining proper truthiness semantics and efficient execution through single condition evaluation.
