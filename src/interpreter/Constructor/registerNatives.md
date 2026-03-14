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

## Line-by-Line Explanation

### Function Signature (Line 341)
- **Line 341**: `void Interpreter::registerNatives()` - Register all built-in native functions
  - Called during interpreter initialization
  - Populates global environment with standard library functions

### Registration Lambda (Lines 342-349)
- **Line 342**: `{` - Opening brace
- **Line 343**: `auto reg = [&](const std::string &name, QuantumNativeFunc fn)` - Lambda to register functions
  - `name`: Function name as string
  - `fn`: Native function implementation
- **Line 344**: `{` - Opening brace for lambda
- **Line 345**: `auto native = std::make_shared<QuantumNative>();` - Create native function object
- **Line 346**: `native->name = name;` - Set function name
- **Line 347**: `native->fn = std::move(fn);` - Set function implementation
- **Line 348**: `env->define(name, QuantumValue(native));` - Define function in environment
- **Line 349**: `};` - Closing brace for lambda

### Math Functions Section (Lines 350-352)
- **Line 350**: Empty line for readability
- **Line 351**: `// ─── Math Functions ──────────────────────────────────────────────────────` - Math functions comment
- **Line 352**: Empty line for readability

### abs() Function (Lines 353-358)
- **Line 353**: `reg("abs", [](auto args) -> QuantumValue {` - Register abs function
- **Line 354**: `if (args.size() != 1) throw TypeError("abs() takes exactly 1 argument");` - Validate arguments
- **Line 355**: `double n = args[0].toNum("abs");` - Convert to number
- **Line 356**: `return QuantumValue(std::abs(n));` - Return absolute value
- **Line 357**: `});` - Close lambda
- **Line 358**: Empty line for readability

### sqrt() Function (Lines 359-364)
- **Line 359**: `reg("sqrt", [](auto args) -> QuantumValue {` - Register sqrt function
- **Line 360**: `if (args.size() != 1) throw TypeError("sqrt() takes exactly 1 argument");` - Validate arguments
- **Line 361**: `double n = args[0].toNum("sqrt");` - Convert to number
- **Line 362**: `return QuantumValue(std::sqrt(n));` - Return square root
- **Line 363**: `});` - Close lambda
- **Line 364**: Empty line for readability

### pow() Function (Lines 365-371)
- **Line 365**: `reg("pow", [](auto args) -> QuantumValue {` - Register pow function
- **Line 366**: `if (args.size() != 2) throw TypeError("pow() takes exactly 2 arguments");` - Validate arguments
- **Line 367**: `double base = args[0].toNum("pow");` - Get base number
- **Line 368**: `double exp = args[1].toNum("pow");` - Get exponent
- **Line 369**: `return QuantumValue(std::pow(base, exp));` - Return power
- **Line 370**: `});` - Close lambda
- **Line 371**: Empty line for readability

### Trigonometric Functions (Lines 372-395)
- **Line 372**: `reg("sin", [](auto args) -> QuantumValue {` - Register sin function
- **Line 373**: `if (args.size() != 1) throw TypeError("sin() takes exactly 1 argument");` - Validate arguments
- **Line 374**: `double n = args[0].toNum("sin");` - Convert to number
- **Line 375**: `return QuantumValue(std::sin(n));` - Return sine
- **Line 376**: `});` - Close lambda
- **Line 377**: Empty line for readability
- **Line 378**: `reg("cos", [](auto args) -> QuantumValue {` - Register cos function
- **Line 379**: `if (args.size() != 1) throw TypeError("cos() takes exactly 1 argument");` - Validate arguments
- **Line 380**: `double n = args[0].toNum("cos");` - Convert to number
- **Line 381**: `return QuantumValue(std::cos(n));` - Return cosine
- **Line 382**: `});` - Close lambda
- **Line 383**: Empty line for readability
- **Line 384**: `reg("tan", [](auto args) -> QuantumValue {` - Register tan function
- **Line 385**: `if (args.size() != 1) throw TypeError("tan() takes exactly 1 argument");` - Validate arguments
- **Line 386**: `double n = args[0].toNum("tan");` - Convert to number
- **Line 387**: `return QuantumValue(std::tan(n));` - Return tangent
- **Line 388**: `});` - Close lambda
- **Line 389**: Empty line for readability

