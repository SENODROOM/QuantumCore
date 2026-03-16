# `compileFunctionDecl`

The `compileFunctionDecl` function is responsible for compiling a function declaration in the Quantum Language compiler. This function processes the details of the function, such as its name, parameters, body, and scope depth, to generate the appropriate bytecode instructions.

## What It Does

The primary task of `compileFunctionDecl` is to:

1. Compile the function itself using the `compileFunction` method.
2. Create a chunk holder for the compiled function.
3. Load the constant containing the chunk holder onto the stack.
4. Depending on whether the function has upvalues or not, either create a closure or a regular function.
5. Define the function at the global or local level based on its scope depth.

## Why It Works This Way

### Compiling the Function

The function starts by calling `compileFunction` with various parameters:
- The function's name (`s.name`)
- Its parameters (`s.params`)
- Whether each parameter is passed by reference (`s.paramIsRef`)
- Default arguments (`s.defaultArgs`)
- The body of the function (`s.body.get()`)
- The current line number (`line`)

This step generates the bytecode instructions necessary to execute the function's logic.

### Creating a Chunk Holder

A chunk holder is then created using `makeChunkHolder`, which encapsulates the function's name and the compiled function chunk. This holder will be used to store information about the function during compilation.

### Loading the Constant

The next instruction loads a constant onto the stack. This constant contains the chunk holder, which provides a reference to the compiled function. The `addConst` function adds this constant to the compiler's constant pool, ensuring that it can be reused throughout the program.

### Creating a Closure or Regular Function

Depending on whether the function has any upvalues (`fnChunk->upvalueCount > 0`), the compiler emits different bytecode operations:
- If there are upvalues, it emits `Op::MAKE_CLOSURE`.
- Otherwise, it emits `Op::MAKE_FUNCTION`.

Upvalues are variables that refer to outer scopes. If a function uses upvalues, it needs to be compiled as a closure to maintain access to these variables even when the outer scope is exited.

### Defining the Function

Finally, the function defines itself at either the global or local level:
- If the current scope depth is 0 (`current_->scopeDepth == 0`), it means the function is being defined globally. In this case, the compiler emits `Op::DEFINE_GLOBAL` followed by the function's name.
- If the current scope depth is greater than 0, the function is being defined locally within another function. The compiler declares the local variable using `declareLocal` and then emits `Op::DEFINE_LOCAL`. The index provided to `Op::DEFINE_LOCAL` corresponds to the position of the local variable in the current scope's locals list.

## Parameters/Return Value

### Parameters

- `s`: A structure containing details about the function declaration, including its name, parameters, default arguments, and body.
- `line`: The current line number in the source code, used for error reporting and debugging purposes.

### Return Value

No explicit return value is shown in the given code snippet. However, it is implied that the function performs side effects by emitting bytecode instructions into the compiler's output stream.

## Edge Cases

### No Upvalues

If the function does not have any upvalues, the compiler simply creates a regular function without wrapping it in a closure. This is handled by the `Op::MAKE_FUNCTION` operation.

### Global vs Local Scope

The function distinguishes between global and local scopes by checking the `scopeDepth` of the current scope. This ensures that functions are correctly defined and accessible according to their intended scope.

## Interactions With Other Components

### Compiler State

The function interacts with the compiler's state through several members and methods:
- `current_`: A pointer to the current compilation context, which includes information about the current scope depth and the list of local variables.
- `emit`: A method used to add bytecode instructions to the compiler's output stream.
- `addConst`: A method that adds constants to the compiler's constant pool.
- `addStr`: A method that adds string literals to the compiler's constant pool.

### Symbol Table

The function also interacts with the symbol table to manage function declarations:
- `declareLocal`: A method used to declare a local variable in the current scope.

Overall, `compileFunctionDecl` plays a crucial role in translating function declarations from the source code into executable bytecode, handling both global and local scoping, and managing upvalues appropriately.