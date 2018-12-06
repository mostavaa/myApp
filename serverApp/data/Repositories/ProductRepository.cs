using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Data.Repositories
{
  public class ProductRepository:Repository<Product>
    {
        public ProductRepository(ClothesContext context):base(context){}

    public Product GetByGuid(Guid id)
    {
      return Get(o => o.Guid == id).Include(o=>o.Department).FirstOrDefault();
    }

    public void DeleteProduct(long id)
    {
      Delete(id);
    }

    public void AddProduct(Product product)
    {
      Add(product);
    }

    public List<Product> GetDepartmentsProducts(List<long> depts, int page , int pageSize)
    {
      return Get(o => depts.Contains(o.Department.Id)).OrderByDescending(o => o.CreationDate).Skip(page * pageSize).Take(pageSize).Include(o => o.Department).ToList();
    }

    public List<Product> GetAll(int page, int pageSize)
    {
      return Get().OrderByDescending(o => o.CreationDate).Skip(page * pageSize).Take(pageSize).Include(o => o.Department).ToList();
    }

    public int GetDepartmentsProductsCount(List<long> depts)
    {
      return Get(o => depts.Contains(o.Department.Id)).Count();
    }

    public int GetCount()
    {
      return Get().Count();
    }
  }
}
