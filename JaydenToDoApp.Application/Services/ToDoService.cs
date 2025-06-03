using JaydenToDoApp.Application.DTOs;
using JaydenToDoApp.Core.Entities;
using JaydenToDoApp.Core.Interfaces;

namespace JaydenToDoApp.Application.Services
{
    public class ToDoService
    {
        private readonly IToDoRepository _repository;

        public ToDoService(IToDoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ToDoDto>> GetAllAsync()
        {
            var todos = await _repository.GetAllAsync();
            return todos.Select(t => new ToDoDto
            {
                Id = t.Id,
                Title = t.Title
            });
        }

        public async Task<ToDoDto> CreateAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be empty");

            var todo = new ToDo { Title = title };
            var created = await _repository.AddAsync(todo);

            return new ToDoDto
            {
                Id = created.Id,
                Title = created.Title
            };
        }

        public async Task UpdateAsync(int id, string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be empty");

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException("ToDo not found");

            existing.Title = title;
            await _repository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException("ToDo not found");

            await _repository.DeleteAsync(id);
        }

    }
}
