using JaydenToDoApp.Application.DTOs;
using JaydenToDoApp.Application.Services;
using JaydenToDoApp.Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JaydenToDoApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoItemsController : ControllerBase
    {
        private readonly ToDoItemService _service;

        public ToDoItemsController(ToDoItemService service)
        {
            _service = service;
        }

        [HttpGet("todo/{toDoId}")]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetByToDoId(int toDoId)
        {
            var items = await _service.GetByToDoIdAsync(toDoId);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoItem>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ToDoItem>> Create([FromBody] ToDoItemDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ToDoItemDto dto)
        {
            if (id != dto.Id)
                return BadRequest("Id mismatch");

            try
            {
                await _service.UpdateAsync(id, dto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
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

        public class CompletedUpdateDto
        {
            public bool Completed { get; set; }
        }

        [HttpPatch("{id}/completed")]
        public async Task<IActionResult> UpdateCompletedStatus(int id, [FromBody] CompletedUpdateDto dto)
        {
            try
            {
                await _service.UpdateCompletedStatusAsync(id, dto.Completed);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
