# `parseParamList`

## Purpose
The `parseParamList` function is designed to parse a parameter list from a source code file, specifically within the context of a quantum language compiler. This function aims to extract individual parameter declarations from a list enclosed in parentheses `( )`. Each parameter declaration includes its type and possibly a name.

## Parameters/Return Value
- **Parameters**: None explicitly listed in the provided snippet, but it relies on global state such as `pos`, `current()`, and `tokens`.
- **Return Value**: A `std::vector<std::string>` containing the names of the parsed parameters. If there are no parameters or an error occurs, the vector will be empty.

## How It Works
### Step-by-Step Breakdown
1. **Expecting Parentheses**:
   ```cpp
   expect(TokenType::LPAREN, "Expected '('");
   ```
   - The function starts by expecting a left parenthesis `(` to denote the beginning of the parameter list. If not found, it throws an error message "Expected '".

2. **Parsing Parameters**:
   ```cpp
   std::vector<std::string> params;
   while (!check(TokenType::RPAREN) && !atEnd())
   ```
   - It initializes an empty vector `params` to store the names of the parsed parameters.
   - The loop continues until it encounters a right parenthesis `)` or reaches the end of the input stream (`atEnd()`).

3. **Handling 'const' Modifier**:
   ```cpp
   if (check(TokenType::CONST))
       consume(); // eat const
   ```
   - Inside the loop, it checks if the current token is a `CONST` keyword. If so, it consumes the token, effectively skipping it.

4. **Identifying C-Type Keywords**:
   ```cpp
   if (isCTypeKeyword(current().type))
   {
       consume();
       while (isCTypeKeyword(current().type))
           consume(); // multi-word types
   }
   ```
   - The function then checks if the current token represents a C-type keyword (like `int`, `char`, etc.). If it does, it consumes these tokens, handling multi-word types like `long long`.

5. **Detecting Identifier Types**:
   ```cpp
   if (check(TokenType::IDENTIFIER))
   {
       size_t la = pos + 1;
       if (la < tokens.size() && tokens[la].type == TokenType::LT)
       {
           int tdepth = 0;
           while (la < tokens.size())
           {
               if (tokens[la].type == TokenType::LT)
                   tdepth++;
               else if (tokens[la].type == TokenType::GT)
               {
                   tdepth--;
                   la++;
                   break;
               }
               else if (tokens[la].type == TokenType::RSHIFT)
               {
                   tdepth -= 2;
                   la++;
                   break;
               }
               la++;
           }
       }
       while (la < tokens.size() &&
              (tokens[la].type == TokenType::BIT_AND ||
               tokens[la].type == TokenType::STAR ||
               tokens[la].type == TokenType::CONST))
           la++;
   ```
   - When encountering an identifier, the function looks ahead to determine if it belongs to a type name that might include qualifiers like `*` (pointer), `&` (reference), or additional `const` modifiers.
   - It handles template arguments `<...>` by adjusting a depth counter `tdepth` and advancing the lookahead pointer `la` accordingly.
   - Finally, it skips any remaining qualifiers after the identifier to ensure only the parameter name is captured.

## Edge Cases
- **Empty Parameter List**: If the parameter list is empty (i.e., immediately followed by a right parenthesis `)`), the function will return an empty vector without consuming any tokens.
- **Syntax Errors**: If the input contains unexpected tokens or malformed syntax (e.g., missing closing parentheses), the function may throw errors or produce incorrect results.
- **Complex Types**: The function can handle complex types including pointers, references, and `const` qualifiers, making it robust for various parameter declarations.

## Interactions with Other Components
- **Tokenizer**: The function uses the tokenizer to access the sequence of tokens (`tokens`) and their positions (`pos`). The tokenizer must correctly identify keywords, identifiers, and punctuation marks.
- **Error Handling**: The function interacts with error handling mechanisms to report issues when expected tokens are missing or when the syntax is invalid.
- **Scope Management**: While not shown in the snippet, the parsed parameter names would likely be used to manage variable scopes during further compilation stages.

This function is crucial for parsing the structure of quantum operations and functions, where precise parameter definitions are essential for correct compilation and execution.