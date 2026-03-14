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

## Line-by-Line Explanation

### Function Signature and Initialization (Lines 2776-2779)
- **Line 2776**: `ASTNodePtr Parser::parsePrimary()` - Parse primary expressions
- **Line 2777**: `{` - Opening brace
- **Line 2778**: `int ln = current().line;` - Store current line number for AST nodes
- **Line 2779**: `auto &tok = current();` - Get reference to current token for value access

### Number Literal (Lines 2780-2782)
- **Line 2780**: `if (match(TokenType::NUMBER)) {` - Check for number token
- **Line 2781**: `return std::make_unique<ASTNode>(NumberLiteral{std::stod(tok.value)}, ln);` - Create number literal
  - `std::stod(tok.value)` converts string to double
  - `NumberLiteral{}` creates number literal structure
- **Line 2782**: `}` - Closing brace

### String Literal (Lines 2783-2785)
- **Line 2783**: `if (match(TokenType::STRING)) {` - Check for string token
- **Line 2784**: `return std::make_unique<ASTNode>(StringLiteral{tok.value}, ln);` - Create string literal
  - Uses token value directly (already unescaped by lexer)
- **Line 2785**: `}` - Closing brace

### Boolean Literals (Lines 2786-2790)
- **Line 2786**: `if (match(TokenType::BOOL_TRUE)) {` - Check for true literal
- **Line 2787**: `return std::make_unique<ASTNode>(BoolLiteral{true}, ln);` - Create true literal
- **Line 2788**: `}` - Closing brace
- **Line 2789**: `if (match(TokenType::BOOL_FALSE)) {` - Check for false literal
- **Line 2790**: `return std::make_unique<ASTNode>(BoolLiteral{false}, ln);` - Create false literal

### Nil Literal (Lines 2791-2793)
- **Line 2791**: `if (match(TokenType::NIL)) {` - Check for nil token
- **Line 2792**: `return std::make_unique<ASTNode>(NilLiteral{}, ln);` - Create nil literal
- **Line 2793**: `}` - Closing brace

### Identifier (Lines 2794-2796)
- **Line 2794**: `if (match(TokenType::IDENTIFIER)) {` - Check for identifier token
- **Line 2795**: `return std::make_unique<ASTNode>(Identifier{tok.value}, ln);` - Create identifier node
  - Uses token value as variable name
- **Line 2796**: `}` - Closing brace

### This Keyword (Lines 2797-2799)
- **Line 2797**: `if (match(TokenType::THIS)) {` - Check for this keyword
- **Line 2798**: `return std::make_unique<ASTNode>(Identifier{"this"}, ln);` - Create this identifier
  - Treated as identifier with special name "this"
- **Line 2799**: `}` - Closing brace

### Super Keyword (Lines 2800-2802)
- **Line 2800**: `if (match(TokenType::SUPER)) {` - Check for super keyword
- **Line 2801**: `return std::make_unique<ASTNode>(SuperExpr{""}, ln);` - Create super expression
  - Empty string indicates constructor call (no method specified)
- **Line 2802**: `}` - Closing brace

### Parenthesized Expression (Lines 2803-2807)
- **Line 2803**: `if (match(TokenType::LPAREN)) {` - Check for opening parenthesis
- **Line 2804**: `auto expr = parseExpr();` - Parse expression inside parentheses
- **Line 2805**: `expect(TokenType::RPAREN, "Expected ')'");` - Expect closing parenthesis
- **Line 2806**: `return expr;` - Return parsed expression (no extra wrapper needed)
- **Line 2807**: `}` - Closing brace

### Array Literal (Lines 2808-2810)
- **Line 2808**: `if (match(TokenType::LBRACKET)) {` - Check for opening bracket
- **Line 2809**: `return parseArrayLiteral();` - Delegate to array literal parser
- **Line 2810**: `}` - Closing brace

### Dictionary Literal (Lines 2811-2813)
- **Line 2811**: `if (match(TokenType::LBRACE)) {` - Check for opening brace
- **Line 2812**: `return parseDictLiteral();` - Delegate to dictionary literal parser
- **Line 2813**: `}` - Closing brace

### New Expression (Lines 2814-2816)
- **Line 2814**: `if (match(TokenType::NEW)) {` - Check for new keyword
- **Line 2815**: `return parseNewExpr();` - Delegate to new expression parser
- **Line 2816**: `}` - Closing brace

### Error Case (Lines 2817-2818)
- **Line 2817**: `throw ParseError("Unexpected token: '" + tok.value + "'", tok.line, tok.col);` - Throw error for unknown tokens
  - Provides descriptive error message with token value
  - Includes line and column for precise error location
- **Line 2818**: `}` - Closing brace for function

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
