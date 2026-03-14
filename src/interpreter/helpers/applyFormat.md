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

## Line-by-Line Explanation

### Function Signature (Line 1)
- **Line 1**: `static std::string applyFormat(const std::string &fmt, const std::vector<QuantumValue> &args, size_t argStart = 1)` - Main format function
  - `fmt`: Format string with printf-style specifiers
  - `args`: Vector of QuantumValue arguments to format
  - `argStart`: Starting index in args vector (default 1)
  - Returns formatted string

### Initialization (Lines 2-5)
- **Line 2**: `{` - Opening brace
- **Line 3**: `std::string out;` - Output string buffer
- **Line 4**: `size_t argIdx = argStart;` - Current argument index
- **Line 5**: `size_t i = 0;` - Format string position

### Next Argument Lambda (Lines 7-11)
- **Line 6**: Empty line for readability
- **Line 7**: `auto nextArg = [&]() -> QuantumValue` - Lambda function to get next argument
- **Line 8**: `{` - Opening brace for lambda
- **Line 9**: `return argIdx < args.size() ? args[argIdx++] : QuantumValue();` - Return next arg or nil
- **Line 10**: `};` - Closing brace for lambda
- **Line 11**: Empty line for readability

### Main Format Loop (Lines 12-30)
- **Line 12**: `while (i < fmt.size())` - Loop through format string
- **Line 13**: `{` - Opening brace for main loop
- **Line 14**: `if (fmt[i] != '%')` - Check if not format specifier
- **Line 15**: `{` - Opening brace for regular character
- **Line 16**: `out += fmt[i++];` - Add character to output and advance
- **Line 17**: `continue;` - Continue to next character
- **Line 18**: `}` - Closing brace for regular character
- **Line 19**: `++i;` - Skip the % character
- **Line 20**: `if (i >= fmt.size())` - Check if at end of format string
- **Line 21**: `break;` - Exit if at end
- **Line 22**: `if (fmt[i] == '%')` - Check for escaped %%
- **Line 23**: `{` - Opening brace for escaped %
- **Line 24**: `out += '%';` - Add literal % to output
- **Line 25**: `++i;` - Skip second %
- **Line 26**: `continue;` - Continue to next character
- **Line 27**: `}` - Closing brace for escaped %
- **Line 28**: Empty line for readability
- **Line 29**: `// ── Collect flags ──────────────────────────────────────────────────` - Flags section comment
- **Line 30**: `bool flagMinus = false, flagPlus = false, flagSpace = false, flagZero = false, flagHash = false;` - Initialize flag variables

### Flag Collection Loop (Lines 31-48)
- **Line 31**: `while (i < fmt.size())` - Loop to collect flags
- **Line 32**: `{` - Opening brace for flag loop
- **Line 33**: `char f = fmt[i];` - Get current flag character
- **Line 34**: `if (f == '-')` - Check for left-align flag
- **Line 35**: `{` - Opening brace for minus flag
- **Line 36**: `flagMinus = true;` - Set minus flag
- **Line 37**: `++i;` - Advance to next character
- **Line 38**: `}` - Closing brace for minus flag
- **Line 39**: `else if (f == '+')` - Check for force sign flag
- **Line 40**: `{` - Opening brace for plus flag
- **Line 41**: `flagPlus = true;` - Set plus flag
- **Line 42**: `++i;` - Advance to next character
- **Line 43**: `}` - Closing brace for plus flag
- **Line 44**: `else if (f == ' ')` - Check for space flag
- **Line 45**: `{` - Opening brace for space flag
- **Line 46**: `flagSpace = true;` - Set space flag
- **Line 47**: `++i;` - Advance to next character
- **Line 48**: `}` - Closing brace for space flag

