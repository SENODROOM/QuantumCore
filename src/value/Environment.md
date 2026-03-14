# Environment Class Methods Explanation

## Complete Code

```cpp
Environment::Environment(std::shared_ptr<Environment> p) : parent(std::move(p)) {}

void Environment::define(const std::string &name, QuantumValue val, bool isConst)
{
    vars[name] = std::move(val);
    if (isConst)
        constants[name] = true;
}

void Environment::defineRef(const std::string &name, std::shared_ptr<QuantumValue> cell)
{
    // Bind name directly to the shared cell — reads/writes go through it automatically
    cells[name] = cell;
    vars[name] = *cell; // keep vars in sync for iteration (e.g. getVars())
}

QuantumValue Environment::get(const std::string &name) const
{
    // Check cells first: if a pointer has written through &var, cells holds the live value
    auto cit = cells.find(name);
    if (cit != cells.end())
        return *cit->second;
    auto it = vars.find(name);
    if (it != vars.end())
        return it->second;
    if (parent)
        return parent->get(name);
    throw NameError("Undefined variable: '" + name + "'");
}

void Environment::set(const std::string &name, QuantumValue val)
{
    auto it = vars.find(name);
    if (it != vars.end())
    {
        if (constants.count(name))
            throw RuntimeError("Cannot reassign constant '" + name + "'");
        it->second = val; // update local vars map
        // Sync to any live shared cell (covers both pointer and ref cases)
        auto cit = cells.find(name);
        if (cit != cells.end())
            *cit->second = val;
        return;
    }
    if (parent)
    {
        parent->set(name, std::move(val));
        return;
    }
    throw NameError("Undefined variable: '" + name + "'");
}

bool Environment::has(const std::string &name) const
{
    if (vars.count(name))
        return true;
    if (parent)
        return parent->has(name);
    return false;
}

std::shared_ptr<QuantumValue> Environment::getCell(const std::string &name)
{
    // Look for existing cell in this scope
    auto cit = cells.find(name);
    if (cit != cells.end())
        return cit->second;

    // Look for the variable in this scope
    auto it = vars.find(name);
    if (it != vars.end())
    {
        // Create a shared cell synced to the current value
        auto cell = std::make_shared<QuantumValue>(it->second);
        cells[name] = cell;
        return cell;
    }

    // Walk parent scopes
    if (parent)
        return parent->getCell(name);
    return nullptr;
}
```

## Line-by-Line Explanation

### Constructor (Line 108)

#### Constructor Signature and Initialization
- **Line 108**: `Environment::Environment(std::shared_ptr<Environment> p) : parent(std::move(p)) {}` - Environment constructor
  - Takes optional parent environment for scoping
  - `std::move(p)` efficiently transfers ownership of parent pointer
  - Empty constructor body (all work done in initializer list)

### define() Method (Lines 110-115)

#### Method Signature
- **Line 110**: `void Environment::define(const std::string &name, QuantumValue val, bool isConst)` - Define a new variable
  - `name`: Variable name
  - `val`: Variable value
  - `isConst`: Whether the variable is constant

#### Implementation
- **Line 111**: `{` - Opening brace
- **Line 112**: `vars[name] = std::move(val);` - Store variable in vars map with efficient move
- **Line 113**: `if (isConst)` - Check if variable should be constant
- **Line 114**: `constants[name] = true;` - Mark as constant in constants map
- **Line 115**: `}` - Closing brace

### defineRef() Method (Lines 117-122)

#### Method Signature
- **Line 117**: `void Environment::defineRef(const std::string &name, std::shared_ptr<QuantumValue> cell)` - Define reference variable
  - Used for pass-by-reference parameters
  - Binds name directly to shared cell for live updates

#### Implementation
- **Line 118**: `{` - Opening brace
- **Line 119**: `// Bind name directly to the shared cell — reads/writes go through it automatically` - Comment explaining behavior
- **Line 120**: `cells[name] = cell;` - Store shared cell reference
- **Line 121**: `vars[name] = *cell; // keep vars in sync for iteration (e.g. getVars())` - Keep vars map synchronized
- **Line 122**: `}` - Closing brace

### get() Method (Lines 124-136)

#### Method Signature
- **Line 124**: `QuantumValue Environment::get(const std::string &name) const` - Get variable value
  - Searches current scope then parent scopes
  - Throws error if variable not found

#### Implementation
- **Line 125**: `{` - Opening brace
- **Line 126**: `// Check cells first: if a pointer has written through &var, cells holds the live value` - Comment about pointer priority
- **Line 127**: `auto cit = cells.find(name);` - Look for shared cell first
- **Line 128**: `if (cit != cells.end())` - If cell found
- **Line 129**: `return *cit->second;` - Return dereferenced cell value
- **Line 130**: `auto it = vars.find(name);` - Look in regular variables
- **Line 131**: `if (it != vars.end())` - If variable found
- **Line 132**: `return it->second;` - Return variable value
- **Line 133**: `if (parent)` - If there's a parent scope
- **Line 134**: `return parent->get(name);` - Recursively search parent
- **Line 135**: `throw NameError("Undefined variable: '" + name + "'");` - Throw error if not found anywhere
- **Line 136**: `}` - Closing brace

