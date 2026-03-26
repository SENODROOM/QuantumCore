# parsePrimary() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parsePrimary()
{
    int ln = current().line;
    auto &tok = current();
    
    // Literals
    if (match(TokenType::NUMBER)) {
        return std::make_unique<ASTNode>(NumberLiteral{std::stod(tok.value)}, ln);
    }
    if (match(TokenType::STRING)) {
        return std::make_unique<ASTNode>(StringLiteral{tok.value}, ln);
    }
    if (match(TokenType::BOOL_TRUE)) {
        return std::make_unique<ASTNode>(BoolLiteral{true}, ln);
    }
    if (match(TokenType::BOOL_FALSE)) {
        return std::make_unique<ASTNode>(BoolLiteral{false}, ln);
    }
    if (match(TokenType::NIL)) {
        return std::make_unique<ASTNode>(NilLiteral{}, ln);
    }
    
    // Identifiers and Keywords
    if (match(TokenType::IDENTIFIER)) {
        return std::make_unique<ASTNode>(Identifier{tok.value}, ln);
    }
    if (match(TokenType::THIS)) {
        return std::make_unique<ASTNode>(Identifier{"this"}, ln);
    }
    if (match(TokenType::SUPER)) {
        return std::make_unique<ASTNode>(SuperExpr{""}, ln);
    }
    
    // Grouping
    if (match(TokenType::LPAREN)) {
        auto expr = parseExpr();
        expect(TokenType::RPAREN, "Expected ')'");
        return expr;
    }
    
    // Collections
    if (match(TokenType::LBRACKET)) {
        return parseArrayLiteral();
    }
    if (match(TokenType::LBRACE)) {
        return parseDictLiteral();
    }
    
    // Special cases
    if (match(TokenType::NEW)) {
        return parseNewExpr();
    }
    
    throw ParseError("Unexpected token: '" + tok.value + "'", tok.line, tok.col);
}
```

## Code Explanation

###
-  `ASTNodePtr Parser::parsePrimary()` - Parse primary expressions
-  `{` - Opening brace
-  `int ln = current().line;` - Store current line number for AST nodes
-  `auto &tok = current();` - Get reference to current token for value access

###
-  `if (match(TokenType::NUMBER)) {` - Check for number token
-  `return std::make_unique<ASTNode>(NumberLiteral{std::stod(tok.value)}, ln);` - Create number literal
  - `std::stod(tok.value)` converts string to double
  - `NumberLiteral{}` creates number literal structure
-  `}` - Closing brace

###
-  `if (match(TokenType::STRING)) {` - Check for string token
-  `return std::make_unique<ASTNode>(StringLiteral{tok.value}, ln);` - Create string literal
  - Uses token value directly (already unescaped by lexer)
-  `}` - Closing brace

###
-  `if (match(TokenType::BOOL_TRUE)) {` - Check for true literal
-  `return std::make_unique<ASTNode>(BoolLiteral{true}, ln);` - Create true literal
-  `}` - Closing brace
-  `if (match(TokenType::BOOL_FALSE)) {` - Check for false literal
-  `return std::make_unique<ASTNode>(BoolLiteral{false}, ln);` - Create false literal

###
-  `if (match(TokenType::NIL)) {` - Check for nil token
-  `return std::make_unique<ASTNode>(NilLiteral{}, ln);` - Create nil literal
-  `}` - Closing brace

###
-  `if (match(TokenType::IDENTIFIER)) {` - Check for identifier token
-  `return std::make_unique<ASTNode>(Identifier{tok.value}, ln);` - Create identifier node
  - Uses token value as variable name
-  `}` - Closing brace

###
-  `if (match(TokenType::THIS)) {` - Check for this keyword
-  `return std::make_unique<ASTNode>(Identifier{"this"}, ln);` - Create this identifier
  - Treated as identifier with special name "this"
-  `}` - Closing brace

###
-  `if (match(TokenType::SUPER)) {` - Check for super keyword
-  `return std::make_unique<ASTNode>(SuperExpr{""}, ln);` - Create super expression
  - Empty string indicates constructor call (no method specified)
-  `}` - Closing brace

###
-  `if (match(TokenType::LPAREN)) {` - Check for opening parenthesis
-  `auto expr = parseExpr();` - Parse expression inside parentheses
-  `expect(TokenType::RPAREN, "Expected ')'");` - Expect closing parenthesis
-  `return expr;` - Return parsed expression (no extra wrapper needed)
-  `}` - Closing brace

###
-  `if (match(TokenType::LBRACKET)) {` - Check for opening bracket
-  `return parseArrayLiteral();` - Delegate to array literal parser
-  `}` - Closing brace

###
-  `if (match(TokenType::LBRACE)) {` - Check for opening brace
-  `return parseDictLiteral();` - Delegate to dictionary literal parser
-  `}` - Closing brace

###
-  `if (match(TokenType::NEW)) {` - Check for new keyword
-  `return parseNewExpr();` - Delegate to new expression parser
-  `}` - Closing brace

###
-  `throw ParseError("Unexpected token: '" + tok.value + "'", tok.line, tok.col);` - Throw error for unknown tokens
  - Provides descriptive error message with token value
  - Includes line and column for precise error location
-  `}` - Closing brace for function

## Summary

The `parsePrimary()` function handles the most basic expression building blocks:

### Primary Expression Types
- **Literals**: Numbers, strings, booleans, nil
- **Identifiers**: Variable names and this keyword
- **Object-Oriented**: Super expressions for inheritance
- **Grouping**: Parenthesized expressions
- **Collections**: Arrays and dictionaries
- **Object Creation**: New expressions

### Key Features
- **Type Safety**: Creates appropriate AST node types
- **Memory Management**: Uses smart pointers for automatic cleanup
- **Error Handling**: Descriptive error messages for invalid tokens
- **Line Tracking**: Preserves source location information

### Parsing Strategy
- **Pattern Matching**: Uses `match()` for token consumption
- **Delegation**: Complex literals delegated to specialized parsers
- **Efficiency**: Single pass with early returns
- **Completeness**: Handles all primary expression types

### AST Node Types Created
- `NumberLiteral` - Numeric values
- `StringLiteral` - String values
- `BoolLiteral` - Boolean values
- `NilLiteral` - Null values
- `Identifier` - Variable names
- `SuperExpr` - Super class access
- Array/Dict/New expressions via delegation

### Error Handling
- **Unexpected Tokens**: Clear error messages with token details
- **Location Information**: Line and column for precise error reporting
- **ParseError**: Structured error type for parser errors

This function forms the foundation of expression parsing, handling the atomic units that combine to form more complex expressions through the precedence chain.
