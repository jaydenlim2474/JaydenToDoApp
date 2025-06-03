using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JaydenToDoApp.Core.Entities
{
    public class ToDoItem
    {
        public int Id { get; set; }
        public int ToDoId { get; set; }
        public string ItemName { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public string? Notes { get; set; }
        public string? Color { get; set; }

        public ToDo? ToDo { get; set; }
        public bool Completed { get; set; } = false;
    }

}
