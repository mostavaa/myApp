using System;
using serverApp.Models.Business;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace serverApp.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DepartmentsController : RootController
  {
    public IDepartmentsBusiness DepartmentsBusiness { get; }

    public DepartmentsController(
        IDepartmentsBusiness departmentsBusiness)
    {
      DepartmentsBusiness = departmentsBusiness;
    }
    //api/departments/delete/guid
    [Route("delete")]
    [HttpPost]
    [Authorize]
    public IActionResult DeleteDepartment([FromQuery]Guid id)
    {
      var response = DepartmentsBusiness.DeleteDepartment(id);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    //api/departments/update/guid
    [Route("update")]
    [HttpPost]
    [Authorize]
    public IActionResult UpdateDepartment([FromQuery]Guid id, [FromBody] Department departmentObj)
    {
      var response = DepartmentsBusiness.UpdateDepartment(id, departmentObj);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    //api/departments/add?parentDepartmentGuid=...&DeptName=...
    [Route("add")]
    [HttpPost]
    [Authorize]
    public IActionResult AddNewDepartment([FromBody] Department department, [FromQuery] Guid? parentDepartmentGuid)
    {
      var response = DepartmentsBusiness.AddDepartment(department, parentDepartmentGuid);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }
    // GET api/Departments
    [HttpGet]
    [Route("all")]
    public IActionResult GetAllDepartments()
    {
      var response = DepartmentsBusiness.GetAllDepartments();
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    [Route("get")]
    public IActionResult GetDepartment([FromQuery]Guid id)
    {
      var response = DepartmentsBusiness.GetDepartmentByGuid(id);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }
  }
}
