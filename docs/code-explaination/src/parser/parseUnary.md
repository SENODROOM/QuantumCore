# `parseUnary`

The `parseUnary` function in the Quantum Language compiler is designed to parse unary expressions, which are expressions that involve a single operator applied to an operand. This function supports various unary operators including increment (`++`), decrement (`--`), negation (`-`), logical NOT (`!`), bitwise NOT (`~`), address-of (`&`), and dereference (`*`). By handling these operators correctly, `parseUnary` ensures that the syntax tree accurately reflects the structure and semantics of the input code.

## Parameters

This function takes no explicit parameters. It relies on the global state managed by the parser, specifically the `current()` token and the ability to call helper functions like `consume()` and `check()`.

## Return Value

The function returns a unique pointer to an `ASTNode`, representing the parsed unary expression. Depending on the type of unary operator encountered, the returned node can be an instance of `UnaryExpr`, `AssignExpr`, or other relevant AST nodes.

## Edge Cases

### Increment and Decrement Operators (`++`, `--`)
When encountering `++` or `--`, the function constructs an `AssignExpr` where the operator is either `"+="` or `"-"=` respectively, and the right-hand side is a literal number `1`. This effectively increments or decrements the operand by `1`.

### No-Op Unary Plus (`+`)
For the unary plus operator (`+`), the function simply discards the operator without modifying the operand. This is because adding zero to a number does not change its value.

### Logical Not (`!`)
The logical NOT operator (`!`) is handled by creating a `UnaryExpr` node with the operator `"not"` and recursively parsing the operand.

### Bitwise Not (`~`)
Similarly, the bitwise NOT operator (`~`) is parsed into a `UnaryExpr` node with the operator `"~"` and the operand.

### Address-of Operator (`&`)
The address-of operator (`&`) is used to obtain the memory address of a variable. If the identifier contains a scope resolution operator (`::`), the function extracts the member name after the last `::`. Otherwise, it parses the operand and wraps it in an `AddressOfExpr` node.

### Dereference Operator (`*`)
The dereference operator (`*`) is used to access the value pointed to by a pointer. It parses the operand and wraps it in a `DerefExpr` node.

## Interactions with Other Components

### Lexer and Token Stream
The `parseUnary` function depends on the lexer to tokenize the input source code. It uses the `current()` token to determine the next operator and calls `consume()` to advance the token stream.

### Error Handling
While not explicitly shown in the provided snippet, error handling mechanisms are integrated within the parser. For example, if the address-of operator is used incorrectly (e.g., on a non-pointer type), the parser would raise an appropriate error.

### Recursive Parsing
`parseUnary` often calls itself recursively to handle nested unary expressions. This allows it to build complex expressions step-by-step, ensuring that each part is correctly parsed according to its precedence and associativity rules.

### AST Construction
By constructing an AST using `ASTNode` instances, `parseUnary` facilitates further processing by subsequent stages of the compiler, such as semantic analysis and code generation.

In summary, the `parseUnary` function plays a crucial role in parsing unary expressions in the Quantum Language compiler. Its comprehensive handling of different unary operators ensures accurate representation of the input code in the AST, supporting subsequent compilation phases.