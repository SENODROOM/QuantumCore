# registerNatives() Function Explanation

## Complete Code

```cpp
void Interpreter::registerNatives()
{
    auto reg = [&](const std::string &name, QuantumNativeFunc fn)
    {
        auto native = std::make_shared<QuantumNative>();
        native->name = name;
        native->fn = std::move(fn);
        env->define(name, QuantumValue(native));
    };

    // ─── Math Functions ──────────────────────────────────────────────────────
    reg("abs", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("abs() takes exactly 1 argument");
        double n = args[0].toNum("abs");
        return QuantumValue(std::abs(n));
    });

    reg("sqrt", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("sqrt() takes exactly 1 argument");
        double n = args[0].toNum("sqrt");
        return QuantumValue(std::sqrt(n));
    });

    reg("pow", [](auto args) -> QuantumValue {
        if (args.size() != 2) throw TypeError("pow() takes exactly 2 arguments");
        double base = args[0].toNum("pow");
        double exp = args[1].toNum("pow");
        return QuantumValue(std::pow(base, exp));
    });

    reg("sin", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("sin() takes exactly 1 argument");
        double n = args[0].toNum("sin");
        return QuantumValue(std::sin(n));
    });

    reg("cos", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("cos() takes exactly 1 argument");
        double n = args[0].toNum("cos");
        return QuantumValue(std::cos(n));
    });

    reg("tan", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("tan() takes exactly 1 argument");
        double n = args[0].toNum("tan");
        return QuantumValue(std::tan(n));
    });

    reg("log", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("log() takes exactly 1 argument");
        double n = args[0].toNum("log");
        return QuantumValue(std::log(n));
    });

    reg("log10", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("log10() takes exactly 1 argument");
        double n = args[0].toNum("log10");
        return QuantumValue(std::log10(n));
    });

    reg("floor", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("floor() takes exactly 1 argument");
        double n = args[0].toNum("floor");
        return QuantumValue(std::floor(n));
    });

    reg("ceil", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("ceil() takes exactly 1 argument");
        double n = args[0].toNum("ceil");
        return QuantumValue(std::ceil(n));
    });

    reg("round", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("round() takes exactly 1 argument");
        double n = args[0].toNum("round");
        return QuantumValue(std::round(n));
    });

    // ─── String Functions ────────────────────────────────────────────────────
    reg("len", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("len() takes exactly 1 argument");
        if (args[0].isString())
            return QuantumValue((double)args[0].asString().size());
        if (args[0].isArray())
            return QuantumValue((double)args[0].asArray()->size());
        if (args[0].isDict())
            return QuantumValue((double)args[0].asDict()->size());
        throw TypeError("len() unsupported type: " + args[0].typeName());
    });

    reg("str", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("str() takes exactly 1 argument");
        return QuantumValue(args[0].toString());
    });

    reg("int", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("int() takes exactly 1 argument");
        return QuantumValue((double)args[0].toInt("int"));
    });

    reg("float", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("float() takes exactly 1 argument");
        return QuantumValue(args[0].toNum("float"));
    });

    reg("chr", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("chr() takes exactly 1 argument");
        int code = args[0].toInt("chr");
        return QuantumValue(std::string(1, (char)code));
    });

    reg("ord", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("ord() takes exactly 1 argument");
        std::string s = args[0].toString();
        if (s.empty())
            throw TypeError("ord() requires non-empty string");
        return QuantumValue((double)(int)s[0]);
    });

    // ─── I/O Functions ───────────────────────────────────────────────────────
    reg("print", [this](auto args) -> QuantumValue {
        std::string output;
        for (size_t i = 0; i < args.size(); ++i)
        {
            if (i > 0) output += " ";
            output += args[i].toString();
        }
        std::cout << output << std::endl;
        return QuantumValue();
    });

    reg("input", [this](auto args) -> QuantumValue {
        std::string prompt;
        if (!args.empty())
        {
            for (size_t i = 0; i < args.size(); ++i)
            {
                if (i > 0) prompt += " ";
                prompt += args[i].toString();
            }
        }
        std::cout << prompt;
        std::string line;
        std::getline(std::cin, line);
        return QuantumValue(line);
    });

    // ─── Array Functions ─────────────────────────────────────────────────────
    reg("append", [this](auto args) -> QuantumValue {
        if (args.size() != 2) throw TypeError("append() takes exactly 2 arguments");
        if (!args[0].isArray())
            throw TypeError("append() first argument must be array");
        args[0].asArray()->elements.push_back(args[1]);
        return QuantumValue();
    });

    reg("pop", [this](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("pop() takes exactly 1 argument");
        if (!args[0].isArray())
            throw TypeError("pop() argument must be array");
        auto arr = args[0].asArray();
        if (arr->elements.empty())
            throw RuntimeError("pop() from empty array");
        QuantumValue result = arr->elements.back();
        arr->elements.pop_back();
        return result;
    });

    reg("push", [this](auto args) -> QuantumValue {
        if (args.size() != 2) throw TypeError("push() takes exactly 2 arguments");
        if (!args[0].isArray())
            throw TypeError("push() first argument must be array");
        args[0].asArray()->elements.insert(args[0].asArray()->elements.begin(), args[1]);
        return QuantumValue();
    });

    // ─── Type Functions ─────────────────────────────────────────────────────
    reg("type", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("type() takes exactly 1 argument");
        return QuantumValue(args[0].typeName());
    });

    reg("isinstance", [](auto args) -> QuantumValue {
        if (args.size() != 2) throw TypeError("isinstance() takes exactly 2 arguments");
        return QuantumValue(args[0].typeName() == args[1].toString());
    });

    // ─── System Functions ───────────────────────────────────────────────────
    reg("exit", [this](auto args) -> QuantumValue {
        int code = 0;
        if (!args.empty())
            code = args[0].toInt("exit");
        std::exit(code);
        return QuantumValue();
    });

    reg("time", [](auto args) -> QuantumValue {
        if (!args.empty()) throw TypeError("time() takes no arguments");
        return QuantumValue((double)std::time(nullptr));
    });

    reg("rand", [](auto args) -> QuantumValue {
        if (!args.empty()) throw TypeError("rand() takes no arguments");
        return QuantumValue((double)std::rand() / RAND_MAX);
    });

    reg("srand", [](auto args) -> QuantumValue {
        if (args.size() != 1) throw TypeError("srand() takes exactly 1 argument");
        std::srand(args[0].toInt("srand"));
        return QuantumValue();
    });
}
```