### set() Method (Lines 138-158)

#### Method Signature
- **Line 138**: `void Environment::set(const std::string &name, QuantumValue val)` - Set variable value
  - Updates existing variables or searches parent scopes
  - Throws error for undefined variables or constants

#### Implementation
- **Line 139**: `{` - Opening brace
- **Line 140**: `auto it = vars.find(name);` - Look for variable in current scope
- **Line 141**: `if (it != vars.end())` - If variable found locally
- **Line 142**: `{` - Opening brace for local variable handling
- **Line 143**: `if (constants.count(name))` - Check if variable is constant
- **Line 144**: `throw RuntimeError("Cannot reassign constant '" + name + "'");` - Throw error for constant reassignment
- **Line 145**: `it->second = val; // update local vars map` - Update variable value
- **Line 146**: `// Sync to any live shared cell (covers both pointer and ref cases)` - Comment about cell synchronization
- **Line 147**: `auto cit = cells.find(name);` - Look for shared cell
- **Line 148**: `if (cit != cells.end())` - If cell exists
- **Line 149**: `*cit->second = val;` - Update cell value too
- **Line 150**: `return;` - Exit function
- **Line 151**: `}` - Closing brace for local handling
- **Line 152**: `if (parent)` - If there's a parent scope
- **Line 153**: `{` - Opening brace for parent handling
- **Line 154**: `parent->set(name, std::move(val));` - Recursively set in parent
- **Line 155**: `return;` - Exit function
- **Line 156**: `}` - Closing brace for parent handling
- **Line 157**: `throw NameError("Undefined variable: '" + name + "'");` - Throw error if variable not found
- **Line 158**: `}` - Closing brace

### has() Method (Lines 160-167)

#### Method Signature
- **Line 160**: `bool Environment::has(const std::string &name) const` - Check if variable exists
  - Returns true if variable found in current or parent scopes

#### Implementation
- **Line 161**: `{` - Opening brace
- **Line 162**: `if (vars.count(name))` - Check current scope
- **Line 163**: `return true;` - Return true if found locally
- **Line 164**: `if (parent)` - If there's a parent scope
- **Line 165**: `return parent->has(name);` - Recursively check parent
- **Line 166**: `return false;` - Return false if not found anywhere
- **Line 167**: `}` - Closing brace

### getCell() Method (Lines 169-190)

#### Method Signature
- **Line 169**: `std::shared_ptr<QuantumValue> Environment::getCell(const std::string &name)` - Get shared cell for pointer operations
  - Returns shared pointer to variable storage for &var operations

#### Implementation
- **Line 170**: `{` - Opening brace
- **Line 171**: `// Look for existing cell in this scope` - Comment about existing cells
- **Line 172**: `auto cit = cells.find(name);` - Look for existing shared cell
- **Line 173**: `if (cit != cells.end())` - If cell found
- **Line 174**: `return cit->second;` - Return existing cell
- **Line 175**: Empty line for readability
- **Line 176**: `// Look for the variable in this scope` - Comment about variable lookup
- **Line 177**: `auto it = vars.find(name);` - Look for variable
- **Line 178**: `if (it != vars.end())` - If variable found
- **Line 179**: `{` - Opening brace for cell creation
- **Line 180**: `// Create a shared cell synced to the current value` - Comment about cell creation
- **Line 181**: `auto cell = std::make_shared<QuantumValue>(it->second);` - Create shared cell with current value
- **Line 182**: `cells[name] = cell;` - Store cell for future use
- **Line 183**: `return cell;` - Return new cell
- **Line 184**: `}` - Closing brace
- **Line 185**: Empty line for readability
- **Line 186**: `// Walk parent scopes` - Comment about parent search
- **Line 187**: `if (parent)` - If there's a parent scope
- **Line 188**: `return parent->getCell(name);` - Recursively search parent
- **Line 189**: `return nullptr;` - Return nullptr if not found anywhere
- **Line 190**: `}` - Closing brace

## Summary

The Environment class provides comprehensive variable and scope management for the Quantum Language:

### Key Features
- **Hierarchical Scoping**: Parent-child environment relationships
- **Variable Management**: Definition, retrieval, and assignment
- **Constants**: Protection against reassignment
- **References**: Pass-by-reference parameter support
- **Pointers**: C-style pointer operations with shared cells

### Storage Maps
- **vars**: Regular variable storage
- **constants**: Flags for constant variables
- **cells**: Shared cells for pointer/reference operations

### Error Handling
- **NameError**: Thrown for undefined variable access
- **RuntimeError**: Thrown for constant reassignment attempts

### Pointer Support
- **Live References**: Shared cells automatically sync with variable changes
- **Deterministic Addresses**: Consistent pointer addresses for debugging
- **Memory Safety**: Smart pointers prevent memory leaks

This environment system enables sophisticated language features like closures, lexical scoping, and C-style pointer operations while maintaining type safety and memory efficiency.
