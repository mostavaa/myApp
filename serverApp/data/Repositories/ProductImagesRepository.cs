using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Repositories
{
    public class ProductImagesRepository:Repository<ProductImages>
    {

        public ProductImagesRepository(ClothesContext context):base(context){}



    }
}
