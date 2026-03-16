# execBinary

`execBinary` is a crucial method in the Quantum Language compiler's Virtual Machine (VM) component (`src/Vm.cpp`). This method handles the execution of binary operations between two `QuantumValue` objects based on the specified operation type (`Op`). It supports various data types including strings, arrays, numbers, and booleans, providing flexibility in handling different kinds of data within quantum computations.

## What it Does

The primary role of `execBinary` is to compute the result of a binary operation between two `QuantumValue` operands. Depending on the operation type, it performs addition, subtraction, multiplication, division, modulo, floor division, or comparison (equality and inequality). The method ensures that operations can be performed between mixed data types, converting them to a common numeric format when necessary.

## Why it Works This Way

This implementation allows for a unified approach to handling binary operations across different data types. By checking the type of each operand and performing appropriate conversions, the method ensures that all operations are executed correctly without runtime errors. For example, string concatenation is handled separately from numeric arithmetic, allowing for intuitive behavior where adding strings results in their concatenation, while adding numbers results in their sum.

## Parameters/Return Value

### Parameters

- `op`: An enumeration representing the binary operation to be executed. Possible values include `Op::ADD`, `Op::SUB`, `Op::MUL`, `Op::DIV`, `Op::MOD`, `Op::FLOOR_DIV`, `Op::EQ`, and `Op::NEQ`.
- `L`: A `QuantumValue` object representing the left-hand side operand of the operation.
- `R`: A `QuantumValue` object representing the right-hand side operand of the operation.
- `line`: An integer indicating the line number in the source code where the operation occurred, used for error reporting.

### Return Value

- Returns a `QuantumValue` object containing the result of the binary operation.

## Edge Cases

1. **Division by Zero**: When performing division or modulo operations, the method checks if the divisor is zero. If so, it throws a `RuntimeError` with an appropriate message and the line number where the error occurred.
2. **Mixed Types**: The method supports mixed types for addition, equality, and inequality comparisons. However, for numeric operations like subtraction, multiplication, and division, it converts both operands to numbers before performing the calculation. If a conversion fails (e.g., trying to convert a non-numeric string), the method defaults to using `0` as the converted value.
3. **String Repeat**: In multiplication operations, if one operand is a string and the other is a number, the method repeats the string the specified number of times. This behavior is useful for creating repeated patterns or sequences within quantum algorithms.

## Interactions with Other Components

- **QuantumValue Class**: `execBinary` relies heavily on the `QuantumValue` class, which encapsulates different data types (strings, arrays, numbers, booleans) and provides methods to access and manipulate these values.
- **RuntimeError Class**: When encountering division by zero, the method uses the `RuntimeError` class to handle exceptions gracefully, providing clear error messages and stopping the execution of the program.
- **Array Class**: For array concatenation, the method utilizes the `Array` class, which manages dynamic arrays of `QuantumValue` objects. It creates a new array, copies elements from the first array, and appends elements from the second array.

Overall, `execBinary` is a versatile method designed to handle complex binary operations efficiently and safely, ensuring robustness in the Quantum Language compiler's VM component.