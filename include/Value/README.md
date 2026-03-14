# Value.h - Value System Header File Explanation

## Complete Code

```cpp
#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <functional>
#include <variant>
#include <stdexcept>

class Environment;
struct ASTNode;
class Interpreter;

// ─── Value Types ──────────────────────────────────────────────────────────────

struct QuantumNil
{
};

struct QuantumFunction
{
    std::string name;
    std::vector<std::string> params;
    std::vector<bool> paramIsRef; // true = pass-by-reference (int& r)
    std::vector<ASTNode*> defaultArgs;
    ASTNode *body;                // non-owning ptr
    std::shared_ptr<Environment> closure;
};

struct QuantumClass;
struct QuantumInstance;

using QuantumNativeFunc = std::function<struct QuantumValue(std::vector<struct QuantumValue>)>;

struct QuantumNative
{
    std::string name;
    QuantumNativeFunc fn;
};

struct QuantumValue;

using Array = std::vector<QuantumValue>;
using Dict = std::unordered_map<std::string, QuantumValue>;

// ─── Pointer Type ─────────────────────────────────────────────────────────────

struct QuantumPointer
{
    std::shared_ptr<QuantumValue> cell; // live reference to variable storage
    std::string varName;                // for display/debug
    int offset = 0;                     // for pointer arithmetic

    QuantumPointer() : cell(nullptr), varName(""), offset(0) {}

    bool isNull() const { return cell == nullptr; }

    QuantumValue &deref() const
    {
        if (!cell)
            throw std::runtime_error("Null pointer dereference");
        return *cell;
    }
};

struct QuantumValue
{
    using Data = std::variant<
        QuantumNil,
        bool,
        double,
        std::string,
        std::shared_ptr<Array>,
        std::shared_ptr<Dict>,
        std::shared_ptr<QuantumFunction>,
        std::shared_ptr<QuantumNative>,
        std::shared_ptr<QuantumInstance>,
        std::shared_ptr<QuantumClass>,
        std::shared_ptr<QuantumPointer>>;

    Data data;

    // Constructors
    QuantumValue() : data(QuantumNil{}) {}
    explicit QuantumValue(bool b) : data(b) {}
    explicit QuantumValue(double d) : data(d) {}
    explicit QuantumValue(const std::string &s) : data(s) {}
    explicit QuantumValue(std::string &&s) : data(std::move(s)) {}
    explicit QuantumValue(std::shared_ptr<Array> a) : data(std::move(a)) {}
    explicit QuantumValue(std::shared_ptr<Dict> d) : data(std::move(d)) {}
    explicit QuantumValue(std::shared_ptr<QuantumFunction> f) : data(std::move(f)) {}
    explicit QuantumValue(std::shared_ptr<QuantumNative> n) : data(std::move(n)) {}
    explicit QuantumValue(std::shared_ptr<QuantumInstance> i) : data(std::move(i)) {}
    explicit QuantumValue(std::shared_ptr<QuantumClass> c) : data(std::move(c)) {}
    explicit QuantumValue(std::shared_ptr<QuantumPointer> p) : data(std::move(p)) {}

    // Type checks
    bool isNil() const { return std::holds_alternative<QuantumNil>(data); }
    bool isBool() const { return std::holds_alternative<bool>(data); }
    bool isNumber() const { return std::holds_alternative<double>(data); }
    bool isString() const { return std::holds_alternative<std::string>(data); }
    bool isArray() const { return std::holds_alternative<std::shared_ptr<Array>>(data); }
    bool isDict() const { return std::holds_alternative<std::shared_ptr<Dict>>(data); }
    bool isFunction() const { return std::holds_alternative<std::shared_ptr<QuantumFunction>>(data) || std::holds_alternative<std::shared_ptr<QuantumNative>>(data); }
    bool isInstance() const { return std::holds_alternative<std::shared_ptr<QuantumInstance>>(data); }
    bool isClass() const { return std::holds_alternative<std::shared_ptr<QuantumClass>>(data); }
    bool isPointer() const { return std::holds_alternative<std::shared_ptr<QuantumPointer>>(data); }

    // Accessors
    bool asBool() const { return std::get<bool>(data); }
    double asNumber() const { return std::get<double>(data); }
    std::string asString() const { return std::get<std::string>(data); }
    std::shared_ptr<Array> asArray() const { return std::get<std::shared_ptr<Array>>(data); }
    std::shared_ptr<Dict> asDict() const { return std::get<std::shared_ptr<Dict>>(data); }
    std::shared_ptr<QuantumFunction> asFunction() const { return std::get<std::shared_ptr<QuantumFunction>>(data); }
    std::shared_ptr<QuantumInstance> asInstance() const { return std::get<std::shared_ptr<QuantumInstance>>(data); }
    std::shared_ptr<QuantumClass> asClass() const { return std::get<std::shared_ptr<QuantumClass>>(data); }
    std::shared_ptr<QuantumPointer> asPointer() const { return std::get<std::shared_ptr<QuantumPointer>>(data); }

    bool isNative() const;
    std::shared_ptr<QuantumNative> asNative() const;

    bool isTruthy() const;
    std::string toString() const;
    std::string typeName() const;
};

// ─── Environment ──────────────────────────────────────────────────────────────

class Environment : public std::enable_shared_from_this<Environment>
{
public:
    explicit Environment(std::shared_ptr<Environment> parent = nullptr);

    void define(const std::string &name, QuantumValue val, bool isConst = false);
    // defineRef: bind a parameter name directly to a shared cell (pass-by-reference)
    void defineRef(const std::string &name, std::shared_ptr<QuantumValue> cell);
    QuantumValue get(const std::string &name) const;
    void set(const std::string &name, QuantumValue val);
    bool has(const std::string &name) const;
    const std::unordered_map<std::string, QuantumValue> &getVars() const { return vars; }

    // Pointer support: get a shared cell for a variable so &var returns a live reference
    std::shared_ptr<QuantumValue> getCell(const std::string &name);

    std::shared_ptr<Environment> parent;

private:
    std::unordered_map<std::string, QuantumValue> vars;
    std::unordered_map<std::string, bool> constants;
    // Shared cells — created on first &var, keeps pointer alive
    std::unordered_map<std::string, std::shared_ptr<QuantumValue>> cells;
};

// ─── Class & Instance ────────────────────────────────────────────────────────

struct QuantumClass
{
    std::string name;
    std::shared_ptr<QuantumClass> base;
    std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> methods;
    std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> staticMethods;
    std::unordered_map<std::string, QuantumValue> staticFields;
};

struct QuantumInstance
{
    std::shared_ptr<QuantumClass> klass;
    std::unordered_map<std::string, QuantumValue> fields;
    std::shared_ptr<Environment> env;

    QuantumValue getField(const std::string &name) const;
    void setField(const std::string &name, QuantumValue val);
};

// ─── Control Flow Signals ────────────────────────────────────────────────────

struct ReturnSignal
{
    QuantumValue value;
    explicit ReturnSignal(QuantumValue v) : value(std::move(v)) {}
};

struct BreakSignal
{
};
struct ContinueSignal
{
};
```

