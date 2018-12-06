namespace Data.Repositories
{
  public class OwnerRepository : Repository<Owner>
  {
    public OwnerRepository(ClothesContext context) : base(context) { }
  }
}
