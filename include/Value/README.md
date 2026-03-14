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

## Line-by-Line Explanation

### Header Guard and Includes (Lines 1-9)
- **Line 1**: `#pragma once` - Prevents multiple inclusion of this header file
- **Line 2**: `#include <string>` - Includes string functionality
- **Line 3**: `#include <vector>` - Includes dynamic array functionality
- **Line 4**: `#include <unordered_map>` - Includes hash map functionality
- **Line 5**: `#include <memory>` - Includes smart pointers
- **Line 6**: `#include <functional>` - Includes function objects
- **Line 7**: `#include <variant>` - Includes variant type for type-safe unions
- **Line 8**: `#include <stdexcept>` - Includes standard exceptions
- **Line 9**: Empty line for readability

### Forward Declarations (Lines 10-12)
- **Line 10**: `class Environment;` - Forward declares Environment class
- **Line 11**: `struct ASTNode;` - Forward declares ASTNode structure
- **Line 12**: `class Interpreter;` - Forward declares Interpreter class

### Value Types Section (Lines 13-45)

#### Basic Value Types (Lines 13-16)
- **Line 13**: Comment indicating value types section
- **Line 14**: `struct QuantumNil` - Empty struct representing null values
- **Line 15**: `{` - Opening brace
- **Line 16**: `};` - Closing brace

#### Function Value Type (Lines 17-28)
- **Line 17**: `struct QuantumFunction` - Function value structure
- **Line 18**: `{` - Opening brace
- **Line 19**: `std::string name;` - Function name
- **Line 20**: `std::vector<std::string> params;` - Parameter names
- **Line 21**: `std::vector<bool> paramIsRef; // true = pass-by-reference (int& r)` - Reference parameter flags
- **Line 22**: `std::vector<ASTNode*> defaultArgs;` - Default argument expressions
- **Line 23**: `ASTNode *body;                // non-owning ptr` - Function body (non-owning pointer)
- **Line 24**: `std::shared_ptr<Environment> closure;` - Lexical closure environment
- **Line 25**: Empty line for readability
- **Line 26**: Forward declarations for class and instance
- **Line 27**: `struct QuantumClass;`
- **Line 28**: `struct QuantumInstance;`

#### Native Function Type (Lines 29-34)
- **Line 29**: `using QuantumNativeFunc = std::function<struct QuantumValue(std::vector<struct QuantumValue>)>;` - Type alias for native function signature
- **Line 30**: Empty line for readability
- **Line 31**: `struct QuantumNative` - Native function structure
- **Line 32**: `{` - Opening brace
- **Line 33**: `std::string name;` - Function name
- **Line 34**: `QuantumNativeFunc fn;` - Function callable
- **Line 35**: `};` - Closing brace

#### Collection Type Aliases (Lines 36-45)
- **Line 36**: `struct QuantumValue;` - Forward declaration
- **Line 37**: Empty line for readability
- **Line 38**: `using Array = std::vector<QuantumValue>;` - Array type alias
- **Line 39**: `using Dict = std::unordered_map<std::string, QuantumValue>;` - Dictionary type alias
- **Line 40**: Empty line for readability

### Pointer Type Section (Lines 41-65)

#### Pointer Structure (Lines 41-65)
- **Line 41**: Comment indicating pointer type section
- **Line 42**: `struct QuantumPointer` - Pointer value structure
- **Line 43**: `{` - Opening brace
- **Line 44**: `std::shared_ptr<QuantumValue> cell; // live reference to variable storage` - Shared reference to value
- **Line 45**: `std::string varName;                // for display/debug` - Variable name for debugging
- **Line 46**: `int offset = 0;                     // for pointer arithmetic` - Offset for pointer arithmetic
- **Line 47**: Empty line for readability

#### Pointer Constructor (Lines 48-49)
- **Line 48**: `QuantumPointer() : cell(nullptr), varName(""), offset(0) {}` - Default constructor
- **Line 49**: Empty line for readability

