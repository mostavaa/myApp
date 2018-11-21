using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Repositories
{
    public class AppUserRepository:Repository<AppUser>
    {

        public AppUserRepository(ClothesContext context):base(context){}



    }
}
