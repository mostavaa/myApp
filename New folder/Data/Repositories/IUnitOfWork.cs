﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Owner> OwnerRepository { get; }
        IRepository<Department> DepartmentRepository { get; }
        IRepository<Product> ProductRepository { get; }
        ClothesContext Context { get; }
        int Commit();
    }
}
