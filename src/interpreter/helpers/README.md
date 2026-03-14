# Interpreter Helper Functions

## Complete Code

```cpp
// ─── Helpers ─────────────────────────────────────────────────────────────────

// Token buffer for cin >> : C++ cin >> reads whitespace-delimited tokens,
// but std::getline reads a whole line. We buffer leftover tokens here so that
// "cin >> a; cin >> b;" with input "5 10\n" correctly gives a=5, b=10.
static std::vector<std::string> s_cinBuffer;

static double toNum(const QuantumValue &v, const std::string &ctx)
{
    if (v.isNumber())
        return v.asNumber();
    throw TypeError("Expected number in " + ctx + ", got " + v.typeName());
}

static long long toInt(const QuantumValue &v, const std::string &ctx)
{
    return (long long)toNum(v, ctx);
}

// ─── Format Engine ───────────────────────────────────────────────────────────
// Shared by printf(), format(), and sprintf()-style calls.
// Supports: %d %i %u %f %e %g %s %c %x %X %o %b %%
// Flags:    - (left-align)  + (force sign)  0 (zero-pad)  space
// Width:    %8d   %-10s
// Precision:%6.2f  %.5s (truncate string)

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

### Cin Buffer (Lines 4-7)
- **Line 4**: `// Token buffer for cin >> : C++ cin >> reads whitespace-delimited tokens,` - Comment explaining cin buffer purpose
- **Line 5**: `// but std::getline reads a whole line. We buffer leftover tokens here so that` - Comment continuation
- **Line 6**: `// "cin >> a; cin >> b;" with input "5 10\n" correctly gives a=5, b=10.` - Example of buffer usage
- **Line 7**: `static std::vector<std::string> s_cinBuffer;` - Static vector to buffer cin tokens

### toNum() Function (Lines 9-14)
- **Line 9**: `static double toNum(const QuantumValue &v, const std::string &ctx)` - Convert value to number
- **Line 10**: `{` - Opening brace
- **Line 11**: `if (v.isNumber())` - Check if value is numeric
- **Line 12**: `return v.asNumber();` - Return numeric value
- **Line 13**: `throw TypeError("Expected number in " + ctx + ", got " + v.typeName());` - Throw type error
- **Line 14**: `}` - Closing brace

### toInt() Function (Lines 16-19)
- **Line 16**: `static long long toInt(const QuantumValue &v, const std::string &ctx)` - Convert value to integer
- **Line 17**: `{` - Opening brace
- **Line 18**: `return (long long)toNum(v, ctx);` - Convert to number then cast to long long
- **Line 19**: `}` - Closing brace

### Format Engine Header (Lines 21-27)
- **Line 21**: `// ─── Format Engine ───────────────────────────────────────────────────────────` - Section comment
- **Line 22**: `// Shared by printf(), format(), and sprintf()-style calls.` - Usage description
- **Line 23**: `// Supports: %d %i %u %f %e %g %s %c %x %X %o %b %%` - Supported format specifiers
- **Line 24**: `// Flags:    - (left-align)  + (force sign)  0 (zero-pad)  space` - Supported flags
- **Line 25**: `// Width:    %8d   %-10s` - Width examples
- **Line 26**: `// Precision:%6.2f  %.5s (truncate string)` - Precision examples

### applyFormat() Function Signature (Lines 28-37)
- **Line 28**: `static std::string applyFormat(const std::string &fmt, const std::vector<QuantumValue> &args, size_t argStart = 1)` - Main format function
- **Line 29**: `{` - Opening brace
- **Line 30**: `std::string out;` - Output string buffer
- **Line 31**: `size_t argIdx = argStart;` - Current argument index
- **Line 32**: `size_t i = 0;` - Format string position
- **Line 33**: Empty line for readability
- **Line 34**: `auto nextArg = [&]() -> QuantumValue` - Lambda function to get next argument
- **Line 35**: `{` - Opening brace for lambda
- **Line 36**: `return argIdx < args.size() ? args[argIdx++] : QuantumValue();` - Return next arg or nil
- **Line 37**: `};` - Closing brace for lambda

