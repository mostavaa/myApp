using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Repositories
{
    public class DepartmentRepository:Repository<Department>
    {

        public DepartmentRepository(ClothesContext context):base(context){}



    }
}
