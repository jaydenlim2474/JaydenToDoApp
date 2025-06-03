using JaydenToDoApp.Core.Entities;
using JaydenToDoApp.Core.Interfaces;
using JaydenToDoApp.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using JaydenToDoApp.Application.Services;
using JaydenToDoApp.Application.DTOs;

namespace JaydenToDoApp.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ToDosController : ControllerBase
    {
        private readonly ToDoService _service;
        private readonly IToDoRepository _repository;
        private readonly IToDoItemRepository _toDoItemRepository;

        #region verify db
        [HttpGet("dbpath")]
        public IActionResult GetDbPath()
        {
            if (_repository is ToDoRepository repo)
            {
                var conn = repo._context.Database.GetDbConnection();
                return Ok(conn.DataSource);
            }
            return Ok("No DB connection");
        }

        [HttpGet("checkdb")]
        public async Task<IActionResult> CheckDatabase()
        {
            try
            {
                var hasTable = await _repository.HasTableAsync("ToDos");
                var dbPath = (_repository as ToDoRepository)?._context.Database.GetDbConnection().DataSource;
                return Ok(new { DbPath = dbPath, TableExists = hasTable });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        #endregion

        #region ToDo
        public ToDosController(IToDoRepository repository, IToDoItemRepository toDoItemRepository, ToDoService service)
        {
            _repository = repository;
            _toDoItemRepository = toDoItemRepository;
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDo>>> GetToDos()
        {
            var todos = await _service.GetAllAsync();
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ToDo>> GetToDo(int id)
        {
            var todo = await _repository.GetByIdAsync(id);
            if (todo == null)
                return NotFound();
            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<ToDoDto>> CreateToDo([FromBody] ToDoDto dto)
        {
            var created = await _service.CreateAsync(dto.Title);
            return CreatedAtAction(nameof(GetToDo), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateToDo(int id, [FromBody] ToDoDto dto)
        {
            if (id != dto.Id)
                return BadRequest("Id mismatch");

            try
            {
                await _service.UpdateAsync(id, dto.Title);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDo(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        #endregion

        #region ToDoItem
        [HttpGet("{toDoId}/items")]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetToDoItems(int toDoId)
        {
            var items = await _toDoItemRepository.GetByToDoIdAsync(toDoId);
            if (items == null || !items.Any())
                return NotFound();

            return Ok(items);
        }


        #endregion
    }
}