## Code Explanation

###
-  `#pragma once` - Prevents multiple inclusion of this header file
-  `#include <string>` - Includes string functionality
-  `#include <vector>` - Includes dynamic array functionality
-  `#include <unordered_map>` - Includes hash map functionality
-  `#include <memory>` - Includes smart pointers
-  `#include <functional>` - Includes function objects
-  `#include <variant>` - Includes variant type for type-safe unions
-  `#include <stdexcept>` - Includes standard exceptions
-  Empty line for readability

###
-  `class Environment;` - Forward declares Environment class
-  `struct ASTNode;` - Forward declares ASTNode structure
-  `class Interpreter;` - Forward declares Interpreter class

###

####
-  Comment indicating value types section
-  `struct QuantumNil` - Empty struct representing null values
-  `{` - Opening brace
-  `};` - Closing brace

####
-  `struct QuantumFunction` - Function value structure
-  `{` - Opening brace
-  `std::string name;` - Function name
-  `std::vector<std::string> params;` - Parameter names
-  `std::vector<bool> paramIsRef; // true = pass-by-reference (int& r)` - Reference parameter flags
-  `std::vector<ASTNode*> defaultArgs;` - Default argument expressions
-  `ASTNode *body;                // non-owning ptr` - Function body (non-owning pointer)
-  `std::shared_ptr<Environment> closure;` - Lexical closure environment
-  Empty line for readability
-  Forward declarations for class and instance
-  `struct QuantumClass;`
-  `struct QuantumInstance;`

