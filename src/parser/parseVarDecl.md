# `parseVarDecl` Function Explanation

The `parseVarDecl` function in the Quantum Language compiler is responsible for parsing variable declarations. It can handle both single and multi-variable declarations, as well as constant declarations. The function also supports optional type hints and initialization expressions.

## Parameters

- `bool isConst`: A boolean flag indicating whether the declared variable should be treated as a constant. If `true`, the variable will not be modifiable after its initial assignment.

## Return Value

- `ASTNodePtr`: A pointer to an abstract syntax tree (AST) node representing the parsed variable declaration. This node can either be a simple `VarDecl` or a `BlockStmt` containing multiple `VarDecl`s.

## How It Works

### Single Variable Declaration

When parsing a single variable declaration, the function follows these steps:

1. **Check for Identifier**: First, it checks if the current token is an identifier (e.g., `let` or `const`). If so, it consumes the token and assigns its value to the `name` variable.
   
   ```cpp
   if (check(TokenType::IDENTIFIER))
       name = consume().value;
   ```

2. **Optional Type Hint**: Next, it looks for an optional colon (`:`). If found, it consumes the colon and expects another identifier or CType keyword, which it assigns to the `typeHint` variable.
   
   ```cpp
   if (check(TokenType::COLON))
   {
       consume(); // eat :
       if (check(TokenType::IDENTIFIER) || isCTypeKeyword(current().type))
           typeHint = consume().value;
   }
   ```

3. **Initialization Expression**: If an equals sign (`=`) is encountered, it indicates that there is an initialization expression. The function parses this expression using the `parseExpr` method and assigns it to the `init` variable.
   
   ```cpp
   if (match(TokenType::ASSIGN))
       init = parseExpr();
   ```

4. **Create AST Node**: Finally, it creates an `ASTNode` of type `VarDecl` with the parsed information (whether it's a constant, the variable name, initialization expression, and type hint) and returns it.
   
   ```cpp
   return std::make_unique<ASTNode>(VarDecl{isConst, name, std::move(init), typeHint}, ln);
   ```

### Multi-Variable Declaration

For multi-variable declarations, such as `let x = 1, y = 2`, the function uses a loop to process each variable individually:

1. **Initialize Block Statement**: It starts by creating a unique pointer to a `BlockStmt` AST node, which will contain all the individual variable declarations.
   
   ```cpp
   auto block = std::make_unique<ASTNode>(BlockStmt{}, ln);
   ```

2. **First Variable Declaration**: It processes the first variable declaration as described above, adding it to the block statement.
   
   ```cpp
   block->as<BlockStmt>().statements.push_back(
       std::make_unique<ASTNode>(VarDecl{isConst, name, std::move(init), typeHint}, ln));
   ```

3. **Loop Through Remaining Variables**: After processing the first variable, it enters a loop that continues until a comma is no longer found:
   
   ```cpp
   while (match(TokenType::COMMA))
   {
       skipNewlines();
       if (atEnd() || check(TokenType::NEWLINE) || check(TokenType::SEMICOLON))
           break;
       
       // Process subsequent variables similarly...
   }
   ```

4. **Skip Newlines and Semicolons**: Inside the loop, it skips any newlines or semicolons and then processes each subsequent variable declaration in the same manner as the first one.

5. **Return Block Statement**: Once all variable declarations have been processed, it skips any remaining newlines or semicolons and returns the `BlockStmt` containing all the `VarDecl`s.

   ```cpp
   return block;
   ```

## Edge Cases

- **Missing Identifier**: If the current token is neither an identifier nor a CType keyword, the function throws a `ParseError` indicating that a variable name was expected.
  
  ```cpp
  else
      throw ParseError("Expected variable name (got '" + current().value + "')", current().line, current().col);
  ```

- **Invalid Type Hint**: If a colon is found but followed by a non-identifier or non-CType keyword, the function may throw a `ParseError`.

- **Unexpected Token**: If the parser encounters unexpected tokens during the parsing process, it may throw a `ParseError` to indicate a syntax error.

## Interactions with Other Components

- **Lexer**: The `parseVarDecl` function relies on the lexer to provide the next token in the source code. The lexer identifies identifiers, keywords, colons, and other relevant tokens.

- **Expression Parser**: When an initialization expression is present (`=`), the `parseVarDecl` function calls the `parseExpr` method to parse the expression. The `parseExpr` method handles various types of expressions, including arithmetic operations, function calls, and more complex constructs.

- **Abstract Syntax Tree (AST)**: The parsed variable declarations are represented as `ASTNode` objects within an `AST`. These nodes are used to construct the AST, which serves as the intermediate representation of the source code before further compilation stages.

By handling both single and multi-variable declarations, as well as constants and type hints, the `parseVarDecl` function provides a robust mechanism for parsing variable declarations in the Quantum Language compiler. Its interaction with the lexer and expression parser ensures that the source code is accurately translated into an AST, facilitating subsequent compilation steps.