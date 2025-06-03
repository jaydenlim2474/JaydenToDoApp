using System;
using JaydenToDoApp.Core.Entities;
using Xunit;

namespace JaydenToDoApp.Test
{
    public class ToDoTests
    {
        [Fact]
        public void CanCreateToDo_WithTitleAndItems()
        {
            // Arrange
            var todo = new ToDo
            {
                Id = 1,
                Title = "My Test ToDo"
            };

            var item = new ToDoItem
            {
                Id = 10,
                ToDoId = todo.Id,
                ItemName = "Test Item",
                Date = DateTime.Today,
                Time = TimeSpan.FromHours(9),
                Completed = false
            };

            todo.Items.Add(item);

            Assert.Equal("My Test ToDo", todo.Title);
            Assert.Single(todo.Items);
            Assert.Equal("Test Item", todo.Items.First().ItemName);
            Assert.False(todo.Items.First().Completed);
        }
    }

    public class ToDoItemTests
    {
        [Fact]
        public void CanCreateToDoItem_WithAllProperties()
        {
            var item = new ToDoItem
            {
                Id = 5,
                ToDoId = 1,
                ItemName = "Task 1",
                Description = "Description here",
                Date = new DateTime(2025, 6, 1),
                Time = new TimeSpan(14, 30, 0),
                Notes = "Some notes",
                Color = "Red",
                Completed = true
            };

            Assert.Equal(5, item.Id);
            Assert.Equal(1, item.ToDoId);
            Assert.Equal("Task 1", item.ItemName);
            Assert.Equal("Description here", item.Description);
            Assert.Equal(new DateTime(2025, 6, 1), item.Date);
            Assert.Equal(new TimeSpan(14, 30, 0), item.Time);
            Assert.Equal("Some notes", item.Notes);
            Assert.Equal("Red", item.Color);
            Assert.True(item.Completed);
        }
    }
}
