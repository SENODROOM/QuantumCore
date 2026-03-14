# parseVarDecl() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parseVarDecl(bool isConst)
{
    int ln = current().line;
    std::string name;
    ASTNodePtr init;
    
    // Handle destructuring: [a, b] = array or {x, y} = object
    if (check(TokenType::LBRACKET) || check(TokenType::LBRACE)) {
        auto pattern = parseExpr(); // Parse array or object pattern
        expect(TokenType::ASSIGN, "Expected '=' after destructuring pattern");
        init = parseExpr();
        return std::make_unique<ASTNode>(VarDecl{isConst, "", std::move(init), "", false}, ln);
    }
    
    // Simple variable name
    name = expect(TokenType::IDENTIFIER, "Expected variable name").value;
    
    // Optional type annotation: x: int = 5
    std::string typeHint;
    if (match(TokenType::COLON)) {
        typeHint = expect(TokenType::IDENTIFIER, "Expected type name").value;
    }
    
    // Optional initializer
    if (match(TokenType::ASSIGN)) {
        init = parseExpr();
    }
    
    return std::make_unique<ASTNode>(VarDecl{isConst, name, std::move(init), typeHint, false}, ln);
}
```

## Code Explanation

###
-  `ASTNodePtr Parser::parseVarDecl(bool isConst)` - Parse variable declarations
  - `isConst`: Whether this is a constant declaration
-  `{` - Opening brace
-  `int ln = current().line;` - Store current line number for AST nodes
-  `std::string name;` - Variable name string
-  `ASTNodePtr init;` - Optional initializer expression

###
-  `// Handle destructuring: [a, b] = array or {x, y} = object` - Comment about destructuring
-  `if (check(TokenType::LBRACKET) || check(TokenType::LBRACE)) {` - Check for destructuring patterns
-  `auto pattern = parseExpr(); // Parse array or object pattern` - Parse the pattern
-  `expect(TokenType::ASSIGN, "Expected '=' after destructuring pattern");` - Expect assignment
-  `init = parseExpr();` - Parse initialization expression
-  `return std::make_unique<ASTNode>(VarDecl{isConst, "", std::move(init), "", false}, ln);` - Create destructuring declaration
  - Empty name for destructuring (pattern contains variable names)
  - `false` for isPointer (not a pointer declaration)

###
-  `// Simple variable name` - Comment about simple case
-  `name = expect(TokenType::IDENTIFIER, "Expected variable name").value;` - Parse variable name
  - `expect()` throws error if not an identifier
  - `.value` extracts the string value from token

###
-  `// Optional type annotation: x: int = 5` - Comment about type hints
-  `std::string typeHint;` - Type hint string
-  `if (match(TokenType::COLON)) {` - Check for type annotation colon
-  `typeHint = expect(TokenType::IDENTIFIER, "Expected type name").value;` - Parse type name

###
-  `// Optional initializer` - Comment about initialization
-  `if (match(TokenType::ASSIGN)) {` - Check for assignment operator
-  `init = parseExpr();` - Parse initialization expression
-  `}` - Closing brace for initializer handling

###
-  `return std::make_unique<ASTNode>(VarDecl{isConst, name, std::move(init), typeHint, false}, ln);` - Create variable declaration AST node
  - `isConst`: Constant flag from parameter
  - `name`: Variable name (or empty for destructuring)
  - `std::move(init)`: Optional initializer (moved for efficiency)
  - `typeHint`: Optional type annotation
  - `false`: isPointer flag (not a pointer declaration)
-  `}` - Closing brace for function

## Summary

The `parseVarDecl()` function handles variable and constant declarations with multiple syntax styles:

### Key Features
- **Destructuring Support**: Array and object destructuring patterns
- **Type Annotations**: Optional type hints like `x: int`
- **Optional Initialization**: Variables can be declared without initial values
- **Constant Support**: Handles both `let` and `const` declarations
- **Memory Efficiency**: Uses move semantics for AST nodes

### Declaration Styles Supported

#### Simple Declaration
```cpp
let x;
const y = 5;
```

#### Type Annotation
```cpp
let x: int;
const y: string = "hello";
```

#### Destructuring
```cpp
let [a, b] = array;
const {x, y} = object;
```

#### With Initialization
```cpp
let x = 10;
const y: double = 3.14;
```

### AST Structure
- **VarDecl Node**: Contains all declaration information
- **Fields**:
  - `isConst`: Whether variable is constant
  - `name`: Variable name (empty for destructuring)
  - `initializer`: Optional initialization expression
  - `typeHint`: Optional type annotation
  - `isPointer`: Whether this is a pointer declaration

### Parsing Strategy
- **Pattern Recognition**: Detects destructuring vs simple declarations
- **Optional Components**: Handles type hints and initializers as optional
- **Error Handling**: Clear error messages for malformed declarations
- **Flexibility**: Supports multiple declaration syntaxes

### Error Cases Handled
- Missing variable name
- Missing type name after colon
- Missing initializer for destructuring patterns
- Invalid tokens in destructuring patterns

### Design Benefits
- **Multi-Paradigm**: Supports JavaScript and Python-style declarations
- **Type Safety**: Optional type hints for better error checking
- **Modern Features**: Destructuring for convenient data extraction
- **Clear Structure**: Well-organized parsing logic

This function enables the Quantum Language to support modern variable declaration patterns while maintaining compatibility with multiple programming language styles.
