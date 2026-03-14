# AST.h - Abstract Syntax Tree Header File Explanation

## Complete Code

```cpp
#pragma once
#include <memory>
#include <string>
#include <vector>
#include <variant>

// Forward declarations
struct ASTNode;
using ASTNodePtr = std::unique_ptr<ASTNode>;

// ─── Expression Types ───────────────────────────────────────────────────────

struct NumberLiteral
{
    double value;
};
struct StringLiteral
{
    std::string value;
};
struct BoolLiteral
{
    bool value;
};
struct NilLiteral
{
};

struct Identifier
{
    std::string name;
};

struct BinaryExpr
{
    std::string op;
    ASTNodePtr left, right;
};

struct UnaryExpr
{
    std::string op;
    ASTNodePtr operand;
};

struct AssignExpr
{
    std::string op; // = += -= *= /=
    ASTNodePtr target;
    ASTNodePtr value;
};

struct CallExpr
{
    ASTNodePtr callee;
    std::vector<ASTNodePtr> args;
};

struct IndexExpr
{
    ASTNodePtr object;
    ASTNodePtr index;
};

// Python slice: obj[start:stop:step]  — any part may be null (omitted)
struct SliceExpr
{
    ASTNodePtr object;
    ASTNodePtr start; // may be null → 0
    ASTNodePtr stop;  // may be null → end
    ASTNodePtr step;  // may be null → 1
};

struct MemberExpr
{
    ASTNodePtr object;
    std::string member;
};

struct ArrayLiteral
{
    std::vector<ASTNodePtr> elements;
};

struct DictLiteral
{
    std::vector<std::pair<ASTNodePtr, ASTNodePtr>> pairs;
};

struct LambdaExpr
{
    std::vector<std::string> params;
    std::vector<ASTNodePtr> defaultArgs;
    ASTNodePtr body;
};

struct TernaryExpr
{
    ASTNodePtr condition;
    ASTNodePtr thenExpr;
    ASTNodePtr elseExpr;
};

// super(args) or super.method(args)
struct SuperExpr
{
    std::string method; // empty = super constructor call
};

// ─── C++ Pointer Expression Types ────────────────────────────────────────────

// &var — address-of operator
struct AddressOfExpr
{
    ASTNodePtr operand;
};

// *ptr — dereference operator
struct DerefExpr
{
    ASTNodePtr operand;
};

// ptr->member — arrow (member access through pointer)
struct ArrowExpr
{
    ASTNodePtr object;
    std::string member;
};

// ─── Statement Types ─────────────────────────────────────────────────────────

struct VarDecl
{
    bool isConst;
    std::string name;
    ASTNodePtr initializer; // may be null
    std::string typeHint;   // e.g. "int", "float", "char", "" = none
    bool isPointer = false; // int* p = ...
};

struct FunctionDecl
{
    std::string name;
    std::vector<std::string> params;
    std::vector<bool> paramIsRef; // true = pass-by-reference (int& r), false = by-value
    std::vector<ASTNodePtr> defaultArgs;
    ASTNodePtr body;              // BlockStmt
};

struct ReturnStmt
{
    ASTNodePtr value; // may be null
};

struct IfStmt
{
    ASTNodePtr condition;
    ASTNodePtr thenBranch;
    // elif chains stored as else-if
    ASTNodePtr elseBranch; // may be null
};

struct WhileStmt
{
    ASTNodePtr condition;
    ASTNodePtr body;
};

struct ForStmt
{
    std::string var;
    std::string var2; // optional second variable for tuple unpacking: for k, v in ...
    ASTNodePtr iterable;
    ASTNodePtr body;
};

// List comprehension: [expr for var in iterable (if cond)?]
struct ListComp
{
    ASTNodePtr expr;               // the value expression
    std::vector<std::string> vars; // loop variable(s) — supports tuple unpacking
    ASTNodePtr iterable;
    ASTNodePtr condition; // optional if-filter (may be null)
};

struct TupleLiteral
{
    std::vector<ASTNodePtr> elements;
};

struct BlockStmt
{
    std::vector<ASTNodePtr> statements;
};

struct ExprStmt
{
    ASTNodePtr expr;
};

struct PrintStmt
{
    std::vector<ASTNodePtr> args;
    bool newline;
    std::string sep = " ";  // Python default: space between args
    std::string end = "\n"; // Python default: newline at end
};

struct InputStmt
{
    std::string target; // simple variable name (legacy)
    ASTNodePtr prompt;
    ASTNodePtr lvalueTarget; // optional: complex lvalue like arr[i]
};

struct BreakStmt
{
};
struct ContinueStmt
{
};
struct RaiseStmt
{
    ASTNodePtr value; // the exception value/message
};

struct ExceptClause
{
    std::string errorType; // e.g. "ValueError" — empty = bare except
    std::string alias;     // "as e" — empty if none
    std::shared_ptr<ASTNode> body;
};

struct TryStmt
{
    std::shared_ptr<ASTNode> body;
    std::vector<ExceptClause> handlers;
    std::shared_ptr<ASTNode> finallyBody; // may be null
};

struct ImportStmt
{
    std::string module; // e.g. "abc" for `from abc import...`, empty for `import sys`
    struct Item
    {
        std::string name;
        std::string alias; // empty if no alias
    };
    std::vector<Item> imports;
};

struct ClassDecl
{
    std::string name;
    std::string base; // optional
    std::vector<ASTNodePtr> methods;
    std::vector<ASTNodePtr> staticMethods;
    std::vector<ASTNodePtr> fields;
};

struct NewExpr
{
    std::string typeName;         // "int", "float", "MyClass", etc.
    std::vector<ASTNodePtr> args; // constructor args for new T(args)
    bool isArray = false;         // true for new T[n]
    ASTNodePtr sizeExpr;          // size expression for new T[n]
};

// ─── ASTNode variant ─────────────────────────────────────────────────────────

using NodeVariant = std::variant<
    NumberLiteral, StringLiteral, BoolLiteral, NilLiteral,
    Identifier,
    BinaryExpr, UnaryExpr, AssignExpr,
    CallExpr, IndexExpr, SliceExpr, MemberExpr,
    ArrayLiteral, DictLiteral, LambdaExpr, ListComp, TupleLiteral,
    VarDecl, FunctionDecl, ReturnStmt,
    IfStmt, WhileStmt, ForStmt,
    BlockStmt, ExprStmt,
    PrintStmt, InputStmt,
    BreakStmt, ContinueStmt, SuperExpr,
    RaiseStmt, TryStmt,
    ImportStmt, ClassDecl,
    TernaryExpr,
    AddressOfExpr, DerefExpr, ArrowExpr,
    NewExpr>;

struct ASTNode
{
    NodeVariant node;
    int line = 0;

    template <typename T>
    ASTNode(T &&n, int ln = 0) : node(std::forward<T>(n)), line(ln) {}

    template <typename T>
    T &as() { return std::get<T>(node); }

    template <typename T>
    const T &as() const { return std::get<T>(node); }

    template <typename T>
    bool is() const { return std::holds_alternative<T>(node); }
};
```

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-5)
- **Line 1**: `#pragma once` - Prevents the header from being included multiple times
- **Line 2**: `#include <memory>` - Includes smart pointers like `unique_ptr`
- **Line 3**: `#include <string>` - Includes string functionality
- **Line 4**: `#include <vector>` - Includes dynamic array functionality
- **Line 5**: `#include <variant>` - Includes variant type for storing different types

