using System.Collections.Generic;
using Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace serverApp.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : RootController
  {
    private IUnitOfWork _unitOfWork { get; set; }
    public ValuesController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }
    // GET api/values
    [HttpGet]
    [Route("all")]
    public ActionResult<IEnumerable<string>> Get()
    {
      return new string[] { "value1", "value2" };
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public ActionResult<string> Get(int id)
    {
      return "value";
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
