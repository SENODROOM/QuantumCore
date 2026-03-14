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

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-5)
- **Line 1**: `#pragma once` - Prevents multiple inclusion of this header file
- **Line 2**: `#include "AST.h"` - Includes Abstract Syntax Tree definitions
- **Line 3**: `#include "Value.h"` - Includes value type definitions
- **Line 4**: `#include <memory>` - Includes smart pointer functionality
- **Line 5**: Empty line for readability

### Class Declaration (Line 6)
- **Line 6**: `class Interpreter` - Declares the Interpreter class that executes Quantum Language code

### Public Interface (Lines 7-14)

#### Constructor (Line 7)
- **Line 7**: `public:` - Starts the public section of the class
- **Line 8**: `Interpreter();` - Default constructor declaration

#### Main Execution Methods (Lines 9-11)
- **Line 9**: `void execute(ASTNode &node);` - Executes a statement AST node
- **Line 10**: `QuantumValue evaluate(ASTNode &node);` - Evaluates an expression AST node and returns its value
- **Line 11**: `void execBlock(BlockStmt &s, std::shared_ptr<Environment> scope = nullptr);` - Executes a block of statements with optional scope

#### Global Environment (Line 13)
- **Line 13**: `std::shared_ptr<Environment> globals;` - Shared pointer to the global environment

### Private Section (Line 15)
- **Line 15**: `private:` - Starts the private section of the class

### Private Member Variables (Lines 16-19)

#### Current Environment (Line 16)
- **Line 16**: `std::shared_ptr<Environment> env;` - Current execution environment

#### Infinite Loop Protection (Lines 17-19)
- **Line 17**: `long long stepCount_ = 0;` - Counter to track execution steps
- **Line 18**: `static constexpr long long MAX_STEPS = 2'000'000;` - Maximum allowed steps to prevent infinite loops
- **Line 19**: Empty line for readability

### Native Function Registration (Line 20)
- **Line 20**: `void registerNatives();` - Registers built-in native functions

### Statement Executors (Lines 22-35)

#### Variable and Function Declarations (Lines 22-24)
- **Line 22**: `void execVarDecl(VarDecl &s);` - Executes variable declarations
- **Line 23**: `void execFunctionDecl(FunctionDecl &s);` - Executes function declarations
- **Line 24**: `void execClassDecl(ClassDecl &s);` - Executes class declarations

#### Control Flow Statements (Lines 25-30)
- **Line 25**: `void execIf(IfStmt &s);` - Executes if statements
- **Line 26**: `void execWhile(WhileStmt &s);` - Executes while loops
- **Line 27**: `void execFor(ForStmt &s);` - Executes for loops
- **Line 28**: `void execReturn(ReturnStmt &s);` - Executes return statements
- **Line 29**: `void execPrint(PrintStmt &s);` - Executes print statements
- **Line 30**: `void execInput(InputStmt &s);` - Executes input statements

#### Other Statements (Lines 31-35)
- **Line 31**: `void execImport(ImportStmt &s);` - Executes import statements
- **Line 32**: `void execExprStmt(ExprStmt &s);` - Executes expression statements
- **Line 33**: Empty line for readability
- **Line 34**: Comment indicating expression evaluators section
- **Line 35**: Empty line for readability

### Expression Evaluators (Lines 36-50)

#### Basic Expression Evaluators (Lines 36-40)
- **Line 36**: `QuantumValue evalBinary(BinaryExpr &e);` - Evaluates binary expressions (a + b)
- **Line 37**: `QuantumValue evalUnary(UnaryExpr &e);` - Evaluates unary expressions (-a)
- **Line 38**: `QuantumValue evalAssign(AssignExpr &e);` - Evaluates assignment expressions (x = 5)
- **Line 39**: `QuantumValue evalCall(CallExpr &e);` - Evaluates function calls
- **Line 40**: `QuantumValue evalIndex(IndexExpr &e);` - Evaluates indexing expressions (arr[0])

#### Collection and Member Access (Lines 41-45)
- **Line 41**: `QuantumValue evalMember(MemberExpr &e);` - Evaluates member access (obj.prop)
- **Line 42**: `QuantumValue evalArray(ArrayLiteral &e);` - Evaluates array literals
- **Line 43**: `QuantumValue evalDict(DictLiteral &e);` - Evaluates dictionary literals
- **Line 44**: `QuantumValue evalLambda(LambdaExpr &e);` - Evaluates lambda expressions
- **Line 45**: `QuantumValue evalListComp(ListComp &e);` - Evaluates list comprehensions

#### Special Expressions (Lines 46-47)
- **Line 46**: `QuantumValue evalIdentifier(Identifier &e);` - Evaluates identifier references
- **Line 47**: Empty line for readability

### C++ Pointer Evaluators (Lines 48-53)

#### Pointer Operations (Lines 48-53)
- **Line 48**: Comment indicating C++ pointer evaluators section
- **Line 49**: `QuantumValue evalAddressOf(AddressOfExpr &e); // &var` - Evaluates address-of operator
- **Line 50**: `QuantumValue evalDeref(DerefExpr &e);         // *ptr` - Evaluates dereference operator
- **Line 51**: `QuantumValue evalArrow(ArrowExpr &e);         // ptr->member` - Evaluates arrow operator
- **Line 52**: `QuantumValue evalNewExpr(NewExpr &e);         // new T(args)` - Evaluates new expression
- **Line 53**: Empty line for readability

### Function Calling Methods (Lines 54-56)

#### Function Call Dispatch (Lines 54-56)
- **Line 54**: `QuantumValue callFunction(std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);` - Calls user-defined functions
- **Line 55**: `QuantumValue callNative(std::shared_ptr<QuantumNative> fn, std::vector<QuantumValue> args);` - Calls native functions
- **Line 56**: `QuantumValue callInstanceMethod(std::shared_ptr<QuantumInstance> inst, std::shared_ptr<QuantumFunction> fn, std::vector<QuantumValue> args);` - Calls instance methods

### Built-in Method Dispatch (Lines 57-61)

#### Method Calling System (Lines 57-61)
- **Line 57**: Comment indicating built-in method dispatch section
- **Line 58**: `QuantumValue callMethod(QuantumValue &obj, const std::string &method, std::vector<QuantumValue> args);` - Generic method dispatcher
- **Line 59**: `QuantumValue callArrayMethod(std::shared_ptr<Array> arr, const std::string &method, std::vector<QuantumValue> args);` - Array method dispatcher
- **Line 60**: `QuantumValue callStringMethod(const std::string &str, const std::string &method, std::vector<QuantumValue> args);` - String method dispatcher
- **Line 61**: `QuantumValue callDictMethod(std::shared_ptr<Dict> dict, const std::string &method, std::vector<QuantumValue> args);` - Dictionary method dispatcher

### Assignment Helper (Line 63)

#### L-Value Assignment (Line 63)
- **Line 62**: Empty line for readability
- **Line 63**: `void setLValue(ASTNode &target, QuantumValue val, const std::string &op);` - Sets the value of an l-value (target of assignment)

### Class Closing (Line 64)
- **Line 64**: `};` - Closing brace for the Interpreter class

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
