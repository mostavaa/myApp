using System;

namespace Data.Repositories
{
  public class UnitOfWork : IUnitOfWork, IDisposable
  {
    private ClothesContext Context { get; }

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
    private OwnerRepository _ownerRepository { get; set; }
    public OwnerRepository OwnerRepository
    {
      get
      {
        return _ownerRepository = _ownerRepository ?? new OwnerRepository(Context);
      }
    }
    private DepartmentRepository _departmentRepository { get; set; }
    public DepartmentRepository DepartmentRepository
    {
      get
      {
        return _departmentRepository = _departmentRepository ?? new DepartmentRepository(Context);
      }
    }
    private ProductRepository _ProductRepository { get; set; }
    public ProductRepository ProductRepository
    {
      get
      {
        return _ProductRepository = _ProductRepository ?? new ProductRepository(Context);
      }
    }
    private AppUserRepository _AppUserRepository { get; set; }
    public AppUserRepository AppUserRepository
    {
      get
      {
        return _AppUserRepository = _AppUserRepository ?? new AppUserRepository(Context);
      }
    }
    private ProductImagesRepository _ProductImagesRepository { get; set; }
    public ProductImagesRepository ProductImagesRepository
    {
      get
      {
        return _ProductImagesRepository = _ProductImagesRepository ?? new ProductImagesRepository(Context);
      }
    }
    public void Dispose()
    {
      Context.Dispose();
    }
  }
}
