using Microsoft.EntityFrameworkCore;

namespace Data
{

  public class ClothesContext : DbContext
  {
    public ClothesContext(DbContextOptions<ClothesContext> options) : base(options)
    {

    }
    public DbSet<Owner> Owners { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<ProductImages> ProductImages { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Department>().HasOne(o => o.ParentDepartment).WithMany(o => o.Departments)
          .HasForeignKey(o => o.ParentDepartmentId);

      modelBuilder.Entity<Product>().HasOne(o => o.Department).WithMany(o => o.Products)
          .HasForeignKey(o => o.DepartmentId);

      modelBuilder.Entity<ProductImages>().HasOne(o => o.Product).WithMany(o => o.Images).HasForeignKey(o => o.ProductId);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      //optionsBuilder.UseSqlServer("Server=.;Database=EFCore-ClothesAd;Trusted_Connection=True");
    }
  }
}
