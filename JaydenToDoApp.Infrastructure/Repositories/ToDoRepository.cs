using JaydenToDoApp.Core.Entities;
using JaydenToDoApp.Core.Interfaces;
using JaydenToDoApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JaydenToDoApp.Infrastructure.Repositories
{
    public class ToDoRepository : IToDoRepository
    {
        public readonly AppDbContext _context;

        public ToDoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasTableAsync(string tableName)
        {
            var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();
            using var command = conn.CreateCommand();
            command.CommandText = $"SELECT name FROM sqlite_master WHERE type='table' AND name='{tableName}'";
            var result = await command.ExecuteScalarAsync();
            await conn.CloseAsync();
            return result != null && result != DBNull.Value;
        }


        public async Task<ToDo> AddAsync(ToDo todo)
        {
            _context.ToDos.Add(todo);
            await _context.SaveChangesAsync();
            return todo;
        }

        public async Task DeleteAsync(int id)
        {
            var todo = await _context.ToDos.FindAsync(id);
            if (todo != null)
            {
                _context.ToDos.Remove(todo);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ToDo>> GetAllAsync()
        {
            return await _context.ToDos.ToListAsync();
        }

        public async Task<ToDo?> GetByIdAsync(int id)
        {
            return await _context.ToDos.FindAsync(id);
        }

        public async Task UpdateAsync(ToDo todo)
        {
            _context.Entry(todo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
