# Period-2
- Explain Pros & Cons in using Node.js + Express to implement your Backend compared to a strategy using, for example, Java/JAX-RS/Tomcat



- Explain the difference between Debug outputs and ApplicationLogging. What’s wrong with console.log(..) statements in our backend code?
    - Debug output:
        - Makes it possible to stop the code with breakpoints and physically see all the steps in the line of code as you go. 
There are multiple functions like, stopping, skipping, forward, backwards etc. 
Debugging this way makes it easier to see what is actually going on, due to the visuals and you can see information about variables, call stack etc.
You can also use an “Application like” feature called log points which is used for creating a point similar to a breakpoint, but a logpoint doesn’t break the code but logs a message instead. 
Debug output is very developer friendly because of the interactive element of debugging your code.

    - ApplicationLogging:
        - If you’re using ApplicationLogging you have to create a log file containing information about events occuring in the application. They can include errors, warnings and information about events.
The log file will contain a lot of information about the application and can be difficult to read and understand.

- Explain, using relevant examples, your strategy for implementing a REST-API with Node/Express  + TypeScript and demonstrate how you have tested the API.