### Main Format Loop (Lines 39-58)
- **Line 38**: Empty line for readability
- **Line 39**: `while (i < fmt.size())` - Loop through format string
- **Line 40**: `{` - Opening brace for main loop
- **Line 41**: `if (fmt[i] != '%')` - Check if not format specifier
- **Line 42**: `{` - Opening brace for regular character
- **Line 43**: `out += fmt[i++];` - Add character to output and advance
- **Line 44**: `continue;` - Continue to next character
- **Line 45**: `}` - Closing brace for regular character
- **Line 46**: `++i;` - Skip the % character
- **Line 47**: `if (i >= fmt.size())` - Check if at end of format string
- **Line 48**: `break;` - Exit if at end
- **Line 49**: `if (fmt[i] == '%')` - Check for escaped %%
- **Line 50**: `{` - Opening brace for escaped %
- **Line 51**: `out += '%';` - Add literal % to output
- **Line 52**: `++i;` - Skip second %
- **Line 53**: `continue;` - Continue to next character
- **Line 54**: `}` - Closing brace for escaped %
- **Line 55**: Empty line for readability
- **Line 56**: `// ── Collect flags ──────────────────────────────────────────────────` - Flags section comment
- **Line 57**: `bool flagMinus = false, flagPlus = false, flagSpace = false, flagZero = false, flagHash = false;` - Initialize flag variables
- **Line 58**: `while (i < fmt.size())` - Loop to collect flags

### Flag Collection Loop (Lines 59-92)
- **Line 59**: `{` - Opening brace for flag loop
- **Line 60**: `char f = fmt[i];` - Get current flag character
- **Line 61**: `if (f == '-')` - Check for left-align flag
- **Line 62**: `{` - Opening brace for minus flag
- **Line 63**: `flagMinus = true;` - Set minus flag
- **Line 64**: `++i;` - Advance to next character
- **Line 65**: `}` - Closing brace for minus flag
- **Line 66**: `else if (f == '+')` - Check for force sign flag
- **Line 67**: `{` - Opening brace for plus flag
- **Line 68**: `flagPlus = true;` - Set plus flag
- **Line 69**: `++i;` - Advance to next character
- **Line 70**: `}` - Closing brace for plus flag
- **Line 71**: `else if (f == ' ')` - Check for space flag
- **Line 72**: `{` - Opening brace for space flag
- **Line 73**: `flagSpace = true;` - Set space flag
- **Line 74**: `++i;` - Advance to next character
- **Line 75**: `}` - Closing brace for space flag
- **Line 76**: `else if (f == '0')` - Check for zero-pad flag
- **Line 77**: `{` - Opening brace for zero flag
- **Line 78**: `flagZero = true;` - Set zero flag
- **Line 79**: `++i;` - Advance to next character
- **Line 80**: `}` - Closing brace for zero flag
- **Line 81**: `else if (f == '#')` - Check for hash flag
- **Line 82**: `{` - Opening brace for hash flag
- **Line 83**: `flagHash = true;` - Set hash flag
- **Line 84**: `++i;` - Advance to next character
- **Line 85**: `}` - Closing brace for hash flag
- **Line 86**: `else` - Not a flag character
- **Line 87**: `break;` - Exit flag collection loop
- **Line 88**: `}` - Closing brace for flag loop

### Width Parsing (Lines 90-93)
- **Line 89**: Empty line for readability
- **Line 90**: `// ── Width ──────────────────────────────────────────────────────────` - Width section comment
- **Line 91**: `int width = 0;` - Initialize width
- **Line 92**: `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for width digits
- **Line 93**: `width = width * 10 + (fmt[i++] - '0');` - Parse width number

### Precision Parsing (Lines 95-103)
- **Line 94**: Empty line for readability
- **Line 95**: `// ── Precision ─────────────────────────────────────────────────────` - Precision section comment
- **Line 96**: `int prec = -1;` - Initialize precision (-1 = not specified)
- **Line 97**: `if (i < fmt.size() && fmt[i] == '.')` - Check for precision specifier
- **Line 98**: `{` - Opening brace for precision
- **Line 99**: `++i;` - Skip the dot
- **Line 100**: `prec = 0;` - Initialize precision
- **Line 101**: `while (i < fmt.size() && std::isdigit(fmt[i]))` - Loop for precision digits
- **Line 102**: `prec = prec * 10 + (fmt[i++] - '0');` - Parse precision number
- **Line 103**: `}` - Closing brace for precision

### Conversion Setup (Lines 105-112)
- **Line 104**: Empty line for readability
- **Line 105**: `if (i >= fmt.size())` - Check if at end of format string
- **Line 106**: `break;` - Exit if at end
- **Line 107**: `char conv = fmt[i++];` - Get conversion character and advance
- **Line 108**: `QuantumValue arg = nextArg();` - Get next argument
- **Line 109**: Empty line for readability
- **Line 110**: `// ── Pad helper ────────────────────────────────────────────────────` - Pad helper comment
- **Line 111**: `auto pad = [&](std::string s, bool numericSign = false) -> std::string` - Lambda for padding
- **Line 112**: `{` - Opening brace for pad lambda

