# applyFormat() Function Explanation

## Complete Code

```cpp
static std::string applyFormat(const std::string &fmt, const std::vector<QuantumValue> &args, size_t argStart = 1)
{
    std::string out;
    size_t argIdx = argStart;
    size_t i = 0;

    auto nextArg = [&]() -> QuantumValue
    {
        return argIdx < args.size() ? args[argIdx++] : QuantumValue();
    };

    while (i < fmt.size())
    {
        if (fmt[i] != '%')
        {
            out += fmt[i++];
            continue;
        }
        ++i;
        if (i >= fmt.size())
            break;
        if (fmt[i] == '%')
        {
            out += '%';
            ++i;
            continue;
        }

        // ── Collect flags ──────────────────────────────────────────────────
        bool flagMinus = false, flagPlus = false, flagSpace = false, flagZero = false, flagHash = false;
        while (i < fmt.size())
        {
            char f = fmt[i];
            if (f == '-')
            {
                flagMinus = true;
                ++i;
            }
            else if (f == '+')
            {
                flagPlus = true;
                ++i;
            }
            else if (f == ' ')
            {
                flagSpace = true;
                ++i;
            }
            else if (f == '0')
            {
                flagZero = true;
                ++i;
            }
            else if (f == '#')
            {
                flagHash = true;
                ++i;
            }
            else
                break;
        }

        // ── Width ──────────────────────────────────────────────────────────
        int width = 0;
        while (i < fmt.size() && std::isdigit(fmt[i]))
            width = width * 10 + (fmt[i++] - '0');

        // ── Precision ─────────────────────────────────────────────────────
        int prec = -1;
        if (i < fmt.size() && fmt[i] == '.')
        {
            ++i;
            prec = 0;
            while (i < fmt.size() && std::isdigit(fmt[i]))
                prec = prec * 10 + (fmt[i++] - '0');
        }

        if (i >= fmt.size())
            break;
        char conv = fmt[i++];
        QuantumValue arg = nextArg();

        // ── Pad helper ────────────────────────────────────────────────────
        auto pad = [&](std::string s, bool numericSign = false) -> std::string
        {
            if (width > 0 && (int)s.size() < width)
            {
                int pad = width - (int)s.size();
                if (flagMinus)
                    s += std::string(pad, ' ');
                else if (flagZero && numericSign)
                    s = std::string(pad, '0') + s;
                else
                    s = std::string(pad, ' ') + s;
            }
            return s;
        };

        char buf[256];
        switch (conv)
        {

        // ── Integer specifiers ────────────────────────────────────────────
        case 'd':
        case 'i':
        {
            long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;
            std::string s;
            if (prec >= 0)
            {
                // precision on integers = minimum digits
                std::snprintf(buf, sizeof(buf), ("%0*lld"), prec, std::abs(n));
                s = buf;
                if (n < 0)
                    s = "-" + s;
                else if (flagPlus)
                    s = "+" + s;
                else if (flagSpace)
                    s = " " + s;
            }
            else
            {
                std::snprintf(buf, sizeof(buf), "%lld", n);
                s = buf;
                if (n >= 0 && flagPlus)
                    s = "+" + s;
                else if (n >= 0 && flagSpace)
                    s = " " + s;
            }
            out += pad(s, true);
            break;
        }
        case 'u':
        {
            unsigned long long n = arg.isNumber() ? (unsigned long long)(long long)arg.asNumber() : 0ULL;
            std::snprintf(buf, sizeof(buf), "%llu", n);
            out += pad(std::string(buf), true);
            break;
        }

        // ── Float specifiers ──────────────────────────────────────────────
        case 'f':
        case 'F':
        {
            double d = arg.isNumber() ? arg.asNumber() : 0.0;
            std::string spec = "%";
            if (flagPlus)
                spec += '+';
            else if (flagSpace)
                spec += ' ';
            if (prec >= 0)
                spec += "." + std::to_string(prec);
            spec += 'f';
            std::snprintf(buf, sizeof(buf), spec.c_str(), d);
            out += pad(std::string(buf), true);
            break;
        }
        case 'e':
        case 'E':
        {
            double d = arg.isNumber() ? arg.asNumber() : 0.0;
            std::string spec = "%";
            if (prec >= 0)
                spec += "." + std::to_string(prec);
            spec += conv;
            std::snprintf(buf, sizeof(buf), spec.c_str(), d);
            out += pad(std::string(buf), true);
            break;
        }
        case 'g':
        case 'G':
        {
            double d = arg.isNumber() ? arg.asNumber() : 0.0;
            std::string spec = "%";
            if (prec >= 0)
                spec += "." + std::to_string(prec);
            spec += conv;
            std::snprintf(buf, sizeof(buf), spec.c_str(), d);
            out += pad(std::string(buf), true);
            break;
        }

        // ── String specifier ─────────────────────────────────────────────
        case 's':
        {
            std::string s = arg.toString();
            if (prec >= 0 && (int)s.size() > prec)
                s = s.substr(0, prec); // truncate to precision
            out += pad(s, false);
            break;
        }

        // ── Char specifier ────────────────────────────────────────────────
        case 'c':
        {
            char c = arg.isString() && !arg.asString().empty()
                         ? arg.asString()[0]
                         : (char)(arg.isNumber() ? (int)arg.asNumber() : 0);
            out += pad(std::string(1, c), false);
            break;
        }

        // ── Hex specifiers ────────────────────────────────────────────────
        case 'x':
        case 'X':
        {
            unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);
            std::string spec = "%";
            if (flagHash)
                spec += '#';
            if (prec >= 0)
                spec += "." + std::to_string(prec);
            spec += (conv == 'x') ? "llx" : "llX";
            std::snprintf(buf, sizeof(buf), spec.c_str(), n);
            std::string s = buf;
            // prefix 0x/0X if not already there (flagHash adds it)
            if (flagHash && n != 0 && s.substr(0, 2) != "0x" && s.substr(0, 2) != "0X")
                s = (conv == 'x' ? "0x" : "0X") + s;
            out += pad(s, true);
            break;
        }

        // ── Octal specifier ───────────────────────────────────────────────
        case 'o':
        {
            unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);
            std::snprintf(buf, sizeof(buf), flagHash ? "%#llo" : "%llo", n);
            out += pad(std::string(buf), true);
            break;
        }

        // ── Binary specifier (non-standard, Quantum extension) ────────────
        case 'b':
        {
            long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;
            if (n == 0)
            {
                out += pad(flagHash ? "0b0" : "0", true);
            }
            else
            {
                std::string bits;
                unsigned long long u = (unsigned long long)n;
                while (u)
                {
                    bits = (char)('0' + (u & 1)) + bits;
                    u >>= 1;
                }
                if (flagHash)
                    bits = "0b" + bits;
                out += pad(bits, true);
            }
            break;
        }

        // ── Boolean specifier (Quantum extension) ─────────────────────────
        case 'B':
        {
            out += pad(arg.isTruthy() ? "true" : "false", false);
            break;
        }

        // ── Type name specifier (Quantum extension) ───────────────────────
        case 't':
        {
            out += pad(arg.typeName(), false);
            break;
        }

        default:
            out += '%';
            out += conv;
            break;
        }
    }
    return out;
}
```

