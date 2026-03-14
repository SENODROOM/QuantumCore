# parseAssignment() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parseAssignment()
{
    int ln = current().line;
    auto left = parseOr();
    while (check(TokenType::ASSIGN) || check(TokenType::PLUS_ASSIGN) || 
           check(TokenType::MINUS_ASSIGN) || check(TokenType::STAR_ASSIGN) || 
           check(TokenType::SLASH_ASSIGN) || check(TokenType::AND_ASSIGN) || 
           check(TokenType::OR_ASSIGN) || check(TokenType::XOR_ASSIGN) || 
           check(TokenType::MOD_ASSIGN))
    {
        auto op = consume();
        auto right = parseAssignment(); // Right-associative
        left = std::make_unique<ASTNode>(AssignExpr{op.value, std::move(left), std::move(right)}, ln);
    }
    return left;
}
```

## Line-by-Line Explanation

### Function Signature and Initialization (Lines 2168-2171)
- **Line 2168**: `ASTNodePtr Parser::parseAssignment()` - Parse assignment expressions
- **Line 2169**: `{` - Opening brace
- **Line 2170**: `int ln = current().line;` - Store current line number for AST nodes
- **Line 2171**: `auto left = parseOr();` - Parse left-hand side (higher precedence)
  - Calls `parseOr()` to parse the left operand
  - Assignment has lower precedence than logical OR

### Assignment Operator Loop (Lines 2172-2179)
- **Line 2172**: `while (check(TokenType::ASSIGN) || check(TokenType::PLUS_ASSIGN) ||` - Check for assignment operators
- **Line 2173**: `check(TokenType::MINUS_ASSIGN) || check(TokenType::STAR_ASSIGN) ||` - Check for arithmetic assignments
- **Line 2174**: `check(TokenType::SLASH_ASSIGN) || check(TokenType::AND_ASSIGN) ||` - Check for more assignments
- **Line 2175**: `check(TokenType::OR_ASSIGN) || check(TokenType::XOR_ASSIGN) ||` - Check for bitwise assignments
- **Line 2176**: `check(TokenType::MOD_ASSIGN))` - Check for modulo assignment
- **Line 2177**: `{` - Opening brace for assignment handling
- **Line 2178**: `auto op = consume();` - Consume the assignment operator
- **Line 2179**: `auto right = parseAssignment(); // Right-associative` - Parse right-hand side
  - Calls `parseAssignment()` recursively for right-associativity
  - Allows chained assignments like `a = b = c`

### AST Node Creation (Lines 2180-2182)
- **Line 2180**: `left = std::make_unique<ASTNode>(AssignExpr{op.value, std::move(left), std::move(right)}, ln);` - Create assignment AST node
  - `AssignExpr{}` creates assignment expression structure
  - `op.value` stores the operator string (e.g., "=", "+=")
  - `std::move(left)` transfers ownership of left side
  - `std::move(right)` transfers ownership of right side
- **Line 2181**: `}` - Closing brace for assignment handling
- **Line 2182**: `}` - Closing brace for function (this is incorrect in actual code - should be after return)

### Return Statement (Line 2183)
- **Line 2183**: `return left;` - Return the parsed assignment expression
- **Line 2184**: `}` - Closing brace for function

## Summary

The `parseAssignment()` function handles assignment expressions with all compound assignment operators:

### Key Features
- **Multiple Operators**: Supports all compound assignment operators
  - `=` - Simple assignment
  - `+=`, `-=` - Addition/subtraction assignment
  - `*=`, `/=` - Multiplication/division assignment
  - `&=`, `|=`, `^=` - Bitwise assignment
  - `%=` - Modulo assignment

### Right-Associative Parsing
- **Chained Assignments**: Supports `a = b = c = 5`
- **Recursive Structure**: Right side parsed with same function
- **Correct Precedence**: Lower precedence than logical operations

### AST Structure
- **AssignExpr Node**: Contains operator, left side, and right side
- **Line Numbers**: Preserved for error reporting
- **Memory Management**: Smart pointers prevent memory leaks

### Operator Precedence
Assignment has lower precedence than:
- Logical OR (`||`)
- Logical AND (`&&`)
- Bitwise operations
- Comparisons
- Arithmetic operations

But higher precedence than:
- Semicolons and statement terminators

### Examples
```cpp
x = 5                    // Simple assignment
x += 1                   // Compound assignment
a = b = c = 10           // Chained assignment
x *= y + z               // Assignment with expression
```

### Design Benefits
- **Comprehensive**: Handles all assignment operators
- **Correct Associativity**: Right-associative parsing
- **Efficient**: Single pass with loop structure
- **Extensible**: Easy to add new assignment operators

This function enables the Quantum Language to support both simple and compound assignment operations with proper precedence and associativity rules.
