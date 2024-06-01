<figure><img src=".gitbook/assets/creenshot 2024-06-01 153514.png" alt=""><figcaption></figcaption></figure>

# CodeYantra - Web IDE

## Overview

### What is CodeYantra?

CodeYantra is a powerful, web-based Integrated Development Environment (IDE) designed to streamline the coding process. It offers a range of features including code editing, file management, terminal access, and innovative AI functionalities. This IDE aims to enhance productivity and collaboration, making it a versatile tool for developers, students, and professionals alike.

<figure><img src=".gitbook/assets/Screenshot 2024-06-01 153543.png" alt=""><figcaption></figcaption></figure>

## Features

1. **File Explorer**
   * Navigate between different files seamlessly.
   * Open files by clicking on them, which appear as tabs in the editor.
   * Close tabs to organize the workspace efficiently.
   * Implemented using a tree data structure to recursively find child nodes.
2. **Code Editor**
   * Supports syntax highlighting for various programming languages.
   * Provides keyword suggestions to enhance coding efficiency.
   * Offers multiple themes for a personalized coding experience.
   * Real-time synchronization with local files using Socket.IO.
   * Displays saved/unsaved status with an auto-save feature that saves every 10 seconds.
   * Supports pair programming and collaborative coding sessions.
3. **Coding Timer**
   * Tracks and displays the time spent coding to help manage productivity.
4. **Terminal**
   * Built using the xterm module and utilizes PowerShell for executing commands.
   * Allows running commands directly within the web-based terminal.
5. **Additional Features**
   * **Search**: Enables users to search for files within the project.
   * **Copy Code**: Copies the code of the selected file opened in the editor using the navigator object provided by the client's browser.

## AI Features (Powered by Gemini API)

1.  **Explain Code**

    * Provides a concise explanation of the selected file's code.
    * Allows for follow-up questions to delve deeper into the code's functionality.

    <figure><img src=".gitbook/assets/Screenshot 2024-06-01 153651.png" alt=""><figcaption></figcaption></figure>
2.  **Debug Code**

    * Analyzes the code and lists any errors present in the file, helping to identify and fix issues quickly.

    <figure><img src=".gitbook/assets/Screenshot 2024-06-01 153712.png" alt=""><figcaption></figcaption></figure>
3.  **Generate Code**

    * Generates code based on user prompts.
    * For example, it can generate an Express.js code snippet to set up a login POST API.

    <figure><img src=".gitbook/assets/Screenshot 2024-06-01 153737.png" alt=""><figcaption></figcaption></figure>

### Important Links

* 📹 [YouTube Demo](https://youtu.be/IEfEId9\_Cx4)
* 💻[ Source Code](https://github.com/mayankyadav1711/CodeYantra)
* 🧑‍💼 [Connect on LinkedIn](https://www.linkedin.com/in/mayankyadav17/)
