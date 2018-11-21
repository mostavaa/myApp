using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Repositories
{
    public class ProductRepository:Repository<Product>
    {

        public ProductRepository(ClothesContext context):base(context){}



    }
}
