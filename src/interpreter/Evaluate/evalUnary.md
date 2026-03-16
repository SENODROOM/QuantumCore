# evalUnary Function Explanation

The `evalUnary` function is responsible for evaluating unary expressions in the Quantum Language compiler. Unary expressions consist of an operator and a single operand, such as `-x`, `!y`, or `~z`. This function processes these operators and returns the appropriate result based on the type of operator encountered.

## Parameters
- `e`: A reference to a `UnaryExpression` object representing the unary expression to be evaluated. It contains information about the operator (`op`) and the operand.

## Return Value
- Returns a `QuantumValue` object representing the result of the unary operation.

## How It Works
The function evaluates the unary expression by first calling the `evaluate` function on the operand to get its value. Depending on the operator specified in the `UnaryExpression` object, the function performs different operations:

- **Operator `-`**: Negates the numeric value of the operand. If the operand is not a number, an error is thrown.
- **Operators `not` and `!`**: Checks if the operand is truthy. If the operand is falsy, it returns `true`; otherwise, it returns `false`.
- **Operator `~`**: Applies bitwise NOT to the integer value of the operand. If the operand is not an integer, an error is thrown.
- **Spread Operator `...`**: Directly returns the value of the operand without any modification. This operator is typically used in contexts where array elements need to be expanded.

For any unknown unary operator, the function throws a `RuntimeError`.

## Edge Cases
- **Non-Numeric Operand with `-` Operator**: If the operand is not a number, attempting to negate it will result in a runtime error.
- **Non-Boolean Operand with `not` and `!` Operators**: These operators expect boolean values. If the operand is not boolean, they may behave unpredictably or throw errors depending on the implementation.
- **Non-Integer Operand with `~` Operator**: Applying bitwise NOT to non-integer types will lead to undefined behavior or errors.

## Interactions with Other Components
- **Evaluation Engine**: The `evalUnary` function relies on the `evaluate` function to compute the value of the operand before applying the unary operator.
- **Type Checking**: For certain operators like `-` and `~`, the function ensures that the operand is of the correct type (numeric or integer respectively). This interaction helps maintain type safety within the compiler.
- **Error Handling**: When encountering an unknown or invalid unary operator, the function throws a `RuntimeError`. This error handling mechanism is crucial for debugging and ensuring the robustness of the compiler.

Overall, the `evalUnary` function plays a vital role in processing unary expressions, ensuring that the correct operations are applied and that the resulting values are returned accurately. Its interactions with other components, particularly the evaluation engine and type checking mechanisms, highlight its importance in maintaining the integrity and functionality of the Quantum Language compiler.