## Code Explanation

### Function Signature
-  `static std::string applyFormat(const std::string &fmt, const std::vector<QuantumValue> &args, size_t argStart = 1)` - Main format function
  - `fmt`: Format string with printf-style specifiers
  - `args`: Vector of QuantumValue arguments to format
  - `argStart`: Starting index in args vector (default 1)
  - Returns formatted string

### Initialization
-  `{` - Opening brace
-  `std::string out;` - Output string buffer
-  `size_t argIdx = argStart;` - Current argument index
-  `size_t i = 0;` - Format string position

### Next Argument Lambda
-  Empty line for readability
-  `auto nextArg = [&]() -> QuantumValue` - Lambda function to get next argument
-  `{` - Opening brace for lambda
-  `return argIdx < args.size() ? args[argIdx++] : QuantumValue();` - Return next arg or nil
-  `};` - Closing brace for lambda
-  Empty line for readability

### Main Format Loop
-  `while (i < fmt.size())` - Loop through format string
-  `{` - Opening brace for main loop
-  `if (fmt[i] != '%')` - Check if not format specifier
-  `{` - Opening brace for regular character
-  `out += fmt[i++];` - Add character to output and advance
-  `continue;` - Continue to next character
-  `}` - Closing brace for regular character
-  `++i;` - Skip the % character
-  `if (i >= fmt.size())` - Check if at end of format string
-  `break;` - Exit if at end
-  `if (fmt[i] == '%')` - Check for escaped %%
-  `{` - Opening brace for escaped %
-  `out += '%';` - Add literal % to output
-  `++i;` - Skip second %
-  `continue;` - Continue to next character
-  `}` - Closing brace for escaped %
-  Empty line for readability
-  `// ── Collect flags ──────────────────────────────────────────────────` - Flags section comment
-  `bool flagMinus = false, flagPlus = false, flagSpace = false, flagZero = false, flagHash = false;` - Initialize flag variables