#### Pointer Methods (Lines 50-65)
- **Line 50**: `bool isNull() const { return cell == nullptr; }` - Checks if pointer is null
- **Line 51**: Empty line for readability
- **Line 52**: `QuantumValue &deref() const` - Dereference operator
- **Line 53**: `{` - Opening brace
- **Line 54**: `if (!cell)` - Check for null pointer
- **Line 55**: `throw std::runtime_error("Null pointer dereference");` - Throw exception if null
- **Line 56**: `return *cell;` - Return dereferenced value
- **Line 57**: `}` - Closing brace
- **Line 58**: `};` - Closing brace for QuantumPointer
- **Line 59**: Empty line for readability

### QuantumValue Structure (Lines 60-126)

#### Data Variant Definition (Lines 60-79)
- **Line 60**: `struct QuantumValue` - Main value structure
- **Line 61**: `{` - Opening brace
- **Line 62**: `using Data = std::variant<` - Type alias for variant data
- **Line 63**: `QuantumNil,` - Null value
- **Line 64**: `bool,` - Boolean value
- **Line 65**: `double,` - Numeric value
- **Line 66**: `std::string,` - String value
- **Line 67**: `std::shared_ptr<Array>,` - Array value
- **Line 68**: `std::shared_ptr<Dict>,` - Dictionary value
- **Line 69**: `std::shared_ptr<QuantumFunction>,` - Function value
- **Line 70**: `std::shared_ptr<QuantumNative>,` - Native function value
- **Line 71**: `std::shared_ptr<QuantumInstance>,` - Object instance value
- **Line 72**: `std::shared_ptr<QuantumClass>,` - Class value
- **Line 73**: `std::shared_ptr<QuantumPointer>>;` - Pointer value
- **Line 74**: Empty line for readability

#### Data Member (Line 75)
- **Line 75**: `Data data;` - Variant data member

#### Constructors (Lines 76-95)
- **Line 76**: Empty line for readability
- **Line 77**: Comment indicating constructors section
- **Line 78**: `QuantumValue() : data(QuantumNil{}) {}` - Default constructor (nil)
- **Line 79**: `explicit QuantumValue(bool b) : data(b) {}` - Boolean constructor
- **Line 80**: `explicit QuantumValue(double d) : data(d) {}` - Number constructor
- **Line 81**: `explicit QuantumValue(const std::string &s) : data(s) {}` - String constructor (copy)
- **Line 82**: `explicit QuantumValue(std::string &&s) : data(std::move(s)) {}` - String constructor (move)
- **Line 83**: `explicit QuantumValue(std::shared_ptr<Array> a) : data(std::move(a)) {}` - Array constructor
- **Line 84**: `explicit QuantumValue(std::shared_ptr<Dict> d) : data(std::move(d)) {}` - Dictionary constructor
- **Line 85**: `explicit QuantumValue(std::shared_ptr<QuantumFunction> f) : data(std::move(f)) {}` - Function constructor
- **Line 86**: `explicit QuantumValue(std::shared_ptr<QuantumNative> n) : data(std::move(n)) {}` - Native function constructor
- **Line 87**: `explicit QuantumValue(std::shared_ptr<QuantumInstance> i) : data(std::move(i)) {}` - Instance constructor
- **Line 88**: `explicit QuantumValue(std::shared_ptr<QuantumClass> c) : data(std::move(c)) {}` - Class constructor
- **Line 89**: `explicit QuantumValue(std::shared_ptr<QuantumPointer> p) : data(std::move(p)) {}` - Pointer constructor
- **Line 90**: Empty line for readability

