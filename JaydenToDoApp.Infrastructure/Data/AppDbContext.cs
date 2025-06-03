using JaydenToDoApp.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace JaydenToDoApp.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<ToDo> ToDos => Set<ToDo>();
        public DbSet<ToDoItem> ToDoItems => Set<ToDoItem>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ToDo>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Title).IsRequired();
                entity.HasMany(t => t.Items)
                    .WithOne(i => i.ToDo)
                    .HasForeignKey(i => i.ToDoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ToDoItem>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.ItemName).IsRequired();
                entity.Property(i => i.Color).HasMaxLength(20);
            });
        }
    }
}
