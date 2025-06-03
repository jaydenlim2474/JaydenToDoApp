# JaydenToDoApp

A full-stack ToDo application built with:

- ASP.NET Core (C#) for the backend API  
- React for the frontend  
- SQLite for the database  

## Features

- Create, edit, delete ToDo lists and items  
- Filter ToDo items by completion status and date range  
- Responsive UI built in a single React component  
- Backend API secured with CORS and runs on HTTPS  

## Getting Started

> 💡 Current frontend runs on port **3020**, if **3020** is used please go to .env file to change port!

---

### 🛠️ Setup Instructions
#### ✅ Step 1:
Double click the backend project sln:  
`JaydenToDoApp.sln`  
```bash
dotnet ef migrations add InitialCreate --project JaydenToDoApp.Infrastructure --startup-project JaydenToDoApp.API
dotnet ef database update --project JaydenToDoApp.Infrastructure --startup-project JaydenToDoApp.API
```

#### ✅ Step 2:
Open the frontend project folder:  
`jayden-todo-ui`  
(Using **Visual Studio 2022**, VS Code, or open the folder manually in the terminal)

#### ✅ Step 3: *(Optional for Visual Studio 2022 users)*  
Open **Developer PowerShell for VS 2022**

#### ✅ Step 4:
Install dependencies and start the app:

```bash
npm install
npm install concurrently --save-dev
npm start

```
#### ✅ Step 5:
Enjoy! 🎉


####Installation Guideline and Demo
[https://youtu.be/pBUE9n](https://www.youtube.com/watch?v=pBUE9ns0_20)

https://github.com/user-attachments/assets/1a97afe5-b5ab-488b-9e46-bc2e541cacb5

s0_20
"# JaydenToDoApp" 
"# JaydenToDoApp" 
"# JaydenToDoApp" 
"# JaydenToDoApp" 
