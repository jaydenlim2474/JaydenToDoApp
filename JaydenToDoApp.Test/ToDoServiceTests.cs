using System.Linq;
using JaydenToDoApp.Core.Entities;
using JaydenToDoApp.Core.Services;
using Xunit;

namespace JaydenToDoApp.Test
{
    public class ToDoServiceTests
    {
        [Fact]
        public void CanAddAndRetrieveToDo()
        {
            var service = new ToDoService();
            var todo = new ToDo { Id = 1, Title = "Shopping List" };

            service.AddToDo(todo);
            var result = service.GetToDoById(1);

            Assert.NotNull(result);
            Assert.Equal("Shopping List", result!.Title);
        }

        [Fact]
        public void MarkItemCompleted_SetsCompletedTrue()
        {
            var service = new ToDoService();
            var todo = new ToDo { Id = 1, Title = "Chores" };
            var item = new ToDoItem { Id = 101, ToDoId = 1, ItemName = "Vacuum", Completed = false };
            todo.Items.Add(item);
            service.AddToDo(todo);

            service.MarkItemCompleted(1, 101);
            var updatedItem = service.GetToDoById(1)?.Items.FirstOrDefault(i => i.Id == 101);

            Assert.NotNull(updatedItem);
            Assert.True(updatedItem!.Completed);
        }

        [Fact]
        public void GetAllToDos_ReturnsAllAddedToDos()
        {
            var service = new ToDoService();
            service.AddToDo(new ToDo { Id = 1, Title = "List 1" });
            service.AddToDo(new ToDo { Id = 2, Title = "List 2" });

            var todos = service.GetAllToDos();

            Assert.Equal(2, todos.Count());
        }
    }
}
