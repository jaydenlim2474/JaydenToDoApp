using JaydenToDoApp.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JaydenToDoApp.Core.Interfaces
{
    public interface IToDoRepository
    {
        Task<IEnumerable<ToDo>> GetAllAsync();
        Task<ToDo?> GetByIdAsync(int id);
        Task<ToDo> AddAsync(ToDo todo);
        Task UpdateAsync(ToDo todo);
        Task DeleteAsync(int id);
        Task<bool> HasTableAsync(string tableName);

    }
}