## Code Explanation

### Function Signature
-  `void Interpreter::registerNatives()` - Register all built-in native functions
  - Called during interpreter initialization
  - Populates global environment with standard library functions

###
-  `{` - Opening brace
-  `auto reg = [&](const std::string &name, QuantumNativeFunc fn)` - Lambda to register functions
  - `name`: Function name as string
  - `fn`: Native function implementation
-  `{` - Opening brace for lambda
-  `auto native = std::make_shared<QuantumNative>();` - Create native function object
-  `native->name = name;` - Set function name
-  `native->fn = std::move(fn);` - Set function implementation
-  `env->define(name, QuantumValue(native));` - Define function in environment
-  `};` - Closing brace for lambda

###
-  Empty line for readability
-  `// ─── Math Functions ──────────────────────────────────────────────────────` - Math functions comment
-  Empty line for readability

###
-  `reg("abs", [](auto args) -> QuantumValue {` - Register abs function
-  `if (args.size() != 1) throw TypeError("abs() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("abs");` - Convert to number
-  `return QuantumValue(std::abs(n));` - Return absolute value
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("sqrt", [](auto args) -> QuantumValue {` - Register sqrt function
-  `if (args.size() != 1) throw TypeError("sqrt() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("sqrt");` - Convert to number
-  `return QuantumValue(std::sqrt(n));` - Return square root
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("pow", [](auto args) -> QuantumValue {` - Register pow function
-  `if (args.size() != 2) throw TypeError("pow() takes exactly 2 arguments");` - Validate arguments
-  `double base = args[0].toNum("pow");` - Get base number
-  `double exp = args[1].toNum("pow");` - Get exponent
-  `return QuantumValue(std::pow(base, exp));` - Return power
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("sin", [](auto args) -> QuantumValue {` - Register sin function
-  `if (args.size() != 1) throw TypeError("sin() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("sin");` - Convert to number
-  `return QuantumValue(std::sin(n));` - Return sine
-  `});` - Close lambda
-  Empty line for readability
-  `reg("cos", [](auto args) -> QuantumValue {` - Register cos function
-  `if (args.size() != 1) throw TypeError("cos() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("cos");` - Convert to number
-  `return QuantumValue(std::cos(n));` - Return cosine
-  `});` - Close lambda
-  Empty line for readability
-  `reg("tan", [](auto args) -> QuantumValue {` - Register tan function
-  `if (args.size() != 1) throw TypeError("tan() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("tan");` - Convert to number
-  `return QuantumValue(std::tan(n));` - Return tangent
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("log", [](auto args) -> QuantumValue {` - Register log function
-  `if (args.size() != 1) throw TypeError("log() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("log");` - Convert to number
-  `return QuantumValue(std::log(n));` - Return natural log
-  `});` - Close lambda
-  Empty line for readability
-  `reg("log10", [](auto args) -> QuantumValue {` - Register log10 function
-  `if (args.size() != 1) throw TypeError("log10() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("log10");` - Convert to number
-  `return QuantumValue(std::log10(n));` - Return base-10 log
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("floor", [](auto args) -> QuantumValue {` - Register floor function
-  `if (args.size() != 1) throw TypeError("floor() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("floor");` - Convert to number
-  `return QuantumValue(std::floor(n));` - Return floor value
-  `});` - Close lambda
-  Empty line for readability
-  `reg("ceil", [](auto args) -> QuantumValue {` - Register ceil function
-  `if (args.size() != 1) throw TypeError("ceil() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("ceil");` - Convert to number
-  `return QuantumValue(std::ceil(n));` - Return ceiling value
-  `});` - Close lambda
-  Empty line for readability
-  `reg("round", [](auto args) -> QuantumValue {` - Register round function
-  `if (args.size() != 1) throw TypeError("round() takes exactly 1 argument");` - Validate arguments
-  `double n = args[0].toNum("round");` - Convert to number
-  `return QuantumValue(std::round(n));` - Return rounded value
-  `});` - Close lambda
-  Empty line for readability

###
-  Empty line for readability
-  `// ─── String Functions ────────────────────────────────────────────────────` - String functions comment
-  Empty line for readability

###
-  `reg("len", [](auto args) -> QuantumValue {` - Register len function
-  `if (args.size() != 1) throw TypeError("len() takes exactly 1 argument");` - Validate arguments
-  `if (args[0].isString())` - Check if string
-  `return QuantumValue((double)args[0].asString().size());` - Return string length
-  `if (args[0].isArray())` - Check if array
-  `return QuantumValue((double)args[0].asArray()->size());` - Return array length
-  `if (args[0].isDict())` - Check if dictionary
-  `return QuantumValue((double)args[0].asDict()->size());` - Return dict length
-  `throw TypeError("len() unsupported type: " + args[0].typeName());` - Error for unsupported type
-  `});` - Close lambda

###
-  Empty line for readability
-  `reg("str", [](auto args) -> QuantumValue {` - Register str function
-  `if (args.size() != 1) throw TypeError("str() takes exactly 1 argument");` - Validate arguments
-  `return QuantumValue(args[0].toString());` - Convert to string
-  `});` - Close lambda
-  Empty line for readability
-  `reg("int", [](auto args) -> QuantumValue {` - Register int function
-  `if (args.size() != 1) throw TypeError("int() takes exactly 1 argument");` - Validate arguments
-  `return QuantumValue((double)args[0].toInt("int"));` - Convert to integer
-  `});` - Close lambda
-  Empty line for readability
-  `reg("float", [](auto args) -> QuantumValue {` - Register float function
-  `if (args.size() != 1) throw TypeError("float() takes exactly 1 argument");` - Validate arguments
-  `return QuantumValue(args[0].toNum("float"));` - Convert to float
-  `});` - Close lambda
-  Empty line for readability
-  `reg("chr", [](auto args) -> QuantumValue {` - Register chr function
-  `if (args.size() != 1) throw TypeError("chr() takes exactly 1 argument");` - Validate arguments
-  `int code = args[0].toInt("chr");` - Convert to integer
-  `return QuantumValue(std::string(1, (char)code));` - Convert to character string
-  `});` - Close lambda
-  Empty line for readability
-  `reg("ord", [](auto args) -> QuantumValue {` - Register ord function

###
-  `if (args.size() != 1) throw TypeError("ord() takes exactly 1 argument");` - Validate arguments
-  `std::string s = args[0].toString();` - Convert to string
-  `if (s.empty())` - Check if empty string
-  `throw TypeError("ord() requires non-empty string");` - Error for empty string
-  `return QuantumValue((double)(int)s[0]);` - Return character code
-  `});` - Close lambda
-  Empty line for readability

###
-  Empty line for readability
-  `// ─── I/O Functions ───────────────────────────────────────────────────────` - I/O functions comment
-  Empty line for readability

###
-  `reg("print", [this](auto args) -> QuantumValue {` - Register print function
-  `std::string output;` - Create output string
-  `for (size_t i = 0; i < args.size(); ++i)` - Loop through arguments
-  `{` - Opening brace for loop
-  `if (i > 0) output += " ";` - Add space between arguments
-  `output += args[i].toString();` - Add argument string
-  `}` - Closing brace for loop
-  `std::cout << output << std::endl;` - Print to stdout
-  `return QuantumValue();` - Return nil
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("input", [this](auto args) -> QuantumValue {` - Register input function
-  `std::string prompt;` - Create prompt string
-  `if (!args.empty())` - Check if prompt provided
-  `{` - Opening brace for prompt
-  `for (size_t i = 0; i < args.size(); ++i)` - Loop through arguments
-  `{` - Opening brace for loop
-  `if (i > 0) prompt += " ";` - Add space between arguments
-  `prompt += args[i].toString();` - Add argument string
-  `}` - Closing brace for loop
-  `}` - Closing brace for prompt
-  `std::cout << prompt;` - Display prompt
-  `std::string line;` - Create line string
-  `std::getline(std::cin, line);` - Read input line
-  `return QuantumValue(line);` - Return input string

###
-  `});` - Close input lambda
-  Empty line for readability
-  `// ─── Array Functions ─────────────────────────────────────────────────────` - Array functions comment
-  Empty line for readability

###
-  `reg("append", [this](auto args) -> QuantumValue {` - Register append function
-  `if (args.size() != 2) throw TypeError("append() takes exactly 2 arguments");` - Validate arguments
-  `if (!args[0].isArray())` - Check if first argument is array
-  `throw TypeError("append() first argument must be array");` - Error for non-array
-  `args[0].asArray()->elements.push_back(args[1]);` - Append element
-  `return QuantumValue();` - Return nil
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("pop", [this](auto args) -> QuantumValue {` - Register pop function
-  `if (args.size() != 1) throw TypeError("pop() takes exactly 1 argument");` - Validate arguments
-  `if (!args[0].isArray())` - Check if argument is array
-  `throw TypeError("pop() argument must be array");` - Error for non-array
-  `auto arr = args[0].asArray();` - Get array reference
-  `if (arr->elements.empty())` - Check if empty
-  `throw RuntimeError("pop() from empty array");` - Error for empty array
-  `QuantumValue result = arr->elements.back();` - Get last element
-  `arr->elements.pop_back();` - Remove last element
-  `return result;` - Return popped element
-  `});` - Close lambda

###
-  Empty line for readability
-  `reg("push", [this](auto args) -> QuantumValue {` - Register push function
-  `if (args.size() != 2) throw TypeError("push() takes exactly 2 arguments");` - Validate arguments
-  `if (!args[0].isArray())` - Check if first argument is array
-  `throw TypeError("push() first argument must be array");` - Error for non-array
-  `args[0].asArray()->elements.insert(args[0].asArray()->elements.begin(), args[1]);` - Insert at front
-  `return QuantumValue();` - Return nil
-  `});` - Close lambda
-  Empty line for readability

###
-  Empty line for readability
-  `// ─── Type Functions ─────────────────────────────────────────────────────` - Type functions comment
-  Empty line for readability

###
-  `reg("type", [](auto args) -> QuantumValue {` - Register type function
-  `if (args.size() != 1) throw TypeError("type() takes exactly 1 argument");` - Validate arguments
-  `return QuantumValue(args[0].typeName());` - Return type name
-  `});` - Close lambda
-  Empty line for readability
-  `reg("isinstance", [](auto args) -> QuantumValue {` - Register isinstance function
-  `if (args.size() != 2) throw TypeError("isinstance() takes exactly 2 arguments");` - Validate arguments
-  `return QuantumValue(args[0].typeName() == args[1].toString());` - Compare types
-  `});` - Close lambda
-  Empty line for readability

###
-  Empty line for readability
-  `// ─── System Functions ───────────────────────────────────────────────────` - System functions comment
-  Empty line for readability

###
-  `reg("exit", [this](auto args) -> QuantumValue {` - Register exit function
-  `int code = 0;` - Default exit code
-  `if (!args.empty())` - Check if exit code provided
-  `code = args[0].toInt("exit");` - Convert to integer
-  `std::exit(code);` - Exit program
-  `return QuantumValue();` - Return nil (unreachable)
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("time", [](auto args) -> QuantumValue {` - Register time function
-  `if (!args.empty()) throw TypeError("time() takes no arguments");` - Validate no arguments
-  `return QuantumValue((double)std::time(nullptr));` - Return current time
-  `});` - Close lambda
-  Empty line for readability

###
-  `reg("rand", [](auto args) -> QuantumValue {` - Register rand function
-  `if (!args.empty()) throw TypeError("rand() takes no arguments");` - Validate no arguments
-  `return QuantumValue((double)std::rand() / RAND_MAX);` - Return random number
-  `});` - Close lambda
-  Empty line for readability
-  `reg("srand", [](auto args) -> QuantumValue {` - Register srand function
-  `if (args.size() != 1) throw TypeError("srand() takes exactly 1 argument");` - Validate arguments
-  `std::srand(args[0].toInt("srand"));` - Set random seed
-  `return QuantumValue();` - Return nil
-  `});` - Close lambda
- **Line 562`: Empty line for readability
-  `}` - Closing brace for function

## Summary

The `registerNatives()` function populates the interpreter's global environment with built-in functions:

### Key Features
- **Comprehensive Library**: Math, string, I/O, array, type, and system functions
- **Type Safety**: Proper argument validation and type checking
- **Error Handling**: Clear error messages for invalid usage
- **Efficient Registration**: Lambda-based function registration

### Function Categories
- **Math Functions**: abs, sqrt, pow, sin, cos, tan, log, log10, floor, ceil, round
- **String Functions**: len, str, int, float, chr, ord
- **I/O Functions**: print, input
- **Array Functions**: append, pop, push
- **Type Functions**: type, isinstance
- **System Functions**: exit, time, rand, srand

### Registration Process
1. **Lambda Creation**: Create registration lambda for convenience
2. **Function Definition**: Define each native function as lambda
3. **Environment Registration**: Add function to global environment
4. **Type Safety**: Validate arguments and return types

### Design Benefits
- **Modular Design**: Each function is independently defined
- **Consistent Interface**: All functions follow same pattern
- **Error Handling**: Comprehensive error checking and messages
- **Performance**: Direct C++ implementation for maximum speed

### Standard Library Coverage
- **Mathematical Operations**: Complete math function library
- **String Manipulation**: Essential string operations
- **Input/Output**: Console I/O operations
- **Data Structures**: Array manipulation functions
- **Type System**: Type inspection and conversion
- **System Interface**: System-level operations

This function provides the foundation for the Quantum Language's standard library, ensuring that all essential built-in functions are available when the interpreter starts up, with proper error handling and type safety throughout.
