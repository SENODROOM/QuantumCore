# QuantumLanguage Compiler - Interpreter.h

## Overview

The `Interpreter.h` file is an integral part of the QuantumLanguage compiler's runtime system. It defines the `Interpreter` class, which is responsible for executing abstract syntax tree (AST) nodes and evaluating expressions within the QuantumLanguage environment. This class forms the core of the interpreter component, enabling the execution of quantum programs.

## Key Design Decisions

### ASTNode and Value Classes

**Why:** The use of `ASTNode` and `Value` classes allows for a flexible and extensible representation of both program structure and data values. By leveraging these classes, the interpreter can handle various types of statements and expressions seamlessly.

### Environment Management

**Why:** An environment management system is essential for maintaining state across different scopes in the program. Using `std::shared_ptr<Environment>` ensures efficient memory management and sharing of environments between nested scopes.

### Step Counting to Prevent Infinite Loops

**Why:** Implementing a step counter (`stepCount_`) helps prevent infinite loops, especially in cases where user input might be empty or not properly handled. Setting a maximum number of steps (`MAX_STEPS`) provides a safety net, ensuring that the interpreter will terminate if it runs for too long.

## Class Documentation

### Interpreter Class

**Purpose:** The `Interpreter` class is the central component responsible for interpreting and executing QuantumLanguage programs. It manages the environment and handles the evaluation of AST nodes.

**Behaviour:**
- **Constructor (`Interpreter()`):** Initializes the interpreter with a global environment.
- **execute (`void execute(ASTNode &node)`):** Executes a single AST node.
- **evaluate (`QuantumValue evaluate(ASTNode &node)`):** Evaluates an AST node and returns its value.
- **execBlock (`void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr)`):** Executes a block of statements within a specified scope.
- **globals:** A shared pointer to the global environment, accessible throughout the interpreter.

### Private Member Functions

#### Statement Executors

- **execVarDecl (`void execVarDecl(VarDecl &s)`):** Handles variable declarations.
- **execFunctionDecl (`void execFunctionDecl(FunctionDecl &s)`):** Handles function declarations.
- **execClassDecl (`void execClassDecl(ClassDecl &s)`):** Handles class declarations.
- **execIf (`void execIf(IfStmt &s)`):** Handles conditional statements.
- **execWhile (`void execWhile(WhileStmt &s)`):** Handles while loops.
- **execFor (`void execFor(ForStmt &s)`):** Handles for loops.
- **execReturn (`void execReturn(ReturnStmt &s)`):** Handles return statements.
- **execPrint (`void execPrint(PrintStmt &s)`):** Handles print statements.
- **execInput (`void execInput(InputStmt &s)`):** Handles input statements.
- **execImport (`void execImport(ImportStmt &s)`):** Handles import statements.
- **execExprStmt (`void execExprStmt(ExprStmt &s)`):** Handles expression statements.

#### Expression Evaluators

- **evalBinary (`QuantumValue evalBinary(BinaryExpr &e)`):** Evaluates binary expressions.
- **evalUnary (`QuantumValue evalUnary(UnaryExpr &e)`):** Evaluates unary expressions.
- **evalAssign (`QuantumValue evalAssign(AssignExpr &e)`):** Evaluates assignment expressions.
- **evalCall (`QuantumValue evalCall(CallExpr &e)`):** Evaluates function calls.
- **evalIndex (`QuantumValue evalIndex(IndexExpr &e)`):** Evaluates index expressions.
- **evalMember (`QuantumValue evalMember(MemberExpr &e)`):** Evaluates member access expressions.
- **evalArray (`QuantumValue evalArray(ArrayLiteral &e)`):** Evaluates array literals.
- **evalDict (`QuantumValue evalDict(DictLiteral &e)`):** Evaluates dictionary literals.
- **evalLambda (`QuantumValue evalLambda(LambdaExpr &e)`):** Evaluates lambda expressions.
- **evalListComp (`QuantumValue evalListComp(ListComp &e)`):** Evaluates list comprehensions.
- **evalIdentifier (`QuantumValue evalIdentifier(Identifier &e)`):** Evaluates identifier expressions.

#### C++ Pointer Evaluators

- **evalAddressOf (`QuantumValue evalAddressOf(AddressOfExpr &e)`):** Evaluates address-of expressions (`&var`).
- **evalDeref (`QuantumValue evalDeref(DerefExpr &e)`):** Evaluates dereference expressions (`*ptr`).
- **evalArrow (`QuantumValue evalArrow(ArrowExpr &e)`):** Evaluates arrow expressions (`ptr->member`).
- **evalNewExpr (`QuantumValue evalNewExpr(NewExpr &e)`):** Evaluates new expressions (`new T(args)`).

#### Function Call Handlers

- **callFunction (`QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)`):** Calls a user-defined function.
- **callNative (`QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args)`):** Calls a native function.
- **callInstanceMethod (`QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args)`):** Calls a method on an instance object.

#### Built-In Method Dispatch

- **callMethod (`QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args