####
-  `using QuantumNativeFunc = std::function<struct QuantumValue(std::vector<struct QuantumValue>)>;` - Type alias for native function signature
-  Empty line for readability
-  `struct QuantumNative` - Native function structure
-  `{` - Opening brace
-  `std::string name;` - Function name
-  `QuantumNativeFunc fn;` - Function callable
-  `};` - Closing brace

####
-  `struct QuantumValue;` - Forward declaration
-  Empty line for readability
-  `using Array = std::vector<QuantumValue>;` - Array type alias
-  `using Dict = std::unordered_map<std::string, QuantumValue>;` - Dictionary type alias
-  Empty line for readability

###

####
-  Comment indicating pointer type section
-  `struct QuantumPointer` - Pointer value structure
-  `{` - Opening brace
-  `std::shared_ptr<QuantumValue> cell; // live reference to variable storage` - Shared reference to value
-  `std::string varName;                // for display/debug` - Variable name for debugging
-  `int offset = 0;                     // for pointer arithmetic` - Offset for pointer arithmetic
-  Empty line for readability

####
-  `QuantumPointer() : cell(nullptr), varName(""), offset(0) {}` - Default constructor
-  Empty line for readability

####
-  `bool isNull() const { return cell == nullptr; }` - Checks if pointer is null
-  Empty line for readability
-  `QuantumValue &deref() const` - Dereference operator
-  `{` - Opening brace
-  `if (!cell)` - Check for null pointer
-  `throw std::runtime_error("Null pointer dereference");` - Throw exception if null
-  `return *cell;` - Return dereferenced value
-  `}` - Closing brace
-  `};` - Closing brace for QuantumPointer
-  Empty line for readability

###

####
-  `struct QuantumValue` - Main value structure
-  `{` - Opening brace
-  `using Data = std::variant<` - Type alias for variant data
-  `QuantumNil,` - Null value
-  `bool,` - Boolean value
-  `double,` - Numeric value
-  `std::string,` - String value
-  `std::shared_ptr<Array>,` - Array value
-  `std::shared_ptr<Dict>,` - Dictionary value
-  `std::shared_ptr<QuantumFunction>,` - Function value
-  `std::shared_ptr<QuantumNative>,` - Native function value
-  `std::shared_ptr<QuantumInstance>,` - Object instance value
-  `std::shared_ptr<QuantumClass>,` - Class value
-  `std::shared_ptr<QuantumPointer>>;` - Pointer value
-  Empty line for readability

####
-  `Data data;` - Variant data member

####
-  Empty line for readability
-  Comment indicating constructors section
-  `QuantumValue() : data(QuantumNil{}) {}` - Default constructor (nil)
-  `explicit QuantumValue(bool b) : data(b) {}` - Boolean constructor
-  `explicit QuantumValue(double d) : data(d) {}` - Number constructor
-  `explicit QuantumValue(const std::string &s) : data(s) {}` - String constructor (copy)
-  `explicit QuantumValue(std::string &&s) : data(std::move(s)) {}` - String constructor (move)
-  `explicit QuantumValue(std::shared_ptr<Array> a) : data(std::move(a)) {}` - Array constructor
-  `explicit QuantumValue(std::shared_ptr<Dict> d) : data(std::move(d)) {}` - Dictionary constructor
-  `explicit QuantumValue(std::shared_ptr<QuantumFunction> f) : data(std::move(f)) {}` - Function constructor
-  `explicit QuantumValue(std::shared_ptr<QuantumNative> n) : data(std::move(n)) {}` - Native function constructor
-  `explicit QuantumValue(std::shared_ptr<QuantumInstance> i) : data(std::move(i)) {}` - Instance constructor
-  `explicit QuantumValue(std::shared_ptr<QuantumClass> c) : data(std::move(c)) {}` - Class constructor
-  `explicit QuantumValue(std::shared_ptr<QuantumPointer> p) : data(std::move(p)) {}` - Pointer constructor
-  Empty line for readability

