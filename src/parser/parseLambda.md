# `parseLambda`

## Purpose

The `parseLambda` function is designed to parse a lambda expression in the Quantum Language compiler's syntax. A lambda expression is an anonymous function defined inline, often used for short, simple functions that can be passed as arguments to higher-order functions.

## Parameters

- **None**: The `parseLambda` function does not take any explicit parameters. It relies on global state and context provided by the parser, such as the current token being processed (`current()`).

## Return Value

- **`std::unique_ptr<ASTNode>`**: The function returns a unique pointer to an abstract syntax tree (AST) node representing the parsed lambda expression. This AST node contains information about the parameters, parameter types, default arguments, and the body of the lambda function.

## How It Works

1. **Initialization**:
   - The function starts by recording the current line number (`ln`) where the lambda expression begins.
   - Three vectors are initialized to store default arguments (`defaultArgs`), parameter types (`paramTypes`), and the parameters themselves (`params`).

2. **Parsing Parameter List**:
   - The function calls `parseParamList(nullptr, &defaultArgs, &paramTypes)` to parse the list of parameters for the lambda function. This method fills the `params`, `defaultArgs`, and `paramTypes` vectors based on the tokens consumed during parsing.

3. **Matching Colon**:
   - The function then matches the colon (`:`) token, which separates the parameter list from the function body. This is typical in languages like Python when defining a lambda function using the `def` keyword.

4. **Matching Arrow**:
   - Following the colon, the function attempts to match the fat arrow (`->`) token, which indicates the start of the function body in languages like JavaScript. If the fat arrow is not found, it falls back to matching the regular arrow (`-->`) token, which is used in the Quantum Language for lambda expressions.

5. **Skipping Newlines**:
   - After matching the arrow, the function skips any newline characters using `skipNewlines()`. This ensures that the parser continues processing without interruption due to whitespace.

6. **Parsing Function Body**:
   - The function then calls `parseBlock()` to parse the block of code that represents the body of the lambda function. This method returns another AST node containing the parsed statements.

7. **Constructing Lambda Expression Node**:
   - With all necessary parts parsed, the function constructs a `LambdaExpr` object (`le`). This object stores the parsed parameters, parameter types, default arguments, and the body of the lambda function.
   - An `ASTNode` is created with the `LambdaExpr` object and the recorded line number (`ln`).
   - Finally, the function returns a unique pointer to this newly created `ASTNode`.

## Edge Cases

- **Missing Colon**: If the colon (`:`) separating the parameter list and the function body is missing, the parser will raise an error.
- **Incorrect Arrow Syntax**: If neither the fat arrow (`->`) nor the regular arrow (`-->`) is found after the colon, the parser will also raise an error.
- **Empty Parameter List**: The function can handle an empty parameter list gracefully, allowing the creation of a lambda function with no arguments.
- **Whitespace Handling**: The `skipNewlines()` call ensures that the parser correctly handles any whitespace between the arrow and the function body, preventing premature termination or errors.

## Interactions with Other Components

- **Token Consumption**: The function consumes tokens from the global parser state, ensuring that subsequent parsing steps proceed correctly.
- **Error Handling**: The parser infrastructure should include mechanisms to handle errors raised by `parseParamList()` and `parseBlock()`, providing feedback to the user or developer about issues encountered during parsing.
- **Scope Management**: While not explicitly shown in the snippet, the parsed lambda expression may need to interact with scope management systems within the compiler to ensure proper variable resolution and lifetime tracking.
- **Code Generation**: The resulting AST node will likely be used by later stages of the compiler, including code generation, to produce executable code or intermediate representations of the lambda function.

This comprehensive approach ensures that the `parseLambda` function accurately captures the structure and semantics of lambda expressions in the Quantum Language, facilitating further analysis and transformation within the compiler.