### Pad Helper Lambda (Lines 113-128)
- **Line 113**: `if (width > 0 && (int)s.size() < width)` - Check if padding needed
- **Line 114**: `{` - Opening brace for padding
- **Line 115**: `int pad = width - (int)s.size();` - Calculate padding amount
- **Line 116**: `if (flagMinus)` - Check for left-align
- **Line 117**: `s += std::string(pad, ' ');` - Add right padding
- **Line 118**: `else if (flagZero && numericSign)` - Check for zero-pad with numeric sign
- **Line 119**: `s = std::string(pad, '0') + s;` - Add left zero padding
- **Line 120**: `else` - Default padding
- **Line 121**: `s = std::string(pad, ' ') + s;` - Add left space padding
- **Line 122**: `}` - Closing brace for padding
- **Line 123**: `return s;` - Return padded string
- **Line 124**: `};` - Closing brace for pad lambda
- **Line 125**: Empty line for readability
- **Line 126**: `char buf[256];` - Buffer for snprintf
- **Line 127**: `switch (conv)` - Switch on conversion character
- **Line 128**: `{` - Opening brace for switch

### Integer Specifiers (Lines 130-166)
- **Line 129**: Empty line for readability
- **Line 130**: `// ── Integer specifiers ────────────────────────────────────────────` - Integer section comment
- **Line 131**: `case 'd':` - Decimal integer case
- **Line 132**: `case 'i':` - Integer case (alias for d)
- **Line 133**: `{` - Opening brace for integer case
- **Line 134**: `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
- **Line 135**: `std::string s;` - String for formatted result
- **Line 136**: `if (prec >= 0)` - Check if precision specified
- **Line 137**: `{` - Opening brace for precision case
- **Line 138**: `// precision on integers = minimum digits` - Comment about integer precision
- **Line 139**: `std::snprintf(buf, sizeof(buf), ("%0*lld"), prec, std::abs(n));` - Format with precision
- **Line 140**: `s = buf;` - Copy to string
- **Line 141**: `if (n < 0)` - Check if negative
- **Line 142**: `s = "-" + s;` - Add negative sign
- **Line 143**: `else if (flagPlus)` - Check for force sign
- **Line 144**: `s = "+" + s;` - Add plus sign
- **Line 145**: `else if (flagSpace)` - Check for space flag
- **Line 146**: `s = " " + s;` - Add space
- **Line 147**: `}` - Closing brace for precision case
- **Line 148**: `else` - No precision specified
- **Line 149**: `{` - Opening brace for no precision
- **Line 150**: `std::snprintf(buf, sizeof(buf), "%lld", n);` - Format normally
- **Line 151**: `s = buf;` - Copy to string
- **Line 152**: `if (n >= 0 && flagPlus)` - Check for positive with force sign
- **Line 153**: `s = "+" + s;` - Add plus sign
- **Line 154**: `else if (n >= 0 && flagSpace)` - Check for positive with space flag
- **Line 155**: `s = " " + s;` - Add space
- **Line 156**: `}` - Closing brace for no precision
- **Line 157**: `out += pad(s, true);` - Add padded result to output
- **Line 158**: `break;` - Exit case
- **Line 159**: `}` - Closing brace for integer case
- **Line 160**: `case 'u':` - Unsigned integer case
- **Line 161**: `{` - Opening brace for unsigned case
- **Line 162**: `unsigned long long n = arg.isNumber() ? (unsigned long long)(long long)arg.asNumber() : 0ULL;` - Convert to unsigned
- **Line 163**: `std::snprintf(buf, sizeof(buf), "%llu", n);` - Format unsigned
- **Line 164**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 165**: `break;` - Exit case
- **Line 166**: `}` - Closing brace for unsigned case

### Float Specifiers (Lines 168-212)
- **Line 167**: Empty line for readability
- **Line 168**: `// ── Float specifiers ──────────────────────────────────────────────` - Float section comment
- **Line 169**: `case 'f':` - Float decimal case
- **Line 170**: `case 'F':` - Float case (alias for f)
- **Line 171**: `{` - Opening brace for float case
- **Line 172**: `double d = arg.isNumber() ? arg.asNumber() : 0.0;` - Convert to double
- **Line 173**: `std::string spec = "%";` - Start format spec
- **Line 174**: `if (flagPlus)` - Check for force sign
- **Line 175**: `spec += '+';` - Add plus to spec
- **Line 176**: `else if (flagSpace)` - Check for space flag
- **Line 177**: `spec += ' ';` - Add space to spec
- **Line 178**: `if (prec >= 0)` - Check for precision
- **Line 179**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 180**: `spec += 'f';` - Add f conversion
- **Line 181**: `std::snprintf(buf, sizeof(buf), spec.c_str(), d);` - Format with spec
- **Line 182**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 183**: `break;` - Exit case
- **Line 184**: `}` - Closing brace for float case

### String and Char Specifiers (Lines 214-232)
- **Line 213**: Empty line for readability
- **Line 214**: `// ── String specifier ─────────────────────────────────────────────` - String section comment
- **Line 215**: `case 's':` - String case
- **Line 216**: `{` - Opening brace for string case
- **Line 217**: `std::string s = arg.toString();` - Convert argument to string
- **Line 218**: `if (prec >= 0 && (int)s.size() > prec)` - Check if precision truncation needed
- **Line 219**: `s = s.substr(0, prec); // truncate to precision` - Truncate to precision
- **Line 220**: `out += pad(s, false);` - Add padded result
- **Line 221**: `break;` - Exit case
- **Line 222**: `}` - Closing brace for string case
- **Line 223**: Empty line for readability
- **Line 224**: `// ── Char specifier ────────────────────────────────────────────────` - Char section comment
- **Line 225**: `case 'c':` - Character case
- **Line 226**: `{` - Opening brace for char case
- **Line 227**: `char c = arg.isString() && !arg.asString().empty()` - Get character from string or number
- **Line 228**: `? arg.asString()[0]` - First character of string
- **Line 229**: `: (char)(arg.isNumber() ? (int)arg.asNumber() : 0);` - Or numeric cast to char
- **Line 230**: `out += pad(std::string(1, c), false);` - Add padded character
- **Line 231**: `break;` - Exit case
- **Line 232**: `}` - Closing brace for char case

### Hex Specifiers (Lines 234-252)
- **Line 233**: Empty line for readability
- **Line 234**: `// ── Hex specifiers ────────────────────────────────────────────────` - Hex section comment
- **Line 235**: `case 'x':` - Hexadecimal lowercase case
- **Line 236**: `case 'X':` - Hexadecimal uppercase case
- **Line 237**: `{` - Opening brace for hex case
- **Line 238**: `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
- **Line 239**: `std::string spec = "%";` - Start format spec
- **Line 240**: `if (flagHash)` - Check for hash flag
- **Line 241**: `spec += '#';` - Add hash to spec
- **Line 242**: `if (prec >= 0)` - Check for precision
- **Line 243**: `spec += "." + std::to_string(prec);` - Add precision to spec
- **Line 244**: `spec += (conv == 'x') ? "llx" : "llX";` - Add conversion specifier
- **Line 245**: `std::snprintf(buf, sizeof(buf), spec.c_str(), n);` - Format with spec
- **Line 246**: `std::string s = buf;` - Copy to string
- **Line 247**: `// prefix 0x/0X if not already there (flagHash adds it)` - Comment about prefix
- **Line 248**: `if (flagHash && n != 0 && s.substr(0, 2) != "0x" && s.substr(0, 2) != "0X")` - Check if prefix needed
- **Line 249**: `s = (conv == 'x' ? "0x" : "0X") + s;` - Add prefix
- **Line 250**: `out += pad(s, true);` - Add padded result
- **Line 251**: `break;` - Exit case
- **Line 252**: `}` - Closing brace for hex case

### Octal Specifier (Lines 254-261)
- **Line 253**: Empty line for readability
- **Line 254**: `// ── Octal specifier ───────────────────────────────────────────────` - Octal section comment
- **Line 255**: `case 'o':` - Octal case
- **Line 256**: `{` - Opening brace for octal case
- **Line 257**: `unsigned long long n = (unsigned long long)(long long)(arg.isNumber() ? arg.asNumber() : 0.0);` - Convert to unsigned
- **Line 258**: `std::snprintf(buf, sizeof(buf), flagHash ? "%#llo" : "%llo", n);` - Format with or without prefix
- **Line 259**: `out += pad(std::string(buf), true);` - Add padded result
- **Line 260**: `break;` - Exit case
- **Line 261**: `}` - Closing brace for octal case

### Binary Specifier (Lines 263-285)
- **Line 262**: Empty line for readability
- **Line 263**: `// ── Binary specifier (non-standard, Quantum extension) ────────────` - Binary section comment
- **Line 264**: `case 'b':` - Binary case
- **Line 265**: `{` - Opening brace for binary case
- **Line 266**: `long long n = arg.isNumber() ? (long long)arg.asNumber() : 0LL;` - Convert to integer
- **Line 267**: `if (n == 0)` - Check for zero
- **Line 268**: `{` - Opening brace for zero case
- **Line 269**: `out += pad(flagHash ? "0b0" : "0", true);` - Output zero with optional prefix
- **Line 270**: `}` - Closing brace for zero case
- **Line 271**: `else` - Non-zero case
- **Line 272**: `{` - Opening brace for non-zero case
- **Line 273**: `std::string bits;` - String for binary digits
- **Line 274**: `unsigned long long u = (unsigned long long)n;` - Convert to unsigned
- **Line 275**: `while (u)` - Loop while bits remain
- **Line 276**: `{` - Opening brace for bit loop
- **Line 277**: `bits = (char)('0' + (u & 1)) + bits;` - Extract bit and prepend
- **Line 278**: `u >>= 1;` - Shift right to next bit
- **Line 279**: `}` - Closing brace for bit loop
- **Line 280**: `if (flagHash)` - Check for hash flag
- **Line 281**: `bits = "0b" + bits;` - Add binary prefix
- **Line 282**: `out += pad(bits, true);` - Add padded result
- **Line 283**: `}` - Closing brace for non-zero case
- **Line 284**: `break;` - Exit case
- **Line 285**: `}` - Closing brace for binary case

### Boolean Specifier (Lines 287-292)
- **Line 286**: Empty line for readability
- **Line 287**: `// ── Boolean specifier (Quantum extension) ─────────────────────────` - Boolean section comment
- **Line 288**: `case 'B':` - Boolean case
- **Line 289**: `{` - Opening brace for boolean case
- **Line 290**: `out += pad(arg.isTruthy() ? "true" : "false", false);` - Output truthiness as string
- **Line 291**: `break;` - Exit case
- **Line 292**: `}` - Closing brace for boolean case

### Type Name Specifier (Lines 294-299)
- **Line 293**: Empty line for readability
- **Line 294**: `// ── Type name specifier (Quantum extension) ───────────────────────` - Type name section comment
- **Line 295**: `case 't':` - Type name case
- **Line 296**: `{` - Opening brace for type name case
- **Line 297**: `out += pad(arg.typeName(), false);` - Output type name
- **Line 298**: `break;` - Exit case
- **Line 299**: `}` - Closing brace for type name case

### Default Case (Lines 301-305)
- **Line 300**: Empty line for readability
- **Line 301**: `default:` - Default case for unknown specifiers
- **Line 302**: `out += '%';` - Add literal percent
- **Line 303**: `out += conv;` - Add unknown specifier
- **Line 304**: `break;` - Exit case

### Function Completion (Lines 306-309)
- **Line 305**: `}` - Closing brace for switch
- **Line 306**: `}` - Closing brace for main loop
- **Line 307**: `return out;` - Return formatted string
- **Line 308**: `}` - Closing brace for function
- **Line 309**: `}` - Closing brace for code block

## Summary

The helper functions provide essential utilities for the Quantum Language interpreter:

### Key Components
- **Cin Buffer**: Handles C++ style input tokenization
- **Type Conversion**: Safe conversion between QuantumValue types
- **Format Engine**: Comprehensive printf-style formatting system

### Format Engine Features
- **Standard Specifiers**: %d, %u, %f, %e, %g, %s, %c, %x, %X, %o
- **Quantum Extensions**: %b (binary), %B (boolean), %t (type name)
- **Flags**: Left-align, force sign, zero-pad, space, hash
- **Width and Precision**: Full formatting control
- **Padding**: Flexible left/right padding with custom characters

### Design Benefits
- **Type Safety**: Proper error handling for type conversions
- **Performance**: Efficient string building and formatting
- **Compatibility**: C-style printf compatibility with extensions
- **Extensibility**: Easy to add new format specifiers

This formatting system enables powerful string formatting capabilities while maintaining compatibility with standard C printf syntax and adding Quantum Language-specific extensions.