### Forward Declarations (Lines 7-9)
- **Line 7**: Comment indicating forward declarations section
- **Line 8**: `struct ASTNode;` - Forward declares the ASTNode structure
- **Line 9**: `using ASTNodePtr = std::unique_ptr<ASTNode>;` - Creates a type alias for unique pointer to ASTNode

### Expression Types Section (Lines 11-109)

#### Literal Types (Lines 13-27)
- **Lines 13-16**: `NumberLiteral` struct - Holds numeric values as double
- **Lines 17-20**: `StringLiteral` struct - Holds text values
- **Lines 21-24**: `BoolLiteral` struct - Holds true/false values
- **Lines 25-27**: `NilLiteral` struct - Represents null/empty values

#### Identifier and Basic Expressions (Lines 29-44)
- **Lines 29-32**: `Identifier` struct - Represents variable names
- **Lines 34-38**: `BinaryExpr` struct - Binary operations like `a + b`
- **Lines 40-44**: `UnaryExpr` struct - Unary operations like `-a`

#### Assignment and Function Calls (Lines 46-57)
- **Lines 46-51**: `AssignExpr` struct - Assignment operations like `x = 5`
- **Lines 53-57**: `CallExpr` struct - Function calls like `func(arg1, arg2)`

#### Indexing and Slicing (Lines 59-72)
- **Lines 59-63**: `IndexExpr` struct - Array/object access like `arr[0]`
- **Lines 65-72**: `SliceExpr` struct - Python-style slicing like `arr[1:5:2]`

