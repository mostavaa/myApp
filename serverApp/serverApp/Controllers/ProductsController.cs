using System;
using serverApp.Models.Business;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace serverApp.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductsController : RootController
  {
    public IProductsBusiness ProductsBusiness { get; }

    public ProductsController(IProductsBusiness productsBusiness)
    {
      ProductsBusiness = productsBusiness;
    }
    //api/products/delete/guid
    [Route("delete")]
    [HttpPost]
    [Authorize]
    public IActionResult Delete([FromQuery]Guid id)
    {
      var response = ProductsBusiness.DeleteProduct(id);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    //api/products/update/guid
    [Route("update")]
    [HttpPost]
    [Authorize]
    public IActionResult Update([FromQuery] Guid id, [FromBody]Product product)
    {
      var response = ProductsBusiness.UpdateProduct(id,product);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    //api/products/add/?query
    [Route("add")]
    [HttpPost]
    [Authorize]
    public IActionResult Add([FromQuery]Guid deptGuid, [FromBody] Product product)
    {
      var response = ProductsBusiness.AddProduct(deptGuid, product);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }
    // GET api/products


    [Route("all")]
    [HttpGet]
    public IActionResult GetAll([FromQuery]Guid? deptId, [FromQuery]int page = 0)
    {
      var response = ProductsBusiness.GetProducts(deptId, page);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }

    // GET api/products/get
    [Route("get")]
    [HttpGet]
    public IActionResult Get([FromQuery]Guid id)
    {
      var response = ProductsBusiness.GetProduct(id);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }
  }
}
