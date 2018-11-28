using System;
using System.Collections.Generic;
using System.Linq;
using serverApp.Controllers;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;

namespace serverApp.Models.Business
{
  public interface IDepartmentsBusiness
  {
    IUnitOfWork UnitOfWork { get; set; }
    List<string> Errors { get; set; }
    bool IsValid(Department department, Guid? parentDepartmentGuid);
    bool CanDeleteDepartment(Guid guid, out long departmentId);
    List<long> GetDepartmentWithChildren(long deptId);
  }
  public class DepartmentsBusiness : IDepartmentsBusiness
  {
    public IUnitOfWork UnitOfWork { get; set; }
    public IStringLocalizer<SharedResources> Localizer { get; }

    public DepartmentsBusiness(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      Localizer = localizer;
      Errors = new List<string>();
    }
    public List<long> GetDepartmentWithChildren(long deptId)
    {
      return GetDepartmentChildren(deptId);
    }
    private List<long> GetDepartmentChildren(long departmentId)
    {
      //stop condition=> no children
      if (!UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == departmentId && o.IsActive).Any())
      {
        return new List<long>() { departmentId };
      }
      var children = new List<long>();
      foreach (var subDept in UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == departmentId && o.IsActive))
      {
        children.AddRange(GetDepartmentChildren(subDept.Id));
      }
      return children;
    }
    public List<string> Errors { get; set; }
    public bool IsValid(Department department, Guid? parentDepartmentGuid)
    {
      Errors = new List<string>();
      if (!string.IsNullOrEmpty(department.DeptName) && department.DeptName.Length > 2 && !string.IsNullOrEmpty(department.DeptNameAr) && department.DeptNameAr.Length > 2)
      {

        if (parentDepartmentGuid != null && parentDepartmentGuid != Guid.Empty)
        {
          var parentDepartment = UnitOfWork.DepartmentRepository.Get(o => o.Guid == parentDepartmentGuid)
              .FirstOrDefault();

          if (parentDepartment != null)
          {
            if (parentDepartment.Departments.Any(o => (o.DeptName.ToLower() == department.DeptName.ToLower() || o.DeptNameAr == department.DeptNameAr) && o.Id!=department.Id)
            )
            {
              Errors.Add(Localizer["DepartmentExistError"]);
            }
            department.ParentDepartmentId = parentDepartment.Id;
            return true;
          }
          else
          {
            Errors.Add(Localizer["NoParentDepartmentFound"]);
          }
        }
        else
        {
          if (UnitOfWork.DepartmentRepository.Get(o => (o.DeptName.ToLower() == department.DeptName.ToLower() || o.DeptNameAr == department.DeptNameAr) && o.Id != department.Id).Any())
          {
            Errors.Add(Localizer["DepartmentExistError"]);
          }
          else
          {
            return true;
          }
        }
      }
      else
      {
        Errors.Add(Localizer["NameIsNullOrEmpty"]);
      }
      return false;
    }

    public bool CanDeleteDepartment(Guid guid, out long departmentId)
    {
      departmentId = 0;
      var department = UnitOfWork.DepartmentRepository.Get(o => o.Guid == guid)
          .FirstOrDefault();
      if (department == null)
      {
        Errors.Add(Localizer["NoDepartmentExist"]);
        return false;
      }
      if (UnitOfWork.DepartmentRepository.Get().Any(o => o.ParentDepartmentId == department.Id && o.IsActive))
      {
        Errors.Add(Localizer["DepartmentHasChildrenError"]);
        return false;
      }
      departmentId = department.Id;
      return true;
    }
  }
}