####
-  Comment indicating type checks section
-  `bool isNil() const { return std::holds_alternative<QuantumNil>(data); }` - Check if nil
-  `bool isBool() const { return std::holds_alternative<bool>(data); }` - Check if boolean
-  `bool isNumber() const { return std::holds_alternative<double>(data); }` - Check if number
-  `bool isString() const { return std::holds_alternative<std::string>(data); }` - Check if string
-  `bool isArray() const { return std::holds_alternative<std::shared_ptr<Array>>(data); }` - Check if array
-  `bool isDict() const { return std::holds_alternative<std::shared_ptr<Dict>>(data); }` - Check if dictionary
-  `bool isFunction() const { return std::holds_alternative<std::shared_ptr<QuantumFunction>>(data) || std::holds_alternative<std::shared_ptr<QuantumNative>>(data); }` - Check if function
-  `bool isInstance() const { return std::holds_alternative<std::shared_ptr<QuantumInstance>>(data); }` - Check if instance
-  `bool isClass() const { return std::holds_alternative<std::shared_ptr<QuantumClass>>(data); }` - Check if class
-  `bool isPointer() const { return std::holds_alternative<std::shared_ptr<QuantumPointer>>(data); }` - Check if pointer
-  Empty line for readability

####
-  Comment indicating accessors section
-  `bool asBool() const { return std::get<bool>(data); }` - Get boolean value
-  `double asNumber() const { return std::get<double>(data); }` - Get number value
-  `std::string asString() const { return std::get<std::string>(data); }` - Get string value
-  `std::shared_ptr<Array> asArray() const { return std::get<std::shared_ptr<Array>>(data); }` - Get array value
-  `std::shared_ptr<Dict> asDict() const { return std::get<std::shared_ptr<Dict>>(data); }` - Get dictionary value
-  `std::shared_ptr<QuantumFunction> asFunction() const { return std::get<std::shared_ptr<QuantumFunction>>(data); }` - Get function value
-  `std::shared_ptr<QuantumInstance> asInstance() const { return std::get<std::shared_ptr<QuantumInstance>>(data); }` - Get instance value
-  `std::shared_ptr<QuantumClass> asClass() const { return std::get<std::shared_ptr<QuantumClass>>(data); }` - Get class value
-  `std::shared_ptr<QuantumPointer> asPointer() const { return std::get<std::shared_ptr<QuantumPointer>>(data); }` - Get pointer value
-  Empty line for readability

####
-  `bool isNative() const;` - Check if native function (implementation elsewhere)
-  `std::shared_ptr<QuantumNative> asNative() const;` - Get native function (implementation elsewhere)

####
-  `bool isTruthy() const;` - Check truthiness (implementation elsewhere)
-  `std::string toString() const;` - Convert to string (implementation elsewhere)
-  `std::string typeName() const;` - Get type name (implementation elsewhere)
-  `};` - Closing brace for QuantumValue

###

####
-  Comment indicating environment section
-  `class Environment : public std::enable_shared_from_this<Environment>` - Environment class with shared_from_this support
-  `{` - Opening brace

####
-  `public:` - Public section
-  `explicit Environment(std::shared_ptr<Environment> parent = nullptr);` - Constructor with optional parent
-  Empty line for readability

####
-  `void define(const std::string &name, QuantumValue val, bool isConst = false);` - Define variable
-  `// defineRef: bind a parameter name directly to a shared cell (pass-by-reference)` - Comment explaining reference binding
-  `void defineRef(const std::string &name, std::shared_ptr<QuantumValue> cell);` - Define reference variable
-  `QuantumValue get(const std::string &name) const;` - Get variable value
-  `void set(const std::string &name, QuantumValue val);` - Set variable value
-  `bool has(const std::string &name) const;` - Check if variable exists
-  `const std::unordered_map<std::string, QuantumValue> &getVars() const { return vars; }` - Get all variables

