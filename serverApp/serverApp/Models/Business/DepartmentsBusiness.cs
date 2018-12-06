using System;
using System.Collections.Generic;
using System.Linq;
using serverApp.Controllers;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;
using serverApp.ViewModels;

namespace serverApp.Models.Business
{
  public interface IDepartmentsBusiness
  {
    List<long> GetDepartmentChildrenIds(long deptId);
    ReturnResponse DeleteDepartment(Guid id);
    ReturnResponse UpdateDepartment(Guid id, Department obj);
    ReturnResponse AddDepartment(Department department, Guid? parentDepartmentGuid);
    ReturnResponse GetDepartmentByGuid(Guid id);
    ReturnResponse GetAllDepartments();
  }
  public class DepartmentsBusiness : IDepartmentsBusiness
  {
    private IUnitOfWork UnitOfWork { get; set; }
    private IStringLocalizer<SharedResources> Localizer { get; }
    private List<string> Errors { get; set; }

    public DepartmentsBusiness(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      Localizer = localizer;
      Errors = new List<string>();
    }
    public ReturnResponse GetDepartmentByGuid(Guid id)
    {
      var department = UnitOfWork.DepartmentRepository.GetByGuid(id);
      if (department != null)
      {
        List<Department> deptChildren = UnitOfWork.DepartmentRepository.GetDepartmentChildren(department.Id);
        return new ReturnResponse()
        {
          status = true,
          data =
         new
         {
           name = department.DeptName,
           nameAr = department.DeptNameAr,
           parentGuid = department.ParentDepartment?.Guid,
           department.NumberOfProducts,
           guid = department.Guid,
           children = deptChildren.Select(o => new
           {
             name = o.DeptName,
             nameAr = o.DeptNameAr,
             parentGuid = department.Guid,
             o.NumberOfProducts,
             guid = o.Guid
           }).ToList()
         }
        };
      }
      return new ReturnResponse() { status = false, messages = new string[] { Localizer["NotFound"] } };
    }
    public ReturnResponse DeleteDepartment(Guid id)
    {
      long departmentId;
      if (CanDeleteDepartment(id, out departmentId))
      {
        UnitOfWork.DepartmentRepository.DeleteDepartment(departmentId);
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return new ReturnResponse { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
        return new ReturnResponse { status = true, messages = new string[] { Localizer["DeletedSuccessfully"] } };
      }
      return new ReturnResponse { status = false, messages = Errors.ToArray() };
    }
    public ReturnResponse UpdateDepartment(Guid id, Department obj)
    {
      var department = UnitOfWork.DepartmentRepository.GetByGuid(id);
      if (department == null)
      {
        return new ReturnResponse() { status = false, messages = new string[] { Localizer["NoDepartmentExist"] } };
      }
      department.DeptName = obj.DeptName;
      department.DeptNameAr = obj.DeptNameAr;
      if (IsValid(department, department.ParentDepartmentId == null ? Guid.Empty : department.ParentDepartment.Guid))
      {
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
        return new ReturnResponse { status = true, messages = new string[] { Localizer["UpdatedSuccessfully"] } };
      }
      return new ReturnResponse() { status = false, messages = Errors.ToArray() };
    }
    public ReturnResponse AddDepartment(Department department, Guid? parentDepartmentGuid)
    {
      if (IsValid(department, parentDepartmentGuid))
      {
        UnitOfWork.DepartmentRepository.AddDepartment(department);
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
        return new ReturnResponse() { status = true, data = new { id = department.Guid }, messages = new string[] { Localizer["AddedSuccessfully"] } };
      }
      return new ReturnResponse() { status = false, messages = Errors.ToArray() };
    }
    public List<long> GetDepartmentChildrenIds(long deptId)
    {
      return GetDepartmentChildrenIdsRecursion(deptId);
    }
    private List<long> GetDepartmentChildrenIdsRecursion(long departmentId)
    {
      //stop condition=> no children
      if (!UnitOfWork.DepartmentRepository.DepartmentHasChildren(departmentId))
      {
        return new List<long>() { departmentId };
      }
      var children = new List<long>();
      foreach (var subDept in UnitOfWork.DepartmentRepository.GetDepartmentChildren(departmentId))
      {
        children.AddRange(GetDepartmentChildrenIdsRecursion(subDept.Id));
      }
      return children;
    }
    private bool IsValid(Department department, Guid? parentDepartmentGuid)
    {
      Errors = new List<string>();
      if (!string.IsNullOrEmpty(department.DeptName) && department.DeptName.Length > 2 && !string.IsNullOrEmpty(department.DeptNameAr) && department.DeptNameAr.Length > 2)
      {

        if (parentDepartmentGuid != null && parentDepartmentGuid != Guid.Empty)
        {
          var parentDepartment = UnitOfWork.DepartmentRepository.GetByGuid((Guid)parentDepartmentGuid);

          if (parentDepartment != null)
          {
            if (UnitOfWork.DepartmentRepository.DepartmentExistWithTheSameName(parentDepartment.Id, department))
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
          if (UnitOfWork.DepartmentRepository.DepartmentExistWithTheSameName(null, department))
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
      var department = UnitOfWork.DepartmentRepository.GetByGuid(guid);
      if (department == null)
      {
        Errors.Add(Localizer["NoDepartmentExist"]);
        return false;
      }
      else if (UnitOfWork.DepartmentRepository.DepartmentHasChildren(department.Id))
      {
        Errors.Add(Localizer["DepartmentHasChildrenError"]);
        return false;
      }
      else
      {
        departmentId = department.Id;
        return true;
      }
    }
    public ReturnResponse GetAllDepartments()
    {
      var result = new List<object>();
      List<Department> parentDepartments = UnitOfWork.DepartmentRepository.GetRootDepartments();
      foreach (var parentDepartment in parentDepartments)
      {
        result.Add(GetDepartmentChildren(parentDepartment));
      }
      return new ReturnResponse()
      {
        data = result,
        status = true
      };
    }
    private object GetDepartmentChildren(Department department)
    {
      //stop condition
      if (!UnitOfWork.DepartmentRepository.DepartmentHasChildren(department.Id))
      {
        if (department.ParentDepartmentId != null)
        {
          return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, parentGuid = department.ParentDepartment.Guid, children = new { } };
        }
        else
        {
          return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, children = new { } };
        }
      }
      var children = new List<object>();
      foreach (var subDept in UnitOfWork.DepartmentRepository.GetDepartmentChildren(department.Id))
      {
        children.Add(GetDepartmentChildren(subDept));
      }
      if (department.ParentDepartment != null)
        return new { name = department.DeptName, nameAr = department.DeptNameAr, parentGuid = department.ParentDepartment.Guid, department.NumberOfProducts, guid = department.Guid, children };
      else
        return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, children };
    }
  }
}