### Logarithmic Functions (Lines 390-405)
- **Line 390**: `reg("log", [](auto args) -> QuantumValue {` - Register log function
- **Line 391**: `if (args.size() != 1) throw TypeError("log() takes exactly 1 argument");` - Validate arguments
- **Line 392**: `double n = args[0].toNum("log");` - Convert to number
- **Line 393**: `return QuantumValue(std::log(n));` - Return natural log
- **Line 394**: `});` - Close lambda
- **Line 395**: Empty line for readability
- **Line 396**: `reg("log10", [](auto args) -> QuantumValue {` - Register log10 function
- **Line 397**: `if (args.size() != 1) throw TypeError("log10() takes exactly 1 argument");` - Validate arguments
- **Line 398**: `double n = args[0].toNum("log10");` - Convert to number
- **Line 399**: `return QuantumValue(std::log10(n));` - Return base-10 log
- **Line 400**: `});` - Close lambda
- **Line 401**: Empty line for readability

### Rounding Functions (Lines 402-425)
- **Line 402**: `reg("floor", [](auto args) -> QuantumValue {` - Register floor function
- **Line 403**: `if (args.size() != 1) throw TypeError("floor() takes exactly 1 argument");` - Validate arguments
- **Line 404**: `double n = args[0].toNum("floor");` - Convert to number
- **Line 405**: `return QuantumValue(std::floor(n));` - Return floor value
- **Line 406**: `});` - Close lambda
- **Line 407**: Empty line for readability
- **Line 408**: `reg("ceil", [](auto args) -> QuantumValue {` - Register ceil function
- **Line 409**: `if (args.size() != 1) throw TypeError("ceil() takes exactly 1 argument");` - Validate arguments
- **Line 410**: `double n = args[0].toNum("ceil");` - Convert to number
- **Line 411**: `return QuantumValue(std::ceil(n));` - Return ceiling value
- **Line 412**: `});` - Close lambda
- **Line 413**: Empty line for readability
- **Line 414**: `reg("round", [](auto args) -> QuantumValue {` - Register round function
- **Line 415**: `if (args.size() != 1) throw TypeError("round() takes exactly 1 argument");` - Validate arguments
- **Line 416**: `double n = args[0].toNum("round");` - Convert to number
- **Line 417**: `return QuantumValue(std::round(n));` - Return rounded value
- **Line 418**: `});` - Close lambda
- **Line 419**: Empty line for readability

### String Functions Section (Lines 420-422)
- **Line 420**: Empty line for readability
- **Line 421**: `// ─── String Functions ────────────────────────────────────────────────────` - String functions comment
- **Line 422**: Empty line for readability

### len() Function (Lines 423-432)
- **Line 423**: `reg("len", [](auto args) -> QuantumValue {` - Register len function
- **Line 424**: `if (args.size() != 1) throw TypeError("len() takes exactly 1 argument");` - Validate arguments
- **Line 425**: `if (args[0].isString())` - Check if string
- **Line 426**: `return QuantumValue((double)args[0].asString().size());` - Return string length
- **Line 427**: `if (args[0].isArray())` - Check if array
- **Line 428**: `return QuantumValue((double)args[0].asArray()->size());` - Return array length
- **Line 429**: `if (args[0].isDict())` - Check if dictionary
- **Line 430**: `return QuantumValue((double)args[0].asDict()->size());` - Return dict length
- **Line 431**: `throw TypeError("len() unsupported type: " + args[0].typeName());` - Error for unsupported type
- **Line 432**: `});` - Close lambda

### Type Conversion Functions (Lines 433-455)
- **Line 433**: Empty line for readability
- **Line 434**: `reg("str", [](auto args) -> QuantumValue {` - Register str function
- **Line 435**: `if (args.size() != 1) throw TypeError("str() takes exactly 1 argument");` - Validate arguments
- **Line 436**: `return QuantumValue(args[0].toString());` - Convert to string
- **Line 437**: `});` - Close lambda
- **Line 438**: Empty line for readability
- **Line 439**: `reg("int", [](auto args) -> QuantumValue {` - Register int function
- **Line 440**: `if (args.size() != 1) throw TypeError("int() takes exactly 1 argument");` - Validate arguments
- **Line 441**: `return QuantumValue((double)args[0].toInt("int"));` - Convert to integer
- **Line 442**: `});` - Close lambda
- **Line 443**: Empty line for readability
- **Line 444**: `reg("float", [](auto args) -> QuantumValue {` - Register float function
- **Line 445**: `if (args.size() != 1) throw TypeError("float() takes exactly 1 argument");` - Validate arguments
- **Line 446**: `return QuantumValue(args[0].toNum("float"));` - Convert to float
- **Line 447**: `});` - Close lambda
- **Line 448**: Empty line for readability
- **Line 449**: `reg("chr", [](auto args) -> QuantumValue {` - Register chr function
- **Line 450**: `if (args.size() != 1) throw TypeError("chr() takes exactly 1 argument");` - Validate arguments
- **Line 451**: `int code = args[0].toInt("chr");` - Convert to integer
- **Line 452**: `return QuantumValue(std::string(1, (char)code));` - Convert to character string
- **Line 453**: `});` - Close lambda
- **Line 454**: Empty line for readability
- **Line 455**: `reg("ord", [](auto args) -> QuantumValue {` - Register ord function