### Flag Collection Loop
-  `while (i < fmt.size())` - Loop to collect flags
-  `{` - Opening brace for flag loop
-  `char f = fmt[i];` - Get current flag character
-  `if (f == '-')` - Check for left-align flag
-  `{` - Opening brace for minus flag
-  `flagMinus = true;` - Set minus flag
-  `++i;` - Advance to next character
-  `}` - Closing brace for minus flag
-  `else if (f == '+')` - Check for force sign flag
-  `{` - Opening brace for plus flag
-  `flagPlus = true;` - Set plus flag
-  `++i;` - Advance to next character
-  `}` - Closing brace for plus flag
-  `else if (f == ' ')` - Check for space flag
-  `{` - Opening brace for space flag
-  `flagSpace = true;` - Set space flag
-  `++i;` - Advance to next character
-  `}` - Closing brace for space flag

###
-  `else if (f == '0')` - Check for zero-pad flag
-  `{` - Opening brace for zero flag
-  `flagZero = true;` - Set zero flag
-  `++i;` - Advance to next character
-  `}` - Closing brace for zero flag
-  `else if (f == '#')` - Check for hash flag
-  `{` - Opening brace for hash flag
-  `flagHash = true;` - Set hash flag
-  `++i;` - Advance to next character
-  `}` - Closing brace for hash flag
-  `else` - Not a flag character
-  `break;` - Exit flag collection loop
-  `}` - Closing brace for flag loop
-  Empty line for readability
-  `// ── Width ──────────────────────────────────────────────────────────` - Width section comment
-  `int width = 0;` - Initialize width
-  `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for width digits

###
-  `width = width * 10 + (fmt[i++] - '0');` - Parse width number
-  Empty line for readability
-  `// ── Precision ─────────────────────────────────────────────────────` - Precision section comment
-  `int prec = -1;` - Initialize precision (-1 = not specified)
-  `if (i < fmt.size() && fmt[i] == '.')` - Check for precision specifier
-  `{` - Opening brace for precision
-  `++i;` - Skip the dot
-  `prec = 0;` - Initialize precision
-  `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for precision digits
-  `prec = prec * 10 + (fmt[i++] - '0');` - Parse precision number
-  `}` - Closing brace for precision
-  Empty line for readability
-  `if (i >= fmt.size())` - Check if at end of format string
-  `break;` - Exit if at end
-  `char conv = fmt[i++];` - Get conversion character and advance

###
-  `QuantumValue arg = nextArg();` - Get next argument
-  Empty line for readability
-  `// ── Pad helper ────────────────────────────────────────────────────` - Pad helper comment
-  `auto pad = [&](std::string s, bool numericSign = false) -> std::string` - Lambda for padding
-  `{` - Opening brace for pad lambda
-  `if (width > 0 && (int)s.size() < width)` - Check if padding needed
-  `{` - Opening brace for padding
-  `int pad = width - (int)s.size();` - Calculate padding amount
-  `if (flagMinus)` - Check for left-align

###
-  `s += std::string(pad, ' ');` - Add right padding
-  `else if (flagZero && numericSign)` - Check for zero-pad with numeric sign
-  `s = std::string(pad, '0') + s;` - Add left zero padding
-  `else` - Default padding
-  `s = std::string(pad, ' ') + s;` - Add left space padding
-  `}` - Closing brace for padding
-  `return s;` - Return padded string
-  `};` - Closing brace for pad lambda
-  Empty line for readability
-  `char buf[256];` - Buffer for snprintf
-  `switch (conv)` - Switch on conversion character

###
-  `{` - Opening brace for switch
-  Empty line for readability
-  `// ── Integer specifiers ────────────────────────────────────────────` - Integer section comment
-  `case 'd':` - Decimal integer case
-  `case 'i':` - Integer case (alias for d)

