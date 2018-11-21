using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repositories
{
  public class UnitOfWork : IUnitOfWork
  {
    public ClothesContext Context { get; }

    public UnitOfWork(ClothesContext context)
    {
      Context = context;
    }
    public int Commit()
    {
      int returned = 0;
      try
      {
        returned = Context.SaveChanges();
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
        return 0;
      }
      return returned;
    }
    private IRepository<Owner> _ownerRepository { get; set; }
    public IRepository<Owner> OwnerRepository
    {
      get
      {
        return _ownerRepository = _ownerRepository ?? new OwnerRepository(Context);
      }
    }

    private IRepository<Department> _departmentRepository { get; set; }
    public IRepository<Department> DepartmentRepository
    {
      get
      {
        return _departmentRepository = _departmentRepository ?? new DepartmentRepository(Context);
      }
    }

    private IRepository<Product> _ProductRepository { get; set; }
    public IRepository<Product> ProductRepository
    {
      get
      {
        return _ProductRepository = _ProductRepository ?? new ProductRepository(Context);
      }
    }

    private IRepository<AppUser> _AppUserRepository { get; set; }
    public IRepository<AppUser> AppUserRepository
    {
      get
      {
        return _AppUserRepository = _AppUserRepository ?? new AppUserRepository(Context);
      }
    }


    public void Dispose()
    {
      Context.Dispose();
    }
  }
}
