using System;
using System.Collections.Generic;
using System.Linq;
using serverApp.Models.Business;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading;
using System.Globalization;
using serverApp.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace serverApp.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class DepartmentsController : RootController
  {


    public IUnitOfWork UnitOfWork { get; set; }
    public IDepartmentsBusiness DepartmentsBusiness { get; }
    public IStringLocalizer<SharedResources> SharedLocalizer { get; }

    public DepartmentsController(
        IUnitOfWork unitOfWork,
        IDepartmentsBusiness departmentsBusiness,
        IStringLocalizer<SharedResources> sharedLocalizer)
    {
      UnitOfWork = unitOfWork;
      DepartmentsBusiness = departmentsBusiness;
      SharedLocalizer = sharedLocalizer;
    }
    //api/departments/delete/guid
    [Route("delete")]
    [HttpPost]
    [Authorize]
    public IActionResult DeleteDepartment([FromQuery]Guid id)
    {
      long departmentId;
      if (DepartmentsBusiness.CanDeleteDepartment(id, out departmentId))
      {
        UnitOfWork.DepartmentRepository.Delete(departmentId);
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return BadRequest(new ReturnResponse { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse { status = true, messages = new string[] { SharedLocalizer["DeletedSuccessfully"] } });
      }
      return BadRequest(new ReturnResponse { status = false, messages = DepartmentsBusiness.Errors.ToArray() });
    }

    //api/departments/update/guid
    [Route("update")]
    [HttpPost]
    [Authorize]
    public IActionResult UpdateDepartment([FromQuery]Guid id, [FromBody] Department departmentObj)
    {
      var department = UnitOfWork.DepartmentRepository.Get(o => o.Guid == id).Include(o => o.ParentDepartment).FirstOrDefault();
      if (department == null)
      {
        return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["NoDepartmentExist"] } });
      }
      department.DeptName = departmentObj.DeptName;
      department.DeptNameAr = departmentObj.DeptNameAr;
      if (DepartmentsBusiness.IsValid(department, department.ParentDepartmentId == null ? Guid.Empty : department.ParentDepartment.Guid))
      {
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse { status = true, messages = new string[] { SharedLocalizer["UpdatedSuccessfully"] } });
      }
      return BadRequest(new ReturnResponse()  { status = false, messages = DepartmentsBusiness.Errors.ToArray() });

    }

    //api/departments/add?parentDepartmentGuid=...&DeptName=...
    [Route("add")]
    [HttpPost]
    [Authorize]
    public IActionResult AddNewDepartment([FromBody] Department department, [FromQuery] Guid? parentDepartmentGuid)
    {
      if (DepartmentsBusiness.IsValid(department, parentDepartmentGuid))
      {
        UnitOfWork.DepartmentRepository.Add(department);
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse() { status = true, data = new { id = department.Guid }, messages = new string[] { SharedLocalizer["AddedSuccessfully"] } });
      }
      return BadRequest(new ReturnResponse() { status = false, messages = DepartmentsBusiness.Errors.ToArray() });
    }
    // GET api/Departments
    [HttpGet]
    public IActionResult GetAllDepartments()
    {
      var result = new List<object>();
      var parentDepartments = UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == null).Include(o => o.ParentDepartment).ToList();
      foreach (var parentDepartment in parentDepartments)
      {
        result.Add(GetDepartmentChildren(parentDepartment));
      }
      return Ok(new ReturnResponse()
      {
        data = result,
        status = true
      });
    }


    private object GetDepartmentChildren(Department department)
    {
      //stop condition
      if (!UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == department.Id && o.IsActive).Any())
      {
        if (department.ParentDepartment != null)
        {
          return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, parentGuid = department.ParentDepartment.Guid, children = new { } };
        }
        else
        {
          return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, children = new { } };
        }
      }
      var children = new List<object>();
      foreach (var subDept in UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == department.Id && o.IsActive).Include(o => o.ParentDepartment))
      {
        children.Add(GetDepartmentChildren(subDept));
      }
      if (department.ParentDepartment != null)
        return new { name = department.DeptName, nameAr = department.DeptNameAr, parentGuid = department.ParentDepartment.Guid, department.NumberOfProducts, guid = department.Guid, children };
      else
        return new { name = department.DeptName, nameAr = department.DeptNameAr, department.NumberOfProducts, guid = department.Guid, children };
    }
    [Route("get")]
    public IActionResult GetDepartment([FromQuery]Guid id)
    {
      var department = UnitOfWork.DepartmentRepository.Get(o => o.Guid == id).Include(o => o.ParentDepartment).Include(o => o.Departments).FirstOrDefault();
      if (department != null)
      {
        return Ok(new ReturnResponse()
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
           children = department.Departments.Select(o => new
           {
             name = o.DeptName,
             nameAr = o.DeptNameAr,
             parentGuid = department.Guid,
             o.NumberOfProducts,
             guid = o.Guid
           }).ToList()
         }
        });
      }
      return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["NotFound"] } });
    }
  }
}
