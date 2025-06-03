using JaydenToDoApp.Application.DTOs;
using JaydenToDoApp.Core.Entities;
using JaydenToDoApp.Core.Interfaces;

namespace JaydenToDoApp.Application.Services
{
    public class ToDoItemService
    {
        private readonly IToDoItemRepository _repository;

        public ToDoItemService(IToDoItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ToDoItem>> GetByToDoIdAsync(int toDoId)
        {
            return await _repository.GetByToDoIdAsync(toDoId);
        }

        public async Task<ToDoItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<ToDoItem> CreateAsync(ToDoItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ItemName))
                throw new ArgumentException("ItemName cannot be empty");

            var item = new ToDoItem
            {
                ToDoId = dto.ToDoId,
                ItemName = dto.ItemName,
                Description = dto.Description,
                Date = dto.Date,
                Time = dto.Time,
                Notes = dto.Notes,
                Color = dto.Color,
                Completed = dto.Completed
            };

            return await _repository.AddAsync(item);
        }

        public async Task UpdateAsync(int id, ToDoItemDto dto)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) throw new KeyNotFoundException();

            item.ItemName = dto.ItemName;
            item.Description = dto.Description;
            item.Date = dto.Date;
            item.Time = dto.Time;
            item.Notes = dto.Notes;
            item.Color = dto.Color;
            item.Completed = dto.Completed;

            await _repository.UpdateAsync(item);
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) throw new KeyNotFoundException();

            await _repository.DeleteAsync(id);
        }

        public async Task UpdateCompletedStatusAsync(int id, bool completed)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) throw new KeyNotFoundException();

            item.Completed = completed;
            await _repository.UpdateAsync(item);
        }
    }
}