####
-  Empty line for readability
-  `// Pointer support: get a shared cell for a variable so &var returns a live reference` - Comment explaining pointer support
-  `std::shared_ptr<QuantumValue> getCell(const std::string &name);` - Get shared cell for pointer
-  Empty line for readability

####
-  `std::shared_ptr<Environment> parent;` - Parent environment reference

####
-  `private:` - Private section
-  `std::unordered_map<std::string, QuantumValue> vars;` - Variable storage
-  `std::unordered_map<std::string, bool> constants;` - Constant flags
-  `// Shared cells — created on first &var, keeps pointer alive` - Comment explaining shared cells
-  `std::unordered_map<std::string, std::shared_ptr<QuantumValue>> cells;` - Shared cell storage
-  `};` - Closing brace for Environment

###

####
-  Comment indicating class and instance section
-  `struct QuantumClass` - Class definition structure
-  `{` - Opening brace
-  `std::string name;` - Class name
-  `std::shared_ptr<QuantumClass> base;` - Base class (inheritance)
-  `std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> methods;` - Instance methods
-  `std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> staticMethods;` - Static methods
-  `std::unordered_map<std::string, QuantumValue> staticFields;` - Static fields
-  `};` - Closing brace

####
-  Empty line for readability
-  `struct QuantumInstance` - Object instance structure
-  `{` - Opening brace
-  `std::shared_ptr<QuantumClass> klass;` - Reference to class
-  `std::unordered_map<std::string, QuantumValue> fields;` - Instance fields
-  `std::shared_ptr<Environment> env;` - Instance environment
-  Empty line for readability

####
-  `QuantumValue getField(const std::string &name) const;` - Get instance field
-  `void setField(const std::string &name, QuantumValue val);` - Set instance field
-  `};` - Closing brace for QuantumInstance

###

####
-  Comment indicating control flow signals section
-  `struct ReturnSignal` - Return control flow signal
-  `{` - Opening brace
-  `QuantumValue value;` - Return value
-  `explicit ReturnSignal(QuantumValue v) : value(std::move(v)) {}` - Constructor
-  `};` - Closing brace
-  Empty line for readability

####
-  `struct BreakSignal` - Break loop signal
-  `{` - Opening brace
-  `};` - Closing brace
-  `struct ContinueSignal` - Continue loop signal
-  `{` - Opening brace
-  `};` - Closing brace

## Summary

This header file defines the complete value system for the Quantum Language runtime with:

### Core Value System
- **QuantumValue**: Main value container using std::variant for type-safe unions
- **Multiple Types**: Nil, bool, number, string, array, dict, function, instance, class, pointer
- **Type Safety**: Comprehensive type checking and accessor methods

### Advanced Features
- **Pointers**: C-style pointer support with live references and arithmetic
- **Functions**: Both user-defined and native function support
- **Objects**: Complete object-oriented system with inheritance
- **Collections**: Arrays and dictionaries with smart pointer management

### Environment System
- **Scoping**: Hierarchical environment with parent-child relationships
- **Variables**: Support for constants and regular variables
- **References**: Pass-by-reference parameter support
- **Memory Management**: Shared cells for pointer operations

### Object-Oriented Support
- **Classes**: Method storage, inheritance, static members
- **Instances**: Field management and environment binding
- **Methods**: Instance and static method support

### Control Flow
- **Signals**: Exception-like control flow for returns, breaks, continues
- **Non-Local**: Enables proper control flow in nested structures

### Design Principles
- **Memory Safety**: Smart pointers prevent memory leaks
- **Type Safety**: Variant prevents invalid type access
- **Performance**: Move semantics for efficient transfers
- **Extensibility**: Easy to add new value types

This value system provides a robust foundation for a multi-paradigm language with advanced features like pointers, objects, and functions while maintaining type safety and memory efficiency.
