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

## Code Explanation

###
-  `ASTNodePtr Parser::parseStatement()` - Parse individual statement
-  `{` - Opening brace
-  `skipNewlines();` - Skip leading whitespace

###
-  `// Skip Python-style decorators (e.g. @property, @dataclass)` - Comment explaining purpose
-  `while (check(TokenType::DECODER))` - Loop while finding decorators
-  `{` - Opening brace for decorator loop
-  `consume(); // eat @` - Consume @ symbol
-  `if (check(TokenType::IDENTIFIER))` - Check for decorator name
-  `{` - Opening brace for name handling
-  `consume(); // eat decorator name` - Consume decorator name
-  `// Optional call parens e.g. @decorator(args)` - Comment about optional arguments
-  `if (check(TokenType::LPAREN))` - Check for opening parenthesis
-  `{` - Opening brace for argument parsing
-  `consume(); // eat (` - Consume opening parenthesis
-  `int depth = 1;` - Initialize parenthesis depth counter
-  `while (!atEnd() && depth > 0)` - Loop until matching closing parenthesis
-  `{` - Opening brace for depth tracking
-  `if (check(TokenType::LPAREN))` - Check for nested opening parenthesis
-  `depth++;` - Increment depth for nested parens
-  `else if (check(TokenType::RPAREN))` - Check for closing parenthesis
-  `depth--;` - Decrement depth
-  `consume();` - Consume current token
-  `}` - Closing brace for depth tracking
-  `}` - Closing brace for argument parsing
-  `}` - Closing brace for name handling
-  `skipNewlines();` - Skip whitespace after decorator
-  `}` - Closing brace for decorator loop
-  Empty line for readability

###
-  `int ln = current().line;` - Store current line number for AST nodes
-  `// Skip C/C++ storage class specifiers like static, extern, inline, volatile, register` - Comment explaining purpose
-  `while (!atEnd() && check(TokenType::IDENTIFIER) &&` - Loop for storage class keywords
-  `(current().value == "static" || current().value == "extern" ||` - Check for static/extern
-  `current().value == "inline" || current().value == "volatile" ||` - Check for inline/volatile
-  `current().value == "register" || current().value == "mutable" ||` - Check for register/mutable
-  `current().value == "constexpr"))` - Check for constexpr
-  `{` - Opening brace for storage class handling
-  `consume();` - Consume storage class keyword
-  `}` - Closing brace for storage class handling
-  Empty line for readability

###
-  `switch (current().type)` - Switch on current token type
-  `{` - Opening brace for switch

###
-  `case TokenType::LET:` - Handle variable declaration
-  `{` - Opening brace for LET case
-  `consume();` - Consume LET keyword
-  `return parseVarDecl(false);` - Parse variable declaration (non-const)
-  `}` - Closing brace for LET case

###
-  `case TokenType::CONST:` - Handle constant declaration
-  `{` - Opening brace for CONST case
-  `consume(); // eat 'const'` - Consume CONST keyword
-  `// C-style: "const int* p = &a" — const followed by a type keyword` - Comment about C-style
-  `// In this case treat as a C-type var decl (the const is just a qualifier, ignore it)` - Comment about treatment
-  `if (isCTypeKeyword(current().type))` - Check if followed by C type keyword
-  `{` - Opening brace for C-style const
-  `// Re-use the TYPE_INT/etc. branch logic inline:` - Comment about code reuse
-  `// eat all type keywords (e.g. "const int", "const unsigned long")` - Comment about type parsing
-  `std::string typeHint = consume().value;` - Start building type hint string
-  `while (isCTypeKeyword(current().type))` - Loop for additional type keywords
-  `typeHint += " " + consume().value;` - Append type keywords to hint
-  `// eat trailing const after type: "int* const ptr"` - Comment about trailing const
-  `if (check(TokenType::CONST))` - Check for trailing const
-  `consume();` - Consume trailing const
-  `auto firstDecl = parseCTypeVarDecl(typeHint);` - Parse first variable declaration
-  `if (!check(TokenType::COMMA))` - Check if single declaration
-  `return firstDecl;` - Return single declaration
-  `auto block = std::make_unique<ASTNode>(BlockStmt{}, ln);` - Create block for multiple declarations
-  `block->as<BlockStmt>().statements.push_back(std::move(firstDecl));` - Add first declaration
-  `while (check(TokenType::COMMA))` - Loop for multiple declarations
-  `{` - Opening brace for multiple declarations
-  `consume();` - Consume comma
-  `std::string hint = typeHint;` - Start with base type hint
-  `if (isCTypeKeyword(current().type) || check(TokenType::CONST))` - Check for type repetition
-  `{` - Opening brace for type repetition
-  `hint = consume().value;` - Start new type hint
-  `while (isCTypeKeyword(current().type) || check(TokenType::CONST))` - Loop for additional keywords
-  `hint += " " + consume().value;` - Build type hint
-  `}` - Closing brace for type repetition
-  `block->as<BlockStmt>().statements.push_back(parseCTypeVarDecl(hint));` - Parse and add declaration
-  `}` - Closing brace for multiple declarations
-  `while (check(TokenType::NEWLINE) || check(TokenType::SEMICOLON))` - Skip terminators
-  `consume();` - Consume terminator tokens
-  `return block;` - Return block with multiple declarations
-  `}` - Closing brace for C-style const
-  `// Quantum/JS style: "const x = 5"` - Comment about JavaScript-style const
-  `return parseVarDecl(true);` - Parse constant declaration
-  `}` - Closing brace for CONST case

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
