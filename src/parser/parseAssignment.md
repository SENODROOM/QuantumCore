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

## Code Explanation

###
-  `ASTNodePtr Parser::parseAssignment()` - Parse assignment expressions
-  `{` - Opening brace
-  `int ln = current().line;` - Store current line number for AST nodes
-  `auto left = parseOr();` - Parse left-hand side (higher precedence)
  - Calls `parseOr()` to parse the left operand
  - Assignment has lower precedence than logical OR

###
-  `while (check(TokenType::ASSIGN) || check(TokenType::PLUS_ASSIGN) ||` - Check for assignment operators
-  `check(TokenType::MINUS_ASSIGN) || check(TokenType::STAR_ASSIGN) ||` - Check for arithmetic assignments
-  `check(TokenType::SLASH_ASSIGN) || check(TokenType::AND_ASSIGN) ||` - Check for more assignments
-  `check(TokenType::OR_ASSIGN) || check(TokenType::XOR_ASSIGN) ||` - Check for bitwise assignments
-  `check(TokenType::MOD_ASSIGN))` - Check for modulo assignment
-  `{` - Opening brace for assignment handling
-  `auto op = consume();` - Consume the assignment operator
-  `auto right = parseAssignment(); // Right-associative` - Parse right-hand side
  - Calls `parseAssignment()` recursively for right-associativity
  - Allows chained assignments like `a = b = c`

###
-  `left = std::make_unique<ASTNode>(AssignExpr{op.value, std::move(left), std::move(right)}, ln);` - Create assignment AST node
  - `AssignExpr{}` creates assignment expression structure
  - `op.value` stores the operator string (e.g., "=", "+=")
  - `std::move(left)` transfers ownership of left side
  - `std::move(right)` transfers ownership of right side
-  `}` - Closing brace for assignment handling
-  `}` - Closing brace for function (this is incorrect in actual code - should be after return)

###
-  `return left;` - Return the parsed assignment expression
-  `}` - Closing brace for function

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
