# `parseArgList`

## Function Overview

The `parseArgList` function is responsible for parsing a list of arguments within parentheses in the source code. This function is crucial for handling both positional and keyword arguments, as well as generator expressions, in the context of function calls or method definitions.

## Parameters and Return Value

- **Parameters**: None
- **Return Value**: A `std::vector<ASTNodePtr>` containing pointers to parsed AST nodes representing the arguments.

## Detailed Explanation

### Parsing Process

1. **Expect Opening Parenthesis (`(`)**:
   ```cpp
   expect(TokenType::LPAREN, "Expected '('");
   ```
   The function starts by expecting an opening parenthesis token. If not found, it throws an error indicating that an opening parenthesis was expected.

2. **Initialize Argument List**:
   ```cpp
   std::vector<ASTNodePtr> args;
   ```
   An empty vector `args` is initialized to store the parsed argument nodes.

3. **Skip New Lines**:
   ```cpp
   skipNewlines();
   ```
   This call ensures that any new lines before the actual arguments are skipped.

4. **Loop Through Arguments Until Closing Parenthesis (`)`)**:
   ```cpp
   while (!check(TokenType::RPAREN) && !atEnd())
   {
       int argLn = current().line;
       skipNewlines();
   ```
   The function enters a loop that continues until a closing parenthesis is encountered or the end of the input is reached. For each iteration, it records the line number of the current argument and skips any leading new lines.

5. **Handle Keyword Argument Unpacking (`**expr`)**:
   ```cpp
   if (check(TokenType::POWER))
   {
       int pLn = current().line;
       consume(); // eat **
       auto expr = parseExpr();
       args.push_back(std::make_unique<ASTNode>(UnaryExpr{"**", std::move(expr)}, pLn));
       skipNewlines();
       if (!match(TokenType::COMMA))
           break;
       skipNewlines();
       continue;
   }
   ```
   If the next token is `TokenType::POWER`, which represents `**`, the function expects a keyword argument unpacking. It consumes the `**` token, parses the expression following it, and wraps it in a `UnaryExpr{"**", ...}` node. This indicates to the evaluation function that this argument should be treated as a spread operator. The loop then checks if there is a comma after the unpacking operator; if not, it breaks out of the loop.

6. **Handle Keyword Arguments (`name=expr`)**:
   ```cpp
   if (check(TokenType::IDENTIFIER))
   {
       size_t la = pos + 1;
       while (la < tokens.size() && tokens[la].type == TokenType::NEWLINE)
           ++la;
       if (la < tokens.size() && tokens[la].type == TokenType::ASSIGN)
       {
           consume(); // name
           while (check(TokenType::NEWLINE))
               consume();
           consume(); // '='
           skipNewlines();
       }
   }
   ```
   If the next token is an identifier, the function checks if it is followed by an assignment token (`=`). If so, it consumes the identifier and assignment token, skipping any intervening new lines, and then consumes the equals sign. This part of the code is intended to handle keyword arguments but currently lacks the logic to actually process them correctly.

7. **Parse Expression**:
   ```cpp
   auto expr = parseExpr();
   skipNewlines();
   ```
   Regardless of whether the argument is a positional argument or a keyword argument, the function parses the expression using the `parseExpr()` method and adds it to the `args` vector.

8. **Handle Generator Expressions (`f(expr for var in iterable)`)**:
   ```cpp
   if (check(TokenType::FOR))
   {
       consume();
       std::vector<std::string> vars;
       auto readVar = [&]()
       {
           if (check(TokenType::IDENTIFIER))
               vars.push_back(consume().value);
           else if (isCTypeKeyword(current().type))
               vars.push_back(consume().value);
           else
               vars.push_back(expect(TokenType::IDENTIFIER, "Expected variable").value);
       };
       readVar();
       while (match(TokenType::COMMA)
   ```
   If the next token is `TokenType::FOR`, the function expects a generator expression. It consumes the `for` token and reads variables involved in the generator expression. The `readVar` lambda function handles reading identifiers or C type keywords as variables. After reading the variables, it checks for commas to allow multiple variables in the generator expression.

### Edge Cases

- **Empty Argument List**: If the argument list is empty (i.e., only contains an opening parenthesis), the function will return an empty vector.
- **Unmatched Parentheses**: If the closing parenthesis is missing, the function will enter an infinite loop due to the lack of a condition to exit the loop.
- **Incorrect Syntax**: If the syntax is incorrect (e.g., missing an equals sign in a keyword argument), the function will throw an error.

### Interactions with Other Components

- **Lexical Analyzer (Tokenizer)**: The function relies on the tokenizer to provide the sequence of tokens for parsing.
- **Evaluation Engine**: The parsed AST nodes are used by the evaluation engine to execute the function call or method definition.
- **Error Handling**: Errors are handled by throwing exceptions when unexpected tokens are encountered.

This function is essential for correctly interpreting function calls and method definitions in the source code, ensuring that all types of arguments are properly parsed and processed.