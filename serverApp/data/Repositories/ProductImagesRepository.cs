using System.Collections.Generic;
using System.Linq;

namespace Data.Repositories
{
  public class ProductImagesRepository:Repository<ProductImages>
    {
        public ProductImagesRepository(ClothesContext context):base(context){}

    public void DeleteImage(long id)
    {
      Delete(id);
    }

    public IEnumerable<ProductImages> GetProductImages(long id)
    {
      return Get(o => o.ProductId == id).ToList();
    }
  }
}
