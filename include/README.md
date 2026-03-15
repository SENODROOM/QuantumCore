# QuantumLanguage Compiler - Interpreter.h

## Overview

The `include/Interpreter.h` header file is an essential component of the QuantumLanguage compiler, responsible for interpreting and executing abstract syntax tree (AST) nodes. It provides the core functionality to evaluate expressions, execute statements, manage environments, and handle built-in methods. This file serves as the bridge between the AST generation phase and the runtime execution phase, ensuring that the compiled code can be executed efficiently.

## Key Design Decisions

### Use of Smart Pointers

**Why:** To manage memory effectively and avoid manual memory management errors such as leaks and dangling pointers. The use of smart pointers (`std::shared_ptr`) ensures automatic deallocation when objects are no longer needed, enhancing the reliability and performance of the interpreter.

### Environment Management

**Why:** To maintain state and scope information during program execution. Each environment represents a variable scope, allowing for nested scopes and dynamic scoping. This design decision facilitates the implementation of control flow constructs like functions, loops, and conditionals without losing track of variable bindings.

### Trade-offs

#### Memory Overhead

Using smart pointers introduces some overhead due to additional bookkeeping required for reference counting. However, this trade-off is considered acceptable given the benefits of automatic memory management and reduced risk of memory-related bugs.

#### Performance Impact

Smart pointer operations may have slight performance implications compared to raw pointers. In critical sections of the interpreter where performance is paramount, further optimizations might be necessary to mitigate these effects.

## Class Documentation

### Interpreter

**Purpose:** Manages the execution of quantum programs by interpreting AST nodes and maintaining the global and local environments.

**Behaviour:**
- **Constructor:** Initializes the interpreter with default settings.
- **execute(ASTNode &node):** Executes the given AST node.
- **evaluate(ASTNode &node):** Evaluates the given AST node and returns its value.
- **execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr):** Executes a block statement with an optional custom environment.
- **globals:** A shared pointer to the global environment, which holds all top-level variables and functions.

### Private Member Functions

#### Statement Executors

- **void execVarDecl(VarDecl &s):** Executes a variable declaration statement.
- **void execFunctionDecl(FunctionDecl &s):** Executes a function declaration statement.
- **void execClassDecl(ClassDecl &s):** Executes a class declaration statement.
- **void execIf(IfStmt &s):** Executes an if statement.
- **void execWhile(WhileStmt &s):** Executes a while loop.
- **void execFor(ForStmt &s):** Executes a for loop.
- **void execReturn(ReturnStmt &s):** Handles return statements.
- **void execPrint(PrintStmt &s):** Prints the result of an expression.
- **void execInput(InputStmt &s):** Reads input from the user.
- **void execImport(ImportStmt &s):** Imports modules.
- **void execExprStmt(ExprStmt &s):** Executes an expression statement.

#### Expression Evaluators

- **QuantumValue evalBinary(BinaryExpr &e):** Evaluates binary expressions.
- **QuantumValue evalUnary(UnaryExpr &e):** Evaluates unary expressions.
- **QuantumValue evalAssign(AssignExpr &e):** Handles assignment expressions.
- **QuantumValue evalCall(CallExpr &e):** Calls functions or methods.
- **QuantumValue evalIndex(IndexExpr &e):** Accesses elements in arrays or dictionaries.
- **QuantumValue evalMember(MemberExpr &e):** Accesses members of instances.
- **QuantumValue evalArray(ArrayLiteral &e):** Creates array literals.
- **QuantumValue evalDict(DictLiteral &e):** Creates dictionary literals.
- **QuantumValue evalLambda(LambdaExpr &e):** Defines lambda functions.
- **QuantumValue evalListComp(ListComp &e):** Handles list comprehensions.
- **QuantumValue evalIdentifier(Identifier &e):** Retrieves the value of an identifier.

### C++ Pointer Evaluators

- **QuantumValue evalAddressOf(AddressOfExpr &e):** Computes the address of a variable.
- **QuantumValue evalDeref(DerefExpr &e):** Dereferences a pointer.
- **QuantumValue evalArrow(ArrowExpr &e):** Accesses a member through a pointer.
- **QuantumValue evalNewExpr(NewExpr &e):** Allocates memory for a new instance of a class.

### Method Dispatch

- **QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args):** Invokes a user-defined function.
- **QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args):** Invokes a native function.
- **QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args):** Invokes a method on an instance.
- **QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args):** Dispatches a method call based on the object type.
- **QuantumValue callArrayMethod(std::shared_ptr<Array> arr, const std::string &method, std::vector<QuantumValue> args):** Dispatches a method call specific to arrays.
- **QuantumValue callStringMethod(const std::string &str, const std::string &method, std::vector<QuantumValue> args):** Dispatches a method call specific to strings.
- **QuantumValue callDictMethod(std::