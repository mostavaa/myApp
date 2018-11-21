using System;
using System.Collections.Generic;
using System.Linq;
using serverApp.Models;
using serverApp.Models.Business;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;

namespace serverApp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : RootController
  {
        public IUnitOfWork UnitOfWork { get; set; }
        public IProductsBusiness ProductsBusiness { get; }
        public IStringLocalizer<ProductsController> Localizer { get; }
        public IStringLocalizer<SharedResources> SharedLocalizer { get; }

        public ProductsController(
            IUnitOfWork unitOfWork,
            IProductsBusiness productsBusiness,
            IStringLocalizer<ProductsController> localizer,
            IStringLocalizer<SharedResources> sharedLocalizer)
        {
            UnitOfWork = unitOfWork;
            Localizer = localizer;
            SharedLocalizer = sharedLocalizer;
            ProductsBusiness = productsBusiness;
        }
        //api/products/delete/guid
        [Route("delete")]
        [HttpPut]
        public JsonResult Delete([FromBody]Guid id)
        {

            var product = UnitOfWork.ProductRepository.Get(o => o.Guid == id).FirstOrDefault();
            if (product != null)
            {
                UnitOfWork.ProductRepository.Delete(product.Id);
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
            else
            {
                return Json(new { status = 0, messages = new string[] { Localizer["NoProductExist"] } });
            }

        }

        //api/products/update/guid
        [Route("update")]
        [HttpPost]
        public JsonResult Update([FromQuery]Guid deptGuid, [FromBody]Product product)
        {
            var obj = UnitOfWork.ProductRepository.Get(o => o.Guid == deptGuid).Include(o=>o.Department).FirstOrDefault();
            if (obj == null)
            {
                return Json(new { status = 0, messages = new string[] { Localizer["NoProductExist"] } });
            }
            obj.Name = product.Name;
            obj.Price = product.Price;
            obj.Description = product.Description;
            obj.PictureContent = product.PictureContent;
            if ((ProductsBusiness.IsValid(obj , obj.Department.Guid)))
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
            return Json(new { status = 0, messages = ProductsBusiness.Errors });
        }

        //api/products/add/?query
        [Route("add")]
        [HttpPost]
        public JsonResult Add([FromQuery]Guid deptGuid , [FromBody] Product obj)
        {
            if (ProductsBusiness.IsValid(obj, deptGuid))
            {
                UnitOfWork.ProductRepository.Add(obj);
                try
                {
                    UnitOfWork.Commit();
                }
                catch (Exception)
                {
                    return Json(new { status = 0, messages = new string[] { SharedLocalizer["ServerError"] } });
                }
                return Json(new { status = 1, id = obj.Guid, messages = new string[] { SharedLocalizer["AddedSuccessfully"] } });
            }
            return Json(new { status = 0, messages = ProductsBusiness.Errors });
        }
        // GET api/products
        [HttpGet]
        public JsonResult GetAll([FromQuery]int page=0)
        {
            var result = new List<object>();
            var objects = UnitOfWork.ProductRepository.Get().Skip(page* Constants.pageSize).Take(Constants.pageSize).Include(o => o.Department).ToList();
            foreach (var obj in objects)
            {
                result.Add(new { obj.Name, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, obj.DepartmentId, DeptGuid = obj.Department.Guid, obj.PictureContent });
            }
            return Json(new{result , count = UnitOfWork.ProductRepository.Get().Count()});
        }

        // GET api/products
        
        [HttpGet]
        public JsonResult GetAll([FromQuery]Guid deptId, [FromQuery]int page = 0)
        {
            var result = new List<object>();
            var objects = UnitOfWork.ProductRepository.Get(o=>o.Department.Guid == deptId).Skip(page * Constants.pageSize).Take(Constants.pageSize).Include(o => o.Department).ToList();
            foreach (var obj in objects)
            {
                result.Add(new { obj.Name, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, obj.DepartmentId, DeptGuid = obj.Department.Guid, obj.PictureContent });
            }
            return Json(new {result, count =  UnitOfWork.ProductRepository.Get(o => o.Department.Guid == deptId).Count() });
        }

        // GET api/products/get
        [Route("get")]
        [HttpGet]
        public JsonResult Get([FromQuery]Guid id)
        {
           
            var obj = UnitOfWork.ProductRepository.Get(o => o.Guid == id).Include(o => o.Department).FirstOrDefault();
            if (obj != null)
                return Json(new { obj.Name, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, obj.DepartmentId, DeptGuid = obj.Department.Guid, obj.PictureContent });
            else
                return Json(new { status = 0, messages = new string[] { Localizer["NoProductExist"] } });
        }
    }
}
