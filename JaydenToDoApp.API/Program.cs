using JaydenToDoApp.Core.Interfaces;
using JaydenToDoApp.Infrastructure.Data;
using JaydenToDoApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using JaydenToDoApp.Application.Services;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "JaydenToDoApp API", Version = "v1" });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:")
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Controllers
builder.Services.AddControllers();


// Configure SQLite DB with safe path
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "ToDoApp.db");

//Directory.CreateDirectory(Path.GetDirectoryName(dbPath)); // Ensure folder exists

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}", b => b.MigrationsAssembly("JaydenToDoApp.Infrastructure")));

// Repositories
builder.Services.AddScoped<IToDoRepository, ToDoRepository>();
builder.Services.AddScoped<IToDoItemRepository, ToDoItemRepository>();
builder.Services.AddScoped<ToDoService>();
builder.Services.AddScoped<ToDoItemService>();
var app = builder.Build();

// Print resolved DB path
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var conn = context.Database.GetDbConnection();
    Console.WriteLine($"[DEBUG] SQLite database path: {conn.DataSource}");
}

// Dev middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "JaydenToDoApp API v1");
    });
}

// Middleware
app.UseCors(MyAllowSpecificOrigins); // Use only the defined policy

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