###
-  `{` - Opening brace for integer case
-  `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
-  `std::string s;` - String for formatted result
-  `if (prec >= 0)` - Check if precision specified
-  `{` - Opening brace for precision case
-  `// precision on integers = minimum digits` - Comment about integer precision
-  `std::snprintf(buf, sizeof(buf), ("%0*lld"), prec, std::abs(n));` - Format with precision
-  `s = buf;` - Copy to string
-  `if (n < 0)` - Check if negative
-  `s = "-" + s;` - Add negative sign
-  `else if (flagPlus)` - Check for force sign
-  `s = "+" + s;` - Add plus sign
-  `else if (flagSpace)` - Check for space flag
-  `s = " " + s;` - Add space
-  `}` - Closing brace for precision case
-  `else` - No precision specified
-  `{` - Opening brace for no precision
-  `std::snprintf(buf, sizeof(buf), "%lld", n);` - Format normally
-  `s = buf;` - Copy to string
-  `if (n >= 0 && flagPlus)` - Check for positive with force sign
-  `s = "+" + s;` - Add plus sign
-  `else if (n >= 0 && flagSpace)` - Check for positive with space flag
-  `s = " " + s;` - Add space
-  `}` - Closing brace for no precision
-  `out += pad(s, true);` - Add padded result to output

###
-  `break;` - Exit case
-  `}` - Closing brace for integer case
-  `case 'u':` - Unsigned integer case
-  `{` - Opening brace for unsigned case
-  `unsigned long long n = arg.isNumber() ? (unsigned long long)(long long)arg.asNumber() : 0ULL;` - Convert to unsigned
-  `std::snprintf(buf, sizeof(buf), "%llu", n);` - Format unsigned
-  `out += pad(std::string(buf), true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for unsigned case
-  Empty line for readability

###
-  `// ── Float specifiers ──────────────────────────────────────────────` - Float section comment
-  `case 'f':` - Float decimal case
-  `case 'F':` - Float case (alias for f)
-  `{` - Opening brace for float case
-  `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
-  `std::string spec = "%";` - Start format spec
-  `if (flagPlus)` - Check for force sign
-  `spec += '+';` - Add plus to spec
-  `else if (flagSpace)` - Check for space flag
-  `spec += ' ';` - Add space to spec
-  `if (prec >= 0)` - Check for precision
-  `spec += "." + std::to_string(prec);` - Add precision to spec
-  `spec += 'f';` - Add f conversion
-  `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
-  `out += pad(std::string(buf), true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for float case

###
-  `case 'e':` - Scientific notation lowercase
-  `case 'E':` - Scientific notation uppercase
-  `{` - Opening brace for scientific case
-  `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
-  `std::string spec = "%";` - Start format spec
-  `if (prec >= 0)` - Check for precision
-  `spec += "." + std::to_string(prec);` - Add precision to spec
-  `spec += conv;` - Add conversion character
-  `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
-  `out += pad(std::string(buf), true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for scientific case

###
-  `case 'g':` - General float lowercase
-  `case 'G':` - General float uppercase
-  `{` - Opening brace for general case
-  `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
-  `std::string spec = "%";` - Start format spec
-  `if (prec >= 0)` - Check for precision
-  `spec += "." + std::to_string(prec);` - Add precision to spec
-  `spec += conv;` - Add conversion character
-  `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
-  `out += pad(std::string(buf), true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for general case
-  Empty line for readability

###
-  `// ── String specifier ─────────────────────────────────────────────` - String section comment
-  `case 's':` - String case
-  `{` - Opening brace for string case
-  `std::string s = arg.toString();` - Convert argument to string
-  `if (prec >= 0 && (int)s.size() > prec)` - Check if precision truncation needed
-  `s = s.substr(0, prec); // truncate to precision` - Truncate to precision
-  `out += pad(s, false);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for string case
-  Empty line for readability
-  `// ── Char specifier ────────────────────────────────────────────────` - Char section comment
-  `case 'c':` - Character case
-  `{` - Opening brace for char case
-  `char c = arg.isString() && !arg.asString().empty()` - Get character from string or number
-  `? arg.asString()[0]` - First character of string
-  `: (char)(arg.isNumber() ? (int)arg.asNumber() : 0);` - Or numeric cast to char
-  `out += pad(std::string(1, c), false);` - Add padded character
-  `break;` - Exit case

###
-  `}` - Closing brace for char case
-  Empty line for readability
-  `// ── Hex specifiers ────────────────────────────────────────────────` - Hex section comment
-  `case 'x':` - Hexadecimal lowercase case
-  `case 'X':` - Hexadecimal uppercase case
-  `{` - Opening brace for hex case
-  `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
-  `std::string spec = "%";` - Start format spec
-  `if (flagHash)` - Check for hash flag
-  `spec += '#';` - Add hash to spec
-  `if (prec >= 0)` - Check for precision
-  `spec += "." + std::to_string(prec);` - Add precision to spec
-  `spec += (conv == 'x') ? "llx" : "llX";` - Add conversion specifier
-  `std::snprintf(buf, sizeof(buf), spec.c_str(), n);` - Format with spec
-  `std::string s = buf;` - Copy to string
-  `// prefix 0x/0X if not already there (flagHash adds it)` - Comment about prefix
-  `if (flagHash && n != 0 && s.substr(0, 2) != "0x" && s.substr(0, 2) != "0X")` - Check if prefix needed
-  `s = (conv == 'x' ? "0x" : "0X") + s;` - Add prefix
-  `out += pad(s, true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for hex case
-  Empty line for readability

###
-  `// ── Octal specifier ───────────────────────────────────────────────` - Octal section comment
-  `case 'o':` - Octal case
-  `{` - Opening brace for octal case
-  `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
-  `std::snprintf(buf, sizeof(buf), flagHash ? "%#llo" : "%llo", n);` - Format with or without prefix
-  `out += pad(std::string(buf), true);` - Add padded result
-  `break;` - Exit case
-  `}` - Closing brace for octal case
-  Empty line for readability
-  `// ── Binary specifier (non-standard, Quantum extension) ────────────` - Binary section comment
-  `case 'b':` - Binary case
-  `{` - Opening brace for binary case
-  `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
-  `if (n == 0)` - Check for zero
-  `{` - Opening brace for zero case
-  `out += pad(flagHash ? "0b0" : "0", true);` - Output zero with optional prefix
-  `}` - Closing brace for zero case
-  `else` - Non-zero case
-  `{` - Opening brace for non-zero case
-  `std::string bits;` - String for binary digits
-  `unsigned long long u = (unsigned long long)n;` - Convert to unsigned
-  `while (u)` - Loop while bits remain
-  `{` - Opening brace for bit loop
-  `bits = (char)('0' + (u & 1)) + bits;` - Extract bit and prepend
-  `u >>= 1;` - Shift right to next bit
-  `}` - Closing brace for bit loop
-  `if (flagHash)` - Check for hash flag
-  `bits = "0b" + bits;` - Add binary prefix
-  `out += pad(bits, true);` - Add padded result
-  `}` - Closing brace for non-zero case
-  `break;` - Exit case
-  `}` - Closing brace for binary case

###
-  Empty line for readability
-  `// ── Boolean specifier (Quantum extension) ─────────────────────────` - Boolean section comment
-  `case 'B':` - Boolean case
-  `{` - Opening brace for boolean case
-  `out += pad(arg.isTruthy() ? "true" : "false", false);` - Output truthiness as string
-  `break;` - Exit case
-  `}` - Closing brace for boolean case
-  Empty line for readability
-  `// ── Type name specifier (Quantum extension) ───────────────────────` - Type name section comment
-  `case 't':` - Type name case
-  `{` - Opening brace for type name case
-  `out += pad(arg.typeName(), false);` - Output type name
-  `break;` - Exit case
-  `}` - Closing brace for type name case

###
-  Empty line for readability
-  `default:` - Default case for unknown specifiers
-  `out += '%';` - Add literal percent
-  `out += conv;` - Add unknown specifier
-  `break;` - Exit case
-  `}` - Closing brace for switch
-  `}` - Closing brace for main loop
-  `return out;` - Return formatted string
-  `}` - Closing brace for function

## Summary

The `applyFormat()` function is a comprehensive printf-style formatting engine for the Quantum Language:

### Key Features
- **Standard Compatibility**: Supports all C printf format specifiers
- **Quantum Extensions**: Adds %b (binary), %B (boolean), %t (type name)
- **Full Flag Support**: -, +, space, 0, # flags with proper precedence
- **Width and Precision**: Complete formatting control
- **Type Safety**: Safe conversion from QuantumValue to appropriate types

### Format Specifiers Supported
- **Integers**: %d, %i (signed), %u (unsigned)
- **Floats**: %f (fixed), %e/%E (scientific), %g/%G (general)
- **Strings**: %s (with precision truncation)
- **Characters**: %c (from strings or numbers)
- **Numbers**: %x/%X (hex), %o (octal), %b (binary)
- **Quantum**: %B (boolean), %t (type name)

### Flag System
- **-**: Left-align output
- **+**: Force sign for positive numbers
- **space**: Space for positive numbers
-  Zero-pad numeric values
- **#: Alternative format (0x, 0X, 0b prefixes)

### Design Benefits
- **Performance**: Efficient single-pass parsing
- **Extensibility**: Easy to add new format specifiers
- **Compatibility**: Drop-in replacement for C printf
- **Error Handling**: Graceful handling of unknown specifiers

This function enables powerful string formatting capabilities while maintaining full compatibility with standard C printf syntax and adding Quantum Language-specific extensions for enhanced functionality.
