# parseStatement() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parseStatement()
{
    skipNewlines();

    // Skip Python-style decorators (e.g. @property, @dataclass)
    while (check(TokenType::DECORATOR))
    {
        consume(); // eat @
        if (check(TokenType::IDENTIFIER))
        {
            consume(); // eat decorator name
            // Optional call parens e.g. @decorator(args)
            if (check(TokenType::LPAREN))
            {
                consume(); // eat (
                int depth = 1;
                while (!atEnd() && depth > 0)
                {
                    if (check(TokenType::LPAREN))
                        depth++;
                    else if (check(TokenType::RPAREN))
                        depth--;
                    consume();
                }
            }
        }
        skipNewlines();
    }

    int ln = current().line;
    // Skip C/C++ storage class specifiers like static, extern, inline, volatile, register
    while (!atEnd() && check(TokenType::IDENTIFIER) && 
           (current().value == "static" || current().value == "extern" || 
            current().value == "inline" || current().value == "volatile" || 
            current().value == "register" || current().value == "mutable" ||
            current().value == "constexpr"))
    {
        consume();
    }
    switch (current().type)
    {
    case TokenType::LET:
    {
        consume();
        return parseVarDecl(false);
    }
    case TokenType::CONST:
    {
        consume(); // eat 'const'
        // C-style: "const int* p = &a" — const followed by a type keyword
        // In this case treat as a C-type var decl (the const is just a qualifier, ignore it)
        if (isCTypeKeyword(current().type))
        {
            // Re-use the TYPE_INT/etc. branch logic inline:
            // eat all type keywords (e.g. "const int", "const unsigned long")
            std::string typeHint = consume().value;
            while (isCTypeKeyword(current().type))
                typeHint += " " + consume().value;
            // eat trailing const after type: "int* const ptr"
            if (check(TokenType::CONST))
                consume();
            auto firstDecl = parseCTypeVarDecl(typeHint);
            if (!check(TokenType::COMMA))
                return firstDecl;
            auto block = std::make_unique<ASTNode>(BlockStmt{}, ln);
            block->as<BlockStmt>().statements.push_back(std::move(firstDecl));
            while (check(TokenType::COMMA))
            {
                consume();
                std::string hint = typeHint;
                if (isCTypeKeyword(current().type) || check(TokenType::CONST))
                {
                    hint = consume().value;
                    while (isCTypeKeyword(current().type) || check(TokenType::CONST))
                        hint += " " + consume().value;
                }
                block->as<BlockStmt>().statements.push_back(parseCTypeVarDecl(hint));
            }
            while (check(TokenType::NEWLINE) || check(TokenType::SEMICOLON))
                consume();
            return block;
        }
        // Quantum/JS style: "const x = 5"
        return parseVarDecl(true);
    }
    // ... more cases continue in actual implementation
    default:
        return parseExprStmt();
    }
}
```

## Line-by-Line Explanation

### Function Start (Lines 55-57)
- **Line 55**: `ASTNodePtr Parser::parseStatement()` - Parse individual statement
- **Line 56**: `{` - Opening brace
- **Line 57**: `skipNewlines();` - Skip leading whitespace

### Decorator Handling (Lines 58-82)
- **Line 58**: `// Skip Python-style decorators (e.g. @property, @dataclass)` - Comment explaining purpose
- **Line 59**: `while (check(TokenType::DECODER))` - Loop while finding decorators
- **Line 60**: `{` - Opening brace for decorator loop
- **Line 61**: `consume(); // eat @` - Consume @ symbol
- **Line 62**: `if (check(TokenType::IDENTIFIER))` - Check for decorator name
- **Line 63**: `{` - Opening brace for name handling
- **Line 64**: `consume(); // eat decorator name` - Consume decorator name
- **Line 65**: `// Optional call parens e.g. @decorator(args)` - Comment about optional arguments
- **Line 66**: `if (check(TokenType::LPAREN))` - Check for opening parenthesis
- **Line 67**: `{` - Opening brace for argument parsing
- **Line 68**: `consume(); // eat (` - Consume opening parenthesis
- **Line 69**: `int depth = 1;` - Initialize parenthesis depth counter
- **Line 70**: `while (!atEnd() && depth > 0)` - Loop until matching closing parenthesis
- **Line 71**: `{` - Opening brace for depth tracking
- **Line 72**: `if (check(TokenType::LPAREN))` - Check for nested opening parenthesis
- **Line 73**: `depth++;` - Increment depth for nested parens
- **Line 74**: `else if (check(TokenType::RPAREN))` - Check for closing parenthesis
- **Line 75**: `depth--;` - Decrement depth
- **Line 76**: `consume();` - Consume current token
- **Line 77**: `}` - Closing brace for depth tracking
- **Line 78**: `}` - Closing brace for argument parsing
- **Line 79**: `}` - Closing brace for name handling
- **Line 80**: `skipNewlines();` - Skip whitespace after decorator
- **Line 81**: `}` - Closing brace for decorator loop
- **Line 82**: Empty line for readability

### Storage Class Handling (Lines 83-93)
- **Line 83**: `int ln = current().line;` - Store current line number for AST nodes
- **Line 84**: `// Skip C/C++ storage class specifiers like static, extern, inline, volatile, register` - Comment explaining purpose
- **Line 85**: `while (!atEnd() && check(TokenType::IDENTIFIER) &&` - Loop for storage class keywords
- **Line 86**: `(current().value == "static" || current().value == "extern" ||` - Check for static/extern
- **Line 87**: `current().value == "inline" || current().value == "volatile" ||` - Check for inline/volatile
- **Line 88**: `current().value == "register" || current().value == "mutable" ||` - Check for register/mutable
- **Line 89**: `current().value == "constexpr"))` - Check for constexpr
- **Line 90**: `{` - Opening brace for storage class handling
- **Line 91**: `consume();` - Consume storage class keyword
- **Line 92**: `}` - Closing brace for storage class handling
- **Line 93**: Empty line for readability

### Main Switch Statement (Lines 94-100)
- **Line 94**: `switch (current().type)` - Switch on current token type
- **Line 95**: `{` - Opening brace for switch

### LET Case (Lines 96-100)
- **Line 96**: `case TokenType::LET:` - Handle variable declaration
- **Line 97**: `{` - Opening brace for LET case
- **Line 98**: `consume();` - Consume LET keyword
- **Line 99**: `return parseVarDecl(false);` - Parse variable declaration (non-const)
- **Line 100**: `}` - Closing brace for LET case

### CONST Case (Lines 101-139)
- **Line 101**: `case TokenType::CONST:` - Handle constant declaration
- **Line 102**: `{` - Opening brace for CONST case
- **Line 103**: `consume(); // eat 'const'` - Consume CONST keyword
- **Line 104**: `// C-style: "const int* p = &a" — const followed by a type keyword` - Comment about C-style
- **Line 105**: `// In this case treat as a C-type var decl (the const is just a qualifier, ignore it)` - Comment about treatment
- **Line 106**: `if (isCTypeKeyword(current().type))` - Check if followed by C type keyword
- **Line 107**: `{` - Opening brace for C-style const
- **Line 108**: `// Re-use the TYPE_INT/etc. branch logic inline:` - Comment about code reuse
- **Line 109**: `// eat all type keywords (e.g. "const int", "const unsigned long")` - Comment about type parsing
- **Line 110**: `std::string typeHint = consume().value;` - Start building type hint string
- **Line 111**: `while (isCTypeKeyword(current().type))` - Loop for additional type keywords
- **Line 112**: `typeHint += " " + consume().value;` - Append type keywords to hint
- **Line 113**: `// eat trailing const after type: "int* const ptr"` - Comment about trailing const
- **Line 114**: `if (check(TokenType::CONST))` - Check for trailing const
- **Line 115**: `consume();` - Consume trailing const
- **Line 116**: `auto firstDecl = parseCTypeVarDecl(typeHint);` - Parse first variable declaration
- **Line 117**: `if (!check(TokenType::COMMA))` - Check if single declaration
- **Line 118**: `return firstDecl;` - Return single declaration
- **Line 119**: `auto block = std::make_unique<ASTNode>(BlockStmt{}, ln);` - Create block for multiple declarations
- **Line 120**: `block->as<BlockStmt>().statements.push_back(std::move(firstDecl));` - Add first declaration
- **Line 121**: `while (check(TokenType::COMMA))` - Loop for multiple declarations
- **Line 122**: `{` - Opening brace for multiple declarations
- **Line 123**: `consume();` - Consume comma
- **Line 124**: `std::string hint = typeHint;` - Start with base type hint
- **Line 125**: `if (isCTypeKeyword(current().type) || check(TokenType::CONST))` - Check for type repetition
- **Line 126**: `{` - Opening brace for type repetition
- **Line 127**: `hint = consume().value;` - Start new type hint
- **Line 128**: `while (isCTypeKeyword(current().type) || check(TokenType::CONST))` - Loop for additional keywords
- **Line 129**: `hint += " " + consume().value;` - Build type hint
- **Line 130**: `}` - Closing brace for type repetition
- **Line 131**: `block->as<BlockStmt>().statements.push_back(parseCTypeVarDecl(hint));` - Parse and add declaration
- **Line 132**: `}` - Closing brace for multiple declarations
- **Line 133**: `while (check(TokenType::NEWLINE) || check(TokenType::SEMICOLON))` - Skip terminators
- **Line 134**: `consume();` - Consume terminator tokens
- **Line 135**: `return block;` - Return block with multiple declarations
- **Line 136**: `}` - Closing brace for C-style const
- **Line 137**: `// Quantum/JS style: "const x = 5"` - Comment about JavaScript-style const
- **Line 138**: `return parseVarDecl(true);` - Parse constant declaration
- **Line 139**: `}` - Closing brace for CONST case

## Summary

The `parseStatement()` function is the core statement dispatcher that handles all statement types:

### Key Features
- **Multi-Paradigm Support**: Handles Python, JavaScript, and C++ syntax
- **Decorator Support**: Processes Python-style decorators
- **Storage Classes**: Handles C++ storage class specifiers
- **Type Flexibility**: Distinguishes between C-style and JavaScript-style declarations
- **Multi-Declarations**: Handles comma-separated variable declarations

### Statement Types Handled
- **Variable Declarations**: `let`, `const` with type hints
- **Function Declarations**: `fn`, `def`, `function`
- **Control Flow**: `if`, `while`, `for`, `return`
- **I/O Operations**: `print`, `input`, `cout`, `cin`
- **Exception Handling**: `try`, `except`, `finally`
- **Import Statements**: `import`, `from`
- **Class Declarations**: `class`
- **Loop Control**: `break`, `continue`

### Language Features
- **C++ Compatibility**: Storage classes, type qualifiers, pointer declarations
- **Python Features**: Decorators, indentation-based blocks
- **JavaScript Style**: Arrow functions, const/let declarations
- **Error Handling**: Descriptive error messages with line numbers

### Design Benefits
- **Extensible**: Easy to add new statement types
- **Robust**: Handles edge cases and multiple syntax styles
- **Clear Structure**: Well-organized switch statement
- **Memory Efficient**: Smart pointers for AST management

This function enables the Quantum Language to support syntax from multiple programming paradigms while maintaining a single, coherent parsing system.
