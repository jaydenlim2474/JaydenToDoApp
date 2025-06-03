using JaydenToDoApp.Core.Entities;
using System.Collections.Generic;
using System.Linq;

namespace JaydenToDoApp.Core.Services
{
    public class ToDoService
    {
        private readonly List<ToDo> _todos = new();

        public IEnumerable<ToDo> GetAllToDos() => _todos;

        public ToDo? GetToDoById(int id) => _todos.FirstOrDefault(t => t.Id == id);

        public void AddToDo(ToDo todo)
        {
            _todos.Add(todo);
        }

        public void MarkItemCompleted(int todoId, int itemId)
        {
            var todo = GetToDoById(todoId);
            var item = todo?.Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                item.Completed = true;
            }
        }
    }
}
