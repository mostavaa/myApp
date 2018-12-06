using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Data.Repositories
{
  public class DepartmentRepository : Repository<Department>
  {
    public DepartmentRepository(ClothesContext context) : base(context) { }

    public Department GetByGuid(Guid guid)
    {
      return Get(o => o.Guid == guid).Include(o => o.ParentDepartment).FirstOrDefault();
    }

    public bool DepartmentHasChildren(long id)
    {
      return Get(o => o.ParentDepartmentId == id && o.IsActive).Any();
    }

    public void DeleteDepartment(long departmentId)
    {
      Delete(departmentId);
    }

    public bool DepartmentExistWithTheSameName(long? parentId, Department department)
    {
      return Get(o => o.ParentDepartmentId == parentId && o.Id != department.Id && o.DeptName.ToLower() == department.DeptName.ToLower() || o.DeptNameAr == department.DeptNameAr).Any();
    }

    public void AddDepartment(Department department)
    {
      Add(department);
    }

    public List<Department> GetDepartmentChildren(long id)
    {
      return Get(o => o.ParentDepartmentId == id ).Include(o=>o.ParentDepartment).ToList();
    }

    public List<Department> GetRootDepartments()
    {
      return Get(o => o.ParentDepartmentId == null).ToList();
    }
  }
}