#### Type Check Methods (Lines 91-107)
- **Line 91**: Comment indicating type checks section
- **Line 92**: `bool isNil() const { return std::holds_alternative<QuantumNil>(data); }` - Check if nil
- **Line 93**: `bool isBool() const { return std::holds_alternative<bool>(data); }` - Check if boolean
- **Line 94**: `bool isNumber() const { return std::holds_alternative<double>(data); }` - Check if number
- **Line 95**: `bool isString() const { return std::holds_alternative<std::string>(data); }` - Check if string
- **Line 96**: `bool isArray() const { return std::holds_alternative<std::shared_ptr<Array>>(data); }` - Check if array
- **Line 97**: `bool isDict() const { return std::holds_alternative<std::shared_ptr<Dict>>(data); }` - Check if dictionary
- **Line 98**: `bool isFunction() const { return std::holds_alternative<std::shared_ptr<QuantumFunction>>(data) || std::holds_alternative<std::shared_ptr<QuantumNative>>(data); }` - Check if function
- **Line 99**: `bool isInstance() const { return std::holds_alternative<std::shared_ptr<QuantumInstance>>(data); }` - Check if instance
- **Line 100**: `bool isClass() const { return std::holds_alternative<std::shared_ptr<QuantumClass>>(data); }` - Check if class
- **Line 101**: `bool isPointer() const { return std::holds_alternative<std::shared_ptr<QuantumPointer>>(data); }` - Check if pointer
- **Line 102**: Empty line for readability

#### Accessor Methods (Lines 103-118)
- **Line 103**: Comment indicating accessors section
- **Line 104**: `bool asBool() const { return std::get<bool>(data); }` - Get boolean value
- **Line 105**: `double asNumber() const { return std::get<double>(data); }` - Get number value
- **Line 106**: `std::string asString() const { return std::get<std::string>(data); }` - Get string value
- **Line 107**: `std::shared_ptr<Array> asArray() const { return std::get<std::shared_ptr<Array>>(data); }` - Get array value
- **Line 108**: `std::shared_ptr<Dict> asDict() const { return std::get<std::shared_ptr<Dict>>(data); }` - Get dictionary value
- **Line 109**: `std::shared_ptr<QuantumFunction> asFunction() const { return std::get<std::shared_ptr<QuantumFunction>>(data); }` - Get function value
- **Line 110**: `std::shared_ptr<QuantumInstance> asInstance() const { return std::get<std::shared_ptr<QuantumInstance>>(data); }` - Get instance value
- **Line 111**: `std::shared_ptr<QuantumClass> asClass() const { return std::get<std::shared_ptr<QuantumClass>>(data); }` - Get class value
- **Line 112**: `std::shared_ptr<QuantumPointer> asPointer() const { return std::get<std::shared_ptr<QuantumPointer>>(data); }` - Get pointer value
- **Line 113**: Empty line for readability

#### Native Function Methods (Lines 114-115)
- **Line 114**: `bool isNative() const;` - Check if native function (implementation elsewhere)
- **Line 115**: `std::shared_ptr<QuantumNative> asNative() const;` - Get native function (implementation elsewhere)

#### Utility Methods (Lines 116-118)
- **Line 116**: `bool isTruthy() const;` - Check truthiness (implementation elsewhere)
- **Line 117**: `std::string toString() const;` - Convert to string (implementation elsewhere)
- **Line 118**: `std::string typeName() const;` - Get type name (implementation elsewhere)
- **Line 119**: `};` - Closing brace for QuantumValue

### Environment Class (Lines 120-153)

#### Class Declaration (Lines 120-122)
- **Line 120**: Comment indicating environment section
- **Line 121**: `class Environment : public std::enable_shared_from_this<Environment>` - Environment class with shared_from_this support
- **Line 122**: `{` - Opening brace

#### Public Interface (Lines 123-142)
- **Line 123**: `public:` - Public section
- **Line 124**: `explicit Environment(std::shared_ptr<Environment> parent = nullptr);` - Constructor with optional parent
- **Line 125**: Empty line for readability

