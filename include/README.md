# QuantumLanguage Compiler - Disassembler.h

## Overview

The `include/Disassembler.h` header file is an integral component of the QuantumLanguage compiler, dedicated to the disassembly process. This file primarily focuses on converting bytecode into human-readable assembly language, aiding in debugging and understanding the intermediate representation produced by the compiler.

### Role in Compiler Pipeline

The Disassembler operates at the end of the compiler pipeline, taking the final bytecode output and transforming it back into a readable format. This allows developers to inspect and verify the correctness of the generated code before deployment or further optimization.

### Key Design Decisions and Why

#### Single Instruction Pretty-Printing

The function `disassembleInstruction` is designed to pretty-print a single instruction from a bytecode chunk. Given that each instruction in QuantumLanguage's bytecode is represented by a single byte (`Opcode`), this function simplifies the disassembly process by always consuming one byte per instruction. This decision ensures consistency and ease of implementation.

#### Entire Chunk Dumping

The function `disassembleChunk` extends the functionality of `disassembleInstruction` by providing a comprehensive view of an entire bytecode chunk. By iterating through each instruction in the chunk, this function aggregates and outputs them as a continuous stream of assembly instructions. This approach facilitates a holistic examination of the compiled code.

### Major Classes/Functions Overview

- **disassembleInstruction**: Accepts a `Chunk` object and an index `idx`, representing the position of the instruction within the chunk. It outputs the instruction in a human-readable format to the specified `std::ostream`. The function guarantees that it consumes exactly one byte of data per call, making it suitable for sequential processing of the bytecode.

- **disassembleChunk**: Takes a `Chunk` object and an `std::ostream` as parameters. It iterates over all instructions in the chunk, using `disassembleInstruction` to convert each one into its assembly form. The resulting assembly code is then written to the provided stream, offering a complete disassembly of the bytecode.

### Tradeoffs

While the current design provides a straightforward and efficient way to disassemble bytecode, there are some potential tradeoffs:

- **Performance vs. Readability**: The focus on simplicity and performance might result in less detailed or more cryptic assembly representations compared to more complex disassemblers. However, this balance is necessary given the compact nature of QuantumLanguage's bytecode.

- **Memory Usage**: Storing and processing the entire bytecode chunk simultaneously can be memory-intensive. Future optimizations could explore incremental disassembly techniques to reduce memory usage.

By addressing these considerations, the `Disassembler.h` header file aims to provide a robust yet user-friendly tool for analyzing QuantumLanguage's compiled code, enhancing both development and maintenance processes.