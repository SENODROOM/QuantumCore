# parseFunctionDecl() Function Explanation

## Complete Code

```cpp
ASTNodePtr Parser::parseFunctionDecl()
{
    int ln = current().line;
    
    // Function name (optional for anonymous functions)
    std::string name;
    if (check(TokenType::IDENTIFIER)) {
        name = consume().value;
    }
    
    // Parse parameters
    expect(TokenType::LPAREN, "Expected '(' after function name");
    std::vector<std::string> params;
    std::vector<bool> paramIsRef;
    std::vector<ASTNodePtr> defaultArgs;
    
    if (!check(TokenType::RPAREN)) {
        params = parseParamList(&paramIsRef, &defaultArgs);
    }
    
    expect(TokenType::RPAREN, "Expected ')' after parameters");
    
    // Parse return type annotation (optional)
    std::string returnType;
    if (match(TokenType::COLON)) {
        returnType = expect(TokenType::IDENTIFIER, "Expected return type").value;
    }
    
    // Parse function body
    auto body = parseBodyOrStatement();
    
    // Create function declaration
    FunctionDecl fd;
    fd.name = name;
    fd.params = params;
    fd.paramIsRef = paramIsRef;
    fd.defaultArgs = defaultArgs;
    fd.body = std::move(body);
    
    return std::make_unique<ASTNode>(std::move(fd), ln);
}
```

## Code Explanation

###
-  `ASTNodePtr Parser::parseFunctionDecl()` - Parse function declarations
-  `{` - Opening brace
-  `int ln = current().line;` - Store current line number for AST nodes
-  Empty line for readability

###
-  `// Function name (optional for anonymous functions)` - Comment about optional names
-  `std::string name;` - Function name string
-  `if (check(TokenType::IDENTIFIER)) {` - Check for function name
-  `name = consume().value;` - Consume and store function name
-  `}` - Closing brace

###
-  `// Parse parameters` - Comment about parameter parsing
-  `expect(TokenType::LPAREN, "Expected '(' after function name");` - Expect opening parenthesis
-  `std::vector<std::string> params;` - Parameter names vector
-  `std::vector<bool> paramIsRef;` - Reference parameter flags
-  `std::vector<ASTNodePtr> defaultArgs;` - Default argument expressions
-  Empty line for readability
-  `if (!check(TokenType::RPAREN)) {` - Check if there are parameters

###
-  `params = parseParamList(&paramIsRef, &defaultArgs);` - Parse parameter list
  - Passes pointers to fill reference flags and default arguments
  - Returns vector of parameter names
-  `}` - Closing brace for parameter check
-  Empty line for readability

###
-  `expect(TokenType::RPAREN, "Expected ')' after parameters");` - Expect closing parenthesis

###
-  `// Parse return type annotation (optional)` - Comment about return type
-  `std::string returnType;` - Return type string
-  `if (match(TokenType::COLON)) {` - Check for type annotation colon
-  `returnType = expect(TokenType::IDENTIFIER, "Expected return type").value;` - Parse return type
-  `}` - Closing brace for return type

###
-  `auto body = parseBodyOrStatement();` - Parse function body
  - Handles both block `{}` and single statement bodies
  - Supports brace-optional syntax

###
-  `// Create function declaration` - Comment about AST creation
-  `FunctionDecl fd;` - Create function declaration structure
-  `fd.name = name;` - Set function name
-  `fd.params = params;` - Set parameter names
-  `fd.paramIsRef = paramIsRef;` - Set reference parameter flags
-  `fd.defaultArgs = defaultArgs;` - Set default arguments
-  `fd.body = std::move(body);` - Set function body (moved for efficiency)

###
-  `return std::make_unique<ASTNode>(std::move(fd), ln);` - Create and return AST node
  - `std::move(fd)` transfers ownership of function declaration
-  `}` - Closing brace for function

## Summary

The `parseFunctionDecl()` function handles comprehensive function declaration parsing:

### Key Features
- **Anonymous Functions**: Optional function names for lambda-style declarations
- **Parameter Support**: Full parameter parsing with references and defaults
- **Return Type Annotations**: Optional type hints for return values
- **Flexible Bodies**: Supports both block and single-statement bodies
- **Memory Efficiency**: Uses move semantics for AST nodes

### Function Declaration Styles Supported

#### Named Function
```cpp
function add(a, b) {
    return a + b;
}
```

#### Anonymous Function
```cpp
function(a, b) { return a + b; }
```

#### With Return Type
```cpp
function calculate(x, y): number {
    return x * y;
}
```

#### With Default Parameters
```cpp
function greet(name = "World") {
    return "Hello, " + name;
}
```

#### With Reference Parameters
```cpp
function swap(&a, &b) {
    let temp = a;
    a = b;
    b = temp;
}
```

### Parameter Features
- **Names**: Standard parameter names
- **Reference Parameters**: `&param` for pass-by-reference
- **Default Values**: `param = value` syntax
- **Empty Parameter Lists**: `()` for functions with no parameters

### AST Structure
- **FunctionDecl Node**: Complete function declaration information
- **Fields**:
  - `name`: Function name (empty for anonymous)
  - `params`: Vector of parameter names
  - `paramIsRef`: Vector indicating reference parameters
  - `defaultArgs`: Vector of default argument expressions
  - `body`: Function body (BlockStmt or single statement)

### Body Parsing
- **Block Bodies**: `{ statement1; statement2; }`
- **Single Statement**: `return x + y;` (without braces)
- **Brace Optional**: Supports both styles for flexibility

### Error Handling
- Missing parenthesis after function name
- Missing closing parenthesis after parameters
- Invalid parameter syntax
- Missing return type after colon

### Design Benefits
- **Multi-Paradigm**: Supports function, def, and fn keywords
- **Type Safety**: Optional return type annotations
- **Modern Features**: Default parameters and reference parameters
- **Flexible Syntax**: Multiple body styles for different preferences

This function enables the Quantum Language to support comprehensive function declarations with features from multiple programming languages while maintaining a consistent parsing approach.