#### Member Access and Collections (Lines 74-95)
- **Lines 74-78**: `MemberExpr` struct - Object member access like `obj.property`
- **Lines 80-83**: `ArrayLiteral` struct - Array literals like `[1, 2, 3]`
- **Lines 85-88**: `DictLiteral` struct - Dictionary literals like `{"key": "value"}`
- **Lines 90-95**: `LambdaExpr` struct - Anonymous functions

#### Advanced Expressions (Lines 97-109)
- **Lines 97-102**: `TernaryExpr` struct - Conditional expressions like `condition ? true : false`
- **Lines 104-109**: `SuperExpr` struct - Super class constructor/method calls

### C++ Pointer Expression Types (Lines 110-129)
- **Lines 112-116**: `AddressOfExpr` struct - `&var` operator
- **Lines 118-122**: `DerefExpr` struct - `*ptr` operator
- **Lines 124-129**: `ArrowExpr` struct - `ptr->member` operator

### Statement Types Section (Lines 131-268)

#### Variable and Function Declarations (Lines 133-149)
- **Lines 133-140**: `VarDecl` struct - Variable declarations with type hints
- **Lines 142-149**: `FunctionDecl` struct - Function definitions

#### Control Flow Statements (Lines 151-176)
- **Lines 151-154**: `ReturnStmt` struct - Return statements
- **Lines 156-162**: `IfStmt` struct - Conditional statements
- **Lines 164-168**: `WhileStmt` struct - While loops
- **Lines 170-176**: `ForStmt` struct - For loops with tuple unpacking support

#### Special Statements (Lines 178-226)
- **Lines 178-185**: `ListComp` struct - List comprehensions
- **Lines 187-190**: `TupleLiteral` struct - Tuple literals
- **Lines 192-195**: `BlockStmt` struct - Code blocks
- **Lines 197-200**: `ExprStmt` struct - Expression statements
- **Lines 202-208**: `PrintStmt` struct - Print statements with formatting
- **Lines 210-215**: `InputStmt` struct - Input statements
- **Lines 217-222**: `BreakStmt` and `ContinueStmt` structs - Loop control
- **Lines 223-226**: `RaiseStmt` struct - Exception throwing

#### Exception Handling (Lines 228-240)
- **Lines 228-233**: `ExceptClause` struct - Exception handlers
- **Lines 235-240**: `TryStmt` struct - Try-catch-finally blocks

#### Import and Class Statements (Lines 242-268)
- **Lines 242-251**: `ImportStmt` struct - Module imports
- **Lines 253-260**: `ClassDecl` struct - Class definitions
- **Lines 262-268**: `NewExpr` struct - Object instantiation

### ASTNode Variant (Lines 270-305)

#### NodeVariant Type Definition (Lines 272-287)
- **Lines 272-287**: `using NodeVariant = std::variant<...>` - Union type that can hold any AST node type

#### ASTNode Structure (Lines 289-305)
- **Lines 289-292**: `ASTNode` struct with node variant and line number
- **Lines 294-295**: Constructor template that forwards any node type
- **Lines 297-298**: `as()` method template for type-safe access
- **Lines 300-301**: Const version of `as()` method
- **Lines 303-304**: `is()` method template for type checking

## Summary

This header file defines the complete Abstract Syntax Tree structure for the Quantum Language compiler. It uses modern C++ features like:
- **Smart pointers** for memory management
- **Variants** for type-safe unions
- **Templates** for generic operations
- **Comprehensive node types** supporting multiple programming paradigms

The AST supports expressions, statements, control flow, object-oriented features, and C++ pointer operations, making it a versatile foundation for a multi-paradigm language.
