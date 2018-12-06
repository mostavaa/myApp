namespace Data.Repositories
{
  public interface IUnitOfWork 
  {
    OwnerRepository OwnerRepository { get; }
    DepartmentRepository DepartmentRepository { get; }
    ProductRepository ProductRepository { get; }
    AppUserRepository AppUserRepository { get; }
    ProductImagesRepository ProductImagesRepository { get; }
    int Commit();
  }
}
