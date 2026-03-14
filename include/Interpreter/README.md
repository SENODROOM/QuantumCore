# Interpreter.h - Interpreter Header File Explanation

## Complete Code

```cpp
#pragma once
#include "AST.h"
#include "Value.h"
#include <memory>

class Interpreter
{
public:
    Interpreter();
    void execute(ASTNode &node);
    QuantumValue evaluate(ASTNode &node);
    void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr);

    std::shared_ptr<Environment> globals;

private:
    std::shared_ptr<Environment> env;
    long long stepCount_ = 0; // guards against infinite loops (e.g. empty-stdin programs)
    static constexpr long long MAX_STEPS = 2'000'000;

    void registerNatives();

    // Statement executors
    void execVarDecl(VarDecl &s);
    void execFunctionDecl(FunctionDecl &s);
    void execClassDecl(ClassDecl &s);
    void execIf(IfStmt &s);
    void execWhile(WhileStmt &s);
    void execFor(ForStmt &s);
    void execReturn(ReturnStmt &s);
    void execPrint(PrintStmt &s);
    void execInput(InputStmt &s);
    void execImport(ImportStmt &s);
    void execExprStmt(ExprStmt &s);

    // Expression evaluators
    QuantumValue evalBinary(BinaryExpr &e);
    QuantumValue evalUnary(UnaryExpr &e);
    QuantumValue evalAssign(AssignExpr &e);
    QuantumValue evalCall(CallExpr &e);
    QuantumValue evalIndex(IndexExpr &e);
    QuantumValue evalMember(MemberExpr &e);
    QuantumValue evalArray(ArrayLiteral &e);
    QuantumValue evalDict(DictLiteral &e);
    QuantumValue evalLambda(LambdaExpr &e);
    QuantumValue evalListComp(ListComp &e);
    QuantumValue evalIdentifier(Identifier &e);

    // ── C++ Pointer evaluators ─────────────────────────────────────────────
    QuantumValue evalAddressOf(AddressOfExpr &e); // &var
    QuantumValue evalDeref(DerefExpr &e);         // *ptr
    QuantumValue evalArrow(ArrowExpr &e);         // ptr->member
    QuantumValue evalNewExpr(NewExpr &e);         // new T(args)

    QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);
    QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args);
    QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);

    // Built-in method dispatch
    QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args);
    QuantumValue callArrayMethod(std::shared_ptr<Array> arr, const std::string &method, std::vector<QuantumValue> args);
    QuantumValue callStringMethod(const std::string &str, const std::string &method, std::vector<QuantumValue> args);
    QuantumValue callDictMethod(std::shared_ptr<Dict> dict, const std::string &method, std::vector<QuantumValue> args);

    void setLValue(ASTNode &target, QuantumValue val, const std::string &op);
};
```

## Code Explanation

###
-  `#pragma once` - Prevents multiple inclusion of this header file
-  `#include "AST.h"` - Includes Abstract Syntax Tree definitions
-  `#include "Value.h"` - Includes value type definitions
-  `#include <memory>` - Includes smart pointer functionality
-  Empty line for readability

###
-  `class Interpreter` - Declares the Interpreter class that executes Quantum Language code

###

####
-  `public:` - Starts the public section of the class
-  `Interpreter();` - Default constructor declaration

####
-  `void execute(ASTNode &node);` - Executes a statement AST node
-  `QuantumValue evaluate(ASTNode &node);` - Evaluates an expression AST node and returns its value
-  `void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr);` - Executes a block of statements with optional scope

####
-  `std::shared_ptr<Environment> globals;` - Shared pointer to the global environment

###
-  `private:` - Starts the private section of the class

###

####
-  `std::shared_ptr<Environment> env;` - Current execution environment

####
-  `long long stepCount_ = 0;` - Counter to track execution steps
-  `static constexpr long long MAX_STEPS = 2'000'000;` - Maximum allowed steps to prevent infinite loops
-  Empty line for readability

###
-  `void registerNatives();` - Registers built-in native functions

###

####
-  `void execVarDecl(VarDecl &s);` - Executes variable declarations
-  `void execFunctionDecl(FunctionDecl &s);` - Executes function declarations
-  `void execClassDecl(ClassDecl &s);` - Executes class declarations