#### Variable Management (Lines 126-133)
- **Line 126**: `void define(const std::string &name, QuantumValue val, bool isConst = false);` - Define variable
- **Line 127**: `// defineRef: bind a parameter name directly to a shared cell (pass-by-reference)` - Comment explaining reference binding
- **Line 128**: `void defineRef(const std::string &name, std::shared_ptr<QuantumValue> cell);` - Define reference variable
- **Line 129**: `QuantumValue get(const std::string &name) const;` - Get variable value
- **Line 130**: `void set(const std::string &name, QuantumValue val);` - Set variable value
- **Line 131**: `bool has(const std::string &name) const;` - Check if variable exists
- **Line 132**: `const std::unordered_map<std::string, QuantumValue> &getVars() const { return vars; }` - Get all variables

#### Pointer Support (Lines 133-136)
- **Line 133**: Empty line for readability
- **Line 134**: `// Pointer support: get a shared cell for a variable so &var returns a live reference` - Comment explaining pointer support
- **Line 135**: `std::shared_ptr<QuantumValue> getCell(const std::string &name);` - Get shared cell for pointer
- **Line 136**: Empty line for readability

#### Parent Environment (Line 137)
- **Line 137**: `std::shared_ptr<Environment> parent;` - Parent environment reference

#### Private Members (Lines 138-153)
- **Line 138**: `private:` - Private section
- **Line 139**: `std::unordered_map<std::string, QuantumValue> vars;` - Variable storage
- **Line 140**: `std::unordered_map<std::string, bool> constants;` - Constant flags
- **Line 141**: `// Shared cells — created on first &var, keeps pointer alive` - Comment explaining shared cells
- **Line 142**: `std::unordered_map<std::string, std::shared_ptr<QuantumValue>> cells;` - Shared cell storage
- **Line 143**: `};` - Closing brace for Environment

### Class and Instance Structures (Lines 154-175)

#### Class Structure (Lines 154-165)
- **Line 154**: Comment indicating class and instance section
- **Line 155**: `struct QuantumClass` - Class definition structure
- **Line 156**: `{` - Opening brace
- **Line 157**: `std::string name;` - Class name
- **Line 158**: `std::shared_ptr<QuantumClass> base;` - Base class (inheritance)
- **Line 159**: `std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> methods;` - Instance methods
- **Line 160**: `std::unordered_map<std::string, std::shared_ptr<QuantumFunction>> staticMethods;` - Static methods
- **Line 161**: `std::unordered_map<std::string, QuantumValue> staticFields;` - Static fields
- **Line 162**: `};` - Closing brace

#### Instance Structure (Lines 163-175)
- **Line 163**: Empty line for readability
- **Line 164**: `struct QuantumInstance` - Object instance structure
- **Line 165**: `{` - Opening brace
- **Line 166**: `std::shared_ptr<QuantumClass> klass;` - Reference to class
- **Line 167**: `std::unordered_map<std::string, QuantumValue> fields;` - Instance fields
- **Line 168**: `std::shared_ptr<Environment> env;` - Instance environment
- **Line 169**: Empty line for readability

#### Instance Methods (Lines 170-175)
- **Line 170**: `QuantumValue getField(const std::string &name) const;` - Get instance field
- **Line 171**: `void setField(const std::string &name, QuantumValue val);` - Set instance field
- **Line 172**: `};` - Closing brace for QuantumInstance

### Control Flow Signals (Lines 176-189)

#### Signal Structures (Lines 176-189)
- **Line 176**: Comment indicating control flow signals section
- **Line 177**: `struct ReturnSignal` - Return control flow signal
- **Line 178**: `{` - Opening brace
- **Line 179**: `QuantumValue value;` - Return value
- **Line 180**: `explicit ReturnSignal(QuantumValue v) : value(std::move(v)) {}` - Constructor
- **Line 181**: `};` - Closing brace
- **Line 182**: Empty line for readability

#### Loop Control Signals (Lines 183-189)
- **Line 183**: `struct BreakSignal` - Break loop signal
- **Line 184**: `{` - Opening brace
- **Line 185**: `};` - Closing brace
- **Line 186**: `struct ContinueSignal` - Continue loop signal
- **Line 187**: `{` - Opening brace
- **Line 188**: `};` - Closing brace

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
