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
using serverApp.ViewModels;

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
    [HttpPost]
    public IActionResult Delete([FromQuery]Guid id)
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
          return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse() { status = true,messages = new string[] { SharedLocalizer["DeletedSuccessfully"] } });
      }
      else
      {
        return BadRequest(new ReturnResponse() { status = false, messages = new string[] { Localizer["NoProductExist"] } });
      }

    }

    //api/products/update/guid
    [Route("update")]
    [HttpPost]
    public IActionResult Update([FromQuery] Guid id, [FromBody]Product product)
    {
      var obj = UnitOfWork.ProductRepository.Get(o => o.Guid == id).Include(o => o.Department).FirstOrDefault();
      if (obj == null)
      {
        return BadRequest(new { status = 0, messages = new string[] { Localizer["NoProductExist"] } });
      }
      obj.Name = product.Name;
      obj.NameAr = product.NameAr;
      obj.Price = product.Price;
      obj.Description = product.Description;
      obj.DescriptionAr = product.DescriptionAr;
      obj.PictureContent = product.PictureContent;
      if ((ProductsBusiness.IsValid(obj, obj.Department.Guid)))
      {
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse(){ status=true, messages = new string[] { SharedLocalizer["UpdatedSuccessfully"] } });
      }
      return BadRequest(new ReturnResponse() { status = false,   messages = ProductsBusiness.Errors.ToArray() });
    }

    //api/products/add/?query
    [Route("add")]
    [HttpPost]
    public IActionResult Add([FromQuery]Guid deptGuid, [FromBody] Product obj)
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
          return BadRequest(new ReturnResponse() { status = false, messages = new string[] { SharedLocalizer["ServerError"] } });
        }
        return Ok(new ReturnResponse() { status = true, data = new { id = obj.Guid }, messages = new string[] { SharedLocalizer["AddedSuccessfully"] } });
      }
      return BadRequest(new ReturnResponse() { status = false, messages = ProductsBusiness.Errors.ToArray() });
    }
    // GET api/products

    [HttpGet]
    public IActionResult GetAll([FromQuery]Guid? deptId, [FromQuery]int page = 0)
    {
      var result = new List<object>();
      List<Product> objects;
      if (deptId != null)
        objects = UnitOfWork.ProductRepository.Get(o => o.Department.Guid == deptId).Skip(page * Constants.pageSize).Take(Constants.pageSize).Include(o => o.Department).ToList();
      else
        objects = UnitOfWork.ProductRepository.Get().Skip(page * Constants.pageSize).Take(Constants.pageSize).Include(o => o.Department).ToList();
      foreach (var obj in objects)
      {
        result.Add(new { obj.Name, obj.NameAr,obj.DescriptionAr ,obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, departmentGuid = obj.Department.Guid, picture = obj.PictureContent });
      }
      int count = deptId != null ? UnitOfWork.ProductRepository.Get(o => o.Department.Guid == deptId).Count() : UnitOfWork.ProductRepository.Get().Count();
      return Ok(new ReturnResponse() { status = true, data = new { result, count } });
    }

    // GET api/products/get
    [Route("get")]
    [HttpGet]
    public IActionResult Get([FromQuery]Guid id)
    {

      var obj = UnitOfWork.ProductRepository.Get(o => o.Guid == id).Include(o => o.Department).FirstOrDefault();
      if (obj != null)
        return Ok( new ReturnResponse() { status = true, data = new { obj.Name, obj.NameAr, obj.DescriptionAr, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, departmentGuid = obj.Department.Guid, picture = obj.PictureContent } });
      else

        return BadRequest(new ReturnResponse() { status = false, messages = new string[] { Localizer["NoProductExist"] } });
    }
  }
}