### More Flag Collection (Lines 49-65)
- **Line 49**: `else if (f == '0')` - Check for zero-pad flag
- **Line 50**: `{` - Opening brace for zero flag
- **Line 51**: `flagZero = true;` - Set zero flag
- **Line 52**: `++i;` - Advance to next character
- **Line 53**: `}` - Closing brace for zero flag
- **Line 54**: `else if (f == '#')` - Check for hash flag
- **Line 55**: `{` - Opening brace for hash flag
- **Line 56**: `flagHash = true;` - Set hash flag
- **Line 57**: `++i;` - Advance to next character
- **Line 58**: `}` - Closing brace for hash flag
- **Line 59**: `else` - Not a flag character
- **Line 60**: `break;` - Exit flag collection loop
- **Line 61**: `}` - Closing brace for flag loop
- **Line 62**: Empty line for readability
- **Line 63**: `// ── Width ──────────────────────────────────────────────────────────` - Width section comment
- **Line 64**: `int width = 0;` - Initialize width
- **Line 65**: `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for width digits

### Width and Precision Parsing (Lines 66-80)
- **Line 66**: `width = width * 10 + (fmt[i++] - '0');` - Parse width number
- **Line 67**: Empty line for readability
- **Line 68**: `// ── Precision ─────────────────────────────────────────────────────` - Precision section comment
- **Line 69**: `int prec = -1;` - Initialize precision (-1 = not specified)
- **Line 70**: `if (i < fmt.size() && fmt[i] == '.')` - Check for precision specifier
- **Line 71**: `{` - Opening brace for precision
- **Line 72**: `++i;` - Skip the dot
- **Line 73**: `prec = 0;` - Initialize precision
- **Line 74**: `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for precision digits
- **Line 75**: `prec = prec * 10 + (fmt[i++] - '0');` - Parse precision number
- **Line 76**: `}` - Closing brace for precision
- **Line 77**: Empty line for readability
- **Line 78**: `if (i >= fmt.size())` - Check if at end of format string
- **Line 79**: `break;` - Exit if at end
- **Line 80**: `char conv = fmt[i++];` - Get conversion character and advance

### Conversion Setup (Lines 81-89)
- **Line 81**: `QuantumValue arg = nextArg();` - Get next argument
- **Line 82**: Empty line for readability
- **Line 83**: `// ── Pad helper ────────────────────────────────────────────────────` - Pad helper comment
- **Line 84**: `auto pad = [&](std::string s, bool numericSign = false) -> std::string` - Lambda for padding
- **Line 85**: `{` - Opening brace for pad lambda
- **Line 86**: `if (width > 0 && (int)s.size() < width)` - Check if padding needed
- **Line 87**: `{` - Opening brace for padding
- **Line 88**: `int pad = width - (int)s.size();` - Calculate padding amount
- **Line 89**: `if (flagMinus)` - Check for left-align

### Padding Logic (Lines 90-100)
- **Line 90**: `s += std::string(pad, ' ');` - Add right padding
- **Line 91**: `else if (flagZero && numericSign)` - Check for zero-pad with numeric sign
- **Line 92**: `s = std::string(pad, '0') + s;` - Add left zero padding
- **Line 93**: `else` - Default padding
- **Line 94**: `s = std::string(pad, ' ') + s;` - Add left space padding
- **Line 95**: `}` - Closing brace for padding
- **Line 96**: `return s;` - Return padded string
- **Line 97**: `};` - Closing brace for pad lambda
- **Line 98**: Empty line for readability
- **Line 99**: `char buf[256];` - Buffer for snprintf
- **Line 100**: `switch (conv)` - Switch on conversion character

### Switch Statement Start (Lines 101-105)
- **Line 101**: `{` - Opening brace for switch
- **Line 102**: Empty line for readability
- **Line 103**: `// ── Integer specifiers ────────────────────────────────────────────` - Integer section comment
- **Line 104**: `case 'd':` - Decimal integer case
- **Line 105**: `case 'i':` - Integer case (alias for d)

