# Token Component Documentation

## Overview

The Token component is an essential part of the Quantum Language Compiler, responsible for representing and manipulating tokens in the source code. Tokens are the basic building blocks of the language, such as keywords, identifiers, literals, and operators. This component provides functionality to convert tokens into a readable string format, which aids in debugging and error reporting.

## Files

### Token.cpp

- **Purpose**: Implements the `toString()` method for the `Token` structure.
- **Functionality**:
  - The `toString()` method constructs a string representation of the token, including its line number, column number, and value.
  - It uses `std::ostringstream` to efficiently build the string.

### Token.h

- **Purpose**: Declares the `Token` structure and its associated methods.
- **Contents**:
  - Defines the `Token` structure with members for line number (`line`), column number (`col`), and token value (`value`).
  - Declares the `toString()` method that returns a string representation of the token.

## Overall Flow

1. **Token Creation**: Tokens are created during the lexical analysis phase of the compiler. Each token represents a significant element found in the source code.
2. **String Conversion**: When a token needs to be converted into a human-readable form, the `toString()` method is called on the `Token` object.
3. **Output**: The `toString()` method constructs a string that includes the token's line number, column number, and value, formatted as `[line:col value]`.

## Usage Example

```cpp
#include "Token.h"

int main() {
    Token t(5, 10, "example");
    std::cout << t.toString() << std::endl; // Output: [5:10 example]
    return 0;
}
```

In this example, a `Token` object is created with a line number of 5, a column number of 10, and a value of `"example"`. The `toString()` method is then called to generate a string representation of the token, which is printed to the console.

## Conclusion

The Token component is crucial for the Quantum Language Compiler as it facilitates the conversion of tokens into a readable format. This enhances the debugging process and improves the overall user experience by providing clear and informative error messages.