####
-  `void execIf(IfStmt &s);` - Executes if statements
-  `void execWhile(WhileStmt &s);` - Executes while loops
-  `void execFor(ForStmt &s);` - Executes for loops
-  `void execReturn(ReturnStmt &s);` - Executes return statements
-  `void execPrint(PrintStmt &s);` - Executes print statements
-  `void execInput(InputStmt &s);` - Executes input statements

####
-  `void execImport(ImportStmt &s);` - Executes import statements
-  `void execExprStmt(ExprStmt &s);` - Executes expression statements
-  Empty line for readability
-  Comment indicating expression evaluators section
-  Empty line for readability

###

####
-  `QuantumValue evalBinary(BinaryExpr &e);` - Evaluates binary expressions (a + b)
-  `QuantumValue evalUnary(UnaryExpr &e);` - Evaluates unary expressions (-a)
-  `QuantumValue evalAssign(AssignExpr &e);` - Evaluates assignment expressions (x = 5)
-  `QuantumValue evalCall(CallExpr &e);` - Evaluates function calls
-  `QuantumValue evalIndex(IndexExpr &e);` - Evaluates indexing expressions (arr[0])

####
-  `QuantumValue evalMember(MemberExpr &e);` - Evaluates member access (obj.prop)
-  `QuantumValue evalArray(ArrayLiteral &e);` - Evaluates array literals
-  `QuantumValue evalDict(DictLiteral &e);` - Evaluates dictionary literals
-  `QuantumValue evalLambda(LambdaExpr &e);` - Evaluates lambda expressions
-  `QuantumValue evalListComp(ListComp &e);` - Evaluates list comprehensions

####
-  `QuantumValue evalIdentifier(Identifier &e);` - Evaluates identifier references
-  Empty line for readability

###

####
-  Comment indicating C++ pointer evaluators section
-  `QuantumValue evalAddressOf(AddressOfExpr &e); // &var` - Evaluates address-of operator
-  `QuantumValue evalDeref(DerefExpr &e);         // *ptr` - Evaluates dereference operator
-  `QuantumValue evalArrow(ArrowExpr &e);         // ptr->member` - Evaluates arrow operator
-  `QuantumValue evalNewExpr(NewExpr &e);         // new T(args)` - Evaluates new expression
-  Empty line for readability

###

####
-  `QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);` - Calls user-defined functions
-  `QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args);` - Calls native functions
-  `QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);` - Calls instance methods

###

####
-  Comment indicating built-in method dispatch section
-  `QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args);` - Generic method dispatcher
-  `QuantumValue callArrayMethod(std::shared_ptr<Array> arr, const std::string &method, std::vector<QuantumValue> args);` - Array method dispatcher
-  `QuantumValue callStringMethod(const std::string &str, const std::string &method, std::vector<QuantumValue> args);` - String method dispatcher
-  `QuantumValue callDictMethod(std::shared_ptr<Dict> dict, const std::string &method, std::vector<QuantumValue> args);` - Dictionary method dispatcher

###

####
-  Empty line for readability
-  `void setLValue(ASTNode &target, QuantumValue val, const std::string &op);` - Sets the value of an l-value (target of assignment)

###
-  `};` - Closing brace for the Interpreter class

## Summary

This header file defines the core interpreter class for the Quantum Language with:

### Key Components
- **Execution Engine**: Main methods for executing statements and evaluating expressions
- **Environment Management**: Handles global and local scopes
- **Infinite Loop Protection**: Step counter to prevent endless execution
- **Native Function Support**: Built-in function registration and calling

### Statement Execution
- **Declarations**: Variables, functions, and classes
- **Control Flow**: If statements, loops, returns
- **I/O Operations**: Print and input statements
- **Modules**: Import statement handling

### Expression Evaluation
- **Basic Operations**: Binary, unary, and assignment expressions
- **Collections**: Arrays, dictionaries, and list comprehensions
- **Object-Oriented**: Member access and method calls
- **C++ Features**: Pointer operations and memory management

### Method System
- **Dynamic Dispatch**: Type-aware method calling
- **Built-in Methods**: Native implementations for arrays, strings, and dictionaries
- **Instance Methods**: Object-oriented method support

The interpreter provides a complete runtime environment for executing Quantum Language programs with support for multiple programming paradigms and advanced language features.