### ord() Function (Lines 456-462)
- **Line 456**: `if (args.size() != 1) throw TypeError("ord() takes exactly 1 argument");` - Validate arguments
- **Line 457**: `std::string s = args[0].toString();` - Convert to string
- **Line 458**: `if (s.empty())` - Check if empty string
- **Line 459**: `throw TypeError("ord() requires non-empty string");` - Error for empty string
- **Line 460**: `return QuantumValue((double)(int)s[0]);` - Return character code
- **Line 461**: `});` - Close lambda
- **Line 462**: Empty line for readability

### I/O Functions Section (Lines 463-465)
- **Line 463**: Empty line for readability
- **Line 464**: `// ─── I/O Functions ───────────────────────────────────────────────────────` - I/O functions comment
- **Line 465**: Empty line for readability

### print() Function (Lines 466-476)
- **Line 466**: `reg("print", [this](auto args) -> QuantumValue {` - Register print function
- **Line 467**: `std::string output;` - Create output string
- **Line 468**: `for (size_t i = 0; i < args.size(); ++i)` - Loop through arguments
- **Line 469**: `{` - Opening brace for loop
- **Line 470**: `if (i > 0) output += " ";` - Add space between arguments
- **Line 471**: `output += args[i].toString();` - Add argument string
- **Line 472**: `}` - Closing brace for loop
- **Line 473**: `std::cout << output << std::endl;` - Print to stdout
- **Line 474**: `return QuantumValue();` - Return nil
- **Line 475**: `});` - Close lambda
- **Line 476**: Empty line for readability

### input() Function (Lines 477-490)
- **Line 477**: `reg("input", [this](auto args) -> QuantumValue {` - Register input function
- **Line 478**: `std::string prompt;` - Create prompt string
- **Line 479**: `if (!args.empty())` - Check if prompt provided
- **Line 480**: `{` - Opening brace for prompt
- **Line 481**: `for (size_t i = 0; i < args.size(); ++i)` - Loop through arguments
- **Line 482**: `{` - Opening brace for loop
- **Line 483**: `if (i > 0) prompt += " ";` - Add space between arguments
- **Line 484**: `prompt += args[i].toString();` - Add argument string
- **Line 485**: `}` - Closing brace for loop
- **Line 486**: `}` - Closing brace for prompt
- **Line 487**: `std::cout << prompt;` - Display prompt
- **Line 488**: `std::string line;` - Create line string
- **Line 489**: `std::getline(std::cin, line);` - Read input line
- **Line 490**: `return QuantumValue(line);` - Return input string

### Array Functions Section (Lines 492-494)
- **Line 491**: `});` - Close input lambda
- **Line 492**: Empty line for readability
- **Line 493**: `// ─── Array Functions ─────────────────────────────────────────────────────` - Array functions comment
- **Line 494**: Empty line for readability

### append() Function (Lines 495-502)
- **Line 495**: `reg("append", [this](auto args) -> QuantumValue {` - Register append function
- **Line 496**: `if (args.size() != 2) throw TypeError("append() takes exactly 2 arguments");` - Validate arguments
- **Line 497**: `if (!args[0].isArray())` - Check if first argument is array
- **Line 498**: `throw TypeError("append() first argument must be array");` - Error for non-array
- **Line 499**: `args[0].asArray()->elements.push_back(args[1]);` - Append element
- **Line 500**: `return QuantumValue();` - Return nil
- **Line 501**: `});` - Close lambda
- **Line 502**: Empty line for readability

