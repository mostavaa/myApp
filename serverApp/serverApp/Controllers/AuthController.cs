using Microsoft.AspNetCore.Mvc;
using Data;
using serverApp.ViewModels;
using serverApp.Models.Business;

namespace serverApp.Controllers
{

  [Route("api/auth")]
  [ApiController]
  public class AuthController : RootController
  {
    private readonly IAuthBusiness authBusiness;

    public AuthController(IAuthBusiness authBusiness)
    {
      this.authBusiness = authBusiness;
    }

    // POST: api/Auth
    [HttpPost]
    [Route("login")]
    public ActionResult Login([FromBody] AppUser user)
    {
      ReturnResponse response = authBusiness.Login(user);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }
    // POST: api/Auth
    [HttpPost]
    [Route("register")]
    public ActionResult Register([FromBody] AppUser user)
    {
      ReturnResponse response = authBusiness.Register(user);
      if (response.status)
        return Ok(response);
      return BadRequest(response);
    }


  }
}
