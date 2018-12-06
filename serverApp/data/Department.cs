using System;
using System.Collections.Generic;
using System.Text;

namespace Data
{
  public class Department : Entity
  {
    public Department()
    {
      Departments = new List<Department>();
      Products = new List<Product>();
    }
    public long? ParentDepartmentId { get; set; }
    public virtual Department ParentDepartment { get; set; }
    public virtual ICollection<Department> Departments { get; set; }

    public string DeptName { get; set; }
    public string DeptNameAr { get; set; }
    public int NumberOfProducts { get; set; }

    public virtual ICollection<Product> Products { get; set; }


  }
}