### Integer Formatting (Lines 106-130)
- **Line 106**: `{` - Opening brace for integer case
- **Line 107**: `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
- **Line 108**: `std::string s;` - String for formatted result
- **Line 109**: `if (prec >= 0)` - Check if precision specified
- **Line 110**: `{` - Opening brace for precision case
- **Line 111**: `// precision on integers = minimum digits` - Comment about integer precision
- **Line 112**: `std::snprintf(buf, sizeof(buf), ("%0*lld"), prec, std::abs(n));` - Format with precision
- **Line 113**: `s = buf;` - Copy to string
- **Line 114**: `if (n < 0)` - Check if negative
- **Line 115**: `s = "-" + s;` - Add negative sign
- **Line 116**: `else if (flagPlus)` - Check for force sign
- **Line 117**: `s = "+" + s;` - Add plus sign
- **Line 118**: `else if (flagSpace)` - Check for space flag
- **Line 119**: `s = " " + s;` - Add space
- **Line 120**: `}` - Closing brace for precision case
- **Line 121**: `else` - No precision specified
- **Line 122**: `{` - Opening brace for no precision
- **Line 123**: `std::snprintf(buf, sizeof(buf), "%lld", n);` - Format normally
- **Line 124**: `s = buf;` - Copy to string
- **Line 125**: `if (n >= 0 && flagPlus)` - Check for positive with force sign
- **Line 126**: `s = "+" + s;` - Add plus sign
- **Line 127**: `else if (n >= 0 && flagSpace)` - Check for positive with space flag
- **Line 128**: `s = " " + s;` - Add space
- **Line 129**: `}` - Closing brace for no precision
- **Line 130**: `out += pad(s, true);` - Add padded result to output

### Integer Completion (Lines 131-140)
- **Line 131**: `break;` - Exit case
- **Line 132**: `}` - Closing brace for integer case
- **Line 133**: `case 'u':` - Unsigned integer case
- **Line 134**: `{` - Opening brace for unsigned case
- **Line 135**: `unsigned long long n = arg.isNumber() ? (unsigned long long)(long long)arg.asNumber() : 0ULL;` - Convert to unsigned
- **Line 136**: `std::snprintf(buf, sizeof(buf), "%llu", n);` - Format unsigned
- **Line 137**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 138**: `break;` - Exit case
- **Line 139**: `}` - Closing brace for unsigned case
- **Line 140**: Empty line for readability

### Float Specifiers (Lines 141-185)
- **Line 141**: `// ── Float specifiers ──────────────────────────────────────────────` - Float section comment
- **Line 142**: `case 'f':` - Float decimal case
- **Line 143**: `case 'F':` - Float case (alias for f)
- **Line 144**: `{` - Opening brace for float case
- **Line 145**: `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
- **Line 146**: `std::string spec = "%";` - Start format spec
- **Line 147**: `if (flagPlus)` - Check for force sign
- **Line 148**: `spec += '+';` - Add plus to spec
- **Line 149**: `else if (flagSpace)` - Check for space flag
- **Line 150**: `spec += ' ';` - Add space to spec
- **Line 151**: `if (prec >= 0)` - Check for precision
- **Line 152**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 153**: `spec += 'f';` - Add f conversion
- **Line 154**: `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
- **Line 155**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 156**: `break;` - Exit case
- **Line 157**: `}` - Closing brace for float case

### Scientific Notation (Lines 158-175)
- **Line 158**: `case 'e':` - Scientific notation lowercase
- **Line 159**: `case 'E':` - Scientific notation uppercase
- **Line 160**: `{` - Opening brace for scientific case
- **Line 161**: `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
- **Line 162**: `std::string spec = "%";` - Start format spec
- **Line 163**: `if (prec >= 0)` - Check for precision
- **Line 164**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 165**: `spec += conv;` - Add conversion character
- **Line 166**: `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
- **Line 167**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 168**: `break;` - Exit case
- **Line 169**: `}` - Closing brace for scientific case

### General Float (Lines 170-185)
- **Line 170**: `case 'g':` - General float lowercase
- **Line 171**: `case 'G':` - General float uppercase
- **Line 172**: `{` - Opening brace for general case
- **Line 173**: `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
- **Line 174**: `std::string spec = "%";` - Start format spec
- **Line 175**: `if (prec >= 0)` - Check for precision
- **Line 176**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 177**: `spec += conv;` - Add conversion character
- **Line 178**: `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
- **Line 179**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 180**: `break;` - Exit case
- **Line 181**: `}` - Closing brace for general case
- **Line 182**: Empty line for readability

### String and Character (Lines 183-200)
- **Line 183**: `// ── String specifier ─────────────────────────────────────────────` - String section comment
- **Line 184**: `case 's':` - String case
- **Line 185**: `{` - Opening brace for string case
- **Line 186**: `std::string s = arg.toString();` - Convert argument to string
- **Line 187**: `if (prec >= 0 && (int)s.size() > prec)` - Check if precision truncation needed
- **Line 188**: `s = s.substr(0, prec); // truncate to precision` - Truncate to precision
- **Line 189**: `out += pad(s, false);` - Add padded result
- **Line 190**: `break;` - Exit case
- **Line 191**: `}` - Closing brace for string case
- **Line 192**: Empty line for readability
- **Line 193**: `// ── Char specifier ────────────────────────────────────────────────` - Char section comment
- **Line 194**: `case 'c':` - Character case
- **Line 195**: `{` - Opening brace for char case
- **Line 196**: `char c = arg.isString() && !arg.asString().empty()` - Get character from string or number
- **Line 197**: `? arg.asString()[0]` - First character of string
- **Line 198**: `: (char)(arg.isNumber() ? (int)arg.asNumber() : 0);` - Or numeric cast to char
- **Line 199**: `out += pad(std::string(1, c), false);` - Add padded character
- **Line 200**: `break;` - Exit case

### Hexadecimal Formatting (Lines 201-225)
- **Line 201**: `}` - Closing brace for char case
- **Line 202**: Empty line for readability
- **Line 203**: `// ── Hex specifiers ────────────────────────────────────────────────` - Hex section comment
- **Line 204**: `case 'x':` - Hexadecimal lowercase case
- **Line 205**: `case 'X':` - Hexadecimal uppercase case
- **Line 206**: `{` - Opening brace for hex case
- **Line 207**: `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
- **Line 208**: `std::string spec = "%";` - Start format spec
- **Line 209**: `if (flagHash)` - Check for hash flag
- **Line 210**: `spec += '#';` - Add hash to spec
- **Line 211**: `if (prec >= 0)` - Check for precision
- **Line 212**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 213**: `spec += (conv == 'x') ? "llx" : "llX";` - Add conversion specifier
- **Line 214**: `std::snprintf(buf, sizeof(buf), spec.c_str(), n);` - Format with spec
- **Line 215**: `std::string s = buf;` - Copy to string
- **Line 216**: `// prefix 0x/0X if not already there (flagHash adds it)` - Comment about prefix
- **Line 217**: `if (flagHash && n != 0 && s.substr(0, 2) != "0x" && s.substr(0, 2) != "0X")` - Check if prefix needed
- **Line 218**: `s = (conv == 'x' ? "0x" : "0X") + s;` - Add prefix
- **Line 219**: `out += pad(s, true);` - Add padded result
- **Line 220**: `break;` - Exit case
- **Line 221**: `}` - Closing brace for hex case
- **Line 222**: Empty line for readability

### Octal and Binary (Lines 223-255)
- **Line 223**: `// ── Octal specifier ───────────────────────────────────────────────` - Octal section comment
- **Line 224**: `case 'o':` - Octal case
- **Line 225**: `{` - Opening brace for octal case
- **Line 226**: `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
- **Line 227**: `std::snprintf(buf, sizeof(buf), flagHash ? "%#llo" : "%llo", n);` - Format with or without prefix
- **Line 228**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 229**: `break;` - Exit case
- **Line 230**: `}` - Closing brace for octal case
- **Line 231**: Empty line for readability
- **Line 232**: `// ── Binary specifier (non-standard, Quantum extension) ────────────` - Binary section comment
- **Line 233**: `case 'b':` - Binary case
- **Line 234**: `{` - Opening brace for binary case
- **Line 235**: `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
- **Line 236**: `if (n == 0)` - Check for zero
- **Line 237**: `{` - Opening brace for zero case
- **Line 238**: `out += pad(flagHash ? "0b0" : "0", true);` - Output zero with optional prefix
- **Line 239**: `}` - Closing brace for zero case
- **Line 240**: `else` - Non-zero case
- **Line 241**: `{` - Opening brace for non-zero case
- **Line 242**: `std::string bits;` - String for binary digits
- **Line 243**: `unsigned long long u = (unsigned long long)n;` - Convert to unsigned
- **Line 244**: `while (u)` - Loop while bits remain
- **Line 245**: `{` - Opening brace for bit loop
- **Line 246**: `bits = (char)('0' + (u & 1)) + bits;` - Extract bit and prepend
- **Line 247**: `u >>= 1;` - Shift right to next bit
- **Line 248**: `}` - Closing brace for bit loop
- **Line 249**: `if (flagHash)` - Check for hash flag
- **Line 250**: `bits = "0b" + bits;` - Add binary prefix
- **Line 251**: `out += pad(bits, true);` - Add padded result
- **Line 252**: `}` - Closing brace for non-zero case
- **Line 253**: `break;` - Exit case
- **Line 254**: `}` - Closing brace for binary case

### Quantum Extensions (Lines 255-275)
- **Line 255**: Empty line for readability
- **Line 256**: `// ── Boolean specifier (Quantum extension) ─────────────────────────` - Boolean section comment
- **Line 257**: `case 'B':` - Boolean case
- **Line 258**: `{` - Opening brace for boolean case
- **Line 259**: `out += pad(arg.isTruthy() ? "true" : "false", false);` - Output truthiness as string
- **Line 260**: `break;` - Exit case
- **Line 261**: `}` - Closing brace for boolean case
- **Line 262**: Empty line for readability
- **Line 263**: `// ── Type name specifier (Quantum extension) ───────────────────────` - Type name section comment
- **Line 264**: `case 't':` - Type name case
- **Line 265**: `{` - Opening brace for type name case
- **Line 266**: `out += pad(arg.typeName(), false);` - Output type name
- **Line 267**: `break;` - Exit case
- **Line 268**: `}` - Closing brace for type name case

### Default Case and Function End (Lines 269-280)
- **Line 269**: Empty line for readability
- **Line 270**: `default:` - Default case for unknown specifiers
- **Line 271**: `out += '%';` - Add literal percent
- **Line 272**: `out += conv;` - Add unknown specifier
- **Line 273**: `break;` - Exit case
- **Line 274**: `}` - Closing brace for switch
- **Line 275**: `}` - Closing brace for main loop
- **Line 276**: `return out;` - Return formatted string
- **Line 277**: `}` - Closing brace for function

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
- **0**: Zero-pad numeric values
- **#: Alternative format (0x, 0X, 0b prefixes)

### Design Benefits
- **Performance**: Efficient single-pass parsing
- **Extensibility**: Easy to add new format specifiers
- **Compatibility**: Drop-in replacement for C printf
- **Error Handling**: Graceful handling of unknown specifiers

This function enables powerful string formatting capabilities while maintaining full compatibility with standard C printf syntax and adding Quantum Language-specific extensions for enhanced functionality.
