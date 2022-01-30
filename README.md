# agena
Simple and transparent (Angular) state management solution
⚠️ WORK IN PROGRESS ⚠️

# Why another state library? 
Agena is born on the assumption that Angular's built-in tools like RxJS and Dependency Injection are powerfull enough to manage most needs regarding application state of small-to-mid size applications.
There are plenty of well-known stores out there, but they all miss one: abstraction for consumers. 

Agena aims to be a completely transparent and integrated store system, which can be attached to any existing Angular Service without having to rewrite a single line of code in all the components currently using it.

### Practical difference
A lot of new projects may start simple and then grow bigger in years. In those scenario, writing stores from the beginning may be a useless overkill for the aim of you simple, fresh, new app. At the same time, you know if 
you don't do it, you'll have to refactor your components a lot as soon as your components structure gets deeper or you need caching. 

With Agena, you simply attach the store to your existing services, leaving your public API unaltered and limiting all the fragile refactoring to your services only.
You don't have to change how you select data in your presentation layer.

