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

## Line-by-Line Explanation

### Function Signature and Initialization (Lines 949-952)
- **Line 949**: `ASTNodePtr Parser::parseFunctionDecl()` - Parse function declarations
- **Line 950**: `{` - Opening brace
- **Line 951**: `int ln = current().line;` - Store current line number for AST nodes
- **Line 952**: Empty line for readability

### Function Name Parsing (Lines 953-957)
- **Line 953**: `// Function name (optional for anonymous functions)` - Comment about optional names
- **Line 954**: `std::string name;` - Function name string
- **Line 955**: `if (check(TokenType::IDENTIFIER)) {` - Check for function name
- **Line 956**: `name = consume().value;` - Consume and store function name
- **Line 957**: `}` - Closing brace

### Parameter Parsing Setup (Lines 958-964)
- **Line 958**: `// Parse parameters` - Comment about parameter parsing
- **Line 959**: `expect(TokenType::LPAREN, "Expected '(' after function name");` - Expect opening parenthesis
- **Line 960**: `std::vector<std::string> params;` - Parameter names vector
- **Line 961**: `std::vector<bool> paramIsRef;` - Reference parameter flags
- **Line 962**: `std::vector<ASTNodePtr> defaultArgs;` - Default argument expressions
- **Line 963**: Empty line for readability
- **Line 964**: `if (!check(TokenType::RPAREN)) {` - Check if there are parameters

### Parameter List Parsing (Lines 965-967)
- **Line 965**: `params = parseParamList(&paramIsRef, &defaultArgs);` - Parse parameter list
  - Passes pointers to fill reference flags and default arguments
  - Returns vector of parameter names
- **Line 966**: `}` - Closing brace for parameter check
- **Line 967**: Empty line for readability

### Parameter List Completion (Line 968)
- **Line 968**: `expect(TokenType::RPAREN, "Expected ')' after parameters");` - Expect closing parenthesis

### Return Type Annotation (Lines 969-973)
- **Line 969**: `// Parse return type annotation (optional)` - Comment about return type
- **Line 970**: `std::string returnType;` - Return type string
- **Line 971**: `if (match(TokenType::COLON)) {` - Check for type annotation colon
- **Line 972**: `returnType = expect(TokenType::IDENTIFIER, "Expected return type").value;` - Parse return type
- **Line 973**: `}` - Closing brace for return type

### Function Body Parsing (Line 974)
- **Line 974**: `auto body = parseBodyOrStatement();` - Parse function body
  - Handles both block `{}` and single statement bodies
  - Supports brace-optional syntax

### Function Declaration Creation (Lines 975-982)
- **Line 975**: `// Create function declaration` - Comment about AST creation
- **Line 976**: `FunctionDecl fd;` - Create function declaration structure
- **Line 977**: `fd.name = name;` - Set function name
- **Line 978**: `fd.params = params;` - Set parameter names
- **Line 979**: `fd.paramIsRef = paramIsRef;` - Set reference parameter flags
- **Line 980**: `fd.defaultArgs = defaultArgs;` - Set default arguments
- **Line 981**: `fd.body = std::move(body);` - Set function body (moved for efficiency)

### Return Statement (Lines 983-984)
- **Line 983**: `return std::make_unique<ASTNode>(std::move(fd), ln);` - Create and return AST node
  - `std::move(fd)` transfers ownership of function declaration
- **Line 984**: `}` - Closing brace for function

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