### pop() Function (Lines 503-513)
- **Line 503**: `reg("pop", [this](auto args) -> QuantumValue {` - Register pop function
- **Line 504**: `if (args.size() != 1) throw TypeError("pop() takes exactly 1 argument");` - Validate arguments
- **Line 505**: `if (!args[0].isArray())` - Check if argument is array
- **Line 506**: `throw TypeError("pop() argument must be array");` - Error for non-array
- **Line 507**: `auto arr = args[0].asArray();` - Get array reference
- **Line 508**: `if (arr->elements.empty())` - Check if empty
- **Line 509**: `throw RuntimeError("pop() from empty array");` - Error for empty array
- **Line 510**: `QuantumValue result = arr->elements.back();` - Get last element
- **Line 511**: `arr->elements.pop_back();` - Remove last element
- **Line 512**: `return result;` - Return popped element
- **Line 513**: `});` - Close lambda

### push() Function (Lines 514-522)
- **Line 514**: Empty line for readability
- **Line 515**: `reg("push", [this](auto args) -> QuantumValue {` - Register push function
- **Line 516**: `if (args.size() != 2) throw TypeError("push() takes exactly 2 arguments");` - Validate arguments
- **Line 517**: `if (!args[0].isArray())` - Check if first argument is array
- **Line 518**: `throw TypeError("push() first argument must be array");` - Error for non-array
- **Line 519**: `args[0].asArray()->elements.insert(args[0].asArray()->elements.begin(), args[1]);` - Insert at front
- **Line 520**: `return QuantumValue();` - Return nil
- **Line 521**: `});` - Close lambda
- **Line 522**: Empty line for readability

### Type Functions Section (Lines 523-525)
- **Line 523**: Empty line for readability
- **Line 524**: `// ─── Type Functions ─────────────────────────────────────────────────────` - Type functions comment
- **Line 525**: Empty line for readability

### type() and isinstance() Functions (Lines 526-537)
- **Line 526**: `reg("type", [](auto args) -> QuantumValue {` - Register type function
- **Line 527**: `if (args.size() != 1) throw TypeError("type() takes exactly 1 argument");` - Validate arguments
- **Line 528**: `return QuantumValue(args[0].typeName());` - Return type name
- **Line 529**: `});` - Close lambda
- **Line 530**: Empty line for readability
- **Line 531**: `reg("isinstance", [](auto args) -> QuantumValue {` - Register isinstance function
- **Line 532**: `if (args.size() != 2) throw TypeError("isinstance() takes exactly 2 arguments");` - Validate arguments
- **Line 533**: `return QuantumValue(args[0].typeName() == args[1].toString());` - Compare types
- **Line 534**: `});` - Close lambda
- **Line 535**: Empty line for readability

### System Functions Section (Lines 536-538)
- **Line 536**: Empty line for readability
- **Line 537**: `// ─── System Functions ───────────────────────────────────────────────────` - System functions comment
- **Line 538**: Empty line for readability

### exit() Function (Lines 539-547)
- **Line 539**: `reg("exit", [this](auto args) -> QuantumValue {` - Register exit function
- **Line 540**: `int code = 0;` - Default exit code
- **Line 541**: `if (!args.empty())` - Check if exit code provided
- **Line 542**: `code = args[0].toInt("exit");` - Convert to integer
- **Line 543**: `std::exit(code);` - Exit program
- **Line 544**: `return QuantumValue();` - Return nil (unreachable)
- **Line 545**: `});` - Close lambda
- **Line 546**: Empty line for readability

### time() Function (Lines 547-552)
- **Line 547**: `reg("time", [](auto args) -> QuantumValue {` - Register time function
- **Line 548**: `if (!args.empty()) throw TypeError("time() takes no arguments");` - Validate no arguments
- **Line 549**: `return QuantumValue((double)std::time(nullptr));` - Return current time
- **Line 550**: `});` - Close lambda
- **Line 551**: Empty line for readability

### Random Functions (Lines 552-564)
- **Line 552**: `reg("rand", [](auto args) -> QuantumValue {` - Register rand function
- **Line 553**: `if (!args.empty()) throw TypeError("rand() takes no arguments");` - Validate no arguments
- **Line 554**: `return QuantumValue((double)std::rand() / RAND_MAX);` - Return random number
- **Line 555**: `});` - Close lambda
- **Line 556**: Empty line for readability
- **Line 557**: `reg("srand", [](auto args) -> QuantumValue {` - Register srand function
- **Line 558**: `if (args.size() != 1) throw TypeError("srand() takes exactly 1 argument");` - Validate arguments
- **Line 559**: `std::srand(args[0].toInt("srand"));` - Set random seed
- **Line 560**: `return QuantumValue();` - Return nil
- **Line 561**: `});` - Close lambda
- **Line 562`: Empty line for readability
- **Line 563**: `}` - Closing brace for function

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
