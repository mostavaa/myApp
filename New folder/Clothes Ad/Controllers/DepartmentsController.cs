using System;
using System.Collections.Generic;
using System.Linq;
using Clothes_Ad.Models.Business;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;

namespace Clothes_Ad.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : Controller
    {
        public IUnitOfWork UnitOfWork { get; set; }
        public IDepartmentsBusiness DepartmentsBusiness { get; }
        public IStringLocalizer<DepartmentsController> Localizer { get; }
        public IStringLocalizer<SharedResources> SharedLocalizer { get; }

        public DepartmentsController(
            IUnitOfWork unitOfWork,
            IDepartmentsBusiness departmentsBusiness,
            IStringLocalizer<DepartmentsController> localizer,
            IStringLocalizer<SharedResources> sharedLocalizer)
        {
            UnitOfWork = unitOfWork;
            DepartmentsBusiness = departmentsBusiness;
            Localizer = localizer;
            SharedLocalizer = sharedLocalizer;
        }
        //api/departments/delete/guid
        [Route("delete")]
        [HttpPut]
        public JsonResult DeleteDepartment([FromBody]Guid id)
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
                    return Json(new { status = 0, messages = new string[] { SharedLocalizer["ServerError"] } });
                }
                return Json(new { status = 1, messages = new string[] { SharedLocalizer["DeletedSuccessfully"] } });

            }
            return Json(new { status = 0, messages = DepartmentsBusiness.Errors });
        }

        //api/departments/update/guid
        [Route("update")]
        [HttpPost]
        public JsonResult UpdateDepartment([FromQuery]Guid id, [FromBody] string departmentName)
        {
            var department = UnitOfWork.DepartmentRepository.Get(o => o.Guid == id).Include(o=>o.ParentDepartment).FirstOrDefault();
            if (department == null)
            {
                return Json(new { status = 0, messages = new string[] { Localizer["NoDepartmentExist"] } });
            }
            department.DeptName = departmentName;
            if (DepartmentsBusiness.IsValid(department, department.ParentDepartmentId==null? Guid.Empty: department.ParentDepartment.Guid))
            {
                try
                {
                    UnitOfWork.Commit();
                }
                catch (Exception)
                {
                    return Json(new { status = 0, messages = new string[] { SharedLocalizer["ServerError"] } });
                }
                return Json(new { status = 1, messages = new string[] { SharedLocalizer["UpdatedSuccessfully"] } });
            }
            return Json(new { status = 0, messages = DepartmentsBusiness.Errors });

        }

        //api/departments/add?parentDepartmentGuid=...&DeptName=...
        [Route("add")]
        [HttpPost]
        public JsonResult AddNewDepartment([FromBody] Department department, [FromQuery] Guid? parentDepartmentGuid)
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
                    return Json(new { status = 0, messages = new string[] { SharedLocalizer["ServerError"] } });
                }
                return Json(new { status = 1, id= department.Guid,  messages = new string[] { SharedLocalizer["AddedSuccessfully"] } });
            }
            return Json(new { status = 0, messages = DepartmentsBusiness.Errors });
        }
        // GET api/Departments
        [HttpGet]
        public JsonResult GetAllDepartments()
        {
            var result = new List<object>();
            var parentDepartments = UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == null).ToList();
            foreach (var parentDepartment in parentDepartments)
            {
                result.Add(GetDepartmentChildren(parentDepartment));
            }
            return Json(result);
        }


        private object GetDepartmentChildren(Department department)
        {
            //stop condition
            if (!UnitOfWork.DepartmentRepository.Get(o => o.Departments.Any(d => d.IsActive)).Any())
            {
                return null;
            }
            var children = new List<object>();
            foreach (var subDept in UnitOfWork.DepartmentRepository.Get(o => o.ParentDepartmentId == department.Id && o.IsActive))
            {
                children.Add(GetDepartmentChildren(subDept));
            }
            return new { department.DeptName, collapse = false, department.NumberOfProducts, department.Guid, children };
        }


    